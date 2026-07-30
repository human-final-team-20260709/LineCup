package com.human.linecup.entity;

public enum DefectStatus {
    UNHANDLED("미처리"),
    IN_PROGRESS("처리 중"),
    ON_HOLD("보류"),
    COMPLETED("처리 완료");

    private final String label;

    DefectStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
