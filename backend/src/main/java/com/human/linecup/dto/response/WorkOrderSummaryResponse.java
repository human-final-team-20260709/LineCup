package com.human.linecup.dto.response;

import com.human.linecup.entity.WorkOrder;

import java.time.Instant;
import java.time.LocalDate;

public record WorkOrderSummaryResponse(
        Long workOrderId,
        String workOrderNo,
        Long productId,
        String productCode,
        String productName,
        WorkOrder.Status status,
        String statusLabel,
        int targetQty,
        int hourlyTargetQty,
        int currentQty,
        int goodQty,
        int defectQty,
        double progressRate,
        LocalDate plannedStartDate,
        Instant startedAt,
        Instant completedAt,
        Instant registeredAt,
        Long supervisorId,
        String supervisorEmpNo,
        String supervisorName
) {
}
