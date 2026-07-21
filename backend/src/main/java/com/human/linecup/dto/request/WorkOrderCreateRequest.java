package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.util.List;

public record WorkOrderCreateRequest(
        @NotNull @Positive Long productId,
        @NotNull @Positive Integer targetQty,
        @NotNull @Positive Integer hourlyTargetQty,
        @NotNull LocalDate plannedStartDate,
        @NotNull @Positive Long supervisorUserId,
        String remarks,
        List<@Positive Long> workerUserIds,
        List<@Positive Long> equipmentIds
) {
    public WorkOrderCreateRequest {
        workerUserIds = workerUserIds == null ? List.of() : List.copyOf(workerUserIds);
        equipmentIds = equipmentIds == null ? List.of() : List.copyOf(equipmentIds);
    }
}
