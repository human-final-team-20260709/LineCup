package com.human.linecup.dto.request.alarm;

import com.human.linecup.entity.AlarmSeverity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * 설비에서 발생한 알람을 등록하는 요청이다.
 * 초기 처리 상태와 조치 정보는 서비스가 관리한다.
 */
public record AlarmCreateRequest(
        @NotNull @Positive Long equipmentId,
        @NotBlank @Size(max = 255) String content,
        @NotNull AlarmSeverity severity,
        LocalDateTime occurredAt
) {
}
