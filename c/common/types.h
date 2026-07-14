#ifndef MES_TYPES_H
#define MES_TYPES_H

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#include "config.h"

#define MES_CODE_SIZE 32
#define MES_STATUS_SIZE 32
#define MES_TIMESTAMP_SIZE 32
#define MES_UNIT_SIZE 16
#define MES_SPOOL_ID_SIZE 96

typedef enum {
    MACHINE_MIXER = 0,
    MACHINE_ROLLER,
    MACHINE_NOODLE,
    MACHINE_STEAMER,
    MACHINE_CUTTER,
    MACHINE_FRYER,
    MACHINE_COOLER,
    MACHINE_PACKER,
    MACHINE_INSPECTOR
} MachineType;

typedef enum {
    MACHINE_STATE_IDLE = 0,
    MACHINE_STATE_RUNNING,
    MACHINE_STATE_HOLD
} MachineRunState;

typedef enum {
    METRIC_TEMPERATURE = 0,
    METRIC_HUMIDITY,
    METRIC_SPEED
} MetricType;

typedef enum {
    ORDER_STATUS_NONE = 0,
    ORDER_STATUS_PENDING,
    ORDER_STATUS_IN_PROGRESS,
    ORDER_STATUS_HOLD,
    ORDER_STATUS_DONE
} WorkOrderStatus;

typedef enum {
    CLOSE_REASON_HOURLY = 0,
    CLOSE_REASON_WORK_ORDER_COMPLETED,
    CLOSE_REASON_HOLD,
    CLOSE_REASON_SHUTDOWN
} CloseReason;

typedef enum {
    DEFECT_OK = 0,
    DEFECT_SEALING = 1,
    DEFECT_MOISTURE = 2,
    DEFECT_WEIGHT = 3,
    DEFECT_FOREIGN_MATERIAL = 4
} DefectCode;

typedef struct {
    int64_t work_order_id;
    int64_t production_lot_id;
    WorkOrderStatus status;
    int target_qty;
    int current_qty;
    int hourly_target_qty;
    uint16_t equipment_mask;
} WorkOrder;

typedef struct {
    char equipment_code[MES_CODE_SIZE];
    int64_t work_order_id;
    MetricType metric_type;
    double value;
    char unit[MES_UNIT_SIZE];
    int64_t measured_at_ms;
} TelemetrySample;

typedef struct {
    int64_t work_order_id;
    int target_qty;
    int production_qty;
    int good_qty;
    int defect_qty;
    int64_t bucket_start_ms;
    int64_t bucket_end_ms;
    bool is_partial;
    CloseReason close_reason;
} HourlyAggregate;

typedef struct {
    char idempotency_key[MES_SPOOL_ID_SIZE];
    int64_t work_order_id;
    int64_t production_lot_id;
    char equipment_code[MES_CODE_SIZE];
    DefectCode defect_code;
    int quantity;
    int64_t occurred_at_ms;
} DefectEvent;

typedef struct {
    char equipment_code[MES_CODE_SIZE];
    int port;
    bool connected;
    int64_t last_received_at_ms;
} DeviceStatus;

const char *machine_type_code(MachineType type);
const char *metric_type_name(MetricType type);
const char *close_reason_name(CloseReason reason);
const char *defect_code_name(DefectCode code);
WorkOrderStatus work_order_status_from_string(const char *value);

#endif
