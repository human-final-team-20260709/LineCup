package com.human.linecup.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

public final class InventoryStatusPolicy {

    private InventoryStatusPolicy() {
    }

    public static InventoryStatus calculate(BigDecimal currentQty, BigDecimal safetyQty, LocalDate expiryDate) {
        if (expiryDate != null && expiryDate.isBefore(LocalDate.now())) {
            return InventoryStatus.EXPIRED;
        }
        if (currentQty == null || currentQty.signum() <= 0) {
            return InventoryStatus.OUT_OF_STOCK;
        }
        if (safetyQty != null && currentQty.compareTo(safetyQty) < 0) {
            return InventoryStatus.LOW;
        }
        return InventoryStatus.NORMAL;
    }
}
