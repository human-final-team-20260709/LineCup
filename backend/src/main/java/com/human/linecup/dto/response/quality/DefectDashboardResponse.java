package com.human.linecup.dto.response.quality;

import java.time.LocalDate;
import java.util.List;

public record DefectDashboardResponse(
        LocalDate date,
        long todayDefectQuantity,
        long unhandledDefectCount,
        List<DefectResponse> recentDefects
) {
    public DefectDashboardResponse {
        recentDefects = List.copyOf(recentDefects);
    }
}
