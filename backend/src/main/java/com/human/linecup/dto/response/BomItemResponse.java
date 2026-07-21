package com.human.linecup.dto.response;

import com.human.linecup.entity.RawMaterial.RawMaterialStatus;

import java.math.BigDecimal;

public record BomItemResponse(
        Long bomItemId,
        Long materialId,
        String materialCode,
        String materialName,
        RawMaterialStatus materialStatus,
        String materialStatusLabel,
        Long processId,
        String processCode,
        String processName,
        String spec,
        BigDecimal requiredQty,
        BigDecimal lossRate,
        String unit,
        String note
) {
}
