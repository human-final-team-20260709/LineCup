package com.human.linecup.entity;

public enum AlarmStatus {
    PENDING_CONFIRMATION("확인 대기"),
    IN_PROGRESS("조치 중"),
    INSPECTION_RESERVED("점검 예약"),
    MONITORING("모니터링"),
    RESOLVED("처리 완료");

    private final String label;

    AlarmStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
