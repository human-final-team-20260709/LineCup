#include "api_client.h"

#include <curl/curl.h>
#include <cjson/cJSON.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "config.h"
#include "platform.h"

typedef struct {
    char *data;
    size_t length;
} ResponseBuffer;

static size_t write_response(void *contents, size_t size, size_t count, void *user_data)
{
    size_t total = size * count;
    ResponseBuffer *buffer = (ResponseBuffer *)user_data;
    char *resized = (char *)realloc(buffer->data, buffer->length + total + 1);
    if (resized == NULL) return 0;
    buffer->data = resized;
    memcpy(buffer->data + buffer->length, contents, total);
    buffer->length += total;
    buffer->data[buffer->length] = '\0';
    return total;
}

static void build_url(const ApiClient *client, const char *path, char *out, size_t out_size)
{
    size_t length = strlen(client->base_url);
    if (length > 0 && client->base_url[length - 1] == '/')
        snprintf(out, out_size, "%s%s", client->base_url, path[0] == '/' ? path + 1 : path);
    else if (path[0] == '/')
        snprintf(out, out_size, "%s%s", client->base_url, path);
    else
        snprintf(out, out_size, "%s/%s", client->base_url, path);
}

static int perform_request(const char *method, const char *url, const char *body,
                           long *http_status, ResponseBuffer *response)
{
    CURL *curl = curl_easy_init();
    if (curl == NULL) return -1;
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    curl_easy_setopt(curl, CURLOPT_URL, url);
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, MES_HTTP_CONNECT_TIMEOUT_SECONDS);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, MES_HTTP_TIMEOUT_SECONDS);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_response);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, response);
    curl_easy_setopt(curl, CURLOPT_NOSIGNAL, 1L);
    if (strcmp(method, "POST") == 0) {
        curl_easy_setopt(curl, CURLOPT_POST, 1L);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body != NULL ? body : "{}");
    }
    CURLcode result = curl_easy_perform(curl);
    if (result == CURLE_OK) curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, http_status);
    else fprintf(stderr, "[L2][HTTP] %s failed: %s\n", url, curl_easy_strerror(result));
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
    return result == CURLE_OK ? 0 : -1;
}

static int post_json(const ApiClient *client, const char *path, cJSON *json)
{
    char url[512];
    build_url(client, path, url, sizeof(url));
    char *body = cJSON_PrintUnformatted(json);
    if (body == NULL) return -1;
    ResponseBuffer response = {0};
    long status = 0;
    int request_result = perform_request("POST", url, body, &status, &response);
    free(body);
    free(response.data);
    return request_result == 0 && status >= 200 && status < 300 ? 0 : -1;
}

int api_global_init(void)
{
    return curl_global_init(CURL_GLOBAL_DEFAULT) == CURLE_OK ? 0 : -1;
}

void api_global_cleanup(void)
{
    curl_global_cleanup();
}

void api_client_configure(ApiClient *client, const char *base_url, const char *collector_code)
{
    memset(client, 0, sizeof(*client));
    snprintf(client->base_url, sizeof(client->base_url), "%s", base_url);
    snprintf(client->collector_code, sizeof(client->collector_code), "%s", collector_code);
}

static uint16_t equipment_mask_from_json(cJSON *array)
{
    if (!cJSON_IsArray(array)) return 0;
    uint16_t mask = 0;
    cJSON *item = NULL;
    cJSON_ArrayForEach(item, array) {
        if (!cJSON_IsString(item)) continue;
        for (int i = 0; i < MES_MACHINE_COUNT; i++) {
            if (strcmp(item->valuestring, machine_type_code((MachineType)i)) == 0) {
                mask |= (uint16_t)(1u << i);
                break;
            }
        }
    }
    return mask;
}

int api_poll_work_order(ApiClient *client, WorkOrder *order, int *has_order)
{
    CURL *escape_handle = curl_easy_init();
    if (escape_handle == NULL) return -1;
    char *escaped = curl_easy_escape(escape_handle, client->collector_code, 0);
    char path[256];
    snprintf(path, sizeof(path), "/api/l2/work-orders/active?collectorCode=%s",
             escaped != NULL ? escaped : client->collector_code);
    if (escaped != NULL) curl_free(escaped);
    curl_easy_cleanup(escape_handle);

    char url[512];
    build_url(client, path, url, sizeof(url));
    ResponseBuffer response = {0};
    long status = 0;
    if (perform_request("GET", url, NULL, &status, &response) != 0) {
        free(response.data);
        return -1;
    }
    if (status == 204) {
        *has_order = 0;
        free(response.data);
        return 0;
    }
    if (status != 200 || response.data == NULL) {
        free(response.data);
        return -1;
    }

    cJSON *json = cJSON_Parse(response.data);
    free(response.data);
    if (json == NULL) return -1;
    cJSON *work_order_id = cJSON_GetObjectItemCaseSensitive(json, "workOrderId");
    cJSON *production_lot_id = cJSON_GetObjectItemCaseSensitive(json, "productionLotId");
    cJSON *status_item = cJSON_GetObjectItemCaseSensitive(json, "status");
    cJSON *target_qty = cJSON_GetObjectItemCaseSensitive(json, "targetQty");
    cJSON *current_qty = cJSON_GetObjectItemCaseSensitive(json, "currentQty");
    cJSON *hourly_target = cJSON_GetObjectItemCaseSensitive(json, "hourlyTargetQty");
    cJSON *equipment_codes = cJSON_GetObjectItemCaseSensitive(json, "equipmentCodes");

    if (!cJSON_IsNumber(work_order_id) || !cJSON_IsNumber(production_lot_id) ||
        !cJSON_IsString(status_item) || !cJSON_IsNumber(target_qty) ||
        !cJSON_IsNumber(current_qty) || !cJSON_IsNumber(hourly_target)) {
        cJSON_Delete(json);
        return -1;
    }
    memset(order, 0, sizeof(*order));
    order->work_order_id = (int64_t)work_order_id->valuedouble;
    order->production_lot_id = (int64_t)production_lot_id->valuedouble;
    order->status = work_order_status_from_string(status_item->valuestring);
    order->target_qty = target_qty->valueint;
    order->current_qty = current_qty->valueint;
    order->hourly_target_qty = hourly_target->valueint;
    order->equipment_mask = equipment_mask_from_json(equipment_codes);
    if (order->equipment_mask == 0) order->equipment_mask = (uint16_t)((1u << MES_MACHINE_COUNT) - 1u);
    *has_order = 1;
    cJSON_Delete(json);
    return 0;
}

int api_send_telemetry(ApiClient *client, const TelemetrySample *samples, size_t count)
{
    cJSON *root = cJSON_CreateObject();
    cJSON *array = cJSON_AddArrayToObject(root, "samples");
    for (size_t i = 0; i < count; i++) {
        char timestamp[MES_TIMESTAMP_SIZE];
        platform_format_utc(samples[i].measured_at_ms, timestamp, sizeof(timestamp));
        cJSON *item = cJSON_CreateObject();
        cJSON_AddStringToObject(item, "equipmentCode", samples[i].equipment_code);
        cJSON_AddNumberToObject(item, "workOrderId", (double)samples[i].work_order_id);
        cJSON_AddStringToObject(item, "metricType", metric_type_name(samples[i].metric_type));
        cJSON_AddNumberToObject(item, "value", samples[i].value);
        cJSON_AddStringToObject(item, "unit", samples[i].unit);
        cJSON_AddStringToObject(item, "measuredAt", timestamp);
        cJSON_AddItemToArray(array, item);
    }
    int result = post_json(client, "/api/l2/telemetry/batch", root);
    cJSON_Delete(root);
    return result;
}

int api_send_hourly(ApiClient *client, const HourlyAggregate *aggregate)
{
    char start[MES_TIMESTAMP_SIZE], end[MES_TIMESTAMP_SIZE];
    platform_format_utc(aggregate->bucket_start_ms, start, sizeof(start));
    platform_format_utc(aggregate->bucket_end_ms, end, sizeof(end));
    cJSON *root = cJSON_CreateObject();
    cJSON_AddNumberToObject(root, "workOrderId", (double)aggregate->work_order_id);
    cJSON_AddStringToObject(root, "bucketStart", start);
    cJSON_AddStringToObject(root, "bucketEnd", end);
    cJSON_AddNumberToObject(root, "targetQty", aggregate->target_qty);
    cJSON_AddNumberToObject(root, "productionQty", aggregate->production_qty);
    cJSON_AddNumberToObject(root, "goodQty", aggregate->good_qty);
    cJSON_AddNumberToObject(root, "defectQty", aggregate->defect_qty);
    cJSON_AddBoolToObject(root, "isPartial", aggregate->is_partial);
    cJSON_AddStringToObject(root, "closeReason", close_reason_name(aggregate->close_reason));
    int result = post_json(client, "/api/l2/hourly-productions", root);
    cJSON_Delete(root);
    return result;
}

int api_send_defect(ApiClient *client, const DefectEvent *event)
{
    char occurred_at[MES_TIMESTAMP_SIZE];
    platform_format_utc(event->occurred_at_ms, occurred_at, sizeof(occurred_at));
    cJSON *root = cJSON_CreateObject();
    cJSON_AddStringToObject(root, "idempotencyKey", event->idempotency_key);
    cJSON_AddNumberToObject(root, "workOrderId", (double)event->work_order_id);
    cJSON_AddNumberToObject(root, "productionLotId", (double)event->production_lot_id);
    cJSON_AddStringToObject(root, "equipmentCode", event->equipment_code);
    cJSON_AddStringToObject(root, "defectType", defect_code_name(event->defect_code));
    cJSON_AddNumberToObject(root, "quantity", event->quantity);
    cJSON_AddStringToObject(root, "occurredAt", occurred_at);
    int result = post_json(client, "/api/l2/defects", root);
    cJSON_Delete(root);
    return result;
}

int api_send_heartbeat(ApiClient *client, const DeviceStatus *statuses, size_t count)
{
    cJSON *root = cJSON_CreateObject();
    cJSON_AddStringToObject(root, "collectorCode", client->collector_code);
    char sent_at[MES_TIMESTAMP_SIZE];
    platform_format_utc(platform_now_ms(), sent_at, sizeof(sent_at));
    cJSON_AddStringToObject(root, "sentAt", sent_at);
    int connected_count = 0;
    cJSON *devices = cJSON_AddArrayToObject(root, "devices");
    for (size_t i = 0; i < count; i++) {
        if (statuses[i].connected) connected_count++;
        cJSON *device = cJSON_CreateObject();
        cJSON_AddStringToObject(device, "equipmentCode", statuses[i].equipment_code);
        cJSON_AddNumberToObject(device, "port", statuses[i].port);
        cJSON_AddStringToObject(device, "connectionStatus", statuses[i].connected ? "CONNECTED" : "DISCONNECTED");
        if (statuses[i].last_received_at_ms > 0) {
            char last_received[MES_TIMESTAMP_SIZE];
            platform_format_utc(statuses[i].last_received_at_ms, last_received, sizeof(last_received));
            cJSON_AddStringToObject(device, "lastReceivedAt", last_received);
        } else {
            cJSON_AddNullToObject(device, "lastReceivedAt");
        }
        cJSON_AddItemToArray(devices, device);
    }
    cJSON_AddNumberToObject(root, "connectedL1Count", connected_count);
    int result = post_json(client, "/api/l2/status/heartbeat", root);
    cJSON_Delete(root);
    return result;
}
