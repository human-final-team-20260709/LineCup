package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class EquipmentHumidityRequest {

    @NotNull
    private Long equipmentId;

    @NotNull
    private Long workOrderId;

    @NotNull
    private BigDecimal humidity;
}
