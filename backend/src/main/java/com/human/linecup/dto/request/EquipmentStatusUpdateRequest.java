package com.human.linecup.dto.request;

import com.human.linecup.entity.Equipment.EquipmentStatus;
import jakarta.validation.constraints.NotNull;

public record EquipmentStatusUpdateRequest(@NotNull EquipmentStatus status) {
}
