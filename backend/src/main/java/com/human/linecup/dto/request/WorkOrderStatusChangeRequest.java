package com.human.linecup.dto.request;

import com.human.linecup.entity.WorkOrder;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record WorkOrderStatusChangeRequest(
        @NotNull WorkOrder.Action action,
        @NotNull @Positive Long changedByUserId,
        String note
) {
}
