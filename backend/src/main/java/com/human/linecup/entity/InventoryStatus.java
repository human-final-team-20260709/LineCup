package com.human.linecup.entity;

public enum InventoryStatus {
    NORMAL("정상"),
    LOW("부족"),
    EXPIRED("기한 만료"),
    OUT_OF_STOCK("재고 없음");

    private final String label;

    InventoryStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
