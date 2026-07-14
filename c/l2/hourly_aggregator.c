#include "hourly_aggregator.h"

#include <string.h>

static int64_t next_boundary(int64_t now_ms, int64_t interval_ms)
{
    return ((now_ms / interval_ms) + 1) * interval_ms;
}

static void finalize_current(HourlyAggregator *aggregator, CloseReason reason, int64_t end_ms,
                             HourlyAggregate *closed);

int hourly_aggregator_init(HourlyAggregator *aggregator, int aggregation_seconds)
{
    if (aggregator == NULL || aggregation_seconds <= 0) return -1;
    memset(aggregator, 0, sizeof(*aggregator));
    aggregator->interval_ms = (int64_t)aggregation_seconds * 1000;
    return pthread_mutex_init(&aggregator->lock, NULL);
}

void hourly_aggregator_destroy(HourlyAggregator *aggregator)
{
    if (aggregator != NULL) pthread_mutex_destroy(&aggregator->lock);
}

void hourly_aggregator_start(HourlyAggregator *aggregator, const WorkOrder *order, int64_t now_ms)
{
    if (aggregator == NULL || order == NULL || order->work_order_id <= 0) return;
    pthread_mutex_lock(&aggregator->lock);
    memset(&aggregator->current, 0, sizeof(aggregator->current));
    aggregator->current.work_order_id = order->work_order_id;
    aggregator->current.target_qty = order->hourly_target_qty;
    aggregator->current.bucket_start_ms = now_ms;
    aggregator->next_boundary_ms = next_boundary(now_ms, aggregator->interval_ms);
    aggregator->active = true;
    pthread_mutex_unlock(&aggregator->lock);
}

int hourly_aggregator_add_result_at(HourlyAggregator *aggregator, DefectCode result,
                                    int64_t occurred_at_ms, HourlyAggregate *closed)
{
    if (aggregator == NULL) return 0;
    pthread_mutex_lock(&aggregator->lock);
    int rolled = 0;
    if (aggregator->active && occurred_at_ms >= aggregator->next_boundary_ms && closed != NULL) {
        int64_t boundary = aggregator->next_boundary_ms;
        finalize_current(aggregator, CLOSE_REASON_HOURLY, boundary, closed);
        int64_t work_order_id = aggregator->current.work_order_id;
        int target_qty = aggregator->current.target_qty;
        int64_t period_start = (occurred_at_ms / aggregator->interval_ms) * aggregator->interval_ms;
        if (period_start < boundary) period_start = boundary;
        memset(&aggregator->current, 0, sizeof(aggregator->current));
        aggregator->current.work_order_id = work_order_id;
        aggregator->current.target_qty = target_qty;
        aggregator->current.bucket_start_ms = period_start;
        aggregator->next_boundary_ms = next_boundary(occurred_at_ms, aggregator->interval_ms);
        rolled = 1;
    }
    if (aggregator->active) {
        aggregator->current.production_qty++;
        if (result == DEFECT_OK) aggregator->current.good_qty++;
        else aggregator->current.defect_qty++;
    }
    pthread_mutex_unlock(&aggregator->lock);
    return rolled;
}

static void finalize_current(HourlyAggregator *aggregator, CloseReason reason, int64_t end_ms,
                             HourlyAggregate *closed)
{
    aggregator->current.bucket_end_ms = end_ms;
    aggregator->current.close_reason = reason;
    aggregator->current.is_partial =
        (end_ms - aggregator->current.bucket_start_ms) < aggregator->interval_ms;
    *closed = aggregator->current;
}

int hourly_aggregator_tick(HourlyAggregator *aggregator, int64_t now_ms, HourlyAggregate *closed)
{
    if (aggregator == NULL || closed == NULL) return 0;
    pthread_mutex_lock(&aggregator->lock);
    if (!aggregator->active || now_ms < aggregator->next_boundary_ms) {
        pthread_mutex_unlock(&aggregator->lock);
        return 0;
    }

    int64_t boundary = aggregator->next_boundary_ms;
    finalize_current(aggregator, CLOSE_REASON_HOURLY, boundary, closed);
    int64_t work_order_id = aggregator->current.work_order_id;
    int target_qty = aggregator->current.target_qty;
    memset(&aggregator->current, 0, sizeof(aggregator->current));
    aggregator->current.work_order_id = work_order_id;
    aggregator->current.target_qty = target_qty;
    aggregator->current.bucket_start_ms = boundary;
    aggregator->next_boundary_ms = next_boundary(boundary, aggregator->interval_ms);
    pthread_mutex_unlock(&aggregator->lock);
    return 1;
}

int hourly_aggregator_close(HourlyAggregator *aggregator, CloseReason reason, int64_t now_ms,
                            HourlyAggregate *closed)
{
    if (aggregator == NULL || closed == NULL) return 0;
    pthread_mutex_lock(&aggregator->lock);
    if (!aggregator->active) {
        pthread_mutex_unlock(&aggregator->lock);
        return 0;
    }
    if (now_ms < aggregator->current.bucket_start_ms) now_ms = aggregator->current.bucket_start_ms;
    finalize_current(aggregator, reason, now_ms, closed);
    aggregator->active = false;
    memset(&aggregator->current, 0, sizeof(aggregator->current));
    pthread_mutex_unlock(&aggregator->lock);
    return 1;
}

bool hourly_aggregator_is_active(HourlyAggregator *aggregator)
{
    if (aggregator == NULL) return false;
    pthread_mutex_lock(&aggregator->lock);
    bool active = aggregator->active;
    pthread_mutex_unlock(&aggregator->lock);
    return active;
}
