package com.human.linecup.dto.response;

public record ManufacturingProcessResponse(
        Long processId,
        String processCode,
        String processName,
        int sequence,
        boolean active
) {
}
