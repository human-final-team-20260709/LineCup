#ifndef MES_HOURLY_AGGREGATOR_H
#define MES_HOURLY_AGGREGATOR_H

#include <pthread.h>

#include "types.h"

typedef struct {
    pthread_mutex_t lock;
    int64_t interval_ms;
    int64_t next_boundary_ms;
    bool active;
    HourlyAggregate current;
} HourlyAggregator;

int hourly_aggregator_init(HourlyAggregator *aggregator, int aggregation_seconds);
void hourly_aggregator_destroy(HourlyAggregator *aggregator);
void hourly_aggregator_start(HourlyAggregator *aggregator, const WorkOrder *order, int64_t now_ms);
int hourly_aggregator_add_result_at(HourlyAggregator *aggregator, DefectCode result,
                                    int64_t occurred_at_ms, HourlyAggregate *closed);
int hourly_aggregator_tick(HourlyAggregator *aggregator, int64_t now_ms, HourlyAggregate *closed);
int hourly_aggregator_close(HourlyAggregator *aggregator, CloseReason reason, int64_t now_ms,
                            HourlyAggregate *closed);
bool hourly_aggregator_is_active(HourlyAggregator *aggregator);

#endif
