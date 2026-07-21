package com.human.linecup.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** ERD: EQUIPMENT_SPEED — 설비 속도 측정값 */
@Entity
@Table(name = "equipment_speed", indexes = {
        @Index(name = "idx_eq_speed_equipment_time", columnList = "equipment_id, measured_at")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EquipmentSpeed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_speed_id")
    private Long equipmentSpeedId;

    // FK -> EQUIPMENT
    @Column(name = "equipment_id", nullable = false)
    private Long equipmentId;

    // FK -> WORK_ORDER (별도 모듈 관리 — 현재는 ID 컬럼만 보유)
    @Column(name = "work_order_id", nullable = false)
    private Long workOrderId;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal speed;

    // RPM, m/min 등
    @Column(nullable = false, length = 20)
    private String unit;

    @Column(name = "measured_at", nullable = false)
    private LocalDateTime measuredAt;

    @Builder
    public EquipmentSpeed(Long equipmentId, Long workOrderId, BigDecimal speed, String unit, LocalDateTime measuredAt) {
        this.equipmentId = equipmentId;
        this.workOrderId = workOrderId;
        this.speed = speed;
        this.unit = unit;
        this.measuredAt = measuredAt;
    }
}
