#ifndef _WIN32
#define _POSIX_C_SOURCE 200809L
#endif

#include "platform.h"

#include <errno.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#ifdef _WIN32
#include <direct.h>
#include <windows.h>
#define mkdir_one(path) _mkdir(path)
#else
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>
#define mkdir_one(path) mkdir((path), 0755)
#endif

void platform_sleep_ms(int milliseconds)
{
    if (milliseconds <= 0) return;
#ifdef _WIN32
    Sleep((DWORD)milliseconds);
#else
    struct timespec ts;
    ts.tv_sec = milliseconds / 1000;
    ts.tv_nsec = (long)(milliseconds % 1000) * 1000000L;
    while (nanosleep(&ts, &ts) != 0 && errno == EINTR) {
    }
#endif
}

int64_t platform_now_ms(void)
{
    struct timespec ts;
    if (timespec_get(&ts, TIME_UTC) != TIME_UTC) return (int64_t)time(NULL) * 1000;
    return (int64_t)ts.tv_sec * 1000 + ts.tv_nsec / 1000000;
}

void platform_format_utc(int64_t epoch_ms, char *out, size_t out_size)
{
    time_t seconds = (time_t)(epoch_ms / 1000);
    struct tm utc_tm;
#ifdef _WIN32
    gmtime_s(&utc_tm, &seconds);
#else
    gmtime_r(&seconds, &utc_tm);
#endif
    char base[24];
    strftime(base, sizeof(base), "%Y-%m-%dT%H:%M:%S", &utc_tm);
    snprintf(out, out_size, "%s.%03lldZ", base, (long long)(epoch_ms % 1000));
}

int platform_env_int(const char *name, int fallback, int minimum, int maximum)
{
    const char *value = getenv(name);
    if (value == NULL || *value == '\0') return fallback;
    char *end = NULL;
    long parsed = strtol(value, &end, 10);
    if (end == value || *end != '\0' || parsed < minimum || parsed > maximum) return fallback;
    return (int)parsed;
}

unsigned int platform_env_uint(const char *name, unsigned int fallback)
{
    const char *value = getenv(name);
    if (value == NULL || *value == '\0') return fallback;
    char *end = NULL;
    unsigned long parsed = strtoul(value, &end, 10);
    if (end == value || *end != '\0' || parsed > UINT_MAX) return fallback;
    return (unsigned int)parsed;
}

const char *platform_env_string(const char *name, const char *fallback)
{
    const char *value = getenv(name);
    return (value != NULL && *value != '\0') ? value : fallback;
}

int platform_ensure_parent_directory(const char *file_path)
{
    char buffer[512];
    size_t length = strlen(file_path);
    if (length == 0 || length >= sizeof(buffer)) return -1;
    memcpy(buffer, file_path, length + 1);

    for (size_t i = 1; i < length; i++) {
        if (buffer[i] != '/' && buffer[i] != '\\') continue;
        char saved = buffer[i];
        buffer[i] = '\0';
        if (mkdir_one(buffer) != 0 && errno != EEXIST) return -1;
        buffer[i] = saved;
    }
    return 0;
}

int platform_replace_file(const char *source_path, const char *destination_path)
{
#ifdef _WIN32
    return MoveFileExA(source_path, destination_path, MOVEFILE_REPLACE_EXISTING) ? 0 : -1;
#else
    return rename(source_path, destination_path);
#endif
}
