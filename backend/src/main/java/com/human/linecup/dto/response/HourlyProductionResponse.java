package com.human.linecup.dto.response;

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
}
