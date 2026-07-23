package com.human.linecup.controller;

import com.human.linecup.dto.request.IdListRequest;
import com.human.linecup.dto.request.WorkOrderCreateRequest;
import com.human.linecup.dto.request.WorkOrderStatusChangeRequest;
import com.human.linecup.dto.request.WorkOrderSupervisorChangeRequest;
import com.human.linecup.dto.request.WorkOrderTargetQtyUpdateRequest;
import com.human.linecup.dto.response.L2ActiveWorkOrderResponse;
import com.human.linecup.dto.response.UserResponse;
import com.human.linecup.dto.response.WorkOrderDashboardSummaryResponse;
import com.human.linecup.dto.response.WorkOrderDetailResponse;
import com.human.linecup.dto.response.WorkOrderSummaryResponse;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.service.WorkOrderService;
import jakarta.validation.Valid;
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

import java.net.URI;
import java.util.List;

/**
 * 작업지시(WorkOrder) REST API.
 * 여기서는 HTTP 요청/응답 변환만 담당하고, 실제 로직은 전부 WorkOrderService에 위임한다.
 * dto / entity / repository / service는 건드리지 않고, 이미 있는 메서드만 노출한다.
 */
@RestController
@RequestMapping("/api/work-orders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

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
    public List<WorkOrderSummaryResponse> getWorkOrdersByWorker(@PathVariable Long userId) {
        return workOrderService.getWorkOrdersByWorker(userId);
    }

    // L2 수집기가 주기적으로 폴링해서 현재 진행할 작업지시를 조회하는 용도
    @GetMapping("/l2/active-order")
    public ResponseEntity<L2ActiveWorkOrderResponse> getActiveWorkOrderForL2(
            @RequestParam String collectorCode
    ) {
        return workOrderService.getActiveWorkOrderForL2(collectorCode)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @GetMapping("/{workOrderId}")
    public WorkOrderDetailResponse getDetail(@PathVariable Long workOrderId) {
        return workOrderService.getDetail(workOrderId);
    }

    // ===== 상태 변경 / 수정 =====

    @PatchMapping("/{workOrderId}/status")
    public WorkOrderSummaryResponse changeStatus(
            @PathVariable Long workOrderId,
            @Valid @RequestBody WorkOrderStatusChangeRequest request
    ) {
        return workOrderService.changeStatus(workOrderId, request);
    }

    @PatchMapping("/{workOrderId}/target-quantities")
    public WorkOrderSummaryResponse changeTargetQuantities(
            @PathVariable Long workOrderId,
            @Valid @RequestBody WorkOrderTargetQtyUpdateRequest request
    ) {
        return workOrderService.changeTargetQuantities(workOrderId, request);
    }

    @PatchMapping("/{workOrderId}/supervisor")
    public WorkOrderSummaryResponse changeSupervisor(
            @PathVariable Long workOrderId,
            @Valid @RequestBody WorkOrderSupervisorChangeRequest request
    ) {
        return workOrderService.changeSupervisor(workOrderId, request);
    }

    // ===== 작업자 배정 =====

    @GetMapping("/{workOrderId}/workers")
    public List<UserResponse> getWorkers(@PathVariable Long workOrderId) {
        return workOrderService.getWorkers(workOrderId);
    }

    // 바디를 아예 생략하면(request == null) 서비스가 전체 작업자를 비우는 것으로 처리한다.
    @PutMapping("/{workOrderId}/workers")
    public List<UserResponse> replaceWorkers(
            @PathVariable Long workOrderId,
            @Valid @RequestBody(required = false) IdListRequest request
    ) {
        return workOrderService.replaceWorkers(workOrderId, request);
    }

    @PostMapping("/{workOrderId}/workers/{userId}")
    public ResponseEntity<UserResponse> addWorker(
            @PathVariable Long workOrderId,
            @PathVariable Long userId
    ) {
        UserResponse response = workOrderService.addWorker(workOrderId, userId);
        return ResponseEntity
                .created(URI.create("/api/work-orders/" + workOrderId + "/workers/" + userId))
                .body(response);
    }

    @DeleteMapping("/{workOrderId}/workers/{userId}")
    public ResponseEntity<Void> removeWorker(
            @PathVariable Long workOrderId,
            @PathVariable Long userId
    ) {
        workOrderService.removeWorker(workOrderId, userId);
        return ResponseEntity.noContent().build();
    }

   // 설비 매핑 수정 API는 의도적으로 뺌 (공정당 설비 1대라 프론트에 선택 UI 없음, 등록 시 자동 매핑됨)
}
