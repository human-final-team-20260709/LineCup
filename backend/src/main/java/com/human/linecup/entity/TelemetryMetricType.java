package com.human.linecup.entity;

public enum TelemetryMetricType {
    TEMPERATURE("온도"),
    HUMIDITY("습도"),
    SPEED("속도");

    private final String label;

    TelemetryMetricType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
