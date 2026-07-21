package com.human.linecup.dto.request;

import com.human.linecup.entity.HourlyProduction;
import com.human.linecup.entity.HourlyProductionCloseReason;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.Instant;

public record HourlyProductionRequest(
        @NotNull(message = "작업지시 ID를 입력해주세요.")
        @Positive(message = "작업지시 ID는 1 이상이어야 합니다.")
        Long workOrderId,

        @NotNull(message = "집계 시작 시각을 입력해주세요.")
        Instant bucketStart,

        @NotNull(message = "집계 종료 시각을 입력해주세요.")
        Instant bucketEnd,

        @PositiveOrZero(message = "목표 수량은 0 이상이어야 합니다.")
        int targetQty,

        @PositiveOrZero(message = "생산 수량은 0 이상이어야 합니다.")
        int productionQty,

        @PositiveOrZero(message = "정상 수량은 0 이상이어야 합니다.")
        int goodQty,

        @PositiveOrZero(message = "불량 수량은 0 이상이어야 합니다.")
        int defectQty,

        boolean isPartial,

        @NotNull(message = "집계 종료 사유를 입력해주세요.")
        HourlyProductionCloseReason closeReason
) {
    @AssertTrue(message = "집계 종료 시각은 시작 시각보다 이후여야 합니다.")
    public boolean isValidPeriod() {
        return bucketStart == null || bucketEnd == null || bucketEnd.isAfter(bucketStart);
    }

    @AssertTrue(message = "생산 수량은 정상 수량과 불량 수량의 합이어야 합니다.")
    public boolean isQuantityConsistent() {
        return productionQty == goodQty + defectQty;
    }

    public HourlyProduction toEntity() {
        return HourlyProduction.create(
                workOrderId,
                bucketStart,
                bucketEnd,
                targetQty,
                productionQty,
                goodQty,
                defectQty,
                isPartial,
                closeReason
        );
    }
}
