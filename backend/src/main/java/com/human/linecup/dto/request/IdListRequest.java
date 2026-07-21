package com.human.linecup.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * ID 목록만 받는 범용 요청 DTO.
 * - 작업자 배정: userIds로 사용
 * - 설비 매핑: equipmentIds로 사용
 * 원래 WorkOrderWorkerAssignRequest / WorkOrderEquipmentMapRequest 두 개였는데,
 * 둘 다 "ID 리스트 하나 받는다"는 모양이 완전히 같아서 하나로 합쳤다.
 * (필드명이 범용적인 "ids"라 무엇을 배정하는 요청인지는 URL로 구분해야 한다 — 유일한 단점)
 */
@Getter
@NoArgsConstructor
public class IdListRequest {

    @NotEmpty(message = "1개 이상 선택해주세요.")
    private List<Long> ids;
}
