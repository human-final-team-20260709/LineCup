package com.human.linecup.dto.response;

import com.human.linecup.entity.Equipment.EquipmentStatus;

public record EquipmentResponse(
        Long equipmentId,
        String equipmentCode,
        String equipmentName,
        Long processId,
        String processCode,
        String processName,
        String location,
        EquipmentStatus status,
        String statusLabel,
        Long currentUserId,
        String currentUserName
) {
}
