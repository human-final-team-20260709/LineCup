#include <pthread.h>
#include <signal.h>
#include <stdio.h>
#include <time.h>

#include "config.h"
#include "machine_common.h"
#include "net.h"
#include "platform.h"

static volatile sig_atomic_t stop_requested = 0;

static void handle_signal(int signal_number)
{
    (void)signal_number;
    stop_requested = 1;
}

int main(void)
{
    signal(SIGINT, handle_signal);
    signal(SIGTERM, handle_signal);
    if (net_init() != 0) {
        fprintf(stderr, "network initialization failed\n");
        return 1;
    }
    NetWakeup accept_wakeup;
    if (net_wakeup_init(&accept_wakeup) != 0) {
        fprintf(stderr, "failed to initialize accept wakeup channel\n");
        net_cleanup();
        return 1;
    }

    int base_port = platform_env_int("MES_BASE_PORT", MES_DEFAULT_BASE_PORT, 1024, 65527);
    int sensor_interval = platform_env_int("MES_SENSOR_INTERVAL_MS", MES_DEFAULT_SENSOR_INTERVAL_MS, 50, 3600000);
    int inspection_interval = platform_env_int("MES_INSPECTION_INTERVAL_MS", MES_DEFAULT_INSPECTION_INTERVAL_MS, 50, 3600000);
    int defect_rate = platform_env_int("MES_DEFECT_RATE_PERCENT", MES_DEFAULT_DEFECT_RATE_PERCENT, 0, 100);
    unsigned int base_seed = platform_env_uint("MES_RANDOM_SEED", (unsigned int)time(NULL));

    MachineProfile profiles[MES_MACHINE_COUNT] = {
        machine_mixer_profile(base_port + 0), machine_roller_profile(base_port + 1),
        machine_noodle_profile(base_port + 2), machine_steamer_profile(base_port + 3),
        machine_cutter_profile(base_port + 4), machine_fryer_profile(base_port + 5),
        machine_cooler_profile(base_port + 6), machine_packer_profile(base_port + 7),
        machine_inspector_profile(base_port + 8)
    };
    MachineThreadArgs arguments[MES_MACHINE_COUNT];
    pthread_t threads[MES_MACHINE_COUNT];

    for (int i = 0; i < MES_MACHINE_COUNT; i++) {
        arguments[i].profile = profiles[i];
        arguments[i].sensor_interval_ms = sensor_interval;
        arguments[i].inspection_interval_ms = inspection_interval;
        arguments[i].defect_rate_percent = defect_rate;
        arguments[i].seed = base_seed + (unsigned int)(i * 7919 + 1);
        arguments[i].stop_requested = &stop_requested;
        arguments[i].accept_wakeup = &accept_wakeup;
        if (pthread_create(&threads[i], NULL, machine_run_thread, &arguments[i]) != 0) {
            fprintf(stderr, "failed to start machine thread %d\n", i);
            stop_requested = 1;
            net_wakeup_signal(&accept_wakeup);
            for (int j = 0; j < i; j++) pthread_join(threads[j], NULL);
            net_wakeup_destroy(&accept_wakeup);
            net_cleanup();
            return 1;
        }
    }

    printf("[L1] 9 machine simulators started. Press Ctrl+C to stop.\n");
    while (!stop_requested) platform_sleep_ms(200);
    net_wakeup_signal(&accept_wakeup);
    for (int i = 0; i < MES_MACHINE_COUNT; i++) pthread_join(threads[i], NULL);
    net_wakeup_destroy(&accept_wakeup);
    net_cleanup();
    printf("[L1] stopped\n");
    return 0;
}
