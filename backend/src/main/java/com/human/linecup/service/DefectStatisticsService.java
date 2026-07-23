package com.human.linecup.service;

import com.human.linecup.dto.response.DefectStatisticsResponse;
import com.human.linecup.entity.Defect;
import com.human.linecup.entity.DefectStatus;
import com.human.linecup.entity.HourlyProduction;
import com.human.linecup.entity.Product;
import com.human.linecup.repository.DefectRepository;
import com.human.linecup.repository.HourlyProductionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DefectStatisticsService {

    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Seoul");
    private static final Duration MAX_PERIOD = Duration.ofDays(93);

    private final DefectRepository defectRepository;
    private final HourlyProductionRepository hourlyProductionRepository;

    public DefectStatisticsResponse getStatistics(Instant from, Instant to) {
        validatePeriod(from, to);
        Duration duration = Duration.between(from, to);
        Instant previousFrom = from.minus(duration);

        List<Defect> defects = defectRepository
                .findByOccurredAtGreaterThanEqualAndOccurredAtLessThan(from, to);
        List<Defect> previousDefects = defectRepository
                .findByOccurredAtGreaterThanEqualAndOccurredAtLessThan(previousFrom, from);
        List<HourlyProduction> productions = hourlyProductionRepository
                .findByBucketStartGreaterThanEqualAndBucketStartLessThanOrderByBucketStartAsc(from, to);
        List<HourlyProduction> previousProductions = hourlyProductionRepository
                .findByBucketStartGreaterThanEqualAndBucketStartLessThanOrderByBucketStartAsc(previousFrom, from);

        long totalProductionQty = sumProduction(productions);
        long previousProductionQty = sumProduction(previousProductions);
        long totalDefectQuantity = defects.stream().mapToLong(Defect::getQuantity).sum();
        long previousDefectQuantity = previousDefects.stream().mapToLong(Defect::getQuantity).sum();
        double periodDefectRate = percentage(totalDefectQuantity, totalProductionQty, 2);
        double previousPeriodRate = percentage(previousDefectQuantity, previousProductionQty, 2);
        long completedDefectCount = defects.stream()
                .filter(defect -> defect.getStatus() == DefectStatus.COMPLETED)
                .count();

        return new DefectStatisticsResponse(
                totalProductionQty,
                defects.size(),
                totalDefectQuantity,
                periodDefectRate,
                round(periodDefectRate - previousPeriodRate, 2),
                completedDefectCount,
                percentage(completedDefectCount, defects.size(), 2),
                createDailyRates(from, to, productions, defects),
                createProductRates(productions, defects),
                createProcessQuantities(defects),
                createTypeCounts(defects),
                createRankings(defects, previousDefects)
        );
    }

    private static List<DefectStatisticsResponse.DailyRate> createDailyRates(
            Instant from,
            Instant to,
            List<HourlyProduction> productions,
            List<Defect> defects
    ) {
        Map<LocalDate, QuantityPair> quantities = new LinkedHashMap<>();
        LocalDate firstDate = from.atZone(BUSINESS_ZONE).toLocalDate();
        LocalDate lastDate = to.minusNanos(1).atZone(BUSINESS_ZONE).toLocalDate();
        for (LocalDate date = firstDate; !date.isAfter(lastDate); date = date.plusDays(1)) {
            quantities.put(date, new QuantityPair());
        }
        productions.forEach(production -> quantities
                .computeIfAbsent(
                        production.getBucketStart().atZone(BUSINESS_ZONE).toLocalDate(),
                        ignored -> new QuantityPair()
                )
                .productionQty += production.getProductionQty());
        defects.forEach(defect -> quantities
                .computeIfAbsent(
                        defect.getOccurredAt().atZone(BUSINESS_ZONE).toLocalDate(),
                        ignored -> new QuantityPair()
                )
                .defectQty += defect.getQuantity());
        return quantities.entrySet().stream()
                .map(entry -> new DefectStatisticsResponse.DailyRate(
                        entry.getKey(),
                        entry.getValue().productionQty,
                        entry.getValue().defectQty,
                        percentage(entry.getValue().defectQty, entry.getValue().productionQty, 2)
                ))
                .toList();
    }

    private static List<DefectStatisticsResponse.ProductRate> createProductRates(
            List<HourlyProduction> productions,
            List<Defect> defects
    ) {
        Map<ProductKey, QuantityPair> quantities = new LinkedHashMap<>();
        productions.forEach(production -> {
            Product product = production.getWorkOrder().getProduct();
            quantities.computeIfAbsent(
                    new ProductKey(product.getProductId(), product.getProductName()),
                    ignored -> new QuantityPair()
            ).productionQty += production.getProductionQty();
        });
        defects.forEach(defect -> {
            Product product = defect.getProductionLot().getWorkOrder().getProduct();
            quantities.computeIfAbsent(
                    new ProductKey(product.getProductId(), product.getProductName()),
                    ignored -> new QuantityPair()
            ).defectQty += defect.getQuantity();
        });
        return quantities.entrySet().stream()
                .sorted(Map.Entry.comparingByKey(Comparator.comparing(ProductKey::productName)))
                .map(entry -> new DefectStatisticsResponse.ProductRate(
                        entry.getKey().productId(),
                        entry.getKey().productName(),
                        entry.getValue().productionQty,
                        entry.getValue().defectQty,
                        percentage(entry.getValue().defectQty, entry.getValue().productionQty, 2)
                ))
                .toList();
    }

    private static List<DefectStatisticsResponse.ProcessQuantity> createProcessQuantities(
            List<Defect> defects
    ) {
        Map<String, Long> quantities = new LinkedHashMap<>();
        defects.forEach(defect -> quantities.merge(
                defect.getEquipment().getManufacturingProcess().getProcessName(),
                (long) defect.getQuantity(),
                Long::sum
        ));
        return quantities.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed()
                        .thenComparing(Map.Entry.comparingByKey()))
                .map(entry -> new DefectStatisticsResponse.ProcessQuantity(
                        entry.getKey(),
                        entry.getValue()
                ))
                .toList();
    }

    private static List<DefectStatisticsResponse.TypeCount> createTypeCounts(List<Defect> defects) {
        Map<TypeKey, TypeAggregate> aggregates = aggregateByType(defects);
        long totalEventCount = defects.size();
        return aggregates.entrySet().stream()
                .sorted(Map.Entry.<TypeKey, TypeAggregate>comparingByValue(
                        Comparator.comparingLong(TypeAggregate::quantity)
                ).reversed().thenComparing(entry -> entry.getKey().code()))
                .map(entry -> new DefectStatisticsResponse.TypeCount(
                        entry.getKey().code(),
                        entry.getKey().label(),
                        entry.getValue().eventCount,
                        entry.getValue().quantity,
                        percentage(entry.getValue().eventCount, totalEventCount, 2)
                ))
                .toList();
    }

    private static List<DefectStatisticsResponse.Ranking> createRankings(
            List<Defect> defects,
            List<Defect> previousDefects
    ) {
        Map<TypeKey, TypeAggregate> current = aggregateByType(defects);
        Map<String, Long> previousCounts = new LinkedHashMap<>();
        previousDefects.forEach(defect -> previousCounts.merge(
                defect.getDefectType().getCode(),
                1L,
                Long::sum
        ));
        List<Map.Entry<TypeKey, TypeAggregate>> entries = current.entrySet().stream()
                .sorted(Map.Entry.<TypeKey, TypeAggregate>comparingByValue(
                        Comparator.comparingLong(TypeAggregate::eventCount)
                ).reversed().thenComparing(entry -> entry.getKey().code()))
                .limit(5)
                .toList();
        List<DefectStatisticsResponse.Ranking> results = new ArrayList<>();
        for (int index = 0; index < entries.size(); index++) {
            Map.Entry<TypeKey, TypeAggregate> entry = entries.get(index);
            long previousCount = previousCounts.getOrDefault(entry.getKey().code(), 0L);
            Double changeRate = previousCount == 0
                    ? null
                    : percentage(entry.getValue().eventCount - previousCount, previousCount, 2);
            results.add(new DefectStatisticsResponse.Ranking(
                    index + 1,
                    entry.getKey().label(),
                    entry.getValue().mainProcessName(),
                    entry.getValue().eventCount,
                    changeRate
            ));
        }
        return results;
    }

    private static Map<TypeKey, TypeAggregate> aggregateByType(List<Defect> defects) {
        Map<TypeKey, TypeAggregate> aggregates = new LinkedHashMap<>();
        defects.forEach(defect -> {
            TypeKey key = new TypeKey(
                    defect.getDefectType().getCode(),
                    defect.getDefectType().getName()
            );
            TypeAggregate aggregate = aggregates.computeIfAbsent(key, ignored -> new TypeAggregate());
            aggregate.eventCount++;
            aggregate.quantity += defect.getQuantity();
            aggregate.processCounts.merge(
                    defect.getEquipment().getManufacturingProcess().getProcessName(),
                    1L,
                    Long::sum
            );
        });
        return aggregates;
    }

    private static long sumProduction(List<HourlyProduction> productions) {
        return productions.stream().mapToLong(HourlyProduction::getProductionQty).sum();
    }

    private static void validatePeriod(Instant from, Instant to) {
        if (from == null || to == null) {
            throw new IllegalArgumentException("조회 시작 시각과 종료 시각은 필수입니다.");
        }
        if (!to.isAfter(from)) {
            throw new IllegalArgumentException("조회 종료 시각은 시작 시각보다 이후여야 합니다.");
        }
        if (Duration.between(from, to).compareTo(MAX_PERIOD) > 0) {
            throw new IllegalArgumentException("통계 조회 기간은 최대 93일입니다.");
        }
    }

    private static double percentage(long numerator, long denominator, int scale) {
        if (denominator == 0) {
            return 0.0;
        }
        return BigDecimal.valueOf(numerator)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(denominator), scale, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private static double round(double value, int scale) {
        return BigDecimal.valueOf(value).setScale(scale, RoundingMode.HALF_UP).doubleValue();
    }

    private record ProductKey(Long productId, String productName) {
    }

    private record TypeKey(String code, String label) {
    }

    private static final class QuantityPair {
        private long productionQty;
        private long defectQty;
    }

    private static final class TypeAggregate {
        private long eventCount;
        private long quantity;
        private final Map<String, Long> processCounts = new LinkedHashMap<>();

        private long eventCount() {
            return eventCount;
        }

        private long quantity() {
            return quantity;
        }

        private String mainProcessName() {
            return processCounts.entrySet().stream()
                    .max(Map.Entry.<String, Long>comparingByValue()
                            .thenComparing(Map.Entry.comparingByKey(Comparator.reverseOrder())))
                    .map(Map.Entry::getKey)
                    .orElse("-");
        }
    }
}
