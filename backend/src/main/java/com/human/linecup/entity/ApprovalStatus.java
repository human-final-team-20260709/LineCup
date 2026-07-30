package com.human.linecup.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum ApprovalStatus {
    PENDING("pending", "대기"),
    APPROVED("approved", "승인"),
    REJECTED("rejected", "거부");

    private final String code;
    private final String label;

    ApprovalStatus(String code, String label) {
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
    public static ApprovalStatus fromCode(String value) {
        if (value == null) {
            return null;
        }

        return Arrays.stream(values())
                .filter(status -> status.code.equalsIgnoreCase(value)
                        || status.name().equalsIgnoreCase(value)
                        || status.label.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 가입 승인 상태입니다: " + value));
    }
}
