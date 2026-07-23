package com.human.linecup.controller;

import com.human.linecup.dto.request.IdListRequest;
import com.human.linecup.dto.request.WorkOrderCreateRequest;
import com.human.linecup.dto.request.WorkOrderStatusChangeRequest;
import com.human.linecup.dto.request.WorkOrderSupervisorChangeRequest;
import com.human.linecup.dto.request.WorkOrderTargetQtyUpdateRequest;
import com.human.linecup.dto.response.UserResponse;
import com.human.linecup.dto.response.WorkOrderDashboardSummaryResponse;
import com.human.linecup.dto.response.WorkOrderDetailResponse;
import com.human.linecup.dto.response.WorkOrderSummaryResponse;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.service.WorkOrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

import java.net.URI;
import java.util.List;

/**
 * 작업지시(WorkOrder) REST API.
 * 여기서는 HTTP 요청/응답 변환만 담당하고, 실제 로직은 전부 WorkOrderService에 위임한다.
 */
@RestController
@RequestMapping("/api/work-orders")
@RequiredArgsConstructor
@Validated
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    // ===== 등록 =====

    @PostMapping
    public ResponseEntity<WorkOrderSummaryResponse> create(@Valid @RequestBody WorkOrderCreateRequest request) {
        WorkOrderSummaryResponse response = workOrderService.create(request);
        return ResponseEntity
                .created(URI.create("/api/work-orders/" + response.workOrderId()))
                .body(response);
    }

    // ===== 목록 / 상세 조회 =====

    @GetMapping
    public Page<WorkOrderSummaryResponse> search(
            @RequestParam(required = false) WorkOrder.Status status,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return workOrderService.search(status, keyword, pageable);
    }

    // 대시보드 요약 카드용 집계. {workOrderId}보다 먼저 매칭되도록 리터럴 경로로 둔다.
    @GetMapping("/dashboard-summary")
    public WorkOrderDashboardSummaryResponse getDashboardSummary() {
        return workOrderService.getDashboardSummary();
    }

    // 특정 작업자가 배정된 작업지시 전체 조회
    @GetMapping("/by-worker/{userId}")
    public List<WorkOrderSummaryResponse> getWorkOrdersByWorker(@PathVariable @Positive Long userId) {
        return workOrderService.getWorkOrdersByWorker(userId);
    }

    @GetMapping("/{workOrderId}")
    public WorkOrderDetailResponse getDetail(@PathVariable @Positive Long workOrderId) {
        return workOrderService.getDetail(workOrderId);
    }

    // ===== 상태 변경 / 수정 =====

    @PatchMapping("/{workOrderId}/status")
    public WorkOrderSummaryResponse changeStatus(
            @PathVariable @Positive Long workOrderId,
            @Valid @RequestBody WorkOrderStatusChangeRequest request
    ) {
        return workOrderService.changeStatus(workOrderId, request);
    }

    @PatchMapping("/{workOrderId}/target-quantities")
    public WorkOrderSummaryResponse changeTargetQuantities(
            @PathVariable @Positive Long workOrderId,
            @Valid @RequestBody WorkOrderTargetQtyUpdateRequest request
    ) {
        return workOrderService.changeTargetQuantities(workOrderId, request);
    }

    @PatchMapping("/{workOrderId}/supervisor")
    public WorkOrderSummaryResponse changeSupervisor(
            @PathVariable @Positive Long workOrderId,
            @Valid @RequestBody WorkOrderSupervisorChangeRequest request
    ) {
        return workOrderService.changeSupervisor(workOrderId, request);
    }

    // ===== 작업자 배정 =====

    @GetMapping("/{workOrderId}/workers")
    public List<UserResponse> getWorkers(@PathVariable @Positive Long workOrderId) {
        return workOrderService.getWorkers(workOrderId);
    }

    // ids가 빈 배열이면 전체 작업자 배정을 해제한다.
    @PutMapping("/{workOrderId}/workers")
    public List<UserResponse> replaceWorkers(
            @PathVariable @Positive Long workOrderId,
            @Valid @RequestBody IdListRequest request
    ) {
        return workOrderService.replaceWorkers(workOrderId, request);
    }

    @PostMapping("/{workOrderId}/workers/{userId}")
    public ResponseEntity<UserResponse> addWorker(
            @PathVariable @Positive Long workOrderId,
            @PathVariable @Positive Long userId
    ) {
        UserResponse response = workOrderService.addWorker(workOrderId, userId);
        return ResponseEntity
                .created(URI.create("/api/work-orders/" + workOrderId + "/workers/" + userId))
                .body(response);
    }

    @DeleteMapping("/{workOrderId}/workers/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeWorker(
            @PathVariable @Positive Long workOrderId,
            @PathVariable @Positive Long userId
    ) {
        workOrderService.removeWorker(workOrderId, userId);
    }

   // 설비 매핑 수정 API는 의도적으로 뺌 (공정당 설비 1대라 프론트에 선택 UI 없음, 등록 시 자동 매핑됨)
}
