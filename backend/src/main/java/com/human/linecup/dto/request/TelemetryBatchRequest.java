package com.human.linecup.dto.request;

import com.human.linecup.entity.TelemetryMetricType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record TelemetryBatchRequest(@NotEmpty List<@Valid TelemetrySampleRequest> samples) {
    public TelemetryBatchRequest {
        samples = samples == null ? List.of() : List.copyOf(samples);
    }

    public record TelemetrySampleRequest(
            @NotBlank @Size(max = 50) String equipmentCode,
            @NotNull @Positive Long workOrderId,
            @NotNull TelemetryMetricType metricType,
            @NotNull BigDecimal value,
            @NotBlank @Size(max = 20) String unit,
            @NotNull Instant measuredAt
    ) {
    }
}
