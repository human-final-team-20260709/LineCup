package com.human.linecup.dto.response;

import java.time.Instant;

public record EquipmentAssignmentResponse(
        Long equipmentAssignmentId,
        Long userId,
        String empNo,
        String userName,
        Long equipmentId,
        String equipmentCode,
        Instant startedAt,
        Instant endedAt,
        boolean active
) {
}
