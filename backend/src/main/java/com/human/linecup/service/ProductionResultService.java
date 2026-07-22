package com.human.linecup.service;

import com.human.linecup.dto.response.ProductionGroupResponse;
import com.human.linecup.dto.response.ProductionResultResponse;
import com.human.linecup.dto.response.ProductionSummaryResponse;
import com.human.linecup.entity.Product;
import com.human.linecup.entity.ProductionProcessProgress;
import com.human.linecup.entity.ProductionQuantityPolicy;
import com.human.linecup.entity.ProductionResult;
import com.human.linecup.entity.ProductionResultStatus;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.repository.ProductionProcessProgressRepository;
import com.human.linecup.repository.ProductionResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductionResultService {

    private final ProductionResultRepository productionResultRepository;
    private final ProductionProcessProgressRepository productionProcessProgressRepository;

    public ProductionResultResponse getProductionResult(String resultNo) {
        String normalizedResultNo = requireText(resultNo, "생산 실적 번호");
        ProductionResult result = productionResultRepository.findByResultNo(normalizedResultNo)
                .orElseThrow(() -> new NoSuchElementException(
                        "존재하지 않는 생산 실적입니다: " + normalizedResultNo
                ));
        return toResponse(result, null);
    }

    public ProductionResultResponse getProductionResultByLot(Long productionLotId) {
        if (productionLotId == null || productionLotId <= 0) {
            throw new IllegalArgumentException("생산 LOT ID는 양수여야 합니다.");
        }
        ProductionResult result = productionResultRepository
                .findByProductionLotProductionLotId(productionLotId)
                .orElseThrow(() -> new NoSuchElementException(
                        "생산 LOT에 연결된 생산 실적이 없습니다: " + productionLotId
                ));
        return toResponse(result, null);
    }

    public List<ProductionResultResponse> getProductionResults(Instant from, Instant to) {
        List<ProductionResult> results = findByPeriod(from, to);
        return toResponses(results);
    }

    public List<ProductionResultResponse> getRecentProductionResults(int limit) {
        if (limit <= 0 || limit > 100) {
            throw new IllegalArgumentException("최근 생산 실적 조회 건수는 1~100 사이여야 합니다.");
        }
        List<ProductionResult> results = productionResultRepository.findRecentExcludingStatus(
                ProductionResultStatus.CANCELED,
                PageRequest.of(0, limit)
        );
        return toResponses(results);
    }

    public ProductionSummaryResponse getProductionSummary(Instant from, Instant to) {
        validatePeriod(from, to);
        ProductionResultRepository.ProductionTotals totals = productionResultRepository.summarizeByPeriod(
                from,
                to,
                ProductionResultStatus.COLLECTING,
                ProductionResultStatus.CANCELED
        );

        return new ProductionSummaryResponse(
                totals.getTargetQty(),
                totals.getProductionQty(),
                totals.getGoodQty(),
                totals.getDefectQty(),
                ProductionQuantityPolicy.percentage(totals.getProductionQty(), totals.getTargetQty()),
                ProductionQuantityPolicy.percentage(totals.getDefectQty(), totals.getProductionQty()),
                totals.getCollectingCount(),
                totals.getRecordCount()
        );
    }

    public List<ProductionGroupResponse> getProductionByProduct(Instant from, Instant to) {
        List<ProductionResult> results = findActiveResultsByPeriod(from, to);
        return groupResults(results, result -> result.getWorkOrder().getProduct().getProductName());
    }

    public List<ProductionGroupResponse> getProductionByWorkOrder(Instant from, Instant to) {
        List<ProductionResult> results = findActiveResultsByPeriod(from, to);
        return groupResults(results, result -> result.getWorkOrder().getWorkOrderNo());
    }

    public List<ProductionGroupResponse> getProductionByProcess(Instant from, Instant to) {
        List<ProductionResult> results = findActiveResultsByPeriod(from, to);
        List<Long> productionLotIds = results.stream()
                .map(result -> result.getProductionLot().getProductionLotId())
                .distinct()
                .toList();
        if (productionLotIds.isEmpty()) {
            return List.of();
        }

        Map<String, GroupAccumulator> groups = new LinkedHashMap<>();
        productionProcessProgressRepository.findByProductionLotIds(productionLotIds)
                .forEach(progress -> groups
                        .computeIfAbsent(
                                progress.getManufacturingProcess().getProcessName(),
                                ignored -> new GroupAccumulator()
                        )
                        .add(progress));
        return toSortedGroupResponses(groups);
    }

    private List<ProductionResult> findByPeriod(Instant from, Instant to) {
        validatePeriod(from, to);
        return productionResultRepository
                .findByStartedAtGreaterThanEqualAndStartedAtLessThanOrderByStartedAtDesc(from, to);
    }

    private List<ProductionResult> findActiveResultsByPeriod(Instant from, Instant to) {
        return findByPeriod(from, to).stream()
                .filter(result -> result.getStatus() != ProductionResultStatus.CANCELED)
                .toList();
    }

    private List<ProductionResultResponse> toResponses(List<ProductionResult> results) {
        return results.stream()
                .map(result -> toResponse(result, null))
                .toList();
    }

    private ProductionResultResponse toResponse(ProductionResult result, String processName) {
        WorkOrder workOrder = result.getWorkOrder();
        Product product = workOrder.getProduct();
        Instant occurredAt = result.getLastAggregatedAt() == null
                ? result.getStartedAt()
                : result.getLastAggregatedAt();

        return new ProductionResultResponse(
                result.getProductionResultId(),
                result.getResultNo(),
                workOrder.getWorkOrderId(),
                workOrder.getWorkOrderNo(),
                result.getProductionLot().getProductionLotId(),
                result.getProductionLot().getLotNo(),
                product.getProductId(),
                product.getProductCode(),
                product.getProductName(),
                processName,
                result.getTargetQty(),
                result.getProductionQty(),
                result.getGoodQty(),
                result.getDefectQty(),
                ProductionQuantityPolicy.percentage(result.getProductionQty(), result.getTargetQty()),
                result.getStatus(),
                result.getStatus().getLabel(),
                occurredAt,
                result.getStartedAt(),
                result.getCompletedAt(),
                result.getLastAggregatedAt()
        );
    }

    private List<ProductionGroupResponse> groupResults(
            List<ProductionResult> results,
            Function<ProductionResult, String> groupNameResolver
    ) {
        Map<String, GroupAccumulator> groups = new LinkedHashMap<>();
        for (ProductionResult result : results) {
            String resolvedName = groupNameResolver.apply(result);
            String groupName = resolvedName == null || resolvedName.isBlank() ? "미지정" : resolvedName;
            groups.computeIfAbsent(groupName, ignored -> new GroupAccumulator())
                    .add(result);
        }

        return toSortedGroupResponses(groups);
    }

    private List<ProductionGroupResponse> toSortedGroupResponses(Map<String, GroupAccumulator> groups) {
        return groups.entrySet().stream()
                .map(entry -> entry.getValue().toResponse(entry.getKey()))
                .sorted(Comparator
                        .comparingLong(ProductionGroupResponse::productionQty)
                        .reversed()
                        .thenComparing(ProductionGroupResponse::name))
                .toList();
    }

    private void validatePeriod(Instant from, Instant to) {
        if (from == null || to == null || !to.isAfter(from)) {
            throw new IllegalArgumentException("조회 종료 시각은 시작 시각보다 이후여야 합니다.");
        }
    }

    private String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }

    private static final class GroupAccumulator {

        private long targetQty;
        private long productionQty;
        private long goodQty;
        private long defectQty;

        private void add(ProductionResult result) {
            targetQty += result.getTargetQty();
            productionQty += result.getProductionQty();
            goodQty += result.getGoodQty();
            defectQty += result.getDefectQty();
        }

        private void add(ProductionProcessProgress progress) {
            targetQty += progress.getTargetQty();
            productionQty += progress.getProductionQty();
            goodQty += progress.getGoodQty();
            defectQty += progress.getDefectQty();
        }

        private ProductionGroupResponse toResponse(String name) {
            return new ProductionGroupResponse(
                    name,
                    targetQty,
                    productionQty,
                    goodQty,
                    defectQty,
                    ProductionQuantityPolicy.percentage(productionQty, targetQty)
            );
        }
    }
}
