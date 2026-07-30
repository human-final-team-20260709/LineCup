package com.human.linecup.repository;

import com.human.linecup.entity.ProductionResult;
import com.human.linecup.entity.ProductionResultStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface ProductionResultRepository extends JpaRepository<ProductionResult, Long> {

    @EntityGraph(attributePaths = {
            "productionLot",
            "productionLot.workOrder",
            "productionLot.workOrder.product"
    })
    Optional<ProductionResult> findByResultNo(String resultNo);

    @EntityGraph(attributePaths = {
            "productionLot",
            "productionLot.workOrder",
            "productionLot.workOrder.product"
    })
    Optional<ProductionResult> findByProductionLotProductionLotId(Long productionLotId);

    boolean existsByResultNo(String resultNo);

    boolean existsByProductionLotProductionLotId(Long productionLotId);

    @EntityGraph(attributePaths = {
            "productionLot",
            "productionLot.workOrder",
            "productionLot.workOrder.product"
    })
    List<ProductionResult> findByStartedAtGreaterThanEqualAndStartedAtLessThanOrderByStartedAtDesc(
            Instant from,
            Instant to
    );

    @EntityGraph(attributePaths = {
            "productionLot",
            "productionLot.workOrder",
            "productionLot.workOrder.product"
    })
    Optional<ProductionResult> findFirstByProductionLotWorkOrderWorkOrderIdAndStatusOrderByStartedAtDesc(
            Long workOrderId,
            ProductionResultStatus status
    );

    @EntityGraph(attributePaths = {
            "productionLot",
            "productionLot.workOrder",
            "productionLot.workOrder.product"
    })
    @Query("""
            select pr
            from ProductionResult pr
            where pr.status <> :excludedStatus
            order by coalesce(pr.lastAggregatedAt, pr.startedAt) desc
            """)
    List<ProductionResult> findRecentExcludingStatus(
            @Param("excludedStatus") ProductionResultStatus excludedStatus,
            Pageable pageable
    );

    @Query("""
            select coalesce(sum(pr.targetQty), 0) as targetQty,
                   coalesce(sum(pr.productionQty), 0) as productionQty,
                   coalesce(sum(pr.goodQty), 0) as goodQty,
                   coalesce(sum(pr.defectQty), 0) as defectQty,
                   coalesce(sum(case when pr.status = :collectingStatus then 1 else 0 end), 0) as collectingCount,
                   count(pr) as recordCount
            from ProductionResult pr
            where pr.startedAt >= :from
              and pr.startedAt < :to
              and pr.status <> :excludedStatus
            """)
    ProductionTotals summarizeByPeriod(
            @Param("from") Instant from,
            @Param("to") Instant to,
            @Param("collectingStatus") ProductionResultStatus collectingStatus,
            @Param("excludedStatus") ProductionResultStatus excludedStatus
    );

    interface ProductionTotals {

        long getTargetQty();

        long getProductionQty();

        long getGoodQty();

        long getDefectQty();

        long getCollectingCount();

        long getRecordCount();
    }
}
