package com.human.linecup.dto.response;

public record WorkOrderDashboardSummaryResponse(
        long totalCount,
        long pendingCount,
        long inProgressCount,
        long holdCount,
        long doneCount,
        double averageProgressRate
) {
}
