package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record ManufacturingProcessRequest(
        @NotBlank @Size(max = 30) String processCode,
        @NotBlank @Size(max = 100) String processName,
        @PositiveOrZero int sequence,
        boolean active
) {
}
