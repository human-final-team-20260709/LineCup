#include "machine_common.h"

MachineProfile machine_mixer_profile(int port)
{
    MachineProfile p = { MACHINE_MIXER, "Mixer", port,
        {{METRIC_TEMPERATURE, 20, 40, 100, "C"}, {METRIC_HUMIDITY, 40, 70, 100, "%"},
         {METRIC_SPEED, 60, 120, 1000, "RPM"}}, 3, false };
    return p;
}
