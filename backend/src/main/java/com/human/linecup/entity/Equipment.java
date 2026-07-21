package com.human.linecup.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * ERD 10.3 설비 (EQUIPMENT)
 *
 * ⚠️ 공용 참조 엔티티입니다. 설비/알람 섹션 담당자가 실제 설비 등록·상태 갱신 로직을
 * 구현할 예정이며, 작업지시 모듈에서는 WORK_ORDER_EQUIPMENT.equipment_id FK 참조 및
 * 설비 매핑 화면(3.10)의 "설비 선택" 드롭다운 조회 용도로만 사용합니다.
 *
 * Status는 Equipment를 떠나서는 의미가 없는 타입이라 중첩시켰다.
 * 바깥에서는 Equipment.Status 로 참조한다.
 */
@Entity
@Table(name = "equipment")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_id")
    private Long equipmentId;

    @Column(name = "equipment_name", nullable = false, unique = true, length = 50)
    private String equipmentName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status;

    @Column(name = "equipment_code", nullable = false, unique = true, length = 255)
    private String equipmentCode;

    /** ERD 10.3 EQUIPMENT.status : RUNNING(가동중) / STOPPED(정지) / ERROR(이상) */
    public enum Status {
        RUNNING,
        STOPPED,
        ERROR
    }
}
