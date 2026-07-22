package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ProductionLotRequest(
        @NotBlank @Size(max = 50) String lotNo,
        @NotNull @Positive Long workOrderId
) {
}
