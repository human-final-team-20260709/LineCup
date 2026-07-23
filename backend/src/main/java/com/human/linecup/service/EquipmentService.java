package com.human.linecup.service;

import com.human.linecup.dto.request.EquipmentAssignRequest;
import com.human.linecup.dto.request.EquipmentSaveRequest;
import com.human.linecup.dto.request.EquipmentStatusUpdateRequest;
import com.human.linecup.dto.response.EquipmentAssignmentResponse;
import com.human.linecup.dto.response.EquipmentDetailResponse;
import com.human.linecup.dto.response.EquipmentResponse;
import com.human.linecup.entity.Equipment;
import com.human.linecup.entity.ApprovalStatus;
import com.human.linecup.entity.BusinessConflictException;
import com.human.linecup.entity.Equipment.EquipmentStatus;
import com.human.linecup.entity.EquipmentAssignment;
import com.human.linecup.entity.ManufacturingProcess;
import com.human.linecup.entity.User;
import com.human.linecup.entity.UserRole;
import com.human.linecup.repository.EquipmentAssignmentRepository;
import com.human.linecup.repository.EquipmentRepository;
import com.human.linecup.repository.ManufacturingProcessRepository;
import com.human.linecup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 설비 마스터 관리, 가동 상태 전환, 작업자 배정을 담당한다.
 * 텔레메트리·통신 상태는 각각 EquipmentTelemetryService / L1DeviceService의 책임이며,
 * 상세 조회에서만 조합한다(단일 책임 원칙 유지, 조회 성능을 위한 조합은 이 계층에서 수행).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final ManufacturingProcessRepository manufacturingProcessRepository;
    private final EquipmentAssignmentRepository equipmentAssignmentRepository;
    private final UserRepository userRepository;
    private final EquipmentTelemetryService equipmentTelemetryService;

    @Transactional
    public EquipmentResponse createEquipment(EquipmentSaveRequest request) {
        if (equipmentRepository.existsByEquipmentCode(request.equipmentCode())) {
            throw new BusinessConflictException("이미 존재하는 설비 코드입니다: " + request.equipmentCode());
        }
        if (equipmentRepository.existsByEquipmentName(request.equipmentName())) {
            throw new BusinessConflictException("이미 존재하는 설비명입니다: " + request.equipmentName());
        }

        ManufacturingProcess process = getProcess(request.processId());
        Equipment equipment = Equipment.create(
                request.equipmentName(),
                request.equipmentCode(),
                process,
                request.location(),
                request.status()
        );
        equipmentRepository.save(equipment);
        return toResponse(equipment, null);
    }

    @Transactional
    public EquipmentResponse updateEquipment(Long equipmentId, EquipmentSaveRequest request) {
        Equipment equipment = getEquipment(equipmentId);

        if (!equipment.getEquipmentCode().equals(request.equipmentCode())
                && equipmentRepository.existsByEquipmentCode(request.equipmentCode())) {
            throw new BusinessConflictException("이미 존재하는 설비 코드입니다: " + request.equipmentCode());
        }
        if (!equipment.getEquipmentName().equals(request.equipmentName())
                && equipmentRepository.existsByEquipmentName(request.equipmentName())) {
            throw new BusinessConflictException("이미 존재하는 설비명입니다: " + request.equipmentName());
        }

        ManufacturingProcess process = getProcess(request.processId());
        equipment.changeInfo(request.equipmentName(), request.equipmentCode(), process, request.location());
        if (request.status() != null) {
            equipment.changeStatus(request.status());
        }
        return toResponse(equipment, findActiveAssignment(equipmentId).orElse(null));
    }

    @Transactional
    public EquipmentResponse updateStatus(Long equipmentId, EquipmentStatusUpdateRequest request) {
        Equipment equipment = getEquipment(equipmentId);
        equipment.changeStatus(request.status());
        return toResponse(equipment, findActiveAssignment(equipmentId).orElse(null));
    }

    public EquipmentResponse getEquipmentResponse(Long equipmentId) {
        Equipment equipment = getEquipment(equipmentId);
        return toResponse(equipment, findActiveAssignment(equipmentId).orElse(null));
    }

    public EquipmentDetailResponse getEquipmentDetail(Long equipmentId) {
        EquipmentResponse response = getEquipmentResponse(equipmentId);
        return new EquipmentDetailResponse(response, equipmentTelemetryService.getLatestByEquipment(equipmentId));
    }

    public List<EquipmentResponse> getEquipments(EquipmentStatus status) {
        List<Equipment> equipments = status == null
                ? equipmentRepository.findAll()
                : equipmentRepository.findAllByStatus(status);

        // 목록 조회 1회당 활성 배정을 한 번만 조회해 설비 수(N)만큼 쿼리가 나가는 것을 막는다.
        Map<Long, EquipmentAssignment> activeAssignmentByEquipmentId = equipmentAssignmentRepository
                .findAllByEndedAtIsNull()
                .stream()
                .collect(Collectors.toMap(
                        a -> a.getEquipment().getEquipmentId(),
                        Function.identity()
                ));

        return equipments.stream()
                .map(equipment -> toResponse(
                        equipment,
                        activeAssignmentByEquipmentId.get(equipment.getEquipmentId())
                ))
                .toList();
    }

    /**
     * 작업자를 설비에 배정한다. 같은 설비에 이미 활성 배정이 있으면 교대(handover)로 간주해
     * 기존 배정을 종료하고 새 배정을 시작한다 — 실제 생산 현장에서 설비 1대는 특정 시점에
     * 1명의 작업자만 조작한다는 물리적 제약을 반영한 설계다.
     */
    @Transactional
    public EquipmentAssignmentResponse assignWorker(Long equipmentId, EquipmentAssignRequest request) {
        Equipment equipment = getEquipmentForUpdate(equipmentId);
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다: " + request.userId()));
        if (user.getApprovalStatus() != ApprovalStatus.APPROVED
                || !user.isActive()
                || user.getRole() != UserRole.OPERATOR) {
            throw new BusinessConflictException("승인된 활성 작업자만 설비에 배정할 수 있습니다.");
        }

        Instant now = Instant.now();
        findActiveAssignment(equipmentId).ifPresent(current -> current.end(now));

        EquipmentAssignment assignment = EquipmentAssignment.assign(user, equipment, now);
        equipmentAssignmentRepository.save(assignment);
        return toAssignmentResponse(assignment);
    }

    @Transactional
    public void unassignWorker(Long equipmentId) {
        getEquipmentForUpdate(equipmentId);
        EquipmentAssignment assignment = findActiveAssignment(equipmentId)
                .orElseThrow(() -> new BusinessConflictException(
                        "현재 배정된 작업자가 없습니다. equipmentId=" + equipmentId
                ));
        assignment.end(Instant.now());
    }

    public List<EquipmentAssignmentResponse> getAssignmentHistory(Long equipmentId) {
        return equipmentAssignmentRepository.findByEquipmentEquipmentIdOrderByStartedAtDesc(equipmentId)
                .stream()
                .map(this::toAssignmentResponse)
                .toList();
    }

    private Equipment getEquipment(Long equipmentId) {
        return equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 설비입니다: " + equipmentId));
    }

    private Equipment getEquipmentForUpdate(Long equipmentId) {
        return equipmentRepository.findByIdForUpdate(equipmentId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 설비입니다: " + equipmentId));
    }

    private ManufacturingProcess getProcess(Long processId) {
        return manufacturingProcessRepository.findById(processId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 공정입니다: " + processId));
    }

    private Optional<EquipmentAssignment> findActiveAssignment(Long equipmentId) {
        return equipmentAssignmentRepository
                .findByEquipmentEquipmentIdAndEndedAtIsNullOrderByStartedAtDesc(equipmentId)
                .stream()
                .findFirst();
    }

    private EquipmentResponse toResponse(Equipment equipment, EquipmentAssignment activeAssignment) {
        ManufacturingProcess process = equipment.getManufacturingProcess();
        return new EquipmentResponse(
                equipment.getEquipmentId(),
                equipment.getEquipmentCode(),
                equipment.getEquipmentName(),
                process.getProcessId(),
                process.getProcessCode(),
                process.getProcessName(),
                equipment.getLocation(),
                equipment.getStatus(),
                equipment.getStatus().getLabel(),
                activeAssignment == null ? null : activeAssignment.getUser().getUserId(),
                activeAssignment == null ? null : activeAssignment.getUser().getName()
        );
    }

    private EquipmentAssignmentResponse toAssignmentResponse(EquipmentAssignment assignment) {
        return new EquipmentAssignmentResponse(
                assignment.getEquipmentAssignmentId(),
                assignment.getUser().getUserId(),
                assignment.getUser().getEmpNo(),
                assignment.getUser().getName(),
                assignment.getEquipment().getEquipmentId(),
                assignment.getEquipment().getEquipmentCode(),
                assignment.getStartedAt(),
                assignment.getEndedAt(),
                assignment.isActive()
        );
    }
}
