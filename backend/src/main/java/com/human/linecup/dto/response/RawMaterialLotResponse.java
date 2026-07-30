package com.human.linecup.dto.response;

import com.human.linecup.entity.InventoryStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RawMaterialLotResponse(
        Long materialLotId,
        String materialLotNo,
        Long materialId,
        String materialCode,
        String materialName,
        String supplierName,
        String supplierLotNo,
        LocalDate manufactureDate,
        LocalDate expiryDate,
        BigDecimal receivedQty,
        BigDecimal currentQty,
        BigDecimal safetyStockQty,
        String unit,
        InventoryStatus status,
        String statusLabel,
        LocalDate receivedDate
) {
}
