package com.human.linecup.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class DefectStatisticsResponse {

    private List<DailyCount> dailyCounts;
    private List<EquipmentCount> equipmentCounts;
    private List<TypeCount> typeCounts;
    private List<RankingItem> ranking;

    @Getter
    @Builder
    public static class DailyCount {
        private String date;
        private long count;
    }

    @Getter
    @Builder
    public static class EquipmentCount {
        private Long equipmentId;
        private long count;
    }

    @Getter
    @Builder
    public static class TypeCount {
        private String type;
        private long count;
        private int percent;
    }

    @Getter
    @Builder
    public static class RankingItem {
        private int rank;
        private String type;
        private Long equipmentId;
        private long count;
    }
}
