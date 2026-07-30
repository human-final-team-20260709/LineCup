package com.human.linecup.dto.request;

import com.human.linecup.entity.Bom.BomStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record BomRequest(
        @NotBlank @Size(max = 30) String bomCode,
        @NotBlank @Size(max = 20) String version,
        @NotNull @Positive Long productId,
        @NotNull BomStatus status,
        String note,
        @NotEmpty List<@Valid BomItemRequest> items
) {
    public BomRequest {
        items = items == null ? List.of() : List.copyOf(items);
    }

    public record BomItemRequest(
            @NotNull @Positive Long materialId,
            @NotNull @Positive Long processId,
            @NotBlank @Size(max = 50) String spec,
            @NotNull @Positive @Digits(integer = 7, fraction = 3) BigDecimal requiredQty,
            @NotNull @PositiveOrZero @Digits(integer = 3, fraction = 2) BigDecimal lossRate,
            String note
    ) {
    }
}
