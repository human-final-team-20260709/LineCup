package com.human.linecup.dto.response;

import com.human.linecup.entity.InventoryStatus;

import java.time.Instant;
import java.time.LocalDate;

public record ProductInventoryResponse(
        Long inventoryId,
        Long productionLotId,
        String lotNo,
        Long productId,
        String productCode,
        String productName,
        int currentQty,
        int safetyStockQty,
        String unit,
        LocalDate expiryDate,
        InventoryStatus status,
        String statusLabel,
        Instant createdAt
) {
}
