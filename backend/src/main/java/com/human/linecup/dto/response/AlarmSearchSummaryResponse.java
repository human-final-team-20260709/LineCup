package com.human.linecup.dto.response;

public record AlarmSearchSummaryResponse(
        long totalCount,
        long handledCount,
        long pendingCount
) {
}
