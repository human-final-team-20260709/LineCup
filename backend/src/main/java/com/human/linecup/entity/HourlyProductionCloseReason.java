package com.human.linecup.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum HourlyProductionCloseReason {
    HOURLY,
    WORK_ORDER_COMPLETED,
    HOLD,
    SHUTDOWN;

    @JsonValue
    public String getCode() {
        return name();
    }

    @JsonCreator
    public static HourlyProductionCloseReason fromCode(String value) {
        if (value == null) {
            return null;
        }

        return Arrays.stream(values())
                .filter(reason -> reason.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 시간별 집계 종료 사유입니다: " + value));
    }
}
