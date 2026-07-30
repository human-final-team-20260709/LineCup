package com.human.linecup.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum ProductionResultStatus {
    COLLECTING("COLLECTING", "집계 중"),
    COMPLETED("COMPLETED", "집계 완료"),
    CANCELED("CANCELED", "취소");

    private final String code;
    private final String label;

    ProductionResultStatus(String code, String label) {
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
    public static ProductionResultStatus fromCode(String value) {
        if (value == null) {
            return null;
        }

        return Arrays.stream(values())
                .filter(status -> status.code.equalsIgnoreCase(value) || status.label.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 생산 실적 상태입니다: " + value));
    }
}
