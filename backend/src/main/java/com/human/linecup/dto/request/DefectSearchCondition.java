package com.human.linecup.dto.request;

import com.human.linecup.entity.DefectStatus;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record DefectSearchCondition(
        @Size(max = 255) String keyword,
        DefectStatus status,
        @Positive Long productionLotId,
        @Positive Long equipmentId,
        Instant startAt,
        Instant endAt
) {
    public static DefectSearchCondition empty() {
        return new DefectSearchCondition(null, null, null, null, null, null);
    }
}
