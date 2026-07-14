#include <assert.h>
#include <stdio.h>
#include <string.h>

#include "spool.h"

int main(void)
{
    const char *path = "runtime/test-pending.jsonl";
    remove(path);
    remove("runtime/test-pending.jsonl.tmp");

    Spool spool;
    assert(spool_init(&spool, path) == 0);
    HourlyAggregate aggregate = {
        .work_order_id = 77,
        .target_qty = 100,
        .production_qty = 10,
        .good_qty = 9,
        .defect_qty = 1,
        .bucket_start_ms = 1000,
        .bucket_end_ms = 2000,
        .is_partial = true,
        .close_reason = CLOSE_REASON_HOLD
    };
    assert(spool_append_hourly(&spool, &aggregate) == 0);
    assert(spool_append_hourly(&spool, &aggregate) == 0);

    DefectEvent defect;
    memset(&defect, 0, sizeof(defect));
    snprintf(defect.idempotency_key, sizeof(defect.idempotency_key), "defect:test:1");
    snprintf(defect.equipment_code, sizeof(defect.equipment_code), "INSPECTOR-01");
    defect.work_order_id = 77;
    defect.production_lot_id = 88;
    defect.defect_code = DEFECT_WEIGHT;
    defect.quantity = 1;
    defect.occurred_at_ms = 1500;
    assert(spool_append_defect(&spool, &defect) == 0);
    assert(spool_count(&spool) == 2);
    spool_destroy(&spool);

    assert(spool_init(&spool, path) == 0);
    assert(spool_count(&spool) == 2);
    SpoolRecord record;
    assert(spool_peek(&spool, &record));
    assert(record.type == SPOOL_RECORD_HOURLY);
    assert(record.payload.hourly.production_qty == 10);
    assert(spool_acknowledge(&spool, record.key) == 0);
    assert(spool_count(&spool) == 1);
    assert(spool_peek(&spool, &record));
    assert(record.type == SPOOL_RECORD_DEFECT);
    assert(record.payload.defect.defect_code == DEFECT_WEIGHT);
    assert(spool_acknowledge(&spool, record.key) == 0);
    assert(spool_count(&spool) == 0);
    spool_destroy(&spool);

    remove(path);
    puts("test_spool: OK");
    return 0;
}
