package com.human.linecup.service;

import com.human.linecup.entity.AlarmSeverity;
import com.human.linecup.entity.TelemetryMetricType;

import java.math.BigDecimal;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

final class TelemetryAlarmPolicy {

    private static final BigDecimal WARNING_BOUNDARY_RATIO = new BigDecimal("0.02");
    private static final Map<String, Map<TelemetryMetricType, OperatingRange>> OPERATING_RANGES = Map.ofEntries(
            Map.entry("MIXER", Map.of(
                    TelemetryMetricType.TEMPERATURE, range("20", "40"),
                    TelemetryMetricType.HUMIDITY, range("40", "70"),
                    TelemetryMetricType.SPEED, range("60", "120")
            )),
            Map.entry("ROLLER", Map.of(
                    TelemetryMetricType.TEMPERATURE, range("30", "60"),
                    TelemetryMetricType.SPEED, range("10", "30")
            )),
            Map.entry("NOODLE", Map.of(
                    TelemetryMetricType.HUMIDITY, range("30", "55"),
                    TelemetryMetricType.SPEED, range("10", "25")
            )),
            Map.entry("STEAMER", Map.of(
                    TelemetryMetricType.TEMPERATURE, range("95", "105"),
                    TelemetryMetricType.HUMIDITY, range("90", "100")
            )),
            Map.entry("CUTTER", Map.of(
                    TelemetryMetricType.SPEED, range("60", "120")
            )),
            Map.entry("FRYER", Map.of(
                    TelemetryMetricType.TEMPERATURE, range("150", "180"),
                    TelemetryMetricType.SPEED, range("5", "15")
            )),
            Map.entry("COOLER", Map.of(
                    TelemetryMetricType.TEMPERATURE, range("15", "30"),
                    TelemetryMetricType.HUMIDITY, range("30", "55"),
                    TelemetryMetricType.SPEED, range("5", "15")
            )),
            Map.entry("PACKER", Map.of(
                    TelemetryMetricType.SPEED, range("40", "80")
            )),
            Map.entry("INSPECTOR", Map.of(
                    TelemetryMetricType.SPEED, range("40", "80")
            ))
    );

    private TelemetryAlarmPolicy() {
    }

    static Optional<AlarmCondition> evaluate(
            String equipmentCode,
            TelemetryMetricType metricType,
            BigDecimal value
    ) {
        if (equipmentCode == null || metricType == null || value == null) {
            return Optional.empty();
        }

        Map<TelemetryMetricType, OperatingRange> ranges =
                OPERATING_RANGES.get(machineType(equipmentCode));
        if (ranges == null) {
            return Optional.empty();
        }

        OperatingRange range = ranges.get(metricType);
        if (range == null) {
            return Optional.empty();
        }

        if (value.compareTo(range.minimum()) < 0) {
            return Optional.of(new AlarmCondition(
                    AlarmSeverity.CRITICAL,
                    "허용 범위 이탈",
                    "하한 이탈",
                    range
            ));
        }
        if (value.compareTo(range.maximum()) > 0) {
            return Optional.of(new AlarmCondition(
                    AlarmSeverity.CRITICAL,
                    "허용 범위 이탈",
                    "상한 이탈",
                    range
            ));
        }

        BigDecimal warningMargin = range.maximum()
                .subtract(range.minimum())
                .multiply(WARNING_BOUNDARY_RATIO);
        if (value.compareTo(range.minimum().add(warningMargin)) <= 0) {
            return Optional.of(new AlarmCondition(
                    AlarmSeverity.WARNING,
                    "기준값 접근",
                    "하한 접근",
                    range
            ));
        }
        if (value.compareTo(range.maximum().subtract(warningMargin)) >= 0) {
            return Optional.of(new AlarmCondition(
                    AlarmSeverity.WARNING,
                    "기준값 접근",
                    "상한 접근",
                    range
            ));
        }
        return Optional.empty();
    }

    private static String machineType(String equipmentCode) {
        int separator = equipmentCode.indexOf('-');
        return (separator < 0 ? equipmentCode : equipmentCode.substring(0, separator))
                .trim()
                .toUpperCase(Locale.ROOT);
    }

    private static OperatingRange range(String minimum, String maximum) {
        return new OperatingRange(new BigDecimal(minimum), new BigDecimal(maximum));
    }

    record AlarmCondition(
            AlarmSeverity severity,
            String messageLabel,
            String conditionLabel,
            OperatingRange operatingRange
    ) {
    }

    record OperatingRange(BigDecimal minimum, BigDecimal maximum) {
    }
}
