package com.human.linecup.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table(
        name = "equipment_telemetry",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_telemetry_equipment_order_metric_time",
                columnNames = {"equipment_id", "work_order_id", "metric_type", "measured_at"}
        ),
        indexes = {
                @Index(name = "idx_telemetry_equipment_metric_time", columnList = "equipment_id, metric_type, measured_at"),
                @Index(name = "idx_telemetry_work_order_time", columnList = "work_order_id, measured_at")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EquipmentTelemetry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "telemetry_id")
    private Long telemetryId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @Enumerated(EnumType.STRING)
    @Column(name = "metric_type", nullable = false, length = 20)
    private TelemetryMetricType metricType;

    @Column(name = "metric_value", nullable = false, precision = 14, scale = 4)
    private BigDecimal value;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(name = "measured_at", nullable = false)
    private Instant measuredAt;

    public static EquipmentTelemetry record(
            Equipment equipment,
            WorkOrder workOrder,
            TelemetryMetricType metricType,
            BigDecimal value,
            String unit,
            Instant measuredAt
    ) {
        EquipmentTelemetry telemetry = new EquipmentTelemetry();
        telemetry.equipment = Objects.requireNonNull(equipment, "설비는 필수입니다.");
        telemetry.workOrder = Objects.requireNonNull(workOrder, "작업지시는 필수입니다.");
        telemetry.metricType = Objects.requireNonNull(metricType, "측정 유형은 필수입니다.");
        telemetry.value = Objects.requireNonNull(value, "측정값은 필수입니다.");
        telemetry.unit = requireText(unit, "측정 단위");
        telemetry.measuredAt = Objects.requireNonNull(measuredAt, "측정 시각은 필수입니다.");
        return telemetry;
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }
}
