#include "machine_common.h"

#include <math.h>
#include <stdatomic.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>

#include "net.h"
#include "platform.h"
#include "protocol.h"

typedef struct {
    socket_t socket;
    pthread_mutex_t lock;
    MachineRunState state;
    int target_qty;
    int processed_qty;
    atomic_int connected;
    int invalid_packets;
} MachineConnection;

static uint32_t random_next(unsigned int *seed)
{
    *seed = *seed * 1664525u + 1013904223u;
    return *seed;
}

static double random_between(unsigned int *seed, double minimum, double maximum)
{
    double ratio = (double)random_next(seed) / (double)UINT32_MAX;
    return minimum + (maximum - minimum) * ratio;
}

static int send_value(socket_t socket, uint8_t type, int32_t value)
{
    uint8_t packet[MES_PACKET_SIZE];
    protocol_build(packet, type, value);
    return net_send_all(socket, packet, sizeof(packet));
}

static void apply_command(MachineConnection *connection, uint8_t type, int32_t value)
{
    pthread_mutex_lock(&connection->lock);
    if (type == MSG_COMMAND_START) {
        connection->target_qty = value > 0 ? value : 0;
        connection->processed_qty = 0;
        connection->state = value > 0 ? MACHINE_STATE_RUNNING : MACHINE_STATE_IDLE;
    } else if (type == MSG_COMMAND_HOLD) {
        if (connection->state == MACHINE_STATE_RUNNING) connection->state = MACHINE_STATE_HOLD;
    } else if (type == MSG_COMMAND_RESUME) {
        if (value > 0) connection->target_qty = value;
        connection->state = connection->target_qty > 0 ? MACHINE_STATE_RUNNING : MACHINE_STATE_IDLE;
    } else if (type == MSG_COMMAND_STOP) {
        connection->state = MACHINE_STATE_IDLE;
        connection->target_qty = 0;
        connection->processed_qty = 0;
    }
    pthread_mutex_unlock(&connection->lock);
}

static void *command_receive_loop(void *argument)
{
    MachineConnection *connection = (MachineConnection *)argument;
    uint8_t packet[MES_PACKET_SIZE];

    while (atomic_load(&connection->connected)) {
        NetRecvResult received = net_recv_exact(connection->socket, packet, sizeof(packet));
        if (received != NET_RECV_OK) break;
        if (!protocol_validate(packet) || !protocol_type_is_known(protocol_get_type(packet))) {
            connection->invalid_packets++;
            if (connection->invalid_packets >= 3) break;
            continue;
        }
        uint8_t type = protocol_get_type(packet);
        if (type < MSG_COMMAND_START || type > MSG_COMMAND_STOP) {
            connection->invalid_packets++;
            if (connection->invalid_packets >= 3) break;
            continue;
        }
        connection->invalid_packets = 0;
        apply_command(connection, type, protocol_get_value(packet));
    }

    atomic_store(&connection->connected, 0);
    return NULL;
}

static uint8_t metric_message_type(MetricType type)
{
    if (type == METRIC_TEMPERATURE) return MSG_TEMPERATURE;
    if (type == METRIC_HUMIDITY) return MSG_HUMIDITY;
    return MSG_SPEED;
}

static DefectCode generate_inspection_result(unsigned int *seed, int defect_rate_percent)
{
    int draw = (int)(random_next(seed) % 100u);
    if (draw >= defect_rate_percent) return DEFECT_OK;
    return (DefectCode)(1 + (random_next(seed) % 4u));
}

static void run_connected_machine(MachineThreadArgs *args, socket_t client_socket)
{
    MachineConnection connection;
    memset(&connection, 0, sizeof(connection));
    connection.socket = client_socket;
    atomic_init(&connection.connected, 1);
    connection.state = MACHINE_STATE_IDLE;
    pthread_mutex_init(&connection.lock, NULL);

    pthread_t command_thread;
    if (pthread_create(&command_thread, NULL, command_receive_loop, &connection) != 0) {
        pthread_mutex_destroy(&connection.lock);
        return;
    }

    int64_t next_sensor_at = platform_now_ms();
    int64_t next_inspection_at = platform_now_ms();

    while (!*args->stop_requested) {
        pthread_mutex_lock(&connection.lock);
        int connected = atomic_load(&connection.connected);
        MachineRunState state = connection.state;
        int target_qty = connection.target_qty;
        int processed_qty = connection.processed_qty;
        pthread_mutex_unlock(&connection.lock);

        if (!connected) break;
        int64_t now = platform_now_ms();

        if (state == MACHINE_STATE_RUNNING && now >= next_sensor_at) {
            for (size_t i = 0; i < args->profile.metric_count; i++) {
                const MachineMetric *metric = &args->profile.metrics[i];
                double generated = random_between(&args->seed, metric->minimum, metric->maximum);
                int32_t wire_value = (int32_t)llround(generated * metric->scale);
                if (send_value(client_socket, metric_message_type(metric->type), wire_value) < 0) {
                    atomic_store(&connection.connected, 0);
                    break;
                }
            }
            next_sensor_at = now + args->sensor_interval_ms;
        }

        if (args->profile.inspector && state == MACHINE_STATE_RUNNING && now >= next_inspection_at &&
            processed_qty < target_qty) {
            DefectCode result = generate_inspection_result(&args->seed, args->defect_rate_percent);
            if (send_value(client_socket, MSG_INSPECTION_RESULT, (int32_t)result) < 0) {
                atomic_store(&connection.connected, 0);
            } else {
                pthread_mutex_lock(&connection.lock);
                connection.processed_qty++;
                if (connection.processed_qty >= connection.target_qty) connection.state = MACHINE_STATE_IDLE;
                pthread_mutex_unlock(&connection.lock);
                printf("[L1][%s] inspection=%s %d/%d\n", args->profile.display_name,
                       defect_code_name(result), processed_qty + 1, target_qty);
            }
            next_inspection_at = now + args->inspection_interval_ms;
        }

        platform_sleep_ms(20);
    }

    atomic_store(&connection.connected, 0);
    net_shutdown(client_socket);
    pthread_join(command_thread, NULL);
    pthread_mutex_destroy(&connection.lock);
}

void *machine_run_thread(void *argument)
{
    MachineThreadArgs *args = (MachineThreadArgs *)argument;
    socket_t server_socket = net_listen(args->profile.port, 1);
    if (server_socket == SOCKET_INVALID) {
        fprintf(stderr, "[L1][%s] port %d listen failed: %s\n", args->profile.display_name,
                args->profile.port, net_last_error());
        return NULL;
    }
    printf("[L1][%s] waiting on port %d\n", args->profile.display_name, args->profile.port);

    while (!*args->stop_requested) {
        char remote_ip[64];
        socket_t client_socket = SOCKET_INVALID;
        NetAcceptResult accepted = net_accept_interruptible(
            server_socket, args->accept_wakeup, &client_socket, remote_ip, sizeof(remote_ip));
        if (accepted == NET_ACCEPT_INTERRUPTED) break;
        if (accepted == NET_ACCEPT_ERROR) {
            fprintf(stderr, "[L1][%s] accept failed: %s\n",
                    args->profile.display_name, net_last_error());
            break;
        }
        printf("[L1][%s] L2 connected (%s)\n", args->profile.display_name, remote_ip);
        run_connected_machine(args, client_socket);
        net_close(client_socket);
        printf("[L1][%s] L2 disconnected\n", args->profile.display_name);
    }

    net_close(server_socket);
    return NULL;
}
