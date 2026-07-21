package com.human.linecup.dto.response;

import com.human.linecup.entity.Equipment;

import lombok.Builder;
import lombok.Getter;

/**
 * 설비 정보 응답 공용 DTO.
 * - 작업지시에 매핑된 설비 목록
 * - 설비 매핑 드롭다운 옵션
 */
@Getter
@Builder
public class EquipmentResponse {

    private Long equipmentId;
    private String equipmentName;
    private Equipment.Status status;

    public static EquipmentResponse from(Equipment equipment) {
        return EquipmentResponse.builder()
                .equipmentId(equipment.getEquipmentId())
                .equipmentName(equipment.getEquipmentName())
                .status(equipment.getStatus())
                .build();
    }
}
