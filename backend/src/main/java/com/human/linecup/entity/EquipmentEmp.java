package com.human.linecup.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * ERD: EQUIPMENT_EMP — 설비 작업자 배정
 * 배정 이력을 보존하기 위해 user_id에는 단일 UNIQUE 제약을 두지 않는다.
 */
@Entity
@Table(name = "equipment_emp")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EquipmentEmp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_emp_id")
    private Long equipmentEmpId;

    // FK -> USER (별도 모듈 관리 — 현재는 ID 컬럼만 보유)
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // FK -> EQUIPMENT
    @Column(name = "equipment_id", nullable = false)
    private Long equipmentId;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    // 현재 배정 중이면 null
    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Builder
    public EquipmentEmp(Long userId, Long equipmentId, LocalDateTime startTime, LocalDateTime endTime) {
        this.userId = userId;
        this.equipmentId = equipmentId;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public void end(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public boolean isActive() {
        return endTime == null;
    }
}
