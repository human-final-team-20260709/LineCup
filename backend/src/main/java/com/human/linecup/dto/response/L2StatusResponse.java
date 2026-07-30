package com.human.linecup.dto.response;

import com.human.linecup.entity.L2Collector.CollectorStatus;
import com.human.linecup.entity.ConnectionStatus;

import java.time.Instant;

public record L2StatusResponse(
        Long collectorId,
        String collectorCode,
        String name,
        CollectorStatus status,
        String statusLabel,
        int connectedL1Count,
        int l1Total,
        ConnectionStatus backendConnectionStatus,
        String backendConnectionStatusLabel,
        Instant lastSentAt
) {
}
