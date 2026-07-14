#include <assert.h>
#include <stdio.h>

#include "hourly_aggregator.h"

int main(void)
{
    HourlyAggregator aggregator;
    assert(hourly_aggregator_init(&aggregator, 60) == 0);
    WorkOrder order = {
        .work_order_id = 101,
        .hourly_target_qty = 700,
        .status = ORDER_STATUS_IN_PROGRESS
    };

    hourly_aggregator_start(&aggregator, &order, 10000);
    HourlyAggregate closed;
    assert(!hourly_aggregator_add_result_at(&aggregator, DEFECT_OK, 20000, &closed));
    assert(!hourly_aggregator_add_result_at(&aggregator, DEFECT_SEALING, 30000, &closed));
    assert(!hourly_aggregator_tick(&aggregator, 59999, &closed));
    assert(hourly_aggregator_tick(&aggregator, 60000, &closed));
    assert(closed.work_order_id == 101);
    assert(closed.production_qty == 2);
    assert(closed.good_qty == 1);
    assert(closed.defect_qty == 1);
    assert(closed.close_reason == CLOSE_REASON_HOURLY);
    assert(closed.is_partial);

    assert(!hourly_aggregator_add_result_at(&aggregator, DEFECT_OK, 70000, &closed));
    assert(hourly_aggregator_close(&aggregator, CLOSE_REASON_HOLD, 90000, &closed));
    assert(closed.bucket_start_ms == 60000);
    assert(closed.bucket_end_ms == 90000);
    assert(closed.production_qty == 1);
    assert(closed.good_qty == 1);
    assert(closed.defect_qty == 0);
    assert(closed.is_partial);
    assert(!hourly_aggregator_is_active(&aggregator));
    assert(!hourly_aggregator_close(&aggregator, CLOSE_REASON_SHUTDOWN, 91000, &closed));

    hourly_aggregator_destroy(&aggregator);
    puts("test_aggregator: OK");
    return 0;
}
