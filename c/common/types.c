#include "types.h"

#include <string.h>

const char *machine_type_code(MachineType type)
{
    static const char *codes[MES_MACHINE_COUNT] = {
        "MIXER-01", "ROLLER-01", "NOODLE-01", "STEAMER-01", "CUTTER-01",
        "FRYER-01", "COOLER-01", "PACKER-01", "INSPECTOR-01"
    };
    return (type >= 0 && type < MES_MACHINE_COUNT) ? codes[type] : "UNKNOWN";
}

const char *metric_type_name(MetricType type)
{
    switch (type) {
        case METRIC_TEMPERATURE: return "TEMPERATURE";
        case METRIC_HUMIDITY: return "HUMIDITY";
        case METRIC_SPEED: return "SPEED";
        default: return "UNKNOWN";
    }
}

const char *close_reason_name(CloseReason reason)
{
    switch (reason) {
        case CLOSE_REASON_HOURLY: return "HOURLY";
        case CLOSE_REASON_WORK_ORDER_COMPLETED: return "WORK_ORDER_COMPLETED";
        case CLOSE_REASON_HOLD: return "HOLD";
        case CLOSE_REASON_SHUTDOWN: return "SHUTDOWN";
        default: return "UNKNOWN";
    }
}

const char *defect_code_name(DefectCode code)
{
    switch (code) {
        case DEFECT_OK: return "OK";
        case DEFECT_SEALING: return "SEALING";
        case DEFECT_MOISTURE: return "MOISTURE";
        case DEFECT_WEIGHT: return "WEIGHT";
        case DEFECT_FOREIGN_MATERIAL: return "FOREIGN_MATERIAL";
        default: return "GENERAL_NG";
    }
}

WorkOrderStatus work_order_status_from_string(const char *value)
{
    if (value == NULL) return ORDER_STATUS_NONE;
    if (strcmp(value, "PENDING") == 0) return ORDER_STATUS_PENDING;
    if (strcmp(value, "IN_PROGRESS") == 0) return ORDER_STATUS_IN_PROGRESS;
    if (strcmp(value, "HOLD") == 0) return ORDER_STATUS_HOLD;
    if (strcmp(value, "DONE") == 0) return ORDER_STATUS_DONE;
    return ORDER_STATUS_NONE;
}
