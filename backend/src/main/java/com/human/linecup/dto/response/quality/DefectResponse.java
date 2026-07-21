package com.human.linecup.dto.response.quality;

import com.human.linecup.entity.Defect;
import com.human.linecup.entity.DefectHandleMethod;
import com.human.linecup.entity.DefectStatus;

import java.time.LocalDateTime;

public record DefectResponse(
        Long defectId,
        String defectNo,
        Long productionLotId,
        Long equipmentId,
        Long handlerId,
        String defectType,
        Integer quantity,
        String cause,
        DefectHandleMethod handleMethod,
        String handleMethodLabel,
        String handlingContent,
        DefectStatus status,
        String statusLabel,
        LocalDateTime occurredAt
) {

    public DefectResponse(
            Long defectId,
            String defectNo,
            Long productionLotId,
            Long equipmentId,
            Long handlerId,
            String defectType,
            Integer quantity,
            String cause,
            DefectHandleMethod handleMethod,
            String handleMethodLabel,
            DefectStatus status,
            String statusLabel,
            LocalDateTime occurredAt
    ) {
        this(
                defectId,
                defectNo,
                productionLotId,
                equipmentId,
                handlerId,
                defectType,
                quantity,
                cause,
                handleMethod,
                handleMethodLabel,
                null,
                status,
                statusLabel,
                occurredAt
        );
    }

    public static DefectResponse from(Defect defect) {
        DefectHandleMethod handleMethod = defect.getHandleMethod();
        DefectStatus status = defect.getStatus();

        return new DefectResponse(
                defect.getDefectId(),
                defect.getDefectNo(),
                defect.getProductionLotId(),
                defect.getEquipmentId(),
                defect.getHandlerId(),
                defect.getDefectType(),
                defect.getQuantity(),
                defect.getCause(),
                handleMethod,
                handleMethod == null ? null : handleMethod.getLabel(),
                defect.getHandlingContent(),
                status,
                status.getLabel(),
                defect.getOccurredAt()
        );
    }
}
