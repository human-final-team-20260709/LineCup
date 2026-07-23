package com.human.linecup.dto.response;

import com.human.linecup.entity.CommunicationLog.CommunicationDirection;

import java.time.Instant;

public record CommunicationLogResponse(
        Long logId,
        CommunicationDirection direction,
        String directionLabel,
        Long deviceId,
        Long collectorId,
        String sourceType,
        String sourceCode,
        String sourceName,
        boolean success,
        String failReason,
        Instant occurredAt
) {
}
