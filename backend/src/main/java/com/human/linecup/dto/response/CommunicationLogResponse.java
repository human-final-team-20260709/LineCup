package com.human.linecup.dto.response;

import com.human.linecup.entity.CommunicationLog;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
@Builder
public class CommunicationLogResponse {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm:ss");

    private Long logId;
    private String direction;
    private Long deviceId;
    private Long collectorId;
    private boolean success;
    private String failReason;
    private String occurredAt;

    public static CommunicationLogResponse from(CommunicationLog log) {
        return CommunicationLogResponse.builder()
                .logId(log.getLogId())
                .direction(log.getDirection())
                .deviceId(log.getDevice() == null ? null : log.getDevice().getDeviceId())
                .collectorId(log.getCollector() == null ? null : log.getCollector().getCollectorId())
                .success(log.isSuccess())
                .failReason(log.getFailReason() == null ? "-" : log.getFailReason())
                .occurredAt(log.getOccurredAt().format(TIME_FORMAT))
                .build();
    }
}
