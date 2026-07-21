package com.human.linecup.dto.request.quality;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record CreateDefectRequest(
        @NotBlank @Size(max = 30) String defectNo,
        @NotNull @Positive Long productionLotId,
        @NotNull @Positive Long equipmentId,
        @NotBlank @Size(max = 50) String defectType,
        @NotNull @Positive Integer quantity,
        String cause,
        LocalDateTime occurredAt
) {
}
