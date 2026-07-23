package com.human.linecup.dto.response;

import com.human.linecup.entity.AlarmSeverity;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record AlarmStatisticsResponse(
        Instant from,
        Instant to,
        long totalCount,
        List<DailyCount> dailyCounts,
        List<EquipmentCount> equipmentCounts,
        List<SeverityCount> severityCounts,
        List<FrequentAlarm> frequentAlarms
) {
    public record DailyCount(LocalDate date, long count) {
    }

    public record EquipmentCount(
            Long equipmentId,
            String equipmentCode,
            String equipmentName,
            long count
    ) {
    }

    public record SeverityCount(
            AlarmSeverity severity,
            String severityLabel,
            long count,
            double ratio
    ) {
    }

    public record FrequentAlarm(
            int rank,
            String message,
            String equipmentCode,
            String equipmentName,
            AlarmSeverity severity,
            String severityLabel,
            long count
    ) {
    }
}
