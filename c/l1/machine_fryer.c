#include "machine_common.h"

MachineProfile machine_fryer_profile(int port)
{
    MachineProfile p = { MACHINE_FRYER, "Fryer", port,
        {{METRIC_TEMPERATURE, 150, 180, 100, "C"}, {METRIC_SPEED, 5, 15, 1000, "m/min"}}, 2, false };
    return p;
}
