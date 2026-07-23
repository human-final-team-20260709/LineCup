package com.human.linecup.dto.response;

import java.time.LocalDate;
import java.util.List;

public record DefectStatisticsResponse(
        long totalProductionQty,
        long totalDefectCount,
        long totalDefectQuantity,
        double periodDefectRate,
        double previousPeriodRateChangePercentagePoint,
        long completedDefectCount,
        double handlingRate,
        List<DailyRate> dailyRates,
        List<ProductRate> productRates,
        List<ProcessQuantity> processQuantities,
        List<TypeCount> typeCounts,
        List<Ranking> rankings
) {
    public record DailyRate(
            LocalDate date,
            long productionQty,
            long defectQty,
            double defectRate
    ) {
    }

    public record ProductRate(
            Long productId,
            String productName,
            long productionQty,
            long defectQty,
            double defectRate
    ) {
    }

    public record ProcessQuantity(String processName, long defectQty) {
    }

    public record TypeCount(
            String defectType,
            String defectTypeLabel,
            long eventCount,
            long quantity,
            double ratio
    ) {
    }

    public record Ranking(
            int rank,
            String defectTypeLabel,
            String mainProcessName,
            long eventCount,
            Double changeRatePercent
    ) {
    }
}
