package com.human.linecup.dto.response;

import java.math.BigDecimal;

public record ProductionLotMaterialResponse(
        Long productionLotMaterialId,
        Long materialLotId,
        String materialLotNo,
        String materialCode,
        String materialName,
        BigDecimal usedQty,
        String unit
) {
}
