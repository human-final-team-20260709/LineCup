package com.human.linecup.dto.response;

import com.human.linecup.entity.HourlyProduction;
import com.human.linecup.entity.HourlyProductionCloseReason;

import java.time.Instant;

public record HourlyProductionResponse(
        Long hourlyProductionId,
        Long workOrderId,
        Instant bucketStart,
        Instant bucketEnd,
        int targetQty,
        int productionQty,
        int goodQty,
        int defectQty,
        boolean partial,
        HourlyProductionCloseReason closeReason,
        Instant receivedAt
) {
    public static HourlyProductionResponse from(HourlyProduction production) {
        return new HourlyProductionResponse(
                production.getHourlyProductionId(),
                production.getWorkOrderId(),
                production.getBucketStart(),
                production.getBucketEnd(),
                production.getTargetQty(),
                production.getProductionQty(),
                production.getGoodQty(),
                production.getDefectQty(),
                production.isPartial(),
                production.getCloseReason(),
                production.getReceivedAt()
        );
    }
}
