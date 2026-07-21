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
    public static ProductionSummaryResponse of(
            long targetQty,
            long productionQty,
            long goodQty,
            long defectQty,
            long collectingCount,
            long recordCount
    ) {
        return new ProductionSummaryResponse(
                targetQty,
                productionQty,
                goodQty,
                defectQty,
                percentage(productionQty, targetQty),
                percentage(defectQty, goodQty + defectQty),
                collectingCount,
                recordCount
        );
    }

    private static double percentage(long value, long total) {
        if (total <= 0) {
            return 0.0;
        }
        return Math.round((value * 1000.0) / total) / 10.0;
    }
}
