package com.human.linecup.dto.response;

import com.human.linecup.entity.ProductionLot;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ProductionLotResponse {

    private final Long productionLotId;
    private final String lotNo;
    private final Long workOrderId;
    private final Integer productionQty;
    private final Integer goodQty;
    private final Integer defectQty;
    private final String status;
    private final LocalDateTime startedAt;
    private final LocalDateTime completedAt;

    public static ProductionLotResponse from(ProductionLot productionLot) {
        return ProductionLotResponse.builder()
                .productionLotId(productionLot.getProductionLotId())
                .lotNo(productionLot.getLotNo())
                .workOrderId(productionLot.getWorkOrderId())
                .productionQty(productionLot.getProductionQty())
                .goodQty(productionLot.getGoodQty())
                .defectQty(productionLot.getDefectQty())
                .status(productionLot.getStatus())
                .startedAt(productionLot.getStartedAt())
                .completedAt(productionLot.getCompletedAt())
                .build();
    }
}
