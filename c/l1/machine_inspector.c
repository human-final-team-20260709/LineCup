#include "machine_common.h"

MachineProfile machine_inspector_profile(int port)
{
    MachineProfile p = { MACHINE_INSPECTOR, "Inspector", port,
        {{METRIC_SPEED, 40, 80, 1000, "EA/min"}}, 1, true };
    return p;
}
