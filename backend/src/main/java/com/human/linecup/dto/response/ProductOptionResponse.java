package com.human.linecup.dto.response;

import com.human.linecup.entity.Product;

import lombok.Builder;
import lombok.Getter;

/** 작업지시 등록 화면의 "제품 선택" 드롭다운용 */
@Getter
@Builder
public class ProductOptionResponse {

    private Long productId;
    private String productCode;
    private String productName;
    private String unit;

    public static ProductOptionResponse from(Product product) {
        return ProductOptionResponse.builder()
                .productId(product.getProductId())
                .productCode(product.getProductCode())
                .productName(product.getProductName())
                .unit(product.getUnit())
                .build();
    }
}
