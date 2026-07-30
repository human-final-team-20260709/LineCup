#include "machine_common.h"

MachineProfile machine_roller_profile(int port)
{
    MachineProfile p = { MACHINE_ROLLER, "Roller", port,
        {{METRIC_TEMPERATURE, 30, 60, 100, "C"}, {METRIC_SPEED, 10, 30, 1000, "m/min"}}, 2, false };
    return p;
}
