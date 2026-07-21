package com.human.linecup.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record ProductionLotMaterialRequest(
        @NotNull @Positive Long productionLotId,
        @NotNull @Positive Long materialLotId,
        @NotNull @Positive @Digits(integer = 9, fraction = 3) BigDecimal usedQty
) {
}
