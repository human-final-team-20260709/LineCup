#ifndef MES_COMMAND_POLLER_H
#define MES_COMMAND_POLLER_H

#include <pthread.h>
#include <signal.h>

#include "api_client.h"
#include "collector.h"
#include "device_manager.h"
#include "hourly_aggregator.h"
#include "spool.h"

typedef struct {
    ApiClient *api;
    Collector *collector;
    DeviceManager *devices;
    HourlyAggregator *aggregator;
    Spool *spool;
    int poll_interval_ms;
    volatile sig_atomic_t *stop_requested;
    pthread_t thread;
} CommandPoller;

int command_poller_start(CommandPoller *poller);
void command_poller_join(CommandPoller *poller);

#endif
