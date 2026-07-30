#include "machine_common.h"

MachineProfile machine_steamer_profile(int port)
{
    MachineProfile p = { MACHINE_STEAMER, "Steamer", port,
        {{METRIC_TEMPERATURE, 95, 105, 100, "C"}, {METRIC_HUMIDITY, 90, 100, 100, "%"}}, 2, false };
    return p;
}
