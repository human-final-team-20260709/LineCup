package com.human.linecup.service;

import com.human.linecup.dto.response.AlarmStatisticsResponse;
import com.human.linecup.entity.Alarm;
import com.human.linecup.entity.AlarmSeverity;
import com.human.linecup.entity.Equipment;
import com.human.linecup.repository.AlarmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AlarmStatisticsService {

    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Seoul");
    private static final Duration MAX_PERIOD = Duration.ofDays(93);

    private final AlarmRepository alarmRepository;

    public AlarmStatisticsResponse getStatistics(Instant from, Instant to) {
        validatePeriod(from, to);
        List<Alarm> alarms = alarmRepository
                .findByOccurredAtGreaterThanEqualAndOccurredAtLessThan(from, to);
        long totalCount = alarms.size();

        Map<LocalDate, Long> dailyCounts = new LinkedHashMap<>();
        LocalDate firstDate = from.atZone(BUSINESS_ZONE).toLocalDate();
        LocalDate lastDate = to.minusNanos(1).atZone(BUSINESS_ZONE).toLocalDate();
        for (LocalDate date = firstDate; !date.isAfter(lastDate); date = date.plusDays(1)) {
            dailyCounts.put(date, 0L);
        }
        alarms.forEach(alarm -> dailyCounts.computeIfPresent(
                alarm.getOccurredAt().atZone(BUSINESS_ZONE).toLocalDate(),
                (date, count) -> count + 1
        ));

        Map<EquipmentKey, Long> equipmentCounts = new LinkedHashMap<>();
        Map<FrequentKey, Long> frequentCounts = new LinkedHashMap<>();
        Map<AlarmSeverity, Long> severityCounts = new LinkedHashMap<>();
        alarms.forEach(alarm -> {
            Equipment equipment = alarm.getEquipment();
            equipmentCounts.merge(new EquipmentKey(
                    equipment.getEquipmentId(),
                    equipment.getEquipmentCode(),
                    equipment.getEquipmentName()
            ), 1L, Long::sum);
            severityCounts.merge(alarm.getSeverity(), 1L, Long::sum);
            frequentCounts.merge(new FrequentKey(
                    alarm.getMessage(),
                    equipment.getEquipmentCode(),
                    equipment.getEquipmentName(),
                    alarm.getSeverity()
            ), 1L, Long::sum);
        });

        List<AlarmStatisticsResponse.EquipmentCount> equipmentResults = equipmentCounts.entrySet()
                .stream()
                .sorted(Map.Entry.<EquipmentKey, Long>comparingByValue().reversed()
                        .thenComparing(entry -> entry.getKey().equipmentCode()))
                .limit(5)
                .map(entry -> new AlarmStatisticsResponse.EquipmentCount(
                        entry.getKey().equipmentId(),
                        entry.getKey().equipmentCode(),
                        entry.getKey().equipmentName(),
                        entry.getValue()
                ))
                .toList();

        List<AlarmStatisticsResponse.SeverityCount> severityResults = Arrays.stream(AlarmSeverity.values())
                .map(severity -> {
                    long count = severityCounts.getOrDefault(severity, 0L);
                    return new AlarmStatisticsResponse.SeverityCount(
                            severity,
                            severity.getLabel(),
                            count,
                            percentage(count, totalCount, 1)
                    );
                })
                .toList();

        List<Map.Entry<FrequentKey, Long>> frequentEntries = frequentCounts.entrySet()
                .stream()
                .sorted(Map.Entry.<FrequentKey, Long>comparingByValue().reversed()
                        .thenComparing(entry -> entry.getKey().equipmentCode())
                        .thenComparing(entry -> entry.getKey().message()))
                .limit(5)
                .toList();
        List<AlarmStatisticsResponse.FrequentAlarm> frequentResults = new ArrayList<>();
        for (int index = 0; index < frequentEntries.size(); index++) {
            Map.Entry<FrequentKey, Long> entry = frequentEntries.get(index);
            FrequentKey key = entry.getKey();
            frequentResults.add(new AlarmStatisticsResponse.FrequentAlarm(
                    index + 1,
                    key.message(),
                    key.equipmentCode(),
                    key.equipmentName(),
                    key.severity(),
                    key.severity().getLabel(),
                    entry.getValue()
            ));
        }

        return new AlarmStatisticsResponse(
                from,
                to,
                totalCount,
                dailyCounts.entrySet().stream()
                        .map(entry -> new AlarmStatisticsResponse.DailyCount(
                                entry.getKey(),
                                entry.getValue()
                        ))
                        .toList(),
                equipmentResults,
                severityResults,
                frequentResults
        );
    }

    private static void validatePeriod(Instant from, Instant to) {
        if (from == null || to == null) {
            throw new IllegalArgumentException("조회 시작 시각과 종료 시각은 필수입니다.");
        }
        if (!to.isAfter(from)) {
            throw new IllegalArgumentException("조회 종료 시각은 시작 시각보다 이후여야 합니다.");
        }
        if (Duration.between(from, to).compareTo(MAX_PERIOD) > 0) {
            throw new IllegalArgumentException("통계 조회 기간은 최대 93일입니다.");
        }
    }

    private static double percentage(long numerator, long denominator, int scale) {
        if (denominator == 0) {
            return 0.0;
        }
        return BigDecimal.valueOf(numerator)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(denominator), scale, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private record EquipmentKey(Long equipmentId, String equipmentCode, String equipmentName) {
    }

    private record FrequentKey(
            String message,
            String equipmentCode,
            String equipmentName,
            AlarmSeverity severity
    ) {
    }
}
