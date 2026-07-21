package com.human.linecup.dto.response;

import com.human.linecup.entity.ProductionResultStatus;

import java.time.Instant;

public record ProductionResultResponse(
        Long productionResultId,
        String resultNo,
        Long workOrderId,
        String workOrderNo,
        Long productionLotId,
        String lotNo,
        Long productId,
        String productCode,
        String productName,
        String processName,
        int targetQty,
        int productionQty,
        int goodQty,
        int defectQty,
        double achievementRate,
        ProductionResultStatus status,
        String statusLabel,
        Instant occurredAt,
        Instant startedAt,
        Instant completedAt,
        Instant lastAggregatedAt
) {
}
