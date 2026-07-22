package com.human.linecup.service;

import com.human.linecup.dto.request.WorkOrderCreateRequest;
import com.human.linecup.dto.request.WorkOrderStatusChangeRequest;
import com.human.linecup.dto.request.WorkOrderSupervisorChangeRequest;
import com.human.linecup.dto.request.WorkOrderTargetQtyUpdateRequest;
import com.human.linecup.dto.response.EquipmentResponse;
import com.human.linecup.dto.response.ProcessProgressResponse;
import com.human.linecup.dto.response.UserResponse;
import com.human.linecup.dto.response.WorkOrderDashboardSummaryResponse;
import com.human.linecup.dto.response.WorkOrderDetailResponse;
import com.human.linecup.dto.response.WorkOrderStatusHistoryResponse;
import com.human.linecup.dto.response.WorkOrderSummaryResponse;
import com.human.linecup.entity.Equipment;
import com.human.linecup.entity.ManufacturingProcess;
import com.human.linecup.entity.Product;
import com.human.linecup.entity.ProductionProcessProgress;
import com.human.linecup.entity.User;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.entity.WorkOrderEquipment;
import com.human.linecup.entity.WorkOrderStatusHistory;
import com.human.linecup.entity.WorkOrderWorker;
import com.human.linecup.repository.EquipmentRepository;
import com.human.linecup.repository.ProductRepository;
import com.human.linecup.repository.ProductionProcessProgressRepository;
import com.human.linecup.repository.UserRepository;
import com.human.linecup.repository.WorkOrderEquipmentRepository;
import com.human.linecup.repository.WorkOrderRepository;
import com.human.linecup.repository.WorkOrderStatusHistoryRepository;
import com.human.linecup.repository.WorkOrderWorkerRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

/**
 * 작업지시(WorkOrder) 도메인 서비스.
 * dto/entity/repository는 전부 기존 것만 사용하고, 이 파일 안에서만 조합한다.
 * 시각은 Clock 주입 없이 Instant.now() / LocalDate.now()를 직접 사용한다.
 */
@Service
@Transactional(readOnly = true)
public class WorkOrderService {

    private static final DateTimeFormatter WORK_ORDER_NO_DATE = DateTimeFormatter.ofPattern("yyyyMMdd");

    private final WorkOrderRepository workOrderRepository;
    private final WorkOrderEquipmentRepository workOrderEquipmentRepository;
    private final WorkOrderWorkerRepository workOrderWorkerRepository;
    private final WorkOrderStatusHistoryRepository workOrderStatusHistoryRepository;
    private final ProductionProcessProgressRepository productionProcessProgressRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EquipmentRepository equipmentRepository;

    public WorkOrderService(
            WorkOrderRepository workOrderRepository,
            WorkOrderEquipmentRepository workOrderEquipmentRepository,
            WorkOrderWorkerRepository workOrderWorkerRepository,
            WorkOrderStatusHistoryRepository workOrderStatusHistoryRepository,
            ProductionProcessProgressRepository productionProcessProgressRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            EquipmentRepository equipmentRepository
    ) {
        this.workOrderRepository = workOrderRepository;
        this.workOrderEquipmentRepository = workOrderEquipmentRepository;
        this.workOrderWorkerRepository = workOrderWorkerRepository;
        this.workOrderStatusHistoryRepository = workOrderStatusHistoryRepository;
        this.productionProcessProgressRepository = productionProcessProgressRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.equipmentRepository = equipmentRepository;
    }

    // ===== 등록 =====

    @Transactional
    public WorkOrderSummaryResponse create(WorkOrderCreateRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "제품을 찾을 수 없습니다. (productId=" + request.productId() + ")"));
        User supervisor = userRepository.findById(request.supervisorUserId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "지시자를 찾을 수 없습니다. (supervisorUserId=" + request.supervisorUserId() + ")"));

        String workOrderNo = generateWorkOrderNo(request.plannedStartDate());
        WorkOrder workOrder = WorkOrder.create(
                workOrderNo,
                product,
                supervisor,
                request.targetQty(),
                request.hourlyTargetQty(),
                request.plannedStartDate(),
                request.remarks()
        );

        try {
            workOrder = workOrderRepository.saveAndFlush(workOrder);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException(
                    "이미 사용 중인 작업지시 번호입니다. (workOrderNo=" + workOrderNo + ")", e);
        }

        Instant now = Instant.now();
        workOrderStatusHistoryRepository.save(WorkOrderStatusHistory.record(
                workOrder, supervisor, WorkOrder.Action.REGISTERED, null, WorkOrder.Status.PENDING,
                "작업지시 등록", now
        ));

        assignWorkers(workOrder, request.workerUserIds());
        assignEquipments(workOrder, request.equipmentIds());

        return toSummary(workOrder);
    }

    private String generateWorkOrderNo(LocalDate plannedStartDate) {
        String prefix = "WO-" + plannedStartDate.format(WORK_ORDER_NO_DATE) + "-";
        int nextSequence = workOrderRepository.findTopByWorkOrderNoStartingWithOrderByWorkOrderNoDesc(prefix)
                .map(existing -> extractSequence(existing.getWorkOrderNo(), prefix) + 1)
                .orElse(1);
        return prefix + String.format("%03d", nextSequence);
    }

    private static int extractSequence(String workOrderNo, String prefix) {
        return Integer.parseInt(workOrderNo.substring(prefix.length()));
    }

    private void assignWorkers(WorkOrder workOrder, List<Long> workerUserIds) {
        for (Long userId : new LinkedHashSet<>(workerUserIds)) {
            User worker = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "작업자를 찾을 수 없습니다. (userId=" + userId + ")"));
            workOrderWorkerRepository.save(WorkOrderWorker.create(workOrder, worker));
        }
    }

    private void assignEquipments(WorkOrder workOrder, List<Long> equipmentIds) {
        List<Equipment> equipments = equipmentIds.isEmpty()
                ? equipmentRepository.findAll()
                : resolveEquipments(equipmentIds);
        for (Equipment equipment : equipments) {
            workOrderEquipmentRepository.save(WorkOrderEquipment.create(workOrder, equipment));
        }
    }

    private List<Equipment> resolveEquipments(List<Long> equipmentIds) {
        List<Equipment> equipments = new ArrayList<>();
        for (Long equipmentId : new LinkedHashSet<>(equipmentIds)) {
            equipments.add(equipmentRepository.findById(equipmentId)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "설비를 찾을 수 없습니다. (equipmentId=" + equipmentId + ")")));
        }
        return equipments;
    }

    // ===== 목록/상세 조회 =====

    public Page<WorkOrderSummaryResponse> search(WorkOrder.Status status, String keyword, Pageable pageable) {
        Pageable effectivePageable = pageable.getSort().isSorted()
                ? pageable
                : PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                        Sort.by(Sort.Direction.DESC, "registeredAt"));

        Specification<WorkOrder> spec = fetchDetailsSpecification().and(filterSpecification(status, keyword));
        return workOrderRepository.findAll(spec, effectivePageable).map(this::toSummary);
    }

    private static Specification<WorkOrder> filterSpecification(WorkOrder.Status status, String keyword) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("workOrderNo")), pattern),
                        cb.like(cb.lower(root.join("product").get("productName")), pattern)
                ));
            }
            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    // product/supervisor를 목록 조회 시 함께 로딩해 N+1을 막는다.
    // count 쿼리에는 fetch를 적용하면 안 되므로 결과 타입을 보고 건너뛴다.
    private static Specification<WorkOrder> fetchDetailsSpecification() {
        return (root, query, cb) -> {
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("product", JoinType.LEFT);
                root.fetch("supervisor", JoinType.LEFT);
            }
            return cb.conjunction();
        };
    }

    public WorkOrderDetailResponse getDetail(Long workOrderId) {
        WorkOrder workOrder = getWorkOrderOrThrow(workOrderId);

        List<UserResponse> workers = workOrderWorkerRepository.findByWorkOrder_WorkOrderId(workOrderId).stream()
                .map(WorkOrderWorker::getUser)
                .map(this::toUserResponse)
                .toList();

        List<EquipmentResponse> equipments = workOrderEquipmentRepository.findByWorkOrder_WorkOrderId(workOrderId)
                .stream()
                .map(WorkOrderEquipment::getEquipment)
                .map(this::toEquipmentResponse)
                .toList();

        List<ProcessProgressResponse> processes = productionProcessProgressRepository
                .findByProductionLotWorkOrderWorkOrderIdOrderByManufacturingProcessSequenceAsc(workOrderId)
                .stream()
                .map(this::toProcessResponse)
                .toList();

        List<WorkOrderStatusHistoryResponse> statusHistories = workOrderStatusHistoryRepository
                .findByWorkOrder_WorkOrderIdOrderByChangedAtDesc(workOrderId)
                .stream()
                .map(this::toHistoryResponse)
                .toList();

        return new WorkOrderDetailResponse(
                toSummary(workOrder),
                workOrder.getProduct().getUnit(),
                workOrder.getRemarks(),
                workers,
                equipments,
                processes,
                statusHistories
        );
    }

    private WorkOrder getWorkOrderOrThrow(Long workOrderId) {
        return workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "작업지시를 찾을 수 없습니다. (workOrderId=" + workOrderId + ")"));
    }

    // ===== 상태 변경 / 수정 =====

    @Transactional
    public WorkOrderSummaryResponse changeStatus(Long workOrderId, WorkOrderStatusChangeRequest request) {
        WorkOrder workOrder = getWorkOrderOrThrow(workOrderId);
        User changedBy = userRepository.findById(request.changedByUserId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "처리자를 찾을 수 없습니다. (userId=" + request.changedByUserId() + ")"));

        Instant now = Instant.now();
        WorkOrder.Status prevStatus = workOrder.applyAction(request.action(), now);

        workOrderStatusHistoryRepository.save(WorkOrderStatusHistory.record(
                workOrder, changedBy, request.action(), prevStatus, workOrder.getStatus(), request.note(), now
        ));

        return toSummary(workOrder);
    }

    @Transactional
    public WorkOrderSummaryResponse changeTargetQuantities(Long workOrderId, WorkOrderTargetQtyUpdateRequest request) {
        WorkOrder workOrder = getWorkOrderOrThrow(workOrderId);
        workOrder.changeTargetQuantities(request.targetQty(), request.hourlyTargetQty());
        return toSummary(workOrder);
    }

    @Transactional
    public WorkOrderSummaryResponse changeSupervisor(Long workOrderId, WorkOrderSupervisorChangeRequest request) {
        WorkOrder workOrder = getWorkOrderOrThrow(workOrderId);
        User supervisor = userRepository.findById(request.supervisorUserId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "지시자를 찾을 수 없습니다. (supervisorUserId=" + request.supervisorUserId() + ")"));
        workOrder.changeSupervisor(supervisor);
        return toSummary(workOrder);
    }

    // 생산 실적 집계(다른 도메인)에서 작업지시 합계를 갱신할 때 호출한다.
    @Transactional
    public WorkOrderSummaryResponse updateQuantities(Long workOrderId, int currentQty, int goodQty, int defectQty) {
        WorkOrder workOrder = getWorkOrderOrThrow(workOrderId);
        workOrder.updateQuantities(currentQty, goodQty, defectQty);
        return toSummary(workOrder);
    }

    // ===== 작업자 배정 =====

    @Transactional
    public UserResponse addWorker(Long workOrderId, Long userId) {
        WorkOrder workOrder = getWorkOrderOrThrow(workOrderId);
        if (workOrderWorkerRepository.existsByWorkOrder_WorkOrderIdAndUser_UserId(workOrderId, userId)) {
            throw new IllegalStateException("이미 배정된 작업자입니다. (userId=" + userId + ")");
        }
        User worker = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "작업자를 찾을 수 없습니다. (userId=" + userId + ")"));
        workOrderWorkerRepository.save(WorkOrderWorker.create(workOrder, worker));
        return toUserResponse(worker);
    }

    @Transactional
    public void removeWorker(Long workOrderId, Long userId) {
        if (!workOrderWorkerRepository.existsByWorkOrder_WorkOrderIdAndUser_UserId(workOrderId, userId)) {
            throw new EntityNotFoundException(
                    "작업지시(" + workOrderId + ")에 배정되지 않은 작업자입니다. (userId=" + userId + ")");
        }
        workOrderWorkerRepository.deleteByWorkOrder_WorkOrderIdAndUser_UserId(workOrderId, userId);
    }

    public List<UserResponse> getWorkers(Long workOrderId) {
        getWorkOrderOrThrow(workOrderId);
        return workOrderWorkerRepository.findByWorkOrder_WorkOrderId(workOrderId).stream()
                .map(WorkOrderWorker::getUser)
                .map(this::toUserResponse)
                .toList();
    }

    // 작업자별 담당 작업 확인용 (특정 작업자가 배정된 작업지시 전체 조회)
    public List<WorkOrderSummaryResponse> getWorkOrdersByWorker(Long userId) {
        return workOrderWorkerRepository.findByUser_UserId(userId).stream()
                .map(WorkOrderWorker::getWorkOrder)
                .map(this::toSummary)
                .toList();
    }

    // ===== 대시보드 요약 =====

    public WorkOrderDashboardSummaryResponse getDashboardSummary() {
        long total = workOrderRepository.count();
        long pending = workOrderRepository.countByStatus(WorkOrder.Status.PENDING);
        long inProgress = workOrderRepository.countByStatus(WorkOrder.Status.IN_PROGRESS);
        long hold = workOrderRepository.countByStatus(WorkOrder.Status.HOLD);
        long done = workOrderRepository.countByStatus(WorkOrder.Status.DONE);

        double averageProgressRate = total == 0
                ? 0.0
                : Math.round(workOrderRepository.findAll().stream()
                        .mapToDouble(WorkOrder::getProgressRate)
                        .average()
                        .orElse(0.0) * 10) / 10.0;

        return new WorkOrderDashboardSummaryResponse(total, pending, inProgress, hold, done, averageProgressRate);
    }

    // ===== 응답 DTO 매핑 =====

    private WorkOrderSummaryResponse toSummary(WorkOrder workOrder) {
        Product product = workOrder.getProduct();
        User supervisor = workOrder.getSupervisor();
        return new WorkOrderSummaryResponse(
                workOrder.getWorkOrderId(),
                workOrder.getWorkOrderNo(),
                product.getProductId(),
                product.getProductCode(),
                product.getProductName(),
                workOrder.getStatus(),
                workOrder.getStatus().getLabel(),
                workOrder.getTargetQty(),
                workOrder.getHourlyTargetQty(),
                workOrder.getCurrentQty(),
                workOrder.getGoodQty(),
                workOrder.getDefectQty(),
                workOrder.getProgressRate(),
                workOrder.getPlannedStartDate(),
                workOrder.getStartedAt(),
                workOrder.getCompletedAt(),
                workOrder.getRegisteredAt(),
                supervisor.getUserId(),
                supervisor.getEmpNo(),
                supervisor.getName()
        );
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getEmpNo(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getRole().getLabel(),
                user.getApprovalStatus(),
                user.getApprovalStatus().getLabel(),
                user.isActive(),
                user.getCreatedAt(),
                user.getLastAccessAt()
        );
    }

    private EquipmentResponse toEquipmentResponse(Equipment equipment) {
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
                null,  // currentUserId - 설비 담당자 배정은 다른 도메인(EquipmentAssignment) 소관
                null   // currentUserName
        );
    }

    private ProcessProgressResponse toProcessResponse(ProductionProcessProgress progress) {
        ManufacturingProcess process = progress.getManufacturingProcess();
        Equipment equipment = progress.getEquipment();
        return new ProcessProgressResponse(
                progress.getProcessProgressId(),
                process.getProcessId(),
                process.getProcessCode(),
                process.getProcessName(),
                equipment == null ? null : equipment.getEquipmentId(),
                equipment == null ? null : equipment.getEquipmentCode(),
                equipment == null ? null : equipment.getEquipmentName(),
                progress.getStatus(),
                progress.getStatus().getLabel(),
                progress.getTargetQty(),
                progress.getProductionQty(),
                progress.getGoodQty(),
                progress.getDefectQty(),
                progress.getStartedAt(),
                progress.getCompletedAt()
        );
    }

    private WorkOrderStatusHistoryResponse toHistoryResponse(WorkOrderStatusHistory history) {
        User changedBy = history.getChangedBy();
        return new WorkOrderStatusHistoryResponse(
                history.getHistoryId(),
                history.getAction(),
                history.getPrevStatus(),
                history.getNewStatus(),
                history.getNewStatus().getLabel(),
                changedBy.getUserId(),
                changedBy.getEmpNo(),
                changedBy.getName(),
                history.getNote(),
                history.getChangedAt()
        );
    }
}