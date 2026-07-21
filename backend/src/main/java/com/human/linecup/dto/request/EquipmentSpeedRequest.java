package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class EquipmentSpeedRequest {

    @NotNull
    private Long equipmentId;

    @NotNull
    private Long workOrderId;

    @NotNull
    private BigDecimal speed;

    @NotBlank
    private String unit;
}
