#ifndef MES_API_CLIENT_H
#define MES_API_CLIENT_H

#include <stddef.h>

#include "types.h"

typedef struct {
    char base_url[256];
    char collector_code[MES_CODE_SIZE];
} ApiClient;

int api_global_init(void);
void api_global_cleanup(void);
void api_client_configure(ApiClient *client, const char *base_url, const char *collector_code);
int api_poll_work_order(ApiClient *client, WorkOrder *order, int *has_order);
int api_send_telemetry(ApiClient *client, const TelemetrySample *samples, size_t count);
int api_send_hourly(ApiClient *client, const HourlyAggregate *aggregate);
int api_send_defect(ApiClient *client, const DefectEvent *event);
int api_send_heartbeat(ApiClient *client, const DeviceStatus *statuses, size_t count);

#endif
