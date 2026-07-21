package com.human.linecup.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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
import com.human.linecup.entity.Equipment;
import com.human.linecup.entity.Product;
import com.human.linecup.entity.User;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.entity.WorkOrderEquipment;
import com.human.linecup.entity.WorkOrderStatusHistory;
import com.human.linecup.entity.WorkOrderWorker;
import com.human.linecup.repository.EquipmentRepository;
import com.human.linecup.repository.ProductRepository;
import com.human.linecup.repository.UserRepository;
import com.human.linecup.repository.WorkOrderEquipmentRepository;
import com.human.linecup.repository.WorkOrderRepository;
import com.human.linecup.repository.WorkOrderStatusHistoryRepository;
import com.human.linecup.repository.WorkOrderWorkerRepository;

import lombok.RequiredArgsConstructor;

/**
 * 작업지시 서비스.
 *
 * 원래 작업자 배정 / 설비 매핑 / 드롭다운 옵션 조회를 서비스 3개로 나눴었는데,
 * 다 "작업지시 하나"를 중심으로 도는 기능이라 파일을 나누는 이점보다 여기저기 옮겨다니며
 * 찾아보는 비용이 더 커서 이 클래스 하나로 합쳤다. 메서드는 기능 단위로 구획(주석)만 나눠뒀고,
 * 나중에 서비스가 더 커지면 그때 다시 쪼개도 된다.
 *
 * 컨트롤러에는 엔티티를 절대 넘기지 않고, 여기서 트랜잭션 안에서 DTO로 변환해서 반환한다.
 * (open-in-view=false 로 꺼뒀기 때문에, 트랜잭션 밖에서 지연 로딩 필드를 건드리면
 *  LazyInitializationException이 나므로 이 규칙을 꼭 지켜야 한다.)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final WorkOrderStatusHistoryRepository statusHistoryRepository;
    private final WorkOrderWorkerRepository workOrderWorkerRepository;
    private final WorkOrderEquipmentRepository workOrderEquipmentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EquipmentRepository equipmentRepository;

    // ──  목록 / 요약 카드 ──────────────────────────────────────────

    public Page<WorkOrderListResponse> getList(WorkOrder.Status status, String keyword, Pageable pageable) {
        return workOrderRepository.search(status, keyword, pageable).map(WorkOrderListResponse::from);
    }

    public WorkOrderSummaryResponse getSummary() {
        double avgProgress = Optional.ofNullable(workOrderRepository.averageProgressRate()).orElse(0.0);
        return WorkOrderSummaryResponse.builder()
                .totalCount(workOrderRepository.count())
                .pendingCount(workOrderRepository.countByStatus(WorkOrder.Status.PENDING))
                .inProgressCount(workOrderRepository.countByStatus(WorkOrder.Status.IN_PROGRESS))
                .holdCount(workOrderRepository.countByStatus(WorkOrder.Status.HOLD))
                .doneCount(workOrderRepository.countByStatus(WorkOrder.Status.DONE))
                .averageProgressRate(Math.round(avgProgress * 10) / 10.0)
                .build();
    }

    // ──  상세 /  이력 조회 ──────────────────────────────────────

    public WorkOrderDetailResponse getDetail(Long workOrderId) {
        return toDetailResponse(getWorkOrderOrThrow(workOrderId));
    }

    public List<WorkOrderStatusHistoryResponse> getStatusHistories(Long workOrderId) {
        ensureWorkOrderExists(workOrderId);
        return statusHistoryRepository.findByWorkOrder_WorkOrderIdOrderByChangedAtDesc(workOrderId).stream()
                .map(WorkOrderStatusHistoryResponse::from)
                .toList();
    }

    // ──  등록 ─────────────────────────────────────────────────────

    @Transactional
    public WorkOrderDetailResponse create(WorkOrderCreateRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> notFound("제품", request.getProductId()));
        User supervisor = userRepository.findById(request.getSupervisorUserId())
                .orElseThrow(() -> notFound("사용자", request.getSupervisorUserId()));

        WorkOrder workOrder = WorkOrder.builder()
                .workOrderNo(generateWorkOrderNo())
                .product(product)
                .supervisor(supervisor)
                .targetQty(request.getTargetQty())
                .plannedStartDate(request.getPlannedStartDate())
                .remarks(request.getRemarks())
                .build();
        workOrderRepository.save(workOrder);

        if (request.getWorkerUserIds() != null) {
            request.getWorkerUserIds().forEach(userId -> saveWorker(workOrder, userId));
        }
        if (request.getEquipmentIds() != null) {
            request.getEquipmentIds().forEach(equipmentId -> saveEquipmentMapping(workOrder, equipmentId));
        }

        return toDetailResponse(workOrder);
    }

    // ──  지시자 변경 /  목표 수량 수정 ──────────────────────────

    @Transactional
    public WorkOrderDetailResponse changeTargetQty(Long workOrderId, WorkOrderTargetQtyUpdateRequest request) {
        WorkOrder workOrder = getWorkOrderOrThrow(workOrderId);
        workOrder.changeTargetQty(request.getTargetQty());
        return toDetailResponse(workOrder);
    }

    @Transactional
    public WorkOrderDetailResponse changeSupervisor(Long workOrderId, WorkOrderSupervisorChangeRequest request) {
        WorkOrder workOrder = getWorkOrderOrThrow(workOrderId);
        User supervisor = userRepository.findById(request.getSupervisorUserId())
                .orElseThrow(() -> notFound("사용자", request.getSupervisorUserId()));
        workOrder.changeSupervisor(supervisor);
        return toDetailResponse(workOrder);
    }

    // ──  상태 변경 (+ 이력 자동 기록) ───────────────────────────────

    @Transactional
    public WorkOrderDetailResponse changeStatus(Long workOrderId, WorkOrderStatusChangeRequest request) {
        WorkOrder workOrder = getWorkOrderOrThrow(workOrderId);
        User actor = userRepository.findById(request.getChangedByUserId())
                .orElseThrow(() -> notFound("사용자", request.getChangedByUserId()));

        WorkOrder.Status prevStatus = workOrder.applyAction(request.getAction());

        statusHistoryRepository.save(WorkOrderStatusHistory.builder()
                .workOrder(workOrder)
                .changedBy(actor)
                .prevStatus(prevStatus)
                .newStatus(workOrder.getStatus())
                .build());

        return toDetailResponse(workOrder);
    }

    // ──  작업자 배정 ──────────────────────────────────────────────

    public List<UserResponse> getWorkers(Long workOrderId) {
        ensureWorkOrderExists(workOrderId);
        return workOrderWorkerRepository.findByWorkOrder_WorkOrderIdOrderById(workOrderId).stream()
                .map(worker -> UserResponse.from(worker.getUser()))
                .toList();
    }

    @Transactional
    public List<UserResponse> assignWorkers(Long workOrderId, List<Long> userIds) {
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> notFound("작업지시", workOrderId));

        for (Long userId : userIds) {
            if (workOrderWorkerRepository.existsByWorkOrder_WorkOrderIdAndUser_UserId(workOrderId, userId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "이미 배정된 작업자입니다. workOrderId=" + workOrderId + ", userId=" + userId);
            }
            saveWorker(workOrder, userId);
        }
        return getWorkers(workOrderId);
    }

    @Transactional
    public void unassignWorker(Long workOrderId, Long userId) {
        ensureWorkOrderExists(workOrderId);
        WorkOrderWorker worker = workOrderWorkerRepository
                .findByWorkOrder_WorkOrderIdAndUser_UserId(workOrderId, userId)
                .orElseThrow(() -> notFound("작업자 배정", userId));
        workOrderWorkerRepository.delete(worker);
    }

    // ──  설비 매핑 ───────────────────────────────────────────────

    public List<EquipmentResponse> getEquipments(Long workOrderId) {
        ensureWorkOrderExists(workOrderId);
        return workOrderEquipmentRepository.findByWorkOrder_WorkOrderIdOrderById(workOrderId).stream()
                .map(mapping -> EquipmentResponse.from(mapping.getEquipment()))
                .toList();
    }

    @Transactional
    public List<EquipmentResponse> mapEquipments(Long workOrderId, List<Long> equipmentIds) {
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> notFound("작업지시", workOrderId));

        for (Long equipmentId : equipmentIds) {
            if (workOrderEquipmentRepository.existsByWorkOrder_WorkOrderIdAndEquipment_EquipmentId(workOrderId, equipmentId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "이미 매핑된 설비입니다. workOrderId=" + workOrderId + ", equipmentId=" + equipmentId);
            }
            saveEquipmentMapping(workOrder, equipmentId);
        }
        return getEquipments(workOrderId);
    }

    @Transactional
    public void unmapEquipment(Long workOrderId, Long equipmentId) {
        ensureWorkOrderExists(workOrderId);
        WorkOrderEquipment mapping = workOrderEquipmentRepository
                .findByWorkOrder_WorkOrderIdAndEquipment_EquipmentId(workOrderId, equipmentId)
                .orElseThrow(() -> notFound("설비 매핑", equipmentId));
        workOrderEquipmentRepository.delete(mapping);
    }

    // ── 등록/배정 화면 드롭다운 옵션 조회 ─────────────────────────────

    public List<ProductOptionResponse> getProductOptions() {
        return productRepository.findAll().stream().map(ProductOptionResponse::from).toList();
    }

    public List<UserResponse> getSupervisorOptions() {
        return userRepository.findByRoleAndIsActiveTrue(User.Role.SUPERVISOR).stream()
                .map(UserResponse::from)
                .toList();
    }

    public List<UserResponse> getWorkerOptions() {
        return userRepository.findByRoleAndIsActiveTrue(User.Role.OPERATOR).stream()
                .map(UserResponse::from)
                .toList();
    }

    public List<EquipmentResponse> getEquipmentOptions() {
        return equipmentRepository.findAll().stream().map(EquipmentResponse::from).toList();
    }

    // ── 내부 헬퍼 ────────────────────────────────────────────────────

    private void saveWorker(WorkOrder workOrder, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> notFound("사용자", userId));
        workOrderWorkerRepository.save(WorkOrderWorker.builder().workOrder(workOrder).user(user).build());
    }

    private void saveEquipmentMapping(WorkOrder workOrder, Long equipmentId) {
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> notFound("설비", equipmentId));
        workOrderEquipmentRepository.save(WorkOrderEquipment.builder().workOrder(workOrder).equipment(equipment).build());
    }

    private WorkOrder getWorkOrderOrThrow(Long workOrderId) {
        return workOrderRepository.findDetailById(workOrderId)
                .orElseThrow(() -> notFound("작업지시", workOrderId));
    }

    private void ensureWorkOrderExists(Long workOrderId) {
        if (!workOrderRepository.existsById(workOrderId)) {
            throw notFound("작업지시", workOrderId);
        }
    }

    private WorkOrderDetailResponse toDetailResponse(WorkOrder workOrder) {
        List<UserResponse> workers = workOrderWorkerRepository
                .findByWorkOrder_WorkOrderIdOrderById(workOrder.getWorkOrderId()).stream()
                .map(worker -> UserResponse.from(worker.getUser()))
                .toList();

        List<EquipmentResponse> equipments = workOrderEquipmentRepository
                .findByWorkOrder_WorkOrderIdOrderById(workOrder.getWorkOrderId()).stream()
                .map(mapping -> EquipmentResponse.from(mapping.getEquipment()))
                .toList();

        List<WorkOrderStatusHistoryResponse> histories = statusHistoryRepository
                .findByWorkOrder_WorkOrderIdOrderByChangedAtDesc(workOrder.getWorkOrderId()).stream()
                .map(WorkOrderStatusHistoryResponse::from)
                .toList();

        return WorkOrderDetailResponse.of(workOrder, workers, equipments, histories);
    }

    /** WO-yyyyMMdd-### 형태로 당일 순번을 이어서 채번 */
    private String generateWorkOrderNo() {
        String prefix = "WO-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-";
        String maxNo = workOrderRepository.findMaxWorkOrderNoByPrefix(prefix).orElse(null);
        int nextSequence = (maxNo == null) ? 1 : Integer.parseInt(maxNo.substring(prefix.length())) + 1;
        return prefix + String.format("%03d", nextSequence);
    }

    /** 404 응답용 ResponseStatusException을 만들어서 돌려준다 (직접 던지지 않음 — orElseThrow에 바로 꽂아 쓰기 위함) */
    private ResponseStatusException notFound(String entityName, Long id) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, entityName + "를 찾을 수 없습니다. id=" + id);
    }
}
