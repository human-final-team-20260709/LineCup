package com.human.linecup.dto.response;

import com.human.linecup.entity.Equipment;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EquipmentResponse {

    private Long equipmentId;
    private String equipmentName;
    private String equipmentCode;
    private String status;
    // 현재 배정된 작업자 (없으면 null)
    private Long currentUserId;

    public static EquipmentResponse from(Equipment equipment, Long currentUserId) {
        return EquipmentResponse.builder()
                .equipmentId(equipment.getEquipmentId())
                .equipmentName(equipment.getEquipmentName())
                .equipmentCode(equipment.getEquipmentCode())
                .status(equipment.getStatus())
                .currentUserId(currentUserId)
                .build();
    }
}
