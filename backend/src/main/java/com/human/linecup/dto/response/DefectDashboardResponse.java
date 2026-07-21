package com.human.linecup.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class DefectDashboardResponse {

    private List<EquipmentDefectCount> equipmentDefects;
    private List<DefectListItemResponse> recentDefects;

    @Getter
    @Builder
    public static class EquipmentDefectCount {
        private Long equipmentId;
        private long quantity;
        // 최대 설비 대비 비율 (%)
        private int ratio;
    }
}
