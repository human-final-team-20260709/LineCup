package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record DefectIngestRequest(
        @NotBlank @Size(max = 100) String idempotencyKey,
        @NotNull @Positive Long workOrderId,
        @NotNull @Positive Long productionLotId,
        @NotBlank @Size(max = 50) String equipmentCode,
        @NotBlank @Size(max = 50) String defectType,
        @NotNull @Positive Integer quantity,
        @NotNull Instant occurredAt
) {
}
