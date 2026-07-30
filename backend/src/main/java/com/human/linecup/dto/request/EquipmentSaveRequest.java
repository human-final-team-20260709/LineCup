package com.human.linecup.dto.request;

import com.human.linecup.entity.Equipment.EquipmentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record EquipmentSaveRequest(
        @NotBlank @Size(max = 50) String equipmentName,
        @NotBlank @Size(max = 50) String equipmentCode,
        @NotNull @Positive Long processId,
        @NotBlank @Size(max = 100) String location,
        EquipmentStatus status
) {
}
