package com.human.linecup.dto.request;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 작업지시 등록
 * - 작업지시 번호(work_order_no)는 서버에서 자동 채번하므로 요청값에 포함하지 않는다.
 * - 최초 상태는 서비스에서 항상 PENDING(대기)으로 고정한다.
 * - workerUserIds / equipmentIds는 등록 시점에 바로 작업자·설비를 지정하고 싶을 때만 채우면 되고,
 *   비워두면 등록 이후 화면에서 별도로 배정할 수 있다.
 */
@Getter
@NoArgsConstructor
public class WorkOrderCreateRequest {

    @NotNull(message = "제품을 선택해주세요.")
    private Long productId;

    @NotNull(message = "생산 목표 수량을 입력해주세요.")
    @Positive(message = "생산 목표 수량은 0보다 커야 합니다.")
    private Integer targetQty;

    @NotNull(message = "작업 시작 예정일을 입력해주세요.")
    private LocalDate plannedStartDate;

    @NotNull(message = "지시자를 배정해주세요.")
    private Long supervisorUserId;

    private String remarks;

    private List<Long> workerUserIds = new ArrayList<>();

    private List<Long> equipmentIds = new ArrayList<>();
}
