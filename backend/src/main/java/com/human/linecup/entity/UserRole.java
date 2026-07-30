package com.human.linecup.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum UserRole {
    ADMIN("admin", "관리자"),
    OPERATOR("operator", "작업자"),
    SUPERVISOR("supervisor", "지시자");

    private final String code;
    private final String label;

    UserRole(String code, String label) {
        this.code = code;
        this.label = label;
    }

    @JsonValue
    public String getCode() {
        return code;
    }

    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static UserRole fromCode(String value) {
        if (value == null) {
            return null;
        }

        return Arrays.stream(values())
                .filter(role -> role.code.equalsIgnoreCase(value) || role.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 사용자 역할입니다: " + value));
    }
}
