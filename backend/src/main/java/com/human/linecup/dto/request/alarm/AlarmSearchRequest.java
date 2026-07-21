package com.human.linecup.dto.request.alarm;

import com.human.linecup.entity.AlarmSeverity;
import com.human.linecup.entity.AlarmStatus;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * 알람 목록에 동시 적용할 검색 조건이다.
 * null인 필드는 필터링하지 않는다.
 */
public record AlarmSearchRequest(
        @Positive Long equipmentId,
        AlarmSeverity severity,
        AlarmStatus status,
        Boolean handled,
        LocalDateTime startAt,
        LocalDateTime endAt,
        @Size(max = 255) String keyword
) {

    public static AlarmSearchRequest empty() {
        return new AlarmSearchRequest(null, null, null, null, null, null, null);
    }
}
