package com.human.linecup.dto.response;

import com.human.linecup.entity.WorkOrder;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record L2ActiveWorkOrderResponse(
        Long workOrderId,
        Long productionLotId,
        WorkOrder.Status status,
        int targetQty,
        int currentQty,
        int hourlyTargetQty,
        @NotEmpty List<String> equipmentCodes
) {
    public L2ActiveWorkOrderResponse {
        equipmentCodes = equipmentCodes == null ? List.of() : List.copyOf(equipmentCodes);
        if (equipmentCodes.isEmpty()) {
            throw new IllegalArgumentException("활성 작업에는 설비가 1개 이상 배정되어야 합니다.");
        }
    }
}
