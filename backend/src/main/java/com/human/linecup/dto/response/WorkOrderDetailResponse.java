package com.human.linecup.dto.response;

import java.util.List;

public record WorkOrderDetailResponse(
        WorkOrderSummaryResponse summary,
        String productUnit,
        String remarks,
        List<UserResponse> workers,
        List<EquipmentResponse> equipments,
        List<ProcessProgressResponse> processes,
        List<WorkOrderStatusHistoryResponse> statusHistories
) {
    public WorkOrderDetailResponse {
        workers = workers == null ? List.of() : List.copyOf(workers);
        equipments = equipments == null ? List.of() : List.copyOf(equipments);
        processes = processes == null ? List.of() : List.copyOf(processes);
        statusHistories = statusHistories == null ? List.of() : List.copyOf(statusHistories);
    }
}
