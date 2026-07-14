#ifndef MES_DEVICE_MANAGER_H
#define MES_DEVICE_MANAGER_H

#include <pthread.h>
#include <signal.h>
#include <stdint.h>

#include "net.h"
#include "types.h"

typedef void (*DeviceMessageCallback)(void *context, MachineType machine, uint8_t type,
                                      int32_t value, int64_t received_at_ms);

struct DeviceManager;

typedef struct {
    struct DeviceManager *manager;
    MachineType machine;
    char equipment_code[MES_CODE_SIZE];
    int port;
    socket_t socket;
    bool connected;
    int64_t last_received_at_ms;
    int invalid_packets;
    pthread_mutex_t lock;
    pthread_t thread;
} DeviceConnection;

typedef struct DeviceManager {
    char host[128];
    DeviceConnection devices[MES_MACHINE_COUNT];
    DeviceMessageCallback callback;
    void *callback_context;
    volatile sig_atomic_t *stop_requested;
    pthread_mutex_t command_lock;
    bool command_available;
    uint16_t command_mask;
    uint8_t command_type;
    int32_t command_value;
} DeviceManager;

int device_manager_init(DeviceManager *manager, const char *host, int base_port,
                        volatile sig_atomic_t *stop_requested,
                        DeviceMessageCallback callback, void *callback_context);
int device_manager_start(DeviceManager *manager);
void device_manager_stop(DeviceManager *manager);
void device_manager_destroy(DeviceManager *manager);
void device_manager_broadcast(DeviceManager *manager, uint16_t equipment_mask,
                              uint8_t command_type, int32_t value);
void device_manager_cache_command(DeviceManager *manager, uint16_t equipment_mask,
                                  uint8_t command_type, int32_t value);
size_t device_manager_get_statuses(DeviceManager *manager, DeviceStatus *out, size_t capacity);

#endif
