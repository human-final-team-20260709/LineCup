#ifndef MES_MACHINE_COMMON_H
#define MES_MACHINE_COMMON_H

#include <pthread.h>
#include <signal.h>
#include <stddef.h>

#include "net.h"
#include "types.h"

#define MACHINE_MAX_METRICS 3

typedef struct {
    MetricType type;
    double minimum;
    double maximum;
    int scale;
    const char *unit;
} MachineMetric;

typedef struct {
    MachineType type;
    const char *display_name;
    int port;
    MachineMetric metrics[MACHINE_MAX_METRICS];
    size_t metric_count;
    bool inspector;
} MachineProfile;

typedef struct {
    MachineProfile profile;
    int sensor_interval_ms;
    int inspection_interval_ms;
    int defect_rate_percent;
    unsigned int seed;
    volatile sig_atomic_t *stop_requested;
    const NetWakeup *accept_wakeup;
} MachineThreadArgs;

void *machine_run_thread(void *argument);

MachineProfile machine_mixer_profile(int port);
MachineProfile machine_roller_profile(int port);
MachineProfile machine_noodle_profile(int port);
MachineProfile machine_steamer_profile(int port);
MachineProfile machine_cutter_profile(int port);
MachineProfile machine_fryer_profile(int port);
MachineProfile machine_cooler_profile(int port);
MachineProfile machine_packer_profile(int port);
MachineProfile machine_inspector_profile(int port);

#endif
