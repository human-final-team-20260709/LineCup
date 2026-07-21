package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.Getter;
import lombok.NoArgsConstructor;

/** 생산 목표 수량 수정 */
@Getter
@NoArgsConstructor
public class WorkOrderTargetQtyUpdateRequest {

    @NotNull(message = "생산 목표 수량을 입력해주세요.")
    @Positive(message = "생산 목표 수량은 0보다 커야 합니다.")
    private Integer targetQty;
}
