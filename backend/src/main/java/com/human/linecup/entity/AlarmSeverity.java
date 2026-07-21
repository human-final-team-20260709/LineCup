package com.human.linecup.entity;

public enum AlarmSeverity {
    INFO("정보"),
    WARNING("경고"),
    CRITICAL("심각");

    private final String label;

    AlarmSeverity(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
