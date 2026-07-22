package com.human.linecup.repository;

import com.human.linecup.entity.ProductionProcessProgress;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ProductionProcessProgressRepository
        extends JpaRepository<ProductionProcessProgress, Long> {

    @EntityGraph(attributePaths = {"manufacturingProcess", "equipment"})
    List<ProductionProcessProgress> findByProductionLotProductionLotIdOrderByManufacturingProcessSequenceAsc(
            Long productionLotId
    );

    @EntityGraph(attributePaths = {"manufacturingProcess", "equipment"})
    List<ProductionProcessProgress> findByProductionLotWorkOrderWorkOrderIdOrderByManufacturingProcessSequenceAsc(
            Long workOrderId
    );

    @EntityGraph(attributePaths = {"manufacturingProcess", "equipment"})
    Optional<ProductionProcessProgress> findByProductionLotProductionLotIdAndManufacturingProcessProcessId(
            Long productionLotId,
            Long processId
    );

    boolean existsByProductionLotProductionLotIdAndManufacturingProcessProcessId(
            Long productionLotId,
            Long processId
    );

    @EntityGraph(attributePaths = {"manufacturingProcess", "equipment"})
    @Query("""
            select ppp
            from ProductionProcessProgress ppp
            where ppp.productionLot.productionLotId in :productionLotIds
            order by ppp.manufacturingProcess.sequence, ppp.productionLot.productionLotId
            """)
    List<ProductionProcessProgress> findByProductionLotIds(
            @Param("productionLotIds") Collection<Long> productionLotIds
    );
}
