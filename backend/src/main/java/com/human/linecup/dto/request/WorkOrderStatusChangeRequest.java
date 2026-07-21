package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotNull;

import com.human.linecup.entity.WorkOrder;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 작업 시작 / 보류 / 재개 / 완료 처리
 * action: START(시작) / HOLD(보류) / RESUME(재개) / COMPLETE(완료)
 *
 * changedByUserId(처리자)는 인증/로그인 기능이 아직 붙기 전이라 임시로 요청 바디에서 받는다.
 * 계정 섹션에서 로그인 인증(JWT/세션 등)이 붙으면 SecurityContext에서 처리자를 꺼내도록
 * 이 필드는 제거하고 인증 정보로 대체하면 된다.
 */
@Getter
@NoArgsConstructor
public class WorkOrderStatusChangeRequest {

    @NotNull(message = "처리할 작업을 선택해주세요.")
    private WorkOrder.Action action;

    @NotNull(message = "처리자 정보가 필요합니다.")
    private Long changedByUserId;
}
