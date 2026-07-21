package com.human.linecup.dto.response;

import com.human.linecup.entity.Product.ProductStatus;

public record ProductResponse(
        Long productId,
        String productCode,
        String productName,
        String category,
        String unit,
        ProductStatus status,
        String statusLabel,
        String activeBomCode,
        String activeBomVersion
) {
}
