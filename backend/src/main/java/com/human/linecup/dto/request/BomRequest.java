package com.human.linecup.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BomRequest {

    @NotNull
    @Positive
    private Long productId;

    @NotNull
    @Positive
    private Long materialId;

    @NotBlank
    @Size(max = 50)
    private String spec;

    @NotNull
    @Positive
    @Digits(integer = 7, fraction = 3)
    private BigDecimal requiredQty;

    @NotNull
    @PositiveOrZero
    @Digits(integer = 3, fraction = 2)
    private BigDecimal lossRate;
}
