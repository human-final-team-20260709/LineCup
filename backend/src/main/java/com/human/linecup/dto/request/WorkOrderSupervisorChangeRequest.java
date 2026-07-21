package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.NoArgsConstructor;

/** 지시자 변경 */
@Getter
@NoArgsConstructor
public class WorkOrderSupervisorChangeRequest {

    @NotNull(message = "변경할 지시자를 선택해주세요.")
    private Long supervisorUserId;
}
