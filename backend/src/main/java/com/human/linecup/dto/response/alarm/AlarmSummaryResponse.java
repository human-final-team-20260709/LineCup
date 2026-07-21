package com.human.linecup.dto.response.alarm;

import com.human.linecup.entity.Alarm;
import com.human.linecup.entity.AlarmSeverity;
import com.human.linecup.entity.AlarmStatus;

import java.time.LocalDateTime;

public record AlarmSummaryResponse(
        Long alarmId,
        Long equipmentId,
        Long handlerId,
        String content,
        AlarmSeverity severity,
        String severityLabel,
        AlarmStatus status,
        String statusLabel,
        LocalDateTime occurredAt,
        LocalDateTime resolvedAt,
        boolean handled
) {

    public static AlarmSummaryResponse from(Alarm alarm) {
        return new AlarmSummaryResponse(
                alarm.getAlarmId(),
                alarm.getEquipmentId(),
                alarm.getHandlerId(),
                alarm.getContent(),
                alarm.getSeverity(),
                alarm.getSeverity().getLabel(),
                alarm.getStatus(),
                alarm.getStatus().getLabel(),
                alarm.getOccurredAt(),
                alarm.getResolvedAt(),
                alarm.getStatus() == AlarmStatus.RESOLVED && alarm.getResolvedAt() != null
        );
    }
}
