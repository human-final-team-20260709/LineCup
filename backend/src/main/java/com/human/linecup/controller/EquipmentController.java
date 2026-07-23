package com.human.linecup.controller;

import com.human.linecup.dto.request.EquipmentAssignRequest;
import com.human.linecup.dto.request.EquipmentSaveRequest;
import com.human.linecup.dto.request.EquipmentStatusUpdateRequest;
import com.human.linecup.dto.response.EquipmentAssignmentResponse;
import com.human.linecup.dto.response.EquipmentDetailResponse;
import com.human.linecup.dto.response.EquipmentResponse;
import com.human.linecup.entity.Equipment.EquipmentStatus;
import com.human.linecup.service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
 * 설비 마스터 CRUD, 가동 상태 전환, 작업자 배정을 다룬다.
 * 실제 비즈니스 로직/검증은 EquipmentService에 있고 이 계층은 HTTP 매핑과 상태코드만 책임진다.
 */
@RestController
@RequestMapping("/api/equipments")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;

    @PostMapping
    public ResponseEntity<EquipmentResponse> create(@Valid @RequestBody EquipmentSaveRequest request) {
        EquipmentResponse response = equipmentService.createEquipment(request);
        return ResponseEntity.created(URI.create("/api/equipments/" + response.equipmentId())).body(response);
    }

    @PutMapping("/{equipmentId}")
    public ResponseEntity<EquipmentResponse> update(
            @PathVariable Long equipmentId,
            @Valid @RequestBody EquipmentSaveRequest request
    ) {
        return ResponseEntity.ok(equipmentService.updateEquipment(equipmentId, request));
    }

    @PatchMapping("/{equipmentId}/status")
    public ResponseEntity<EquipmentResponse> updateStatus(
            @PathVariable Long equipmentId,
            @Valid @RequestBody EquipmentStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(equipmentService.updateStatus(equipmentId, request));
    }

    @GetMapping
    public ResponseEntity<List<EquipmentResponse>> getAll(
            @RequestParam(required = false) EquipmentStatus status
    ) {
        return ResponseEntity.ok(equipmentService.getEquipments(status));
    }

    @GetMapping("/{equipmentId}")
    public ResponseEntity<EquipmentResponse> getOne(@PathVariable Long equipmentId) {
        return ResponseEntity.ok(equipmentService.getEquipmentResponse(equipmentId));
    }

    @GetMapping("/{equipmentId}/detail")
    public ResponseEntity<EquipmentDetailResponse> getDetail(@PathVariable Long equipmentId) {
        return ResponseEntity.ok(equipmentService.getEquipmentDetail(equipmentId));
    }

    @PostMapping("/{equipmentId}/assignment")
    public ResponseEntity<EquipmentAssignmentResponse> assignWorker(
            @PathVariable Long equipmentId,
            @Valid @RequestBody EquipmentAssignRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(equipmentService.assignWorker(equipmentId, request));
    }

    @DeleteMapping("/{equipmentId}/assignment")
    public ResponseEntity<Void> unassignWorker(@PathVariable Long equipmentId) {
        equipmentService.unassignWorker(equipmentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{equipmentId}/assignments")
    public ResponseEntity<List<EquipmentAssignmentResponse>> getAssignmentHistory(@PathVariable Long equipmentId) {
        return ResponseEntity.ok(equipmentService.getAssignmentHistory(equipmentId));
    }
}
