package com.human.linecup.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "manufacturing_process")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ManufacturingProcess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "process_id")
    private Long processId;

    @Column(name = "process_code", nullable = false, unique = true, length = 30)
    private String processCode;

    @Column(name = "process_name", nullable = false, length = 100)
    private String processName;

    @Column(name = "sequence_no", nullable = false)
    private int sequence;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    public static ManufacturingProcess create(
            String processCode,
            String processName,
            int sequence,
            boolean active
    ) {
        if (sequence < 0) {
            throw new IllegalArgumentException("공정 순서는 0 이상이어야 합니다.");
        }
        ManufacturingProcess process = new ManufacturingProcess();
        process.processCode = requireText(processCode, "공정 코드");
        process.processName = requireText(processName, "공정명");
        process.sequence = sequence;
        process.active = active;
        return process;
    }

    public void changeInfo(String processName, int sequence, boolean active) {
        if (sequence < 0) {
            throw new IllegalArgumentException("공정 순서는 0 이상이어야 합니다.");
        }
        this.processName = requireText(processName, "공정명");
        this.sequence = sequence;
        this.active = active;
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }
}
