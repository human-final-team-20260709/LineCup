package com.human.linecup.dto.response;

public record ProductionGroupResponse(
        String name,
        long targetQty,
        long productionQty,
        long goodQty,
        long defectQty,
        double achievementRate
) {
    public static ProductionGroupResponse of(
            String name,
            long targetQty,
            long productionQty,
            long goodQty,
            long defectQty
    ) {
        double achievementRate = targetQty <= 0
                ? 0.0
                : Math.round((productionQty * 1000.0) / targetQty) / 10.0;
        return new ProductionGroupResponse(
                name,
                targetQty,
                productionQty,
                goodQty,
                defectQty,
                achievementRate
        );
    }
}
