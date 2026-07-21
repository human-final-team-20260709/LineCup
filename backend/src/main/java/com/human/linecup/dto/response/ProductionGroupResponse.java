package com.human.linecup.dto.response;

public record ProductionGroupResponse(
        String name,
        long targetQty,
        long productionQty,
        long goodQty,
        long defectQty,
        double achievementRate
) {
}
