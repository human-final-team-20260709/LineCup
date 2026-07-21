package com.human.linecup.dto.response;

import com.human.linecup.entity.Defect;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
@Builder
public class DefectListItemResponse {

    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private Long defectId;
    private String defectNo;
    private String occurredAt;
    private Long productionLotId;
    private Long equipmentId;
    private String defectType;
    private int quantity;
    private String status;
    private String tone;

    public static DefectListItemResponse from(Defect defect) {
        return DefectListItemResponse.builder()
                .defectId(defect.getDefectId())
                .defectNo(defect.getDefectNo())
                .occurredAt(defect.getOccurredAt().format(DATETIME_FORMAT))
                .productionLotId(defect.getProductionLotId())
                .equipmentId(defect.getEquipmentId())
                .defectType(defect.getDefectType())
                .quantity(defect.getQuantity())
                .status(defect.getStatus())
                .tone(defect.getTone())
                .build();
    }
}
