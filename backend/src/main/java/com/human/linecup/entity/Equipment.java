package com.human.linecup.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Objects;

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

    @Column(name = "equipment_code", nullable = false, unique = true, length = 50)
    private String equipmentCode;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "process_id", nullable = false)
    private ManufacturingProcess manufacturingProcess;

    @Column(nullable = false, length = 100)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EquipmentStatus status;

    public static Equipment create(
            String equipmentName,
            String equipmentCode,
            ManufacturingProcess manufacturingProcess,
            String location,
            EquipmentStatus status
    ) {
        Equipment equipment = new Equipment();
        equipment.changeInfo(equipmentName, equipmentCode, manufacturingProcess, location);
        equipment.status = status == null ? EquipmentStatus.STOPPED : status;
        return equipment;
    }

    public void changeInfo(
            String equipmentName,
            String equipmentCode,
            ManufacturingProcess manufacturingProcess,
            String location
    ) {
        this.equipmentName = requireText(equipmentName, "설비명");
        this.equipmentCode = requireText(equipmentCode, "설비 코드");
        this.manufacturingProcess = Objects.requireNonNull(manufacturingProcess, "공정은 필수입니다.");
        this.location = requireText(location, "설비 위치");
    }

    public void changeStatus(EquipmentStatus status) {
        this.status = Objects.requireNonNull(status, "설비 상태는 필수입니다.");
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }

    public enum EquipmentStatus {
        RUNNING("가동 중"),
        STOPPED("정지"),
        ERROR("이상");

        private final String label;

        EquipmentStatus(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
