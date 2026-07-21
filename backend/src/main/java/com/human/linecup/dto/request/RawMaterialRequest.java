package com.human.linecup.dto.request;

import com.human.linecup.entity.RawMaterial.RawMaterialStatus;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record RawMaterialRequest(
        @NotBlank @Size(max = 30) String materialCode,
        @NotBlank @Size(max = 100) String materialName,
        @NotBlank @Size(max = 20) String unit,
        @NotNull @PositiveOrZero @Digits(integer = 9, fraction = 3) BigDecimal safetyStockQty,
        @NotNull RawMaterialStatus status
) {
}
