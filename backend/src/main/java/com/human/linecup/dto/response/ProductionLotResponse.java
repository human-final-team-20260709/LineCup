package com.human.linecup.dto.response;

import com.human.linecup.entity.ProductionLot.ProductionLotStatus;

import java.time.Instant;
import java.util.List;

public record ProductionLotResponse(
        Long productionLotId,
        String lotNo,
        Long workOrderId,
        String workOrderNo,
        Long productId,
        String productCode,
        String productName,
        int productionQty,
        int goodQty,
        int defectQty,
        ProductionLotStatus status,
        String statusLabel,
        Instant startedAt,
        Instant completedAt,
        String currentProcess,
        List<ProcessProgressResponse> processes,
        List<ProductionLotMaterialResponse> materials
) {
    public ProductionLotResponse {
        processes = processes == null ? List.of() : List.copyOf(processes);
        materials = materials == null ? List.of() : List.copyOf(materials);
    }
}
