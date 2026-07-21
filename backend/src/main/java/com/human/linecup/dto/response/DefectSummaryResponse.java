package com.human.linecup.dto.response;

import com.human.linecup.entity.DefectStatus;

import java.time.Instant;

public record DefectSummaryResponse(
        Long defectId,
        String defectNo,
        Long workOrderId,
        String workOrderNo,
        Long productionLotId,
        String lotNo,
        Long productId,
        String productCode,
        String productName,
        Long equipmentId,
        String equipmentCode,
        String equipmentName,
        String processName,
        String defectType,
        String defectTypeLabel,
        int quantity,
        DefectStatus status,
        String statusLabel,
        Instant occurredAt
) {
}
