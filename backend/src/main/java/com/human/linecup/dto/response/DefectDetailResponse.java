package com.human.linecup.dto.response;

import com.human.linecup.entity.Defect;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Getter
@Builder
public class DefectDetailResponse {

    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private Long defectId;
    private String defectNo;
    private String occurredAt;
    private Long productionLotId;
    private Long equipmentId;
    private Long handlerId;
    private String defectType;
    private int quantity;
    private String cause;
    private String handleMethod;
    private String status;
    private List<DefectHistoryResponse> history;

    public static DefectDetailResponse from(Defect defect) {
        return DefectDetailResponse.builder()
                .defectId(defect.getDefectId())
                .defectNo(defect.getDefectNo())
                .occurredAt(defect.getOccurredAt().format(DATETIME_FORMAT))
                .productionLotId(defect.getProductionLotId())
                .equipmentId(defect.getEquipmentId())
                .handlerId(defect.getHandlerId())
                .defectType(defect.getDefectType())
                .quantity(defect.getQuantity())
                .cause(defect.getCause())
                .handleMethod(defect.getHandleMethod())
                .status(defect.getStatus())
                .history(defect.getHistory().stream()
                        .map(DefectHistoryResponse::from)
                        .toList())
                .build();
    }
}
