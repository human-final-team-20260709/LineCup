#include "device_manager.h"

#include <stdio.h>
#include <string.h>

#include "platform.h"
#include "protocol.h"

static int send_command(DeviceConnection *device, uint8_t type, int32_t value)
{
    uint8_t packet[MES_PACKET_SIZE];
    protocol_build(packet, type, value);
    pthread_mutex_lock(&device->lock);
    int result = -1;
    if (device->connected && device->socket != SOCKET_INVALID)
        result = net_send_all(device->socket, packet, sizeof(packet));
    if (result < 0 && device->socket != SOCKET_INVALID) {
        device->connected = false;
        net_shutdown(device->socket);
    }
    pthread_mutex_unlock(&device->lock);
    return result;
}

static void send_cached_command(DeviceConnection *device)
{
    DeviceManager *manager = device->manager;
    pthread_mutex_lock(&manager->command_lock);
    bool available = manager->command_available &&
                     (manager->command_mask & (uint16_t)(1u << device->machine)) != 0;
    uint8_t type = manager->command_type;
    int32_t value = manager->command_value;
    pthread_mutex_unlock(&manager->command_lock);
    if (available) send_command(device, type, value);
}

static void mark_disconnected(DeviceConnection *device)
{
    pthread_mutex_lock(&device->lock);
    socket_t socket = device->socket;
    device->socket = SOCKET_INVALID;
    device->connected = false;
    pthread_mutex_unlock(&device->lock);
    net_close(socket);
}

static void *device_receive_loop(void *argument)
{
    DeviceConnection *device = (DeviceConnection *)argument;
    DeviceManager *manager = device->manager;
    int backoff_ms = 1000;

    while (!*manager->stop_requested) {
        socket_t socket = net_connect(manager->host, device->port);
        if (socket == SOCKET_INVALID) {
            platform_sleep_ms(backoff_ms);
            if (backoff_ms < 30000) backoff_ms *= 2;
            if (backoff_ms > 30000) backoff_ms = 30000;
            continue;
        }

        pthread_mutex_lock(&device->lock);
        device->socket = socket;
        device->connected = true;
        device->invalid_packets = 0;
        pthread_mutex_unlock(&device->lock);
        backoff_ms = 1000;
        printf("[L2][%s] connected to %s:%d\n", device->equipment_code, manager->host, device->port);
        send_cached_command(device);

        uint8_t packet[MES_PACKET_SIZE];
        while (!*manager->stop_requested) {
            NetRecvResult received = net_recv_exact(socket, packet, sizeof(packet));
            if (received != NET_RECV_OK) break;
            if (!protocol_validate(packet) || !protocol_type_is_known(protocol_get_type(packet))) {
                device->invalid_packets++;
                if (device->invalid_packets >= 3) break;
                continue;
            }
            uint8_t type = protocol_get_type(packet);
            if (type >= MSG_COMMAND_START) {
                device->invalid_packets++;
                if (device->invalid_packets >= 3) break;
                continue;
            }
            device->invalid_packets = 0;
            int64_t now = platform_now_ms();
            pthread_mutex_lock(&device->lock);
            device->last_received_at_ms = now;
            pthread_mutex_unlock(&device->lock);
            if (manager->callback != NULL)
                manager->callback(manager->callback_context, device->machine, type,
                                  protocol_get_value(packet), now);
        }

        mark_disconnected(device);
        printf("[L2][%s] disconnected\n", device->equipment_code);
    }
    return NULL;
}

int device_manager_init(DeviceManager *manager, const char *host, int base_port,
                        volatile sig_atomic_t *stop_requested,
                        DeviceMessageCallback callback, void *callback_context)
{
    memset(manager, 0, sizeof(*manager));
    snprintf(manager->host, sizeof(manager->host), "%s", host);
    manager->callback = callback;
    manager->callback_context = callback_context;
    manager->stop_requested = stop_requested;
    if (pthread_mutex_init(&manager->command_lock, NULL) != 0) return -1;
    for (int i = 0; i < MES_MACHINE_COUNT; i++) {
        DeviceConnection *device = &manager->devices[i];
        device->manager = manager;
        device->machine = (MachineType)i;
        device->port = base_port + i;
        device->socket = SOCKET_INVALID;
        snprintf(device->equipment_code, sizeof(device->equipment_code), "%s",
                 machine_type_code((MachineType)i));
        if (pthread_mutex_init(&device->lock, NULL) != 0) return -1;
    }
    return 0;
}

int device_manager_start(DeviceManager *manager)
{
    for (int i = 0; i < MES_MACHINE_COUNT; i++) {
        if (pthread_create(&manager->devices[i].thread, NULL, device_receive_loop,
                           &manager->devices[i]) != 0) {
            *manager->stop_requested = 1;
            for (int j = 0; j < i; j++) pthread_join(manager->devices[j].thread, NULL);
            return -1;
        }
    }
    return 0;
}

void device_manager_broadcast(DeviceManager *manager, uint16_t equipment_mask,
                              uint8_t command_type, int32_t value)
{
    device_manager_cache_command(manager, equipment_mask, command_type, value);

    for (int i = 0; i < MES_MACHINE_COUNT; i++) {
        if ((equipment_mask & (uint16_t)(1u << i)) != 0)
            send_command(&manager->devices[i], command_type, value);
    }
}

void device_manager_cache_command(DeviceManager *manager, uint16_t equipment_mask,
                                  uint8_t command_type, int32_t value)
{
    pthread_mutex_lock(&manager->command_lock);
    manager->command_available = command_type != MSG_COMMAND_STOP;
    manager->command_mask = equipment_mask;
    manager->command_type = command_type;
    manager->command_value = value;
    pthread_mutex_unlock(&manager->command_lock);
}

size_t device_manager_get_statuses(DeviceManager *manager, DeviceStatus *out, size_t capacity)
{
    size_t count = capacity < MES_MACHINE_COUNT ? capacity : MES_MACHINE_COUNT;
    for (size_t i = 0; i < count; i++) {
        DeviceConnection *device = &manager->devices[i];
        pthread_mutex_lock(&device->lock);
        memset(&out[i], 0, sizeof(out[i]));
        snprintf(out[i].equipment_code, sizeof(out[i].equipment_code), "%s", device->equipment_code);
        out[i].port = device->port;
        out[i].connected = device->connected;
        out[i].last_received_at_ms = device->last_received_at_ms;
        pthread_mutex_unlock(&device->lock);
    }
    return count;
}

void device_manager_stop(DeviceManager *manager)
{
    for (int i = 0; i < MES_MACHINE_COUNT; i++) {
        pthread_mutex_lock(&manager->devices[i].lock);
        if (manager->devices[i].socket != SOCKET_INVALID)
            net_shutdown(manager->devices[i].socket);
        pthread_mutex_unlock(&manager->devices[i].lock);
    }
    for (int i = 0; i < MES_MACHINE_COUNT; i++) pthread_join(manager->devices[i].thread, NULL);
}

void device_manager_destroy(DeviceManager *manager)
{
    for (int i = 0; i < MES_MACHINE_COUNT; i++)
        pthread_mutex_destroy(&manager->devices[i].lock);
    pthread_mutex_destroy(&manager->command_lock);
}
