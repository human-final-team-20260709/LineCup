package com.human.linecup.dto.response;

import com.human.linecup.entity.Bom.BomStatus;

import java.util.List;

public record BomResponse(
        Long bomId,
        String bomCode,
        String version,
        Long productId,
        String productCode,
        String productName,
        BomStatus status,
        String statusLabel,
        String note,
        List<BomItemResponse> items
) {
    public BomResponse {
        items = items == null ? List.of() : List.copyOf(items);
    }
}
