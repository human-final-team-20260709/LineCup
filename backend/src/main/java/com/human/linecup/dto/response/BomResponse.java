package com.human.linecup.dto.response;

import com.human.linecup.entity.Bom;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class BomResponse {

    private final Long bomId;
    private final Long productId;
    private final Long materialId;
    private final String spec;
    private final BigDecimal requiredQty;
    private final BigDecimal lossRate;

    public static BomResponse from(Bom bom) {
        return BomResponse.builder()
                .bomId(bom.getBomId())
                .productId(bom.getProduct().getProductId())
                .materialId(bom.getMaterial().getMaterialId())
                .spec(bom.getSpec())
                .requiredQty(bom.getRequiredQty())
                .lossRate(bom.getLossRate())
                .build();
    }
}
