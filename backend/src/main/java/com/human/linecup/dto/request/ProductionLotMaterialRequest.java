package com.human.linecup.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductionLotMaterialRequest {

    @NotNull
    @Positive
    private Long productionLotId;

    @NotNull
    @Positive
    private Long materialLotId;

    @NotNull
    @Positive
    @Digits(integer = 9, fraction = 3)
    private BigDecimal usedQty;
}
