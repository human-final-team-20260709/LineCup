package com.human.linecup.dto.request.alarm;

import com.human.linecup.entity.AlarmStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

/**
 * 알람 담당자·조치 내용·처리 상태를 교체하는 요청이다.
 */
public record AlarmHandlingRequest(
        @Positive Long handlerId,
        String handlingContent,
        @NotNull AlarmStatus status,
        LocalDateTime resolvedAt
) {
}
