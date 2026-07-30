package com.human.linecup.dto.response;

import com.human.linecup.entity.DefectHandleMethod;
import com.human.linecup.entity.DefectStatus;

import java.time.Instant;

public record DefectHandlingHistoryResponse(
        Long defectHandlingHistoryId,
        DefectStatus status,
        String statusLabel,
        DefectHandleMethod handleMethod,
        String handleMethodLabel,
        String content,
        Long handledById,
        String handledByEmpNo,
        String handledByName,
        Instant handledAt
) {
}
