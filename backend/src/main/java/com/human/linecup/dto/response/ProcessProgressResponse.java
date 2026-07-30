package com.human.linecup.dto.response;

import com.human.linecup.entity.ProductionProcessProgress.ProcessProgressStatus;

import java.time.Instant;

public record ProcessProgressResponse(
        Long processProgressId,
        Long processId,
        String processCode,
        String processName,
        Long equipmentId,
        String equipmentCode,
        String equipmentName,
        ProcessProgressStatus status,
        String statusLabel,
        int targetQty,
        int productionQty,
        int goodQty,
        int defectQty,
        Instant startedAt,
        Instant completedAt
) {
}
