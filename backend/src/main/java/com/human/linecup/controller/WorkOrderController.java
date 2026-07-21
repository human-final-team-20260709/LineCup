package com.human.linecup.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.human.linecup.dto.request.IdListRequest;
import com.human.linecup.dto.request.WorkOrderCreateRequest;
import com.human.linecup.dto.request.WorkOrderStatusChangeRequest;
import com.human.linecup.dto.request.WorkOrderSupervisorChangeRequest;
import com.human.linecup.dto.request.WorkOrderTargetQtyUpdateRequest;
import com.human.linecup.dto.response.EquipmentResponse;
import com.human.linecup.dto.response.ProductOptionResponse;
import com.human.linecup.dto.response.UserResponse;
import com.human.linecup.dto.response.WorkOrderDetailResponse;
import com.human.linecup.dto.response.WorkOrderListResponse;
import com.human.linecup.dto.response.WorkOrderStatusHistoryResponse;
import com.human.linecup.dto.response.WorkOrderSummaryResponse;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.service.WorkOrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/** 작업지시 REST API */
@RestController
@RequestMapping("/api/work-orders")
@RequiredArgsConstructor
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    // =====  작업지시 목록 =====
    @GetMapping
    public ResponseEntity<Page<WorkOrderListResponse>> getList(
            @RequestParam(required = false) WorkOrder.Status status,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20, sort = "registeredAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(workOrderService.getList(status, keyword, pageable));
    }

    @GetMapping("/summary")
    public ResponseEntity<WorkOrderSummaryResponse> getSummary() {
        return ResponseEntity.ok(workOrderService.getSummary());
    }

    // ===== 작업지시 상세 =====
    @GetMapping("/{workOrderId}")
    public ResponseEntity<WorkOrderDetailResponse> getDetail(@PathVariable Long workOrderId) {
        return ResponseEntity.ok(workOrderService.getDetail(workOrderId));
    }

    // ===== 작업지시 등록 =====
    @PostMapping
    public ResponseEntity<WorkOrderDetailResponse> create(@Valid @RequestBody WorkOrderCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workOrderService.create(request));
    }

    // ===== 작업 시작 / 보류 / 재개 / 완료 =====
    @PatchMapping("/{workOrderId}/status")
    public ResponseEntity<WorkOrderDetailResponse> changeStatus(
            @PathVariable Long workOrderId,
            @Valid @RequestBody WorkOrderStatusChangeRequest request) {
        return ResponseEntity.ok(workOrderService.changeStatus(workOrderId, request));
    }

    @GetMapping("/{workOrderId}/status-histories")
    public ResponseEntity<List<WorkOrderStatusHistoryResponse>> getStatusHistories(@PathVariable Long workOrderId) {
        return ResponseEntity.ok(workOrderService.getStatusHistories(workOrderId));
    }

    // ===== 지시자 변경 =====
    @PatchMapping("/{workOrderId}/supervisor")
    public ResponseEntity<WorkOrderDetailResponse> changeSupervisor(
            @PathVariable Long workOrderId,
            @Valid @RequestBody WorkOrderSupervisorChangeRequest request) {
        return ResponseEntity.ok(workOrderService.changeSupervisor(workOrderId, request));
    }

    // ===== 작업자 배정 =====
    @GetMapping("/{workOrderId}/workers")
    public ResponseEntity<List<UserResponse>> getWorkers(@PathVariable Long workOrderId) {
        return ResponseEntity.ok(workOrderService.getWorkers(workOrderId));
    }

    @PostMapping("/{workOrderId}/workers")
    public ResponseEntity<List<UserResponse>> assignWorkers(
            @PathVariable Long workOrderId,
            @Valid @RequestBody IdListRequest request) {
        return ResponseEntity.ok(workOrderService.assignWorkers(workOrderId, request.getIds()));
    }

    @DeleteMapping("/{workOrderId}/workers/{userId}")
    public ResponseEntity<Void> unassignWorker(@PathVariable Long workOrderId, @PathVariable Long userId) {
        workOrderService.unassignWorker(workOrderId, userId);
        return ResponseEntity.noContent().build();
    }

    // =====  생산 목표 수량 수정 =====
    @PatchMapping("/{workOrderId}/target-qty")
    public ResponseEntity<WorkOrderDetailResponse> changeTargetQty(
            @PathVariable Long workOrderId,
            @Valid @RequestBody WorkOrderTargetQtyUpdateRequest request) {
        return ResponseEntity.ok(workOrderService.changeTargetQty(workOrderId, request));
    }

    // =====  작업지시별 설비 매핑 =====
    @GetMapping("/{workOrderId}/equipments")
    public ResponseEntity<List<EquipmentResponse>> getEquipments(@PathVariable Long workOrderId) {
        return ResponseEntity.ok(workOrderService.getEquipments(workOrderId));
    }

    @PostMapping("/{workOrderId}/equipments")
    public ResponseEntity<List<EquipmentResponse>> mapEquipments(
            @PathVariable Long workOrderId,
            @Valid @RequestBody IdListRequest request) {
        return ResponseEntity.ok(workOrderService.mapEquipments(workOrderId, request.getIds()));
    }

    @DeleteMapping("/{workOrderId}/equipments/{equipmentId}")
    public ResponseEntity<Void> unmapEquipment(@PathVariable Long workOrderId, @PathVariable Long equipmentId) {
        workOrderService.unmapEquipment(workOrderId, equipmentId);
        return ResponseEntity.noContent().build();
    }

    // ===== 등록/배정 화면 드롭다운용 옵션 조회 =====
    @GetMapping("/options/products")
    public ResponseEntity<List<ProductOptionResponse>> getProductOptions() {
        return ResponseEntity.ok(workOrderService.getProductOptions());
    }

    @GetMapping("/options/supervisors")
    public ResponseEntity<List<UserResponse>> getSupervisorOptions() {
        return ResponseEntity.ok(workOrderService.getSupervisorOptions());
    }

    @GetMapping("/options/workers")
    public ResponseEntity<List<UserResponse>> getWorkerOptions() {
        return ResponseEntity.ok(workOrderService.getWorkerOptions());
    }

    @GetMapping("/options/equipments")
    public ResponseEntity<List<EquipmentResponse>> getEquipmentOptions() {
        return ResponseEntity.ok(workOrderService.getEquipmentOptions());
    }
}
