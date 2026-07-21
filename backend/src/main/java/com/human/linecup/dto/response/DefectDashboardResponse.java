package com.human.linecup.dto.response;

import java.time.LocalDate;
import java.util.List;

public record DefectDashboardResponse(
        LocalDate date,
        long todayDefectQuantity,
        long unhandledDefectCount,
        List<DefectSummaryResponse> recentDefects
) {
    public DefectDashboardResponse {
        recentDefects = recentDefects == null ? List.of() : List.copyOf(recentDefects);
    }
}
