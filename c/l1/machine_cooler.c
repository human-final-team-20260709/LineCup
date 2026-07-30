#include "machine_common.h"

MachineProfile machine_cooler_profile(int port)
{
    MachineProfile p = { MACHINE_COOLER, "Cooler", port,
        {{METRIC_TEMPERATURE, 15, 30, 100, "C"}, {METRIC_HUMIDITY, 30, 55, 100, "%"},
         {METRIC_SPEED, 5, 15, 1000, "m/min"}}, 3, false };
    return p;
}
