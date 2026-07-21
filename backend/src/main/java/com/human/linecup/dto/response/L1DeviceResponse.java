package com.human.linecup.dto.response;

import com.human.linecup.entity.ConnectionStatus;

import java.time.Instant;

public record L1DeviceResponse(
        Long deviceId,
        Long equipmentId,
        String equipmentCode,
        String equipmentName,
        String ipAddress,
        Integer port,
        ConnectionStatus connectionStatus,
        String connectionStatusLabel,
        Instant lastReceivedAt
) {
}
