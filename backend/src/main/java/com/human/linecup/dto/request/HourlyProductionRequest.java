package com.human.linecup.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.human.linecup.entity.HourlyProductionCloseReason;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.Instant;

public record HourlyProductionRequest(
        @NotNull @Positive Long workOrderId,
        @NotNull Instant bucketStart,
        @NotNull Instant bucketEnd,
        @PositiveOrZero int targetQty,
        @PositiveOrZero int productionQty,
        @PositiveOrZero int goodQty,
        @PositiveOrZero int defectQty,
        @JsonProperty("isPartial") boolean partial,
        @NotNull HourlyProductionCloseReason closeReason
) {
    @AssertTrue(message = "집계 종료 시각은 시작 시각보다 이후여야 합니다.")
    public boolean isValidPeriod() {
        return bucketStart == null || bucketEnd == null || bucketEnd.isAfter(bucketStart);
    }

    @AssertTrue(message = "생산 수량은 정상 수량과 불량 수량의 합이어야 합니다.")
    public boolean isQuantityConsistent() {
        return productionQty == goodQty + defectQty;
    }
}
