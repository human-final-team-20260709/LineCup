package com.human.linecup.dto.request;

import com.human.linecup.entity.AlarmStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.Instant;

public record AlarmHandlingRequest(
        @Positive Long handlerId,
        String handlingContent,
        @NotNull AlarmStatus status,
        Instant resolvedAt
) {
}
