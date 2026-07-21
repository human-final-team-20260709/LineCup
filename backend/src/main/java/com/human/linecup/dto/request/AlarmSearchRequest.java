package com.human.linecup.dto.request;

import com.human.linecup.entity.AlarmSeverity;
import com.human.linecup.entity.AlarmStatus;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record AlarmSearchRequest(
        @Positive Long equipmentId,
        AlarmSeverity severity,
        AlarmStatus status,
        Boolean handled,
        Instant startAt,
        Instant endAt,
        @Size(max = 255) String keyword
) {
    public static AlarmSearchRequest empty() {
        return new AlarmSearchRequest(null, null, null, null, null, null, null);
    }
}
