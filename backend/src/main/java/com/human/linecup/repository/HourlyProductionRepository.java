package com.human.linecup.repository;

import com.human.linecup.entity.HourlyProduction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface HourlyProductionRepository extends JpaRepository<HourlyProduction, Long> {

    Optional<HourlyProduction> findByWorkOrderWorkOrderIdAndBucketStart(
            Long workOrderId,
            Instant bucketStart
    );

    boolean existsByWorkOrderWorkOrderIdAndBucketStart(Long workOrderId, Instant bucketStart);

    List<HourlyProduction> findByWorkOrderWorkOrderIdOrderByBucketStartAsc(Long workOrderId);

    List<HourlyProduction> findByBucketStartGreaterThanEqualAndBucketStartLessThanOrderByBucketStartAsc(
            Instant from,
            Instant to
    );

    List<HourlyProduction> findByWorkOrderWorkOrderIdAndBucketStartGreaterThanEqualAndBucketStartLessThanOrderByBucketStartAsc(
            Long workOrderId,
            Instant from,
            Instant to
    );

    @Query("""
            select coalesce(sum(hp.productionQty), 0) as productionQty,
                   coalesce(sum(hp.goodQty), 0) as goodQty,
                   coalesce(sum(hp.defectQty), 0) as defectQty,
                   max(hp.bucketEnd) as lastAggregatedAt
            from HourlyProduction hp
            where hp.workOrder.workOrderId = :workOrderId
            """)
    QuantityTotals summarizeByWorkOrderId(@Param("workOrderId") Long workOrderId);

    interface QuantityTotals {

        long getProductionQty();

        long getGoodQty();

        long getDefectQty();

        Instant getLastAggregatedAt();
    }
}
