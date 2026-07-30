package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

public record ProductInventoryRequest(
        @NotNull @Positive Long productionLotId,
        @NotNull @PositiveOrZero Integer safetyStockQty,
        LocalDate expiryDate,
        @NotNull @Positive Long handledById
) {
}
