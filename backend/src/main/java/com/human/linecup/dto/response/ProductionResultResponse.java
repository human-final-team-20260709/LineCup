package com.human.linecup.dto.response;

import com.human.linecup.entity.ProductionResult;
import com.human.linecup.entity.ProductionResultStatus;

import java.time.Instant;

public record ProductionResultResponse(
        Long productionResultId,
        String resultNo,
        Long workOrderId,
        String workOrderNo,
        Long productionLotId,
        String lotNo,
        String productName,
        String processName,
        int targetQty,
        int productionQty,
        int goodQty,
        int defectQty,
        double achievementRate,
        ProductionResultStatus status,
        Instant occurredAt,
        Instant startedAt,
        Instant completedAt,
        Instant lastAggregatedAt
) {
    public static ProductionResultResponse from(ProductionResult result) {
        return from(result, null, null, null, null);
    }

    public static ProductionResultResponse from(
            ProductionResult result,
            String workOrderNo,
            String lotNo,
            String productName,
            String processName
    ) {
        Instant occurredAt = result.getLastAggregatedAt() == null
                ? result.getStartedAt()
                : result.getLastAggregatedAt();

        return new ProductionResultResponse(
                result.getProductionResultId(),
                result.getResultNo(),
                result.getWorkOrderId(),
                workOrderNo,
                result.getProductionLotId(),
                lotNo,
                productName,
                processName,
                result.getTargetQty(),
                result.getProductionQty(),
                result.getGoodQty(),
                result.getDefectQty(),
                calculateRate(result.getProductionQty(), result.getTargetQty()),
                result.getStatus(),
                occurredAt,
                result.getStartedAt(),
                result.getCompletedAt(),
                result.getLastAggregatedAt()
        );
    }

    private static double calculateRate(int productionQty, int targetQty) {
        if (targetQty <= 0) {
            return 0.0;
        }
        return Math.round((productionQty * 1000.0) / targetQty) / 10.0;
    }
}
