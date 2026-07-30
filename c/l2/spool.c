#include "spool.h"

#include <cjson/cJSON.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#ifdef _WIN32
#include <io.h>
#else
#include <unistd.h>
#endif

#include "platform.h"

static int ensure_capacity(Spool *spool, size_t required)
{
    if (required <= spool->capacity) return 0;
    size_t next = spool->capacity == 0 ? 16 : spool->capacity * 2;
    while (next < required) next *= 2;
    SpoolRecord *resized = (SpoolRecord *)realloc(spool->records, next * sizeof(*resized));
    if (resized == NULL) return -1;
    spool->records = resized;
    spool->capacity = next;
    return 0;
}

static void sync_file(FILE *file)
{
    fflush(file);
#ifdef _WIN32
    _commit(_fileno(file));
#else
    fsync(fileno(file));
#endif
}

static cJSON *record_to_json(const SpoolRecord *record)
{
    cJSON *root = cJSON_CreateObject();
    cJSON_AddStringToObject(root, "kind", record->type == SPOOL_RECORD_HOURLY ? "HOURLY" : "DEFECT");
    cJSON_AddStringToObject(root, "key", record->key);
    cJSON *payload = cJSON_AddObjectToObject(root, "payload");
    if (record->type == SPOOL_RECORD_HOURLY) {
        const HourlyAggregate *a = &record->payload.hourly;
        cJSON_AddNumberToObject(payload, "workOrderId", (double)a->work_order_id);
        cJSON_AddNumberToObject(payload, "targetQty", a->target_qty);
        cJSON_AddNumberToObject(payload, "productionQty", a->production_qty);
        cJSON_AddNumberToObject(payload, "goodQty", a->good_qty);
        cJSON_AddNumberToObject(payload, "defectQty", a->defect_qty);
        cJSON_AddNumberToObject(payload, "bucketStartMs", (double)a->bucket_start_ms);
        cJSON_AddNumberToObject(payload, "bucketEndMs", (double)a->bucket_end_ms);
        cJSON_AddBoolToObject(payload, "isPartial", a->is_partial);
        cJSON_AddNumberToObject(payload, "closeReason", a->close_reason);
    } else {
        const DefectEvent *d = &record->payload.defect;
        cJSON_AddStringToObject(payload, "idempotencyKey", d->idempotency_key);
        cJSON_AddNumberToObject(payload, "workOrderId", (double)d->work_order_id);
        cJSON_AddNumberToObject(payload, "productionLotId", (double)d->production_lot_id);
        cJSON_AddStringToObject(payload, "equipmentCode", d->equipment_code);
        cJSON_AddNumberToObject(payload, "defectCode", d->defect_code);
        cJSON_AddNumberToObject(payload, "quantity", d->quantity);
        cJSON_AddNumberToObject(payload, "occurredAtMs", (double)d->occurred_at_ms);
    }
    return root;
}

static int json_number(cJSON *object, const char *name, double *out)
{
    cJSON *item = cJSON_GetObjectItemCaseSensitive(object, name);
    if (!cJSON_IsNumber(item)) return -1;
    *out = item->valuedouble;
    return 0;
}

static int record_from_json(const char *line, SpoolRecord *record)
{
    cJSON *root = cJSON_Parse(line);
    if (root == NULL) return -1;
    cJSON *kind = cJSON_GetObjectItemCaseSensitive(root, "kind");
    cJSON *key = cJSON_GetObjectItemCaseSensitive(root, "key");
    cJSON *payload = cJSON_GetObjectItemCaseSensitive(root, "payload");
    if (!cJSON_IsString(kind) || !cJSON_IsString(key) || !cJSON_IsObject(payload)) {
        cJSON_Delete(root);
        return -1;
    }
    memset(record, 0, sizeof(*record));
    snprintf(record->key, sizeof(record->key), "%s", key->valuestring);
    double value;
    if (strcmp(kind->valuestring, "HOURLY") == 0) {
        record->type = SPOOL_RECORD_HOURLY;
        HourlyAggregate *a = &record->payload.hourly;
        if (json_number(payload, "workOrderId", &value) != 0) goto invalid;
        a->work_order_id = (int64_t)value;
        if (json_number(payload, "targetQty", &value) != 0) goto invalid;
        a->target_qty = (int)value;
        if (json_number(payload, "productionQty", &value) != 0) goto invalid;
        a->production_qty = (int)value;
        if (json_number(payload, "goodQty", &value) != 0) goto invalid;
        a->good_qty = (int)value;
        if (json_number(payload, "defectQty", &value) != 0) goto invalid;
        a->defect_qty = (int)value;
        if (json_number(payload, "bucketStartMs", &value) != 0) goto invalid;
        a->bucket_start_ms = (int64_t)value;
        if (json_number(payload, "bucketEndMs", &value) != 0) goto invalid;
        a->bucket_end_ms = (int64_t)value;
        cJSON *partial = cJSON_GetObjectItemCaseSensitive(payload, "isPartial");
        a->is_partial = cJSON_IsTrue(partial);
        if (json_number(payload, "closeReason", &value) != 0) goto invalid;
        a->close_reason = (CloseReason)(int)value;
    } else if (strcmp(kind->valuestring, "DEFECT") == 0) {
        record->type = SPOOL_RECORD_DEFECT;
        DefectEvent *d = &record->payload.defect;
        cJSON *id = cJSON_GetObjectItemCaseSensitive(payload, "idempotencyKey");
        cJSON *equipment = cJSON_GetObjectItemCaseSensitive(payload, "equipmentCode");
        if (!cJSON_IsString(id) || !cJSON_IsString(equipment)) goto invalid;
        snprintf(d->idempotency_key, sizeof(d->idempotency_key), "%s", id->valuestring);
        snprintf(d->equipment_code, sizeof(d->equipment_code), "%s", equipment->valuestring);
        if (json_number(payload, "workOrderId", &value) != 0) goto invalid;
        d->work_order_id = (int64_t)value;
        if (json_number(payload, "productionLotId", &value) != 0) goto invalid;
        d->production_lot_id = (int64_t)value;
        if (json_number(payload, "defectCode", &value) != 0) goto invalid;
        d->defect_code = (DefectCode)(int)value;
        if (json_number(payload, "quantity", &value) != 0) goto invalid;
        d->quantity = (int)value;
        if (json_number(payload, "occurredAtMs", &value) != 0) goto invalid;
        d->occurred_at_ms = (int64_t)value;
    } else {
        goto invalid;
    }
    cJSON_Delete(root);
    return 0;

invalid:
    cJSON_Delete(root);
    return -1;
}

static int append_record_to_file(const Spool *spool, const SpoolRecord *record)
{
    if (platform_ensure_parent_directory(spool->path) != 0) return -1;
    FILE *file = fopen(spool->path, "a");
    if (file == NULL) return -1;
    cJSON *json = record_to_json(record);
    char *line = cJSON_PrintUnformatted(json);
    int result = line != NULL && fprintf(file, "%s\n", line) >= 0 ? 0 : -1;
    sync_file(file);
    free(line);
    cJSON_Delete(json);
    fclose(file);
    return result;
}

static int rewrite_file(const Spool *spool)
{
    char temporary[544];
    snprintf(temporary, sizeof(temporary), "%s.tmp", spool->path);
    if (platform_ensure_parent_directory(spool->path) != 0) return -1;
    FILE *file = fopen(temporary, "w");
    if (file == NULL) return -1;
    for (size_t i = 0; i < spool->count; i++) {
        cJSON *json = record_to_json(&spool->records[i]);
        char *line = cJSON_PrintUnformatted(json);
        if (line == NULL || fprintf(file, "%s\n", line) < 0) {
            free(line);
            cJSON_Delete(json);
            fclose(file);
            remove(temporary);
            return -1;
        }
        free(line);
        cJSON_Delete(json);
    }
    sync_file(file);
    fclose(file);
    return platform_replace_file(temporary, spool->path);
}

int spool_init(Spool *spool, const char *path)
{
    if (spool == NULL || path == NULL || strlen(path) >= sizeof(spool->path)) return -1;
    memset(spool, 0, sizeof(*spool));
    snprintf(spool->path, sizeof(spool->path), "%s", path);
    if (pthread_mutex_init(&spool->lock, NULL) != 0) return -1;

    FILE *file = fopen(path, "r");
    if (file == NULL) return 0;
    char line[4096];
    while (fgets(line, sizeof(line), file) != NULL) {
        SpoolRecord record;
        if (record_from_json(line, &record) != 0) continue;
        if (ensure_capacity(spool, spool->count + 1) != 0) {
            fclose(file);
            spool_destroy(spool);
            return -1;
        }
        spool->records[spool->count++] = record;
    }
    fclose(file);
    return 0;
}

void spool_destroy(Spool *spool)
{
    if (spool == NULL) return;
    free(spool->records);
    spool->records = NULL;
    spool->count = 0;
    spool->capacity = 0;
    pthread_mutex_destroy(&spool->lock);
}

static int key_exists(const Spool *spool, const char *key)
{
    for (size_t i = 0; i < spool->count; i++) {
        if (strcmp(spool->records[i].key, key) == 0) return 1;
    }
    return 0;
}

static int append_record(Spool *spool, const SpoolRecord *record)
{
    pthread_mutex_lock(&spool->lock);
    if (key_exists(spool, record->key)) {
        pthread_mutex_unlock(&spool->lock);
        return 0;
    }
    if (ensure_capacity(spool, spool->count + 1) != 0 || append_record_to_file(spool, record) != 0) {
        pthread_mutex_unlock(&spool->lock);
        return -1;
    }
    spool->records[spool->count++] = *record;
    pthread_mutex_unlock(&spool->lock);
    return 0;
}

int spool_append_hourly(Spool *spool, const HourlyAggregate *aggregate)
{
    SpoolRecord record;
    memset(&record, 0, sizeof(record));
    record.type = SPOOL_RECORD_HOURLY;
    record.payload.hourly = *aggregate;
    snprintf(record.key, sizeof(record.key), "hourly:%lld:%lld",
             (long long)aggregate->work_order_id, (long long)aggregate->bucket_start_ms);
    return append_record(spool, &record);
}

int spool_append_defect(Spool *spool, const DefectEvent *event)
{
    SpoolRecord record;
    memset(&record, 0, sizeof(record));
    record.type = SPOOL_RECORD_DEFECT;
    record.payload.defect = *event;
    snprintf(record.key, sizeof(record.key), "%s", event->idempotency_key);
    return append_record(spool, &record);
}

int spool_peek(Spool *spool, SpoolRecord *record)
{
    pthread_mutex_lock(&spool->lock);
    int available = spool->count > 0;
    if (available) *record = spool->records[0];
    pthread_mutex_unlock(&spool->lock);
    return available;
}

int spool_acknowledge(Spool *spool, const char *key)
{
    pthread_mutex_lock(&spool->lock);
    size_t index = spool->count;
    for (size_t i = 0; i < spool->count; i++) {
        if (strcmp(spool->records[i].key, key) == 0) {
            index = i;
            break;
        }
    }
    if (index == spool->count) {
        pthread_mutex_unlock(&spool->lock);
        return -1;
    }
    SpoolRecord removed = spool->records[index];
    if (index + 1 < spool->count) {
        memmove(&spool->records[index], &spool->records[index + 1],
                (spool->count - index - 1) * sizeof(*spool->records));
    }
    spool->count--;
    int result = rewrite_file(spool);
    if (result != 0) {
        if (index < spool->count) {
            memmove(&spool->records[index + 1], &spool->records[index],
                    (spool->count - index) * sizeof(*spool->records));
        }
        spool->records[index] = removed;
        spool->count++;
    }
    pthread_mutex_unlock(&spool->lock);
    return result;
}

size_t spool_count(Spool *spool)
{
    pthread_mutex_lock(&spool->lock);
    size_t count = spool->count;
    pthread_mutex_unlock(&spool->lock);
    return count;
}
