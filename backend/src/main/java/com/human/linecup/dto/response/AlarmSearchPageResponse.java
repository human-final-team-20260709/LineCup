package com.human.linecup.dto.response;

import java.util.List;

public record AlarmSearchPageResponse(
        List<AlarmSummaryResponse> content,
        int number,
        int size,
        long totalElements,
        int totalPages,
        int numberOfElements,
        boolean first,
        boolean last,
        boolean empty,
        AlarmSearchSummaryResponse summary
) {
}
