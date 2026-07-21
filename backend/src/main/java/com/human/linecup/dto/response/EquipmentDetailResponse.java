package com.human.linecup.dto.response;

import com.human.linecup.entity.Equipment;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class EquipmentDetailResponse {

    private Long equipmentId;
    private String equipmentName;
    private String equipmentCode;
    private String status;
    private Long currentUserId;

    // 최근 측정값 (없으면 null)
    private BigDecimal latestTemperature;
    private BigDecimal latestHumidity;
    private BigDecimal latestSpeed;
    private String latestSpeedUnit;

    public static EquipmentDetailResponse of(Equipment equipment, Long currentUserId,
                                              BigDecimal latestTemperature,
                                              BigDecimal latestHumidity,
                                              BigDecimal latestSpeed,
                                              String latestSpeedUnit) {
        return EquipmentDetailResponse.builder()
                .equipmentId(equipment.getEquipmentId())
                .equipmentName(equipment.getEquipmentName())
                .equipmentCode(equipment.getEquipmentCode())
                .status(equipment.getStatus())
                .currentUserId(currentUserId)
                .latestTemperature(latestTemperature)
                .latestHumidity(latestHumidity)
                .latestSpeed(latestSpeed)
                .latestSpeedUnit(latestSpeedUnit)
                .build();
    }
}
