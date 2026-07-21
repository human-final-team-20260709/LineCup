package com.human.linecup.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** ERD: EQUIPMENT_HUMIDITY — 설비 습도 측정값 */
@Entity
@Table(name = "equipment_humidity", indexes = {
        @Index(name = "idx_eq_humidity_equipment_time", columnList = "equipment_id, measured_at")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EquipmentHumidity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_humidity_id")
    private Long equipmentHumidityId;

    // FK -> EQUIPMENT
    @Column(name = "equipment_id", nullable = false)
    private Long equipmentId;

    // FK -> WORK_ORDER (별도 모듈 관리 — 현재는 ID 컬럼만 보유)
    @Column(name = "work_order_id", nullable = false)
    private Long workOrderId;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal humidity;

    @Column(name = "measured_at", nullable = false)
    private LocalDateTime measuredAt;

    @Builder
    public EquipmentHumidity(Long equipmentId, Long workOrderId, BigDecimal humidity, LocalDateTime measuredAt) {
        this.equipmentId = equipmentId;
        this.workOrderId = workOrderId;
        this.humidity = humidity;
        this.measuredAt = measuredAt;
    }
}
