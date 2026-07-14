#include "collector.h"

#include <stdio.h>
#include <string.h>

#include "protocol.h"

int collector_init(Collector *collector, HourlyAggregator *aggregator, Spool *spool)
{
    memset(collector, 0, sizeof(*collector));
    collector->aggregator = aggregator;
    collector->spool = spool;
    return pthread_mutex_init(&collector->lock, NULL);
}

void collector_destroy(Collector *collector)
{
    pthread_mutex_destroy(&collector->lock);
}

void collector_set_order(Collector *collector, const WorkOrder *order, bool has_order)
{
    pthread_mutex_lock(&collector->lock);
    collector->has_order = has_order;
    if (has_order && order != NULL) collector->current_order = *order;
    else memset(&collector->current_order, 0, sizeof(collector->current_order));
    pthread_mutex_unlock(&collector->lock);
}

bool collector_get_order(Collector *collector, WorkOrder *order)
{
    pthread_mutex_lock(&collector->lock);
    bool available = collector->has_order;
    if (available && order != NULL) *order = collector->current_order;
    pthread_mutex_unlock(&collector->lock);
    return available;
}

static const char *speed_unit(MachineType machine)
{
    if (machine == MACHINE_MIXER) return "RPM";
    if (machine == MACHINE_CUTTER || machine == MACHINE_PACKER || machine == MACHINE_INSPECTOR)
        return "EA/min";
    return "m/min";
}

static int decode_metric(uint8_t type, int32_t raw, MachineType machine,
                         MetricType *metric, double *value, const char **unit)
{
    if (type == MSG_TEMPERATURE) {
        *metric = METRIC_TEMPERATURE;
        *value = raw / 100.0;
        *unit = "C";
        return 0;
    }
    if (type == MSG_HUMIDITY) {
        *metric = METRIC_HUMIDITY;
        *value = raw / 100.0;
        *unit = "%";
        return 0;
    }
    if (type == MSG_SPEED) {
        *metric = METRIC_SPEED;
        *value = raw / 1000.0;
        *unit = speed_unit(machine);
        return 0;
    }
    return -1;
}

static void append_telemetry_locked(Collector *collector, const TelemetrySample *sample)
{
    if (collector->sample_count == MES_TELEMETRY_CAPACITY) {
        memmove(&collector->samples[0], &collector->samples[1],
                (MES_TELEMETRY_CAPACITY - 1) * sizeof(collector->samples[0]));
        collector->sample_count--;
        fprintf(stderr, "[L2][collector] telemetry buffer full; oldest sample dropped\n");
    }
    collector->samples[collector->sample_count++] = *sample;
}

void collector_handle_message(void *context, MachineType machine, uint8_t type,
                              int32_t value, int64_t received_at_ms)
{
    Collector *collector = (Collector *)context;
    WorkOrder order;
    pthread_mutex_lock(&collector->lock);
    bool has_order = collector->has_order && collector->current_order.status == ORDER_STATUS_IN_PROGRESS;
    order = collector->current_order;

    MetricType metric;
    double decoded;
    const char *unit;
    if (has_order && decode_metric(type, value, machine, &metric, &decoded, &unit) == 0) {
        TelemetrySample sample;
        memset(&sample, 0, sizeof(sample));
        snprintf(sample.equipment_code, sizeof(sample.equipment_code), "%s", machine_type_code(machine));
        sample.work_order_id = order.work_order_id;
        sample.metric_type = metric;
        sample.value = decoded;
        snprintf(sample.unit, sizeof(sample.unit), "%s", unit);
        sample.measured_at_ms = received_at_ms;
        append_telemetry_locked(collector, &sample);
        pthread_mutex_unlock(&collector->lock);
        printf("[L2][RECV][%s] %s=%.2f %s\n",
            machine_type_code(machine),
            metric_type_name(metric),
            decoded,
            unit);
        fflush(stdout);
        return;
    }

    if (!has_order || machine != MACHINE_INSPECTOR || type != MSG_INSPECTION_RESULT ||
        value < DEFECT_OK || value > DEFECT_FOREIGN_MATERIAL) {
        pthread_mutex_unlock(&collector->lock);
        return;
    }

    DefectCode result = (DefectCode)value;
    uint64_t sequence = ++collector->defect_sequence;
    pthread_mutex_unlock(&collector->lock);

    HourlyAggregate closed;
    if (hourly_aggregator_add_result_at(collector->aggregator, result, received_at_ms, &closed) &&
        spool_append_hourly(collector->spool, &closed) != 0)
        fprintf(stderr, "[L2][collector] failed to spool rolled aggregate\n");
    if (result != DEFECT_OK) {
        DefectEvent event;
        memset(&event, 0, sizeof(event));
        event.work_order_id = order.work_order_id;
        event.production_lot_id = order.production_lot_id;
        snprintf(event.equipment_code, sizeof(event.equipment_code), "%s",
                 machine_type_code(MACHINE_INSPECTOR));
        event.defect_code = result;
        event.quantity = 1;
        event.occurred_at_ms = received_at_ms;
        snprintf(event.idempotency_key, sizeof(event.idempotency_key), "defect:%lld:%lld:%llu",
                 (long long)order.work_order_id, (long long)received_at_ms,
                 (unsigned long long)sequence);
        if (spool_append_defect(collector->spool, &event) != 0)
            fprintf(stderr, "[L2][collector] failed to spool defect event\n");
    }
}

size_t collector_peek_telemetry(Collector *collector, TelemetrySample *out, size_t capacity)
{
    pthread_mutex_lock(&collector->lock);
    size_t count = collector->sample_count < capacity ? collector->sample_count : capacity;
    if (count > 0) memcpy(out, collector->samples, count * sizeof(*out));
    pthread_mutex_unlock(&collector->lock);
    return count;
}

void collector_ack_telemetry(Collector *collector, size_t count)
{
    pthread_mutex_lock(&collector->lock);
    if (count > collector->sample_count) count = collector->sample_count;
    if (count < collector->sample_count) {
        memmove(collector->samples, collector->samples + count,
                (collector->sample_count - count) * sizeof(collector->samples[0]));
    }
    collector->sample_count -= count;
    pthread_mutex_unlock(&collector->lock);
}

size_t collector_telemetry_count(Collector *collector)
{
    pthread_mutex_lock(&collector->lock);
    size_t count = collector->sample_count;
    pthread_mutex_unlock(&collector->lock);
    return count;
}
