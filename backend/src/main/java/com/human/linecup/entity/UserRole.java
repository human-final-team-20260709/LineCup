package com.human.linecup.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum UserRole {
    ADMIN("admin"),
    OPERATOR("operator"),
    SUPERVISOR("supervisor");

    private final String code;

    UserRole(String code) {
        this.code = code;
    }

    @JsonValue
    public String getCode() {
        return code;
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
