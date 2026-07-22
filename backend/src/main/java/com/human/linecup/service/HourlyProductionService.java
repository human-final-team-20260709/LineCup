package com.human.linecup.service;

import com.human.linecup.dto.request.HourlyProductionRequest;
import com.human.linecup.dto.response.HourlyProductionResponse;
import com.human.linecup.entity.HourlyProduction;
import com.human.linecup.entity.HourlyProductionCloseReason;
import com.human.linecup.entity.ProductionLot;
import com.human.linecup.entity.ProductionResult;
import com.human.linecup.entity.ProductionResultStatus;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.repository.HourlyProductionRepository;
import com.human.linecup.repository.ProductionLotRepository;
import com.human.linecup.repository.ProductionResultRepository;
import com.human.linecup.repository.WorkOrderRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.EnumSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HourlyProductionService {

    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Seoul");
    private static final DateTimeFormatter RESULT_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd")
            .withZone(BUSINESS_ZONE);
    private static final EnumSet<ProductionLot.ProductionLotStatus> ACTIVE_LOT_STATUSES = EnumSet.of(
            ProductionLot.ProductionLotStatus.IN_PROGRESS,
            ProductionLot.ProductionLotStatus.HOLD
    );

    private final HourlyProductionRepository hourlyProductionRepository;
    private final WorkOrderRepository workOrderRepository;
    private final ProductionLotRepository productionLotRepository;
    private final ProductionResultRepository productionResultRepository;
    private final EntityManager entityManager;

    @Transactional
    public HourlyProductionResponse saveHourlyProduction(HourlyProductionRequest request) {
        Objects.requireNonNull(request, "시간별 생산 실적 요청은 필수입니다.");
        validateRequest(request);

        WorkOrder workOrder = workOrderRepository.findById(request.workOrderId())
                .orElseThrow(() -> new NoSuchElementException(
                        "존재하지 않는 작업지시입니다: " + request.workOrderId()
                ));

        // 같은 작업지시의 집계 저장과 합계 재계산을 한 트랜잭션씩 직렬화한다.
        entityManager.lock(workOrder, LockModeType.PESSIMISTIC_WRITE);

        HourlyProduction hourlyProduction = hourlyProductionRepository
                .findByWorkOrderWorkOrderIdAndBucketStart(request.workOrderId(), request.bucketStart())
                .map(existing -> updateHourlyProduction(existing, request))
                .orElseGet(() -> createHourlyProduction(workOrder, request));

        HourlyProduction saved = hourlyProductionRepository.saveAndFlush(hourlyProduction);
        synchronizeProductionResult(workOrder, request);
        return toResponse(saved);
    }

    public HourlyProductionResponse getHourlyProduction(Long hourlyProductionId) {
        return hourlyProductionRepository.findById(requirePositiveId(hourlyProductionId, "시간별 생산 실적 ID"))
                .map(this::toResponse)
                .orElseThrow(() -> new NoSuchElementException(
                        "존재하지 않는 시간별 생산 실적입니다: " + hourlyProductionId
                ));
    }

    public List<HourlyProductionResponse> getHourlyProductionsByWorkOrder(Long workOrderId) {
        return hourlyProductionRepository
                .findByWorkOrderWorkOrderIdOrderByBucketStartAsc(requirePositiveId(workOrderId, "작업지시 ID"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<HourlyProductionResponse> getHourlyProductionsByPeriod(Instant from, Instant to) {
        validatePeriod(from, to);
        return hourlyProductionRepository
                .findByBucketStartGreaterThanEqualAndBucketStartLessThanOrderByBucketStartAsc(from, to)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<HourlyProductionResponse> getHourlyProductionsByWorkOrderAndPeriod(
            Long workOrderId,
            Instant from,
            Instant to
    ) {
        validatePeriod(from, to);
        return hourlyProductionRepository
                .findByWorkOrderWorkOrderIdAndBucketStartGreaterThanEqualAndBucketStartLessThanOrderByBucketStartAsc(
                        requirePositiveId(workOrderId, "작업지시 ID"),
                        from,
                        to
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private HourlyProduction createHourlyProduction(
            WorkOrder workOrder,
            HourlyProductionRequest request
    ) {
        return HourlyProduction.create(
                workOrder,
                request.bucketStart(),
                request.bucketEnd(),
                request.targetQty(),
                request.productionQty(),
                request.goodQty(),
                request.defectQty(),
                request.partial(),
                request.closeReason()
        );
    }

    private HourlyProduction updateHourlyProduction(
            HourlyProduction hourlyProduction,
            HourlyProductionRequest request
    ) {
        hourlyProduction.updateAggregate(
                request.bucketEnd(),
                request.targetQty(),
                request.productionQty(),
                request.goodQty(),
                request.defectQty(),
                request.partial(),
                request.closeReason()
        );
        return hourlyProduction;
    }

    private void synchronizeProductionResult(WorkOrder workOrder, HourlyProductionRequest request) {
        ProductionLot productionLot = findCurrentProductionLot(workOrder.getWorkOrderId());
        HourlyProductionRepository.QuantityTotals totals = hourlyProductionRepository
                .summarizeByWorkOrderId(workOrder.getWorkOrderId());

        int productionQty = toIntQuantity(totals.getProductionQty(), "누적 생산 수량");
        int goodQty = toIntQuantity(totals.getGoodQty(), "누적 정상 수량");
        int defectQty = toIntQuantity(totals.getDefectQty(), "누적 불량 수량");
        Instant aggregatedAt = totals.getLastAggregatedAt() == null
                ? request.bucketEnd()
                : totals.getLastAggregatedAt();

        workOrder.updateQuantities(productionQty, goodQty, defectQty);
        productionLot.updateQuantities(productionQty, goodQty, defectQty);

        ProductionResult productionResult = productionResultRepository
                .findByProductionLotProductionLotId(productionLot.getProductionLotId())
                .orElseGet(() -> ProductionResult.start(
                        generateResultNo(productionLot),
                        productionLot,
                        workOrder.getTargetQty(),
                        productionLot.getStartedAt()
                ));

        productionResult.updateAggregate(productionQty, goodQty, defectQty, aggregatedAt);
        if (request.closeReason() == HourlyProductionCloseReason.WORK_ORDER_COMPLETED) {
            if (productionLot.getStatus() != ProductionLot.ProductionLotStatus.COMPLETED) {
                productionLot.complete(request.bucketEnd());
            }
            if (productionResult.getStatus() != ProductionResultStatus.COMPLETED) {
                productionResult.complete(request.bucketEnd());
            }
        }

        productionResultRepository.saveAndFlush(productionResult);
    }

    private ProductionLot findCurrentProductionLot(Long workOrderId) {
        return productionLotRepository
                .findFirstByWorkOrderWorkOrderIdAndStatusInOrderByStartedAtDesc(
                        workOrderId,
                        ACTIVE_LOT_STATUSES
                )
                .or(() -> productionLotRepository.findFirstByWorkOrderWorkOrderIdOrderByStartedAtDesc(workOrderId))
                .orElseThrow(() -> new IllegalStateException(
                        "시간별 실적을 연결할 생산 LOT가 없습니다: workOrderId=" + workOrderId
                ));
    }

    private String generateResultNo(ProductionLot productionLot) {
        Long productionLotId = productionLot.getProductionLotId();
        if (productionLotId == null) {
            throw new IllegalStateException("저장되지 않은 생산 LOT로 생산 실적을 생성할 수 없습니다.");
        }
        return "PR-%s-%06d".formatted(
                RESULT_DATE_FORMAT.format(productionLot.getStartedAt()),
                productionLotId
        );
    }

    private HourlyProductionResponse toResponse(HourlyProduction production) {
        return new HourlyProductionResponse(
                production.getHourlyProductionId(),
                production.getWorkOrder().getWorkOrderId(),
                production.getBucketStart(),
                production.getBucketEnd(),
                production.getTargetQty(),
                production.getProductionQty(),
                production.getGoodQty(),
                production.getDefectQty(),
                production.isPartial(),
                production.getCloseReason(),
                production.getReceivedAt()
        );
    }

    private void validateRequest(HourlyProductionRequest request) {
        requirePositiveId(request.workOrderId(), "작업지시 ID");
        if (!request.isValidPeriod()) {
            throw new IllegalArgumentException("집계 종료 시각은 시작 시각보다 이후여야 합니다.");
        }
        if (!request.isQuantityConsistent()) {
            throw new IllegalArgumentException("생산 수량은 정상 수량과 불량 수량의 합이어야 합니다.");
        }
    }

    private void validatePeriod(Instant from, Instant to) {
        if (from == null || to == null || !to.isAfter(from)) {
            throw new IllegalArgumentException("조회 종료 시각은 시작 시각보다 이후여야 합니다.");
        }
    }

    private Long requirePositiveId(Long id, String fieldName) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException(fieldName + "는 양수여야 합니다.");
        }
        return id;
    }

    private int toIntQuantity(long quantity, String fieldName) {
        try {
            return Math.toIntExact(quantity);
        } catch (ArithmeticException exception) {
            throw new IllegalStateException(fieldName + "이 저장 가능한 범위를 초과했습니다.", exception);
        }
    }
}
