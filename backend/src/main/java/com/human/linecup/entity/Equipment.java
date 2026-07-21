package com.human.linecup.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** ERD: EQUIPMENT — 설비 마스터 */
@Entity
@Table(name = "equipment")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Equipment {

    public static final String RUNNING = "RUNNING";
    public static final String STOPPED = "STOPPED";
    public static final String ERROR = "ERROR";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_id")
    private Long equipmentId;

    @Column(name = "equipment_name", nullable = false, unique = true, length = 50)
    private String equipmentName;

    // RUNNING(가동중) / STOPPED(정지) / ERROR(이상)
    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "equipment_code", nullable = false, unique = true, length = 255)
    private String equipmentCode;

    @Builder
    public Equipment(String equipmentName, String status, String equipmentCode) {
        this.equipmentName = equipmentName;
        this.status = status == null ? STOPPED : status;
        this.equipmentCode = equipmentCode;
    }

    public void updateStatus(String status) {
        this.status = status;
    }

    public void updateInfo(String equipmentName, String equipmentCode) {
        this.equipmentName = equipmentName;
        this.equipmentCode = equipmentCode;
    }
}
