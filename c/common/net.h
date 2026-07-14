#ifndef MES_NET_H
#define MES_NET_H

#include <stddef.h>

#ifdef _WIN32
#include <winsock2.h>
typedef SOCKET socket_t;
#define SOCKET_INVALID INVALID_SOCKET
#else
typedef int socket_t;
#define SOCKET_INVALID (-1)
#endif

typedef enum {
    NET_ACCEPT_ERROR = -1,
    NET_ACCEPT_INTERRUPTED = 0,
    NET_ACCEPT_CONNECTED = 1
} NetAcceptResult;

typedef enum {
    NET_RECV_ERROR = -1,
    NET_RECV_CLOSED = 0,
    NET_RECV_OK = 1
} NetRecvResult;

typedef struct {
    socket_t read_socket;
    socket_t write_socket;
} NetWakeup;

int net_init(void);
void net_cleanup(void);
socket_t net_listen(int port, int backlog);
socket_t net_accept(socket_t server_socket, char *ip_out, size_t ip_out_size);
NetAcceptResult net_accept_interruptible(socket_t server_socket, const NetWakeup *wakeup,
                                         socket_t *client_out, char *ip_out,
                                         size_t ip_out_size);
socket_t net_connect(const char *host, int port);
socket_t net_connect_timeout(const char *host, int port, int timeout_ms);
int net_wakeup_init(NetWakeup *wakeup);
int net_wakeup_signal(const NetWakeup *wakeup);
void net_wakeup_destroy(NetWakeup *wakeup);
int net_send_all(socket_t socket, const void *buffer, size_t length);
NetRecvResult net_recv_exact(socket_t socket, void *buffer, size_t length);
void net_shutdown(socket_t socket);
void net_close(socket_t socket);
const char *net_last_error(void);

#endif
