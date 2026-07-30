package com.human.linecup.dto.response;

public record CurrentAlarmSummaryResponse(
        long totalActive,
        long criticalCount,
        long warningCount,
        long cautionCount
) {
}
