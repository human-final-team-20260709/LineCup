#include <signal.h>
#include <stdio.h>
#include <string.h>

#include "api_client.h"
#include "collector.h"
#include "command_poller.h"
#include "config.h"
#include "device_manager.h"
#include "hourly_aggregator.h"
#include "net.h"
#include "platform.h"
#include "protocol.h"
#include "spool.h"

static volatile sig_atomic_t stop_requested = 0;

static void handle_signal(int signal_number)
{
    (void)signal_number;
    stop_requested = 1;
}

static int send_spool_record(ApiClient *api, const SpoolRecord *record)
{
    if (record->type == SPOOL_RECORD_HOURLY)
        return api_send_hourly(api, &record->payload.hourly);
    return api_send_defect(api, &record->payload.defect);
}

int main(void)
{
    signal(SIGINT, handle_signal);
    signal(SIGTERM, handle_signal);

    const char *base_url = platform_env_string("MES_BASE_URL", MES_DEFAULT_BASE_URL);
    const char *collector_code = platform_env_string("MES_COLLECTOR_CODE", MES_DEFAULT_COLLECTOR_CODE);
    const char *l1_host = platform_env_string("MES_L1_HOST", MES_DEFAULT_L1_HOST);
    const char *spool_path = platform_env_string("MES_SPOOL_PATH", MES_DEFAULT_SPOOL_PATH);
    int base_port = platform_env_int("MES_BASE_PORT", MES_DEFAULT_BASE_PORT, 1024, 65527);
    int poll_ms = platform_env_int("MES_COMMAND_POLL_MS", MES_DEFAULT_COMMAND_POLL_MS, 100, 3600000);
    int telemetry_ms = platform_env_int("MES_TELEMETRY_BATCH_MS", MES_DEFAULT_TELEMETRY_BATCH_MS, 100, 3600000);
    int aggregation_seconds = platform_env_int("MES_AGGREGATION_SECONDS", MES_DEFAULT_AGGREGATION_SECONDS, 1, 86400);

    if (net_init() != 0) {
        fprintf(stderr, "[L2] network initialization failed\n");
        return 1;
    }
    if (api_global_init() != 0) {
        fprintf(stderr, "[L2] initialization failed\n");
        net_cleanup();
        return 1;
    }

    ApiClient api;
    api_client_configure(&api, base_url, collector_code);
    Spool spool;
    HourlyAggregator aggregator;
    Collector collector;
    DeviceManager devices;
    int spool_ready = 0, aggregator_ready = 0, collector_ready = 0, devices_ready = 0;

    if (spool_init(&spool, spool_path) != 0) {
        fprintf(stderr, "[L2] failed to initialize spool: %s\n", spool_path);
        goto fail;
    }
    spool_ready = 1;
    if (hourly_aggregator_init(&aggregator, aggregation_seconds) != 0) goto fail;
    aggregator_ready = 1;
    if (collector_init(&collector, &aggregator, &spool) != 0) goto fail;
    collector_ready = 1;
    if (device_manager_init(&devices, l1_host, base_port, &stop_requested,
                            collector_handle_message, &collector) != 0) goto fail;
    devices_ready = 1;
    if (device_manager_start(&devices) != 0) goto fail;

    CommandPoller poller = {
        .api = &api,
        .collector = &collector,
        .devices = &devices,
        .aggregator = &aggregator,
        .spool = &spool,
        .poll_interval_ms = poll_ms,
        .stop_requested = &stop_requested
    };
    if (command_poller_start(&poller) != 0) {
        stop_requested = 1;
        device_manager_stop(&devices);
        goto fail;
    }

    printf("[L2] collector=%s backend=%s restored_spool=%zu\n",
           collector_code, base_url, spool_count(&spool));
    int64_t next_telemetry_at = platform_now_ms() + telemetry_ms;
    int64_t next_heartbeat_at = platform_now_ms() + telemetry_ms;
    int64_t next_spool_attempt = platform_now_ms();
    int spool_backoff_ms = 1000;

    while (!stop_requested) {
        int64_t now = platform_now_ms();
        HourlyAggregate closed;
        if (hourly_aggregator_tick(&aggregator, now, &closed)) {
            if (spool_append_hourly(&spool, &closed) != 0)
                fprintf(stderr, "[L2] failed to spool hourly aggregate\n");
        }

        if (now >= next_telemetry_at) {
            TelemetrySample batch[512];
            size_t count = collector_peek_telemetry(&collector, batch, 512);
            if (count > 0 && api_send_telemetry(&api, batch, count) == 0)
                collector_ack_telemetry(&collector, count);
            next_telemetry_at = now + telemetry_ms;
        }

        if (now >= next_heartbeat_at) {
            DeviceStatus statuses[MES_MACHINE_COUNT];
            size_t count = device_manager_get_statuses(&devices, statuses, MES_MACHINE_COUNT);
            api_send_heartbeat(&api, statuses, count);
            next_heartbeat_at = now + telemetry_ms;
        }

        if (now >= next_spool_attempt) {
            SpoolRecord record;
            if (spool_peek(&spool, &record)) {
                if (send_spool_record(&api, &record) == 0) {
                    if (spool_acknowledge(&spool, record.key) != 0)
                        fprintf(stderr, "[L2] failed to compact spool after acknowledgement\n");
                    spool_backoff_ms = 1000;
                    next_spool_attempt = now;
                } else {
                    next_spool_attempt = now + spool_backoff_ms;
                    if (spool_backoff_ms < 30000) spool_backoff_ms *= 2;
                    if (spool_backoff_ms > 30000) spool_backoff_ms = 30000;
                }
            } else {
                next_spool_attempt = now + 200;
            }
        }
        platform_sleep_ms(50);
    }

    command_poller_join(&poller);
    WorkOrder current;
    if (collector_get_order(&collector, &current))
        device_manager_broadcast(&devices, current.equipment_mask, MSG_COMMAND_STOP, 0);
    HourlyAggregate shutdown_aggregate;
    if (hourly_aggregator_close(&aggregator, CLOSE_REASON_SHUTDOWN, platform_now_ms(),
                                &shutdown_aggregate))
        spool_append_hourly(&spool, &shutdown_aggregate);

    SpoolRecord last_record;
    if (spool_peek(&spool, &last_record) && send_spool_record(&api, &last_record) == 0)
        spool_acknowledge(&spool, last_record.key);

    device_manager_stop(&devices);
    device_manager_destroy(&devices);
    size_t buffered_telemetry = collector_telemetry_count(&collector);
    collector_destroy(&collector);
    hourly_aggregator_destroy(&aggregator);
    printf("[L2] stopped; pending_spool=%zu telemetry_buffer=%zu\n",
           spool_count(&spool), buffered_telemetry);
    spool_destroy(&spool);
    api_global_cleanup();
    net_cleanup();
    return 0;

fail:
    stop_requested = 1;
    if (devices_ready) device_manager_destroy(&devices);
    if (collector_ready) collector_destroy(&collector);
    if (aggregator_ready) hourly_aggregator_destroy(&aggregator);
    if (spool_ready) spool_destroy(&spool);
    api_global_cleanup();
    net_cleanup();
    return 1;
}
