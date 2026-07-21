package com.human.linecup.dto.response;

import java.util.List;

public record DefectDetailResponse(
        DefectSummaryResponse summary,
        String cause,
        List<DefectHandlingHistoryResponse> handlingHistories
) {
    public DefectDetailResponse {
        handlingHistories = handlingHistories == null ? List.of() : List.copyOf(handlingHistories);
    }
}
