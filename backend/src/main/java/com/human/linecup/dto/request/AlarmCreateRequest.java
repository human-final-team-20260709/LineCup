package com.human.linecup.dto.request;

import com.human.linecup.entity.AlarmSeverity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record AlarmCreateRequest(
        @NotNull @Positive Long equipmentId,
        @NotBlank @Size(max = 255) String message,
        String description,
        @NotNull AlarmSeverity severity,
        Instant occurredAt
) {
}
