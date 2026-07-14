#include "machine_common.h"

MachineProfile machine_packer_profile(int port)
{
    MachineProfile p = { MACHINE_PACKER, "Packer", port,
        {{METRIC_SPEED, 40, 80, 1000, "EA/min"}}, 1, false };
    return p;
}
