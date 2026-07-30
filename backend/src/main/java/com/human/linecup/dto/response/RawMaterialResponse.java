package com.human.linecup.dto.response;

import com.human.linecup.entity.RawMaterial.RawMaterialStatus;

import java.math.BigDecimal;

public record RawMaterialResponse(
        Long materialId,
        String materialCode,
        String materialName,
        String unit,
        BigDecimal safetyStockQty,
        RawMaterialStatus status,
        String statusLabel
) {
}
