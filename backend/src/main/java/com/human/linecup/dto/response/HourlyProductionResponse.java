package com.human.linecup.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
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
        @JsonProperty("isPartial") boolean partial,
        HourlyProductionCloseReason closeReason,
        Instant receivedAt
) {
}
