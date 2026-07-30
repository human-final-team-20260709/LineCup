package com.human.linecup.dto.request;

import com.human.linecup.entity.Product.ProductStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProductRequest(
        @NotBlank @Size(max = 30) String productCode,
        @NotBlank @Size(max = 100) String productName,
        @NotBlank @Size(max = 50) String category,
        @NotBlank @Size(max = 10) String unit,
        @NotNull ProductStatus status
) {
}
