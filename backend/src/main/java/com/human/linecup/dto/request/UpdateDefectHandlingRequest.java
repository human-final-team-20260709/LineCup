package com.human.linecup.dto.request;

import com.human.linecup.entity.DefectHandleMethod;
import com.human.linecup.entity.DefectStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateDefectHandlingRequest(
        @Positive Long handlerId,
        DefectHandleMethod handleMethod,
        @NotNull DefectStatus status,
        String handlingContent
) {

    public UpdateDefectHandlingRequest(
            Long handlerId,
            DefectHandleMethod handleMethod,
            DefectStatus status
    ) {
        this(handlerId, handleMethod, status, null);
    }
}
