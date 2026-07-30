package com.human.linecup.dto.response;

import com.human.linecup.entity.TelemetryMetricType;

import java.math.BigDecimal;
import java.time.Instant;

public record TelemetryResponse(
        Long telemetryId,
        Long equipmentId,
        String equipmentCode,
        Long workOrderId,
        TelemetryMetricType metricType,
        String metricTypeLabel,
        BigDecimal value,
        String unit,
        Instant measuredAt
) {
}
