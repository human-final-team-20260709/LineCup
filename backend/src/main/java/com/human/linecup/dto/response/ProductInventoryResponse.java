package com.human.linecup.dto.response;

import com.human.linecup.entity.ProductInventory;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ProductInventoryResponse {

    private final Long inventoryId;
    private final Long productionLotId;
    private final Integer currentQty;
    private final String status;
    private final LocalDateTime createdAt;

    public static ProductInventoryResponse from(ProductInventory productInventory) {
        return ProductInventoryResponse.builder()
                .inventoryId(productInventory.getInventoryId())
                .productionLotId(productInventory.getProductionLot().getProductionLotId())
                .currentQty(productInventory.getCurrentQty())
                .status(productInventory.getStatus())
                .createdAt(productInventory.getCreatedAt())
                .build();
    }
}
