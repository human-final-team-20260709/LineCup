#include "machine_common.h"

MachineProfile machine_noodle_profile(int port)
{
    MachineProfile p = { MACHINE_NOODLE, "Noodle", port,
        {{METRIC_HUMIDITY, 30, 55, 100, "%"}, {METRIC_SPEED, 10, 25, 1000, "m/min"}}, 2, false };
    return p;
}
