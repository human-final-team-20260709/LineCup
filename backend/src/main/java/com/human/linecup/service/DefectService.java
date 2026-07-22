package com.human.linecup.service;

import com.human.linecup.dto.request.DefectCreateRequest;
import com.human.linecup.dto.request.DefectIngestRequest;
import com.human.linecup.dto.request.DefectSearchCondition;
import com.human.linecup.dto.request.UpdateDefectCauseRequest;
import com.human.linecup.dto.request.UpdateDefectHandlingRequest;
import com.human.linecup.dto.response.DefectDashboardResponse;
import com.human.linecup.dto.response.DefectDetailResponse;
import com.human.linecup.dto.response.DefectHandlingHistoryResponse;
import com.human.linecup.dto.response.DefectSummaryResponse;
import com.human.linecup.entity.Defect;
import com.human.linecup.entity.DefectHandleMethod;
import com.human.linecup.entity.DefectHandlingHistory;
import com.human.linecup.entity.DefectStatus;
import com.human.linecup.entity.DefectType;
import com.human.linecup.entity.Equipment;
import com.human.linecup.entity.ManufacturingProcess;
import com.human.linecup.entity.Product;
import com.human.linecup.entity.ProductionLot;
import com.human.linecup.entity.User;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.repository.DefectHandlingHistoryRepository;
import com.human.linecup.repository.DefectRepository;
import com.human.linecup.repository.DefectTypeRepository;
import com.human.linecup.repository.EquipmentRepository;
import com.human.linecup.repository.ProductionLotRepository;
import com.human.linecup.repository.UserRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
public class DefectService {

    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Seoul");
    private static final DateTimeFormatter NUMBER_DATE_FORMAT =
            DateTimeFormatter.ofPattern("yyMMdd").withZone(BUSINESS_ZONE);
    private static final Sort DEFAULT_SORT = Sort.by(
            Sort.Order.desc("occurredAt"),
            Sort.Order.desc("defectId")
    );
    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_NUMBER_LOOKUPS = 1_000;

    private final DefectRepository defectRepository;
    private final DefectTypeRepository defectTypeRepository;
    private final DefectHandlingHistoryRepository historyRepository;
    private final ProductionLotRepository productionLotRepository;
    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;
    private final Clock clock;

    @Autowired
    public DefectService(
            DefectRepository defectRepository,
            DefectTypeRepository defectTypeRepository,
            DefectHandlingHistoryRepository historyRepository,
            ProductionLotRepository productionLotRepository,
            EquipmentRepository equipmentRepository,
            UserRepository userRepository
    ) {
        this(
                defectRepository,
                defectTypeRepository,
                historyRepository,
                productionLotRepository,
                equipmentRepository,
                userRepository,
                Clock.systemUTC()
        );
    }

    public DefectService(
            DefectRepository defectRepository,
            DefectTypeRepository defectTypeRepository,
            DefectHandlingHistoryRepository historyRepository,
            ProductionLotRepository productionLotRepository,
            EquipmentRepository equipmentRepository,
            UserRepository userRepository,
            Clock clock
    ) {
        this.defectRepository = Objects.requireNonNull(defectRepository, "불량 저장소는 필수입니다.");
        this.defectTypeRepository = Objects.requireNonNull(
                defectTypeRepository,
                "불량 유형 저장소는 필수입니다."
        );
        this.historyRepository = Objects.requireNonNull(
                historyRepository,
                "불량 처리 이력 저장소는 필수입니다."
        );
        this.productionLotRepository = Objects.requireNonNull(
                productionLotRepository,
                "생산 LOT 저장소는 필수입니다."
        );
        this.equipmentRepository = Objects.requireNonNull(
                equipmentRepository,
                "설비 저장소는 필수입니다."
        );
        this.userRepository = Objects.requireNonNull(userRepository, "사용자 저장소는 필수입니다.");
        this.clock = Objects.requireNonNull(clock, "Clock은 필수입니다.");
    }

    @Transactional
    public DefectDetailResponse create(DefectCreateRequest request) {
        Objects.requireNonNull(request, "불량 등록 요청은 필수입니다.");

        Instant occurredAt = effectiveOccurredAt(request.occurredAt());
        ProductionLot productionLot = findProductionLot(request.productionLotId());
        Equipment equipment = findEquipment(request.equipmentId());
        DefectType defectType = findActiveDefectType(request.defectType());
        String defectNo = generateDefectNo(occurredAt);

        Defect defect = Defect.create(
                defectNo,
                "manual:" + defectNo,
                productionLot,
                equipment,
                defectType,
                requireQuantity(request.quantity()),
                request.cause(),
                occurredAt
        );
        Defect saved = defectRepository.saveAndFlush(defect);

        return new DefectDetailResponse(toSummary(saved), saved.getCause(), List.of());
    }

    @Transactional
    public DefectSummaryResponse ingest(DefectIngestRequest request) {
        Objects.requireNonNull(request, "L2 불량 등록 요청은 필수입니다.");

        String idempotencyKey = requireText(request.idempotencyKey(), "멱등성 키");
        Defect existing = defectRepository.findByIdempotencyKey(idempotencyKey).orElse(null);
        if (existing != null) {
            return toSummary(existing);
        }

        Instant occurredAt = effectiveOccurredAt(
                Objects.requireNonNull(request.occurredAt(), "불량 발생 시각은 필수입니다.")
        );
        ProductionLot productionLot = findProductionLot(request.productionLotId());
        requirePositiveId(request.workOrderId(), "작업지시 ID");
        if (!Objects.equals(
                productionLot.getWorkOrder().getWorkOrderId(),
                request.workOrderId()
        )) {
            throw new IllegalArgumentException(
                    "요청한 생산 LOT가 작업지시에 속하지 않습니다: " + request.workOrderId()
            );
        }

        Equipment equipment = findEquipmentByCode(request.equipmentCode());
        DefectType defectType = findActiveDefectType(request.defectType());
        String defectNo = generateDefectNo(occurredAt);

        Defect defect = Defect.create(
                defectNo,
                idempotencyKey,
                productionLot,
                equipment,
                defectType,
                requireQuantity(request.quantity()),
                null,
                occurredAt
        );

        return toSummary(defectRepository.saveAndFlush(defect));
    }

    public Page<DefectSummaryResponse> search(
            DefectSearchCondition condition,
            Pageable pageable
    ) {
        DefectSearchCondition effectiveCondition =
                condition == null ? DefectSearchCondition.empty() : condition;
        validatePeriod(effectiveCondition.startAt(), effectiveCondition.endAt());
        if (effectiveCondition.productionLotId() != null) {
            requirePositiveId(effectiveCondition.productionLotId(), "생산 LOT ID");
        }
        if (effectiveCondition.equipmentId() != null) {
            requirePositiveId(effectiveCondition.equipmentId(), "설비 ID");
        }

        return defectRepository.findAll(
                        createSearchSpecification(effectiveCondition),
                        withDefaultSort(pageable)
                )
                .map(this::toSummary);
    }

    public DefectDetailResponse getById(Long defectId) {
        return toDetail(findDefect(defectId));
    }

    public DefectDetailResponse getDetail(Long defectId) {
        return getById(defectId);
    }

    public DefectDetailResponse getByDefectNo(String defectNo) {
        String normalizedDefectNo = requireText(defectNo, "불량 번호");
        Defect defect = defectRepository.findByDefectNo(normalizedDefectNo)
                .orElseThrow(() -> new NoSuchElementException(
                        "존재하지 않는 불량 이력입니다: " + normalizedDefectNo
                ));
        return toDetail(defect);
    }

    @Transactional
    public DefectDetailResponse updateCause(
            Long defectId,
            UpdateDefectCauseRequest request
    ) {
        Objects.requireNonNull(request, "불량 원인 변경 요청은 필수입니다.");
        Defect defect = findDefect(defectId);
        defect.changeCause(request.cause());
        return toDetail(defect);
    }

    @Transactional
    public DefectDetailResponse updateHandling(
            Long defectId,
            UpdateDefectHandlingRequest request
    ) {
        Objects.requireNonNull(request, "불량 처리 요청은 필수입니다.");
        DefectStatus nextStatus = Objects.requireNonNull(
                request.status(),
                "불량 처리 상태는 필수입니다."
        );
        requirePositiveId(request.handlerId(), "처리자 ID");
        if (nextStatus == DefectStatus.COMPLETED && request.handleMethod() == null) {
            throw new IllegalArgumentException("처리 완료에는 처리 방법이 필요합니다.");
        }

        Defect defect = findDefect(defectId);
        if (defect.getStatus() == DefectStatus.COMPLETED
                && nextStatus != DefectStatus.COMPLETED) {
            throw new IllegalStateException("처리 완료된 불량은 다시 열 수 없습니다.");
        }
        User handler = findUser(request.handlerId());

        defect.changeStatus(nextStatus);
        DefectHandlingHistory history = DefectHandlingHistory.record(
                defect,
                nextStatus,
                request.handleMethod(),
                request.handlingContent(),
                handler,
                clock.instant()
        );
        historyRepository.save(history);

        return toDetail(defect, history);
    }

    public DefectDashboardResponse getDashboard() {
        LocalDate date = clock.instant().atZone(BUSINESS_ZONE).toLocalDate();
        Instant startAt = date.atStartOfDay(BUSINESS_ZONE).toInstant();
        Instant endAt = date.plusDays(1).atStartOfDay(BUSINESS_ZONE).toInstant();

        long todayDefectQuantity = defectRepository.sumQuantityByOccurredAt(startAt, endAt);
        long unhandledDefectCount = defectRepository.countByStatus(DefectStatus.UNHANDLED);
        List<DefectSummaryResponse> recentDefects = defectRepository
                .findTop5ByOrderByOccurredAtDescDefectIdDesc()
                .stream()
                .map(this::toSummary)
                .toList();

        return new DefectDashboardResponse(
                date,
                todayDefectQuantity,
                unhandledDefectCount,
                recentDefects
        );
    }

    private Specification<Defect> createSearchSpecification(DefectSearchCondition condition) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<Defect, ProductionLot> productionLot =
                    root.join("productionLot", JoinType.INNER);
            Join<ProductionLot, WorkOrder> workOrder =
                    productionLot.join("workOrder", JoinType.INNER);
            Join<WorkOrder, Product> product = workOrder.join("product", JoinType.INNER);
            Join<Defect, Equipment> equipment = root.join("equipment", JoinType.INNER);
            Join<Equipment, ManufacturingProcess> process =
                    equipment.join("manufacturingProcess", JoinType.INNER);
            Join<Defect, DefectType> defectType = root.join("defectType", JoinType.INNER);

            if (condition.status() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("status"),
                        condition.status()
                ));
            }
            if (condition.productionLotId() != null) {
                predicates.add(criteriaBuilder.equal(
                        productionLot.get("productionLotId"),
                        condition.productionLotId()
                ));
            }
            if (condition.equipmentId() != null) {
                predicates.add(criteriaBuilder.equal(
                        equipment.get("equipmentId"),
                        condition.equipmentId()
                ));
            }
            if (condition.startAt() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("occurredAt"),
                        condition.startAt()
                ));
            }
            if (condition.endAt() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("occurredAt"),
                        condition.endAt()
                ));
            }

            String keyword = normalizeText(condition.keyword());
            if (keyword != null) {
                String pattern = toContainsPattern(keyword);
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("defectNo")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("cause")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(productionLot.get("lotNo")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(workOrder.get("workOrderNo")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(product.get("productCode")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(product.get("productName")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(equipment.get("equipmentCode")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(equipment.get("equipmentName")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(process.get("processName")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(defectType.get("code")), pattern, '\\'),
                        criteriaBuilder.like(criteriaBuilder.lower(defectType.get("name")), pattern, '\\')
                ));
            }

            return predicates.isEmpty()
                    ? criteriaBuilder.conjunction()
                    : criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private Defect findDefect(Long defectId) {
        requirePositiveId(defectId, "불량 ID");
        return defectRepository.findById(defectId)
                .orElseThrow(() -> new NoSuchElementException(
                        "존재하지 않는 불량 이력입니다: " + defectId
                ));
    }

    private ProductionLot findProductionLot(Long productionLotId) {
        requirePositiveId(productionLotId, "생산 LOT ID");
        return productionLotRepository.findById(productionLotId)
                .orElseThrow(() -> new NoSuchElementException(
                        "존재하지 않는 생산 LOT입니다: " + productionLotId
                ));
    }

    private Equipment findEquipment(Long equipmentId) {
        requirePositiveId(equipmentId, "설비 ID");
        return equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new NoSuchElementException(
                        "존재하지 않는 설비입니다: " + equipmentId
                ));
    }

    private Equipment findEquipmentByCode(String equipmentCode) {
        String normalizedCode = requireText(equipmentCode, "설비 코드");
        return equipmentRepository.findByEquipmentCode(normalizedCode)
                .orElseThrow(() -> new NoSuchElementException(
                        "존재하지 않는 설비입니다: " + normalizedCode
                ));
    }

    private DefectType findActiveDefectType(String value) {
        String normalized = requireText(value, "불량 유형");
        DefectType defectType = defectTypeRepository
                .findByCode(normalized.toUpperCase(Locale.ROOT))
                .orElseGet(() -> defectTypeRepository
                        .findAllByActiveTrueOrderByNameAsc()
                        .stream()
                        .filter(type -> type.getName().equalsIgnoreCase(normalized))
                        .findFirst()
                        .orElseThrow(() -> new NoSuchElementException(
                                "존재하지 않는 불량 유형입니다: " + normalized
                        )));

        if (!defectType.isActive()) {
            throw new IllegalArgumentException("사용 중지된 불량 유형입니다: " + normalized);
        }
        return defectType;
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException(
                        "존재하지 않는 처리자입니다: " + userId
                ));
    }

    private Instant effectiveOccurredAt(Instant requestedAt) {
        Instant now = clock.instant();
        Instant occurredAt = requestedAt == null ? now : requestedAt;
        if (occurredAt.isAfter(now)) {
            throw new IllegalArgumentException("불량 발생 시각은 현재 시각 이후일 수 없습니다.");
        }
        return occurredAt;
    }

    private String generateDefectNo(Instant occurredAt) {
        String prefix = "DF-" + NUMBER_DATE_FORMAT.format(occurredAt) + "-";
        long sequence = defectRepository.count() + 1L;

        for (int attempt = 0; attempt < MAX_NUMBER_LOOKUPS; attempt++, sequence++) {
            String candidate = prefix + String.format(Locale.ROOT, "%03d", sequence);
            if (defectRepository.findByDefectNo(candidate).isEmpty()) {
                return candidate;
            }
        }
        throw new IllegalStateException("사용 가능한 불량 번호를 생성할 수 없습니다.");
    }

    private DefectSummaryResponse toSummary(Defect defect) {
        ProductionLot productionLot = defect.getProductionLot();
        WorkOrder workOrder = productionLot.getWorkOrder();
        Product product = workOrder.getProduct();
        Equipment equipment = defect.getEquipment();
        ManufacturingProcess process = equipment.getManufacturingProcess();
        DefectType defectType = defect.getDefectType();

        return new DefectSummaryResponse(
                defect.getDefectId(),
                defect.getDefectNo(),
                workOrder.getWorkOrderId(),
                workOrder.getWorkOrderNo(),
                productionLot.getProductionLotId(),
                productionLot.getLotNo(),
                product.getProductId(),
                product.getProductCode(),
                product.getProductName(),
                equipment.getEquipmentId(),
                equipment.getEquipmentCode(),
                equipment.getEquipmentName(),
                process.getProcessName(),
                defectType.getCode(),
                defectType.getName(),
                defect.getQuantity(),
                defect.getStatus(),
                defect.getStatus().getLabel(),
                defect.getOccurredAt()
        );
    }

    private DefectDetailResponse toDetail(Defect defect) {
        return toDetail(defect, null);
    }

    private DefectDetailResponse toDetail(
            Defect defect,
            DefectHandlingHistory additionalHistory
    ) {
        List<DefectHandlingHistory> histories = new ArrayList<>(historyRepository
                .findByDefect_DefectIdOrderByHandledAtAscDefectHandlingHistoryIdAsc(
                        defect.getDefectId()
                ));
        if (additionalHistory != null && histories.stream().noneMatch(
                history -> isSameHistory(history, additionalHistory)
        )) {
            histories.add(additionalHistory);
        }
        List<DefectHandlingHistoryResponse> historyResponses = histories.stream()
                .map(this::toHistoryResponse)
                .toList();
        return new DefectDetailResponse(
                toSummary(defect),
                defect.getCause(),
                historyResponses
        );
    }

    private boolean isSameHistory(
            DefectHandlingHistory left,
            DefectHandlingHistory right
    ) {
        if (left == right) {
            return true;
        }
        return left.getDefectHandlingHistoryId() != null
                && left.getDefectHandlingHistoryId().equals(
                        right.getDefectHandlingHistoryId()
                );
    }

    private DefectHandlingHistoryResponse toHistoryResponse(DefectHandlingHistory history) {
        DefectHandleMethod method = history.getHandleMethod();
        User handler = history.getHandledBy();
        return new DefectHandlingHistoryResponse(
                history.getDefectHandlingHistoryId(),
                history.getStatus(),
                history.getStatus().getLabel(),
                method,
                method == null ? null : method.getLabel(),
                history.getContent(),
                handler.getUserId(),
                handler.getEmpNo(),
                handler.getName(),
                history.getHandledAt()
        );
    }

    private Pageable withDefaultSort(Pageable pageable) {
        Pageable effective = pageableOrDefault(pageable);
        if (effective.getSort().isSorted()) {
            return effective;
        }
        return PageRequest.of(
                effective.getPageNumber(),
                effective.getPageSize(),
                DEFAULT_SORT
        );
    }

    private Pageable pageableOrDefault(Pageable pageable) {
        if (pageable == null || pageable.isUnpaged()) {
            return PageRequest.of(0, DEFAULT_PAGE_SIZE);
        }
        return pageable;
    }

    private void validatePeriod(Instant startAt, Instant endAt) {
        if (startAt != null && endAt != null && startAt.isAfter(endAt)) {
            throw new IllegalArgumentException("조회 시작 시각은 종료 시각보다 늦을 수 없습니다.");
        }
    }

    private static int requireQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("불량 수량은 양수여야 합니다.");
        }
        return quantity;
    }

    private static void requirePositiveId(Long id, String fieldName) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException(fieldName + "는 양수여야 합니다.");
        }
    }

    private static String requireText(String value, String fieldName) {
        String normalized = normalizeText(value);
        if (normalized == null) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return normalized;
    }

    private static String normalizeText(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private static String toContainsPattern(String keyword) {
        String escaped = keyword.toLowerCase(Locale.ROOT)
                .replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
        return "%" + escaped + "%";
    }
}
