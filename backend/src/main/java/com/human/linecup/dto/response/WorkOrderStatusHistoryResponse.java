package com.human.linecup.dto.response;

import com.human.linecup.entity.WorkOrder;

import java.time.Instant;

public record WorkOrderStatusHistoryResponse(
        Long historyId,
        WorkOrder.Action action,
        WorkOrder.Status prevStatus,
        WorkOrder.Status newStatus,
        String newStatusLabel,
        Long changedById,
        String changedByEmpNo,
        String changedByName,
        String note,
        Instant changedAt
) {
}
