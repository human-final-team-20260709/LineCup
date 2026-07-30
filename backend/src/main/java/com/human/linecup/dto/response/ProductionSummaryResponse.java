package com.human.linecup.dto.response;

public record ProductionSummaryResponse(
        long targetQty,
        long productionQty,
        long goodQty,
        long defectQty,
        double achievementRate,
        double defectRate,
        long collectingCount,
        long recordCount
) {
}
