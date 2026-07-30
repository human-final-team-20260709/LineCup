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
@Table(name = "defect_type")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DefectType {

    public static final String OK = "OK";
    public static final String SEALING = "SEALING";
    public static final String MOISTURE = "MOISTURE";
    public static final String WEIGHT = "WEIGHT";
    public static final String FOREIGN_MATERIAL = "FOREIGN_MATERIAL";
    public static final String GENERAL_NG = "GENERAL_NG";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "defect_type_id")
    private Long defectTypeId;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    public static DefectType create(String code, String name, boolean active) {
        DefectType type = new DefectType();
        type.code = requireText(code, "불량 유형 코드").toUpperCase();
        type.name = requireText(name, "불량 유형명");
        type.active = active;
        return type;
    }

    public void change(String name, boolean active) {
        this.name = requireText(name, "불량 유형명");
        this.active = active;
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }
}
