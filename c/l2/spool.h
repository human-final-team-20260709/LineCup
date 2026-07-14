#ifndef MES_SPOOL_H
#define MES_SPOOL_H

#include <pthread.h>
#include <stddef.h>

#include "types.h"

typedef enum {
    SPOOL_RECORD_HOURLY = 0,
    SPOOL_RECORD_DEFECT
} SpoolRecordType;

typedef struct {
    SpoolRecordType type;
    char key[MES_SPOOL_ID_SIZE];
    union {
        HourlyAggregate hourly;
        DefectEvent defect;
    } payload;
} SpoolRecord;

typedef struct {
    pthread_mutex_t lock;
    char path[512];
    SpoolRecord *records;
    size_t count;
    size_t capacity;
} Spool;

int spool_init(Spool *spool, const char *path);
void spool_destroy(Spool *spool);
int spool_append_hourly(Spool *spool, const HourlyAggregate *aggregate);
int spool_append_defect(Spool *spool, const DefectEvent *event);
int spool_peek(Spool *spool, SpoolRecord *record);
int spool_acknowledge(Spool *spool, const char *key);
size_t spool_count(Spool *spool);

#endif
