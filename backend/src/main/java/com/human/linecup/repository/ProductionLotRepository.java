package com.human.linecup.repository;

import com.human.linecup.entity.ProductionLot;
import com.human.linecup.entity.ProductionLot.ProductionLotStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ProductionLotRepository extends JpaRepository<ProductionLot, Long> {

    @EntityGraph(attributePaths = {"workOrder", "workOrder.product"})
    Optional<ProductionLot> findByLotNo(String lotNo);

    boolean existsByLotNo(String lotNo);

    @EntityGraph(attributePaths = {"workOrder", "workOrder.product"})
    List<ProductionLot> findByWorkOrderWorkOrderIdOrderByStartedAtDesc(Long workOrderId);

    @EntityGraph(attributePaths = {"workOrder", "workOrder.product"})
    Optional<ProductionLot> findFirstByWorkOrderWorkOrderIdOrderByStartedAtDesc(Long workOrderId);

    @EntityGraph(attributePaths = {"workOrder", "workOrder.product"})
    Optional<ProductionLot> findFirstByWorkOrderWorkOrderIdAndStatusInOrderByStartedAtDesc(
            Long workOrderId,
            Collection<ProductionLotStatus> statuses
    );

    @EntityGraph(attributePaths = {"workOrder", "workOrder.product"})
    @Query("""
            select pl
            from ProductionLot pl
            join pl.workOrder wo
            join wo.product p
            where pl.status in :statuses
              and (:keyword is null or :keyword = ''
                   or lower(pl.lotNo) like lower(concat('%', :keyword, '%'))
                   or lower(wo.workOrderNo) like lower(concat('%', :keyword, '%'))
                   or lower(p.productCode) like lower(concat('%', :keyword, '%'))
                   or lower(p.productName) like lower(concat('%', :keyword, '%')))
            """)
    Page<ProductionLot> search(
            @Param("keyword") String keyword,
            @Param("statuses") Collection<ProductionLotStatus> statuses,
            Pageable pageable
    );
}
