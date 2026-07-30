package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record MaterialUsageReversalRequest(
        @NotNull @Positive Long handledById,
        @NotBlank @Size(max = 255) String reason
) {
}
