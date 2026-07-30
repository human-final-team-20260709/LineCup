package com.human.linecup.entity;

public enum DefectHandleMethod {
    NORMAL_APPROVAL("정상 승인"),
    REWORK("재작업"),
    DISPOSAL("폐기");

    private final String label;

    DefectHandleMethod(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
