package com.human.linecup.dto.response;

import com.human.linecup.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ProductResponse {

    private final Long productId;
    private final String productCode;
    private final String productName;
    private final String unit;
    private final String status;

    public static ProductResponse from(Product product) {
        return ProductResponse.builder()
                .productId(product.getProductId())
                .productCode(product.getProductCode())
                .productName(product.getProductName())
                .unit(product.getUnit())
                .status(product.getStatus())
                .build();
    }
}
