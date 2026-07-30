#ifndef _WIN32
#define _POSIX_C_SOURCE 200112L
#endif

#include "net.h"

#include <errno.h>
#include <stdio.h>
#include <string.h>

#ifdef _WIN32
#include <ws2tcpip.h>
#else
#include <arpa/inet.h>
#include <fcntl.h>
#include <netdb.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <sys/time.h>
#include <unistd.h>
#endif

int net_init(void)
{
#ifdef _WIN32
    WSADATA data;
    return WSAStartup(MAKEWORD(2, 2), &data) == 0 ? 0 : -1;
#else
    return 0;
#endif
}

void net_cleanup(void)
{
#ifdef _WIN32
    WSACleanup();
#endif
}

static int socket_error_interrupted(void)
{
#ifdef _WIN32
    return WSAGetLastError() == WSAEINTR;
#else
    return errno == EINTR;
#endif
}

static int socket_error_would_block(void)
{
#ifdef _WIN32
    int error = WSAGetLastError();
    return error == WSAEWOULDBLOCK || error == WSAETIMEDOUT;
#else
    return errno == EAGAIN || errno == EWOULDBLOCK;
#endif
}

void net_close(socket_t socket)
{
    if (socket == SOCKET_INVALID) return;
#ifdef _WIN32
    closesocket(socket);
#else
    close(socket);
#endif
}

void net_shutdown(socket_t socket)
{
    if (socket == SOCKET_INVALID) return;
#ifdef _WIN32
    shutdown(socket, SD_BOTH);
#else
    shutdown(socket, SHUT_RDWR);
#endif
}

socket_t net_listen(int port, int backlog)
{
    socket_t server_socket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (server_socket == SOCKET_INVALID) return SOCKET_INVALID;

    int reuse = 1;
    setsockopt(server_socket, SOL_SOCKET, SO_REUSEADDR, (const char *)&reuse, sizeof(reuse));

    struct sockaddr_in address;
    memset(&address, 0, sizeof(address));
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = htonl(INADDR_ANY);
    address.sin_port = htons((unsigned short)port);

    if (bind(server_socket, (struct sockaddr *)&address, sizeof(address)) != 0 ||
        listen(server_socket, backlog) != 0) {
        net_close(server_socket);
        return SOCKET_INVALID;
    }
    return server_socket;
}

socket_t net_accept(socket_t server_socket, char *ip_out, size_t ip_out_size)
{
    struct sockaddr_in address;
#ifdef _WIN32
    int length = (int)sizeof(address);
#else
    socklen_t length = sizeof(address);
#endif
    socket_t client = accept(server_socket, (struct sockaddr *)&address, &length);
    if (client != SOCKET_INVALID && ip_out != NULL && ip_out_size > 0) {
#ifdef _WIN32
        const char *ip = inet_ntop(AF_INET, &address.sin_addr, ip_out, ip_out_size);
#else
        const char *ip = inet_ntop(AF_INET, &address.sin_addr, ip_out, (socklen_t)ip_out_size);
#endif
        if (ip == NULL) ip_out[0] = '\0';
    }
    return client;
}

NetAcceptResult net_accept_interruptible(socket_t server_socket, const NetWakeup *wakeup,
                                         socket_t *client_out, char *ip_out,
                                         size_t ip_out_size)
{
    if (wakeup == NULL || client_out == NULL ||
        wakeup->read_socket == SOCKET_INVALID) {
        return NET_ACCEPT_ERROR;
    }

    *client_out = SOCKET_INVALID;
    for (;;) {
        fd_set read_set;
        FD_ZERO(&read_set);
        FD_SET(server_socket, &read_set);
        FD_SET(wakeup->read_socket, &read_set);
#ifdef _WIN32
        int selected = select(0, &read_set, NULL, NULL, NULL);
#else
        socket_t maximum = server_socket > wakeup->read_socket
                               ? server_socket
                               : wakeup->read_socket;
        int selected = select(maximum + 1, &read_set, NULL, NULL, NULL);
#endif
        if (selected < 0) {
            if (socket_error_interrupted()) continue;
            return NET_ACCEPT_ERROR;
        }
        if (FD_ISSET(wakeup->read_socket, &read_set))
            return NET_ACCEPT_INTERRUPTED;
        if (!FD_ISSET(server_socket, &read_set)) continue;

        socket_t client = net_accept(server_socket, ip_out, ip_out_size);
        if (client == SOCKET_INVALID) {
            if (socket_error_interrupted() || socket_error_would_block()) continue;
            return NET_ACCEPT_ERROR;
        }
        *client_out = client;
        return NET_ACCEPT_CONNECTED;
    }
}

int net_wakeup_init(NetWakeup *wakeup)
{
    if (wakeup == NULL) return -1;
    wakeup->read_socket = SOCKET_INVALID;
    wakeup->write_socket = SOCKET_INVALID;

    socket_t listener = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (listener == SOCKET_INVALID) return -1;

    struct sockaddr_in address;
    memset(&address, 0, sizeof(address));
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
    address.sin_port = 0;
    if (bind(listener, (struct sockaddr *)&address, sizeof(address)) != 0 ||
        listen(listener, 1) != 0) {
        net_close(listener);
        return -1;
    }

#ifdef _WIN32
    int address_length = (int)sizeof(address);
#else
    socklen_t address_length = sizeof(address);
#endif
    if (getsockname(listener, (struct sockaddr *)&address, &address_length) != 0) {
        net_close(listener);
        return -1;
    }

    socket_t writer = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (writer == SOCKET_INVALID ||
        connect(writer, (struct sockaddr *)&address, (int)sizeof(address)) != 0) {
        net_close(writer);
        net_close(listener);
        return -1;
    }

    socket_t reader = accept(listener, NULL, NULL);
    net_close(listener);
    if (reader == SOCKET_INVALID) {
        net_close(writer);
        return -1;
    }

    wakeup->read_socket = reader;
    wakeup->write_socket = writer;
    return 0;
}

int net_wakeup_signal(const NetWakeup *wakeup)
{
    if (wakeup == NULL || wakeup->write_socket == SOCKET_INVALID) return -1;
    const char signal_byte = 1;
#ifdef _WIN32
    return send(wakeup->write_socket, &signal_byte, 1, 0) == 1 ? 0 : -1;
#else
    return send(wakeup->write_socket, &signal_byte, 1, MSG_NOSIGNAL) == 1 ? 0 : -1;
#endif
}

void net_wakeup_destroy(NetWakeup *wakeup)
{
    if (wakeup == NULL) return;
    net_close(wakeup->read_socket);
    net_close(wakeup->write_socket);
    wakeup->read_socket = SOCKET_INVALID;
    wakeup->write_socket = SOCKET_INVALID;
}

socket_t net_connect(const char *host, int port)
{
    return net_connect_timeout(host, port, 3000);
}

static int set_nonblocking(socket_t socket, int enabled)
{
#ifdef _WIN32
    u_long mode = enabled ? 1UL : 0UL;
    return ioctlsocket(socket, FIONBIO, &mode);
#else
    int flags = fcntl(socket, F_GETFL, 0);
    if (flags < 0) return -1;
    return fcntl(socket, F_SETFL, enabled ? (flags | O_NONBLOCK) : (flags & ~O_NONBLOCK));
#endif
}

static int connect_in_progress(void)
{
#ifdef _WIN32
    int error = WSAGetLastError();
    return error == WSAEWOULDBLOCK || error == WSAEINPROGRESS || error == WSAEINVAL;
#else
    return errno == EINPROGRESS || errno == EWOULDBLOCK;
#endif
}

socket_t net_connect_timeout(const char *host, int port, int timeout_ms)
{
    char port_text[16];
    snprintf(port_text, sizeof(port_text), "%d", port);
    struct addrinfo hints;
    memset(&hints, 0, sizeof(hints));
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_protocol = IPPROTO_TCP;

    struct addrinfo *result = NULL;
    if (getaddrinfo(host, port_text, &hints, &result) != 0) return SOCKET_INVALID;

    socket_t connected = SOCKET_INVALID;
    for (struct addrinfo *item = result; item != NULL; item = item->ai_next) {
        socket_t candidate = socket(item->ai_family, item->ai_socktype, item->ai_protocol);
        if (candidate == SOCKET_INVALID) continue;
        if (set_nonblocking(candidate, 1) != 0) {
            net_close(candidate);
            continue;
        }
        int connect_result = connect(candidate, item->ai_addr, (int)item->ai_addrlen);
        if (connect_result == 0) {
            set_nonblocking(candidate, 0);
            connected = candidate;
            break;
        }
        if (!connect_in_progress()) {
            net_close(candidate);
            continue;
        }

        fd_set write_set;
        FD_ZERO(&write_set);
        FD_SET(candidate, &write_set);
        struct timeval timeout;
        timeout.tv_sec = timeout_ms / 1000;
        timeout.tv_usec = (timeout_ms % 1000) * 1000;
#ifdef _WIN32
        int selected = select(0, NULL, &write_set, NULL, &timeout);
        int error_length = sizeof(int);
#else
        int selected = select(candidate + 1, NULL, &write_set, NULL, &timeout);
        socklen_t error_length = sizeof(int);
#endif
        int socket_error = 0;
        if (selected > 0 && getsockopt(candidate, SOL_SOCKET, SO_ERROR,
                                       (char *)&socket_error, &error_length) == 0 && socket_error == 0) {
            set_nonblocking(candidate, 0);
            connected = candidate;
            break;
        }
        net_close(candidate);
    }
    freeaddrinfo(result);
    return connected;
}

int net_send_all(socket_t socket, const void *buffer, size_t length)
{
    const char *cursor = (const char *)buffer;
    size_t sent_total = 0;
    while (sent_total < length) {
#ifdef _WIN32
        int sent = send(socket, cursor + sent_total, (int)(length - sent_total), 0);
#else
        ssize_t sent = send(socket, cursor + sent_total, length - sent_total, 0);
#endif
        if (sent <= 0) return -1;
        sent_total += (size_t)sent;
    }
    return (int)sent_total;
}

static int wait_until_readable(socket_t socket)
{
    for (;;) {
        fd_set read_set;
        FD_ZERO(&read_set);
        FD_SET(socket, &read_set);
#ifdef _WIN32
        int selected = select(0, &read_set, NULL, NULL, NULL);
#else
        int selected = select(socket + 1, &read_set, NULL, NULL, NULL);
#endif
        if (selected > 0) return 0;
        if (selected < 0 && socket_error_interrupted()) continue;
        return -1;
    }
}

NetRecvResult net_recv_exact(socket_t socket, void *buffer, size_t length)
{
    char *cursor = (char *)buffer;
    size_t received_total = 0;
    while (received_total < length) {
#ifdef _WIN32
        int received = recv(socket, cursor + received_total, (int)(length - received_total), 0);
#else
        ssize_t received = recv(socket, cursor + received_total, length - received_total, 0);
#endif
        if (received == 0) return NET_RECV_CLOSED;
        if (received < 0) {
            if (socket_error_interrupted()) continue;
            if (socket_error_would_block()) {
                if (wait_until_readable(socket) == 0) continue;
            }
            return NET_RECV_ERROR;
        }
        received_total += (size_t)received;
    }
    return NET_RECV_OK;
}

const char *net_last_error(void)
{
    static char buffer[128];
#ifdef _WIN32
    snprintf(buffer, sizeof(buffer), "WinSock error %d", WSAGetLastError());
#else
    snprintf(buffer, sizeof(buffer), "%s", strerror(errno));
#endif
    return buffer;
}
