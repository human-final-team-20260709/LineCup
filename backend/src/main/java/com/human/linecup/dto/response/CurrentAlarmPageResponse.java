package com.human.linecup.dto.response;

import java.util.List;

public record CurrentAlarmPageResponse(
        List<AlarmSummaryResponse> content,
        int number,
        int size,
        long totalElements,
        int totalPages,
        int numberOfElements,
        boolean first,
        boolean last,
        boolean empty,
        CurrentAlarmSummaryResponse summary
) {
}
