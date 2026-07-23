package com.human.linecup.service;

import com.human.linecup.dto.request.WorkOrderCreateRequest;
import com.human.linecup.dto.request.IdListRequest;
import com.human.linecup.dto.request.WorkOrderStatusChangeRequest;
import com.human.linecup.dto.request.WorkOrderSupervisorChangeRequest;
import com.human.linecup.dto.request.WorkOrderTargetQtyUpdateRequest;
import com.human.linecup.dto.response.EquipmentResponse;
import com.human.linecup.dto.response.ProcessProgressResponse;
import com.human.linecup.dto.response.L2ActiveWorkOrderResponse;
import com.human.linecup.dto.response.UserResponse;
import com.human.linecup.dto.response.WorkOrderDashboardSummaryResponse;
import com.human.linecup.dto.response.WorkOrderDetailResponse;
import com.human.linecup.dto.response.WorkOrderStatusHistoryResponse;
import com.human.linecup.dto.response.WorkOrderSummaryResponse;
import com.human.linecup.entity.Equipment;
import com.human.linecup.entity.ApprovalStatus;
import com.human.linecup.entity.BusinessConflictException;
import com.human.linecup.entity.ManufacturingProcess;
import com.human.linecup.entity.Product;
import com.human.linecup.entity.ProductionProcessProgress;
import com.human.linecup.entity.User;
import com.human.linecup.entity.UserRole;
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
import java.util.EnumSet;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

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
    private final ProductionLotService productionLotService;

    public WorkOrderService(
            WorkOrderRepository workOrderRepository,
            WorkOrderEquipmentRepository workOrderEquipmentRepository,
            WorkOrderWorkerRepository workOrderWorkerRepository,
            WorkOrderStatusHistoryRepository workOrderStatusHistoryRepository,
            ProductionProcessProgressRepository productionProcessProgressRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            EquipmentRepository equipmentRepository,
            ProductionLotService productionLotService
    ) {
        this.workOrderRepository = workOrderRepository;
        this.workOrderEquipmentRepository = workOrderEquipmentRepository;
        this.workOrderWorkerRepository = workOrderWorkerRepository;
        this.workOrderStatusHistoryRepository = workOrderStatusHistoryRepository;
        this.productionProcessProgressRepository = productionProcessProgressRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.equipmentRepository = equipmentRepository;
        this.productionLotService = productionLotService;
    }

    // ===== 등록 =====

    @Transactional
    public WorkOrderSummaryResponse create(WorkOrderCreateRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new NoSuchElementException(
                        "제품을 찾을 수 없습니다. (productId=" + request.productId() + ")"));
        User supervisor = userRepository.findById(request.supervisorUserId())
                .orElseThrow(() -> new NoSuchElementException(
                        "지시자를 찾을 수 없습니다. (supervisorUserId=" + request.supervisorUserId() + ")"));
        requireAssignableUser(supervisor, UserRole.SUPERVISOR, "지시자");

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
            throw new BusinessConflictException(
                    "이미 사용 중인 작업지시 번호입니다. (workOrderNo=" + workOrderNo + ")", e);
        }

        Instant now = Instant.now();
        workOrderStatusHistoryRepository.save(WorkOrderStatusHistory.record(
                workOrder, supervisor, WorkOrder.Action.REGISTERED, null, WorkOrder.Status.PENDING,
                "작업지시 등록", now
        ));

        assignWorkers(workOrder, request.workerUserIds());
        assignEquipments(workOrder, request.equipmentIds());
        productionLotService.createPendingForWorkOrder(workOrder);

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
                    .orElseThrow(() -> new NoSuchElementException(
                            "작업자를 찾을 수 없습니다. (userId=" + userId + ")"));
            requireAssignableUser(worker, UserRole.OPERATOR, "작업자");
            workOrderWorkerRepository.save(WorkOrderWorker.create(workOrder, worker));
        }
    }

    private void assignEquipments(WorkOrder workOrder, List<Long> equipmentIds) {
        List<Equipment> equipments = equipmentIds.isEmpty()
                ? resolveDefaultL2Equipments()
                : resolveEquipments(equipmentIds);
        for (Equipment equipment : equipments) {
            workOrderEquipmentRepository.save(WorkOrderEquipment.create(workOrder, equipment));
        }
    }

    private List<Equipment> resolveDefaultL2Equipments() {
        Map<String, Equipment> equipmentByCode = equipmentRepository
                .findAllByEquipmentCodeIn(L2EquipmentCatalog.EQUIPMENT_CODES)
                .stream()
                .collect(Collectors.toMap(Equipment::getEquipmentCode, Function.identity()));
        List<String> missingCodes = L2EquipmentCatalog.EQUIPMENT_CODES.stream()
                .filter(code -> !equipmentByCode.containsKey(code))
                .toList();
        if (!missingCodes.isEmpty()) {
            throw new IllegalStateException("C 연동 설비 기준 정보가 누락되었습니다: " + missingCodes);
        }
        return L2EquipmentCatalog.EQUIPMENT_CODES.stream()
                .map(equipmentByCode::get)
                .toList();
    }

    private List<Equipment> resolveEquipments(List<Long> equipmentIds) {
        List<Equipment> equipments = new ArrayList<>();
        for (Long equipmentId : new LinkedHashSet<>(equipmentIds)) {
            equipments.add(equipmentRepository.findById(equipmentId)
                    .orElseThrow(() -> new NoSuchElementException(
                            "설비를 찾을 수 없습니다. (equipmentId=" + equipmentId + ")")));
        }
        return equipments;
    }

    // ===== 목록/상세 조회 =====

    public Page<WorkOrderSummaryResponse> search(WorkOrder.Status status, String keyword, Pageable pageable) {
        Pageable effectivePageable = pageable.getSort().isSorted()
                ? pageable
                : PageRequest.of(
                        pageable.getPageNumber(),
                        pageable.getPageSize(),
                        Sort.by(
                                Sort.Order.desc("registeredAt"),
                                Sort.Order.desc("workOrderId")
                        )
                );

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
                .orElseThrow(() -> new NoSuchElementException(
                        "작업지시를 찾을 수 없습니다. (workOrderId=" + workOrderId + ")"));
    }

    // ===== 상태 변경 / 수정 =====

    @Transactional
    public synchronized WorkOrderSummaryResponse changeStatus(
            Long workOrderId,
            WorkOrderStatusChangeRequest request
    ) {
        WorkOrder workOrder = getWorkOrderOrThrow(workOrderId);
        User changedBy = userRepository.findById(request.changedByUserId())
                .orElseThrow(() -> new NoSuchElementException(
                        "처리자를 찾을 수 없습니다. (userId=" + request.changedByUserId() + ")"));
        requireApprovedActiveUser(changedBy, "처리자");

        Instant now = Instant.now();
        validateSingleActiveWorkOrder(workOrderId, request.action());
        WorkOrder.Status prevStatus = workOrder.applyAction(request.action(), now);
        productionLotService.applyWorkOrderAction(workOrderId, request.action(), now);

        workOrderStatusHistoryRepository.save(WorkOrderStatusHistory.record(
                workOrder, changedBy, request.action(), prevStatus, workOrder.getStatus(), request.note(), now
        ));

        return toSummary(workOrder);
    }

    public Optional<L2ActiveWorkOrderResponse> getActiveWorkOrderForL2(String collectorCode) {
        if (collectorCode == null || collectorCode.isBlank()) {
            throw new IllegalArgumentException("L2 수집기 코드는 필수입니다.");
        }

        List<WorkOrder> activeOrders = workOrderRepository.findByStatusInOrderByRegisteredAtAsc(
                EnumSet.of(WorkOrder.Status.IN_PROGRESS, WorkOrder.Status.HOLD)
        );
        if (activeOrders.size() > 1) {
            throw new IllegalStateException("동시에 둘 이상의 활성 작업지시가 존재합니다.");
        }
        if (activeOrders.isEmpty()) {
            return Optional.empty();
        }

        WorkOrder workOrder = activeOrders.get(0);
        Long productionLotId = productionLotService
                .getActiveProductionLot(workOrder.getWorkOrderId())
                .getProductionLotId();
        List<String> mappedCodes = workOrderEquipmentRepository
                .findByWorkOrder_WorkOrderId(workOrder.getWorkOrderId())
                .stream()
                .map(mapping -> mapping.getEquipment().getEquipmentCode())
                .filter(L2EquipmentCatalog.EQUIPMENT_CODES::contains)
                .distinct()
                .toList();
        List<String> equipmentCodes = mappedCodes.isEmpty()
                ? L2EquipmentCatalog.EQUIPMENT_CODES
                : L2EquipmentCatalog.EQUIPMENT_CODES.stream().filter(mappedCodes::contains).toList();

        return Optional.of(new L2ActiveWorkOrderResponse(
                workOrder.getWorkOrderId(),
                productionLotId,
                workOrder.getStatus(),
                workOrder.getTargetQty(),
                workOrder.getCurrentQty(),
                workOrder.getHourlyTargetQty(),
                equipmentCodes
        ));
    }

    private void validateSingleActiveWorkOrder(Long workOrderId, WorkOrder.Action action) {
        if (action != WorkOrder.Action.START && action != WorkOrder.Action.RESUME) {
            return;
        }
        boolean anotherActiveOrderExists = workOrderRepository
                .findByStatusInOrderByRegisteredAtAsc(
                        EnumSet.of(WorkOrder.Status.IN_PROGRESS, WorkOrder.Status.HOLD)
                )
                .stream()
                .anyMatch(order -> !order.getWorkOrderId().equals(workOrderId));
        if (anotherActiveOrderExists) {
            throw new BusinessConflictException("이미 진행 중이거나 보류된 작업지시가 있습니다.");
        }
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
                .orElseThrow(() -> new NoSuchElementException(
                        "지시자를 찾을 수 없습니다. (supervisorUserId=" + request.supervisorUserId() + ")"));
        requireAssignableUser(supervisor, UserRole.SUPERVISOR, "지시자");
        workOrder.changeSupervisor(supervisor);
        return toSummary(workOrder);
    }

    // ===== 작업자 배정 =====

    @Transactional
    public UserResponse addWorker(Long workOrderId, Long userId) {
        WorkOrder workOrder = getWorkOrderOrThrow(workOrderId);
        if (workOrderWorkerRepository.existsByWorkOrder_WorkOrderIdAndUser_UserId(workOrderId, userId)) {
            throw new BusinessConflictException("이미 배정된 작업자입니다. (userId=" + userId + ")");
        }
        User worker = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException(
                        "작업자를 찾을 수 없습니다. (userId=" + userId + ")"));
        requireAssignableUser(worker, UserRole.OPERATOR, "작업자");
        workOrderWorkerRepository.save(WorkOrderWorker.create(workOrder, worker));
        return toUserResponse(worker);
    }

    @Transactional
    public void removeWorker(Long workOrderId, Long userId) {
        if (!workOrderWorkerRepository.existsByWorkOrder_WorkOrderIdAndUser_UserId(workOrderId, userId)) {
            throw new NoSuchElementException(
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

    @Transactional
    public List<UserResponse> replaceWorkers(Long workOrderId, IdListRequest request) {
        WorkOrder workOrder = getWorkOrderOrThrow(workOrderId);
        workOrderWorkerRepository.deleteByWorkOrder_WorkOrderId(workOrderId);
        workOrderWorkerRepository.flush();
        assignWorkers(workOrder, request.ids());
        return getWorkers(workOrderId);
    }

    @Transactional
    public List<EquipmentResponse> replaceEquipments(Long workOrderId, IdListRequest request) {
        WorkOrder workOrder = getWorkOrderOrThrow(workOrderId);
        if (workOrder.getStatus() != WorkOrder.Status.PENDING) {
            throw new BusinessConflictException("대기 중인 작업지시의 설비만 변경할 수 있습니다.");
        }
        workOrderEquipmentRepository.deleteByWorkOrder_WorkOrderId(workOrderId);
        workOrderEquipmentRepository.flush();
        assignEquipments(workOrder, request == null ? List.of() : request.ids());
        return workOrderEquipmentRepository.findByWorkOrder_WorkOrderId(workOrderId)
                .stream()
                .map(WorkOrderEquipment::getEquipment)
                .map(this::toEquipmentResponse)
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

        List<WorkOrder> activeOrders = workOrderRepository.findByStatusInOrderByRegisteredAtAsc(
                EnumSet.of(WorkOrder.Status.IN_PROGRESS, WorkOrder.Status.HOLD)
        );
        double averageProgressRate = activeOrders.isEmpty()
                ? 0.0
                : Math.round(activeOrders.stream()
                        .mapToDouble(WorkOrder::getProgressRate)
                        .average()
                        .orElse(0.0) * 10) / 10.0;

        return new WorkOrderDashboardSummaryResponse(total, pending, inProgress, hold, done, averageProgressRate);
    }

    private void requireAssignableUser(User user, UserRole requiredRole, String roleName) {
        requireApprovedActiveUser(user, roleName);
        if (user.getRole() != requiredRole) {
            throw new BusinessConflictException(
                    roleName + " 역할의 사용자만 배정할 수 있습니다. (userId=" + user.getUserId() + ")"
            );
        }
    }

    private void requireApprovedActiveUser(User user, String roleName) {
        if (user.getApprovalStatus() != ApprovalStatus.APPROVED || !user.isActive()) {
            throw new BusinessConflictException(
                    "승인된 활성 " + roleName + "만 배정하거나 처리할 수 있습니다. (userId="
                            + user.getUserId() + ")"
            );
        }
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
