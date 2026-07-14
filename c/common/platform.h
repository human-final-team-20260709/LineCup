#ifndef MES_PLATFORM_H
#define MES_PLATFORM_H

#include <stddef.h>
#include <stdint.h>

void platform_sleep_ms(int milliseconds);
int64_t platform_now_ms(void);
void platform_format_utc(int64_t epoch_ms, char *out, size_t out_size);
int platform_env_int(const char *name, int fallback, int minimum, int maximum);
unsigned int platform_env_uint(const char *name, unsigned int fallback);
const char *platform_env_string(const char *name, const char *fallback);
int platform_ensure_parent_directory(const char *file_path);
int platform_replace_file(const char *source_path, const char *destination_path);

#endif
