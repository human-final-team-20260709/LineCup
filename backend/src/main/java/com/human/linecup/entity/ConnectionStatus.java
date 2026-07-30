package com.human.linecup.entity;

public enum ConnectionStatus {
    CONNECTED("연결"),
    DISCONNECTED("연결 끊김");

    private final String label;

    ConnectionStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
