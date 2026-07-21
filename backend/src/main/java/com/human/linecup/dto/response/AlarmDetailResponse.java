package com.human.linecup.dto.response;

import java.time.Instant;

public record AlarmDetailResponse(
        AlarmSummaryResponse summary,
        String description,
        Long handlerId,
        String handlerEmpNo,
        String handlerName,
        String handlingContent,
        Instant resolvedAt
) {
}
