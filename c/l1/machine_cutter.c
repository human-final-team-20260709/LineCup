#include "machine_common.h"

MachineProfile machine_cutter_profile(int port)
{
    MachineProfile p = { MACHINE_CUTTER, "Cutter", port,
        {{METRIC_SPEED, 60, 120, 1000, "EA/min"}}, 1, false };
    return p;
}
