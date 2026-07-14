#include "command_poller.h"

#include <stdio.h>

#include "platform.h"
#include "protocol.h"

static void spool_closed_aggregate(CommandPoller *poller, CloseReason reason)
{
    HourlyAggregate closed;
    if (hourly_aggregator_close(poller->aggregator, reason, platform_now_ms(), &closed)) {
        if (spool_append_hourly(poller->spool, &closed) != 0)
            fprintf(stderr, "[L2][command] failed to spool closed aggregate\n");
    }
}

static int remaining_target(const WorkOrder *order)
{
    int remaining = order->target_qty - order->current_qty;
    return remaining > 0 ? remaining : 0;
}

static void apply_new_order(CommandPoller *poller, const WorkOrder *old_order, bool had_old,
                            const WorkOrder *new_order)
{
    if (had_old) {
        device_manager_broadcast(poller->devices, old_order->equipment_mask, MSG_COMMAND_STOP, 0);
        spool_closed_aggregate(poller, CLOSE_REASON_WORK_ORDER_COMPLETED);
    }
    collector_set_order(poller->collector, new_order, true);
    if (new_order->status == ORDER_STATUS_IN_PROGRESS) {
        hourly_aggregator_start(poller->aggregator, new_order, platform_now_ms());
        device_manager_broadcast(poller->devices, new_order->equipment_mask,
                                 MSG_COMMAND_START, remaining_target(new_order));
    } else if (new_order->status == ORDER_STATUS_HOLD) {
        device_manager_broadcast(poller->devices, new_order->equipment_mask, MSG_COMMAND_HOLD, 0);
    }
}

static void apply_same_order(CommandPoller *poller, const WorkOrder *old_order,
                             const WorkOrder *new_order)
{
    if (old_order->equipment_mask != new_order->equipment_mask) {
        uint16_t removed = (uint16_t)(old_order->equipment_mask & ~new_order->equipment_mask);
        if (removed != 0) device_manager_broadcast(poller->devices, removed, MSG_COMMAND_STOP, 0);
    }

    if (old_order->status != new_order->status) {
        if (new_order->status == ORDER_STATUS_HOLD) {
            spool_closed_aggregate(poller, CLOSE_REASON_HOLD);
            device_manager_broadcast(poller->devices, new_order->equipment_mask, MSG_COMMAND_HOLD, 0);
        } else if (new_order->status == ORDER_STATUS_IN_PROGRESS) {
            hourly_aggregator_start(poller->aggregator, new_order, platform_now_ms());
            uint8_t command = old_order->status == ORDER_STATUS_HOLD ? MSG_COMMAND_RESUME : MSG_COMMAND_START;
            device_manager_broadcast(poller->devices, new_order->equipment_mask,
                                     command, remaining_target(new_order));
        } else if (new_order->status == ORDER_STATUS_DONE || new_order->status == ORDER_STATUS_NONE) {
            spool_closed_aggregate(poller, CLOSE_REASON_WORK_ORDER_COMPLETED);
            device_manager_broadcast(poller->devices, old_order->equipment_mask, MSG_COMMAND_STOP, 0);
        }
    } else if (new_order->status == ORDER_STATUS_IN_PROGRESS) {
        device_manager_cache_command(poller->devices, new_order->equipment_mask,
                                     MSG_COMMAND_START, remaining_target(new_order));
    }
    collector_set_order(poller->collector, new_order, true);
}

static void *poll_loop(void *argument)
{
    CommandPoller *poller = (CommandPoller *)argument;
    while (!*poller->stop_requested) {
        WorkOrder new_order;
        int has_new_order = 0;
        if (api_poll_work_order(poller->api, &new_order, &has_new_order) == 0) {
            WorkOrder old_order;
            bool had_old = collector_get_order(poller->collector, &old_order);
            if (!has_new_order) {
                if (had_old) {
                    device_manager_broadcast(poller->devices, old_order.equipment_mask,
                                             MSG_COMMAND_STOP, 0);
                    spool_closed_aggregate(poller, CLOSE_REASON_WORK_ORDER_COMPLETED);
                    collector_set_order(poller->collector, NULL, false);
                }
            } else if (!had_old || old_order.work_order_id != new_order.work_order_id) {
                apply_new_order(poller, &old_order, had_old, &new_order);
            } else {
                apply_same_order(poller, &old_order, &new_order);
            }
        }

        int waited = 0;
        while (!*poller->stop_requested && waited < poller->poll_interval_ms) {
            int step = poller->poll_interval_ms - waited;
            if (step > 100) step = 100;
            platform_sleep_ms(step);
            waited += step;
        }
    }
    return NULL;
}

int command_poller_start(CommandPoller *poller)
{
    return pthread_create(&poller->thread, NULL, poll_loop, poller);
}

void command_poller_join(CommandPoller *poller)
{
    pthread_join(poller->thread, NULL);
}
