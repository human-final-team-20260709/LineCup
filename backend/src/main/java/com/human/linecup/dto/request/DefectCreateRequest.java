package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record DefectCreateRequest(
        @NotNull @Positive Long productionLotId,
        @NotNull @Positive Long equipmentId,
        @NotBlank @Size(max = 50) String defectType,
        @NotNull @Positive Integer quantity,
        String cause,
        Instant occurredAt
) {
}
