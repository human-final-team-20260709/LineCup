package com.human.linecup.dto.response;

import com.human.linecup.entity.DefectHistory;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
@Builder
public class DefectHistoryResponse {

    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private String occurredAt;
    private String title;
    private String description;
    private String tone;

    public static DefectHistoryResponse from(DefectHistory history) {
        return DefectHistoryResponse.builder()
                .occurredAt(history.getOccurredAt().format(DATETIME_FORMAT))
                .title(history.getTitle())
                .description(history.getDescription())
                .tone(history.getTone())
                .build();
    }
}
