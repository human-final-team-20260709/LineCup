package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record WorkOrderTargetQtyUpdateRequest(
        @NotNull @Positive Integer targetQty,
        @NotNull @Positive Integer hourlyTargetQty
) {
}
