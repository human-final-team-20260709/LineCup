package com.human.linecup.dto.response;

import com.human.linecup.entity.AlarmSeverity;
import com.human.linecup.entity.AlarmStatus;

import java.time.Instant;

public record AlarmSummaryResponse(
        Long alarmId,
        String alarmNo,
        Long equipmentId,
        String equipmentCode,
        String equipmentName,
        String processName,
        String location,
        String message,
        AlarmSeverity severity,
        String severityLabel,
        AlarmStatus status,
        String statusLabel,
        Instant occurredAt,
        Instant resolvedAt,
        boolean handled
) {
}
