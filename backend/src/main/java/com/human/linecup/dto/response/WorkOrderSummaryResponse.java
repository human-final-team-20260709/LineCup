package com.human.linecup.dto.response;

import lombok.Builder;
import lombok.Getter;

/**
 * 작업지시 목록 화면 상단 요약 카드용
 * ("전체 작업지시", "진행중", "목표 대비 평균 진행률")
 */
@Getter
@Builder
public class WorkOrderSummaryResponse {

    private long totalCount;
    private long pendingCount;
    private long inProgressCount;
    private long holdCount;
    private long doneCount;
    private double averageProgressRate;
}
