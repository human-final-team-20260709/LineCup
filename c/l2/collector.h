#ifndef MES_COLLECTOR_H
#define MES_COLLECTOR_H

#include <pthread.h>
#include <stddef.h>

#include "hourly_aggregator.h"
#include "spool.h"
#include "types.h"

typedef struct {
    pthread_mutex_t lock;
    WorkOrder current_order;
    bool has_order;
    TelemetrySample samples[MES_TELEMETRY_CAPACITY];
    size_t sample_count;
    uint64_t defect_sequence;
    HourlyAggregator *aggregator;
    Spool *spool;
} Collector;

int collector_init(Collector *collector, HourlyAggregator *aggregator, Spool *spool);
void collector_destroy(Collector *collector);
void collector_set_order(Collector *collector, const WorkOrder *order, bool has_order);
bool collector_get_order(Collector *collector, WorkOrder *order);
void collector_handle_message(void *context, MachineType machine, uint8_t type,
                              int32_t value, int64_t received_at_ms);
size_t collector_peek_telemetry(Collector *collector, TelemetrySample *out, size_t capacity);
void collector_ack_telemetry(Collector *collector, size_t count);
size_t collector_telemetry_count(Collector *collector);

#endif
