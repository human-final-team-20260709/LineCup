package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductInventoryRequest {

    @NotNull
    @Positive
    private Long productionLotId;

    @NotNull
    @PositiveOrZero
    private Integer currentQty;

    @NotBlank
    @Pattern(regexp = "AVAILABLE|DEPLETED|HOLD")
    private String status;
}
