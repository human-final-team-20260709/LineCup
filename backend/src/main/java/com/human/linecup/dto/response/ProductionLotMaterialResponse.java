package com.human.linecup.dto.response;

import com.human.linecup.entity.ProductionLotMaterial;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ProductionLotMaterialResponse {

    private final Long id;
    private final Long productionLotId;
    private final Long materialLotId;
    private final BigDecimal usedQty;

    public static ProductionLotMaterialResponse from(ProductionLotMaterial productionLotMaterial) {
        return ProductionLotMaterialResponse.builder()
                .id(productionLotMaterial.getId())
                .productionLotId(productionLotMaterial.getProductionLot().getProductionLotId())
                .materialLotId(productionLotMaterial.getMaterialLot().getMaterialLotId())
                .usedQty(productionLotMaterial.getUsedQty())
                .build();
    }
}
