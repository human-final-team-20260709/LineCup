package com.human.linecup.repository;

import com.human.linecup.entity.ProductionLotMaterial;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ProductionLotMaterialRepository extends JpaRepository<ProductionLotMaterial, Long> {

    @EntityGraph(attributePaths = {"materialLot", "materialLot.material"})
    List<ProductionLotMaterial> findByProductionLotProductionLotIdOrderByProductionLotMaterialIdAsc(
            Long productionLotId
    );

    @EntityGraph(attributePaths = {"productionLot", "materialLot", "materialLot.material"})
    Optional<ProductionLotMaterial> findByProductionLotProductionLotIdAndMaterialLotMaterialLotId(
            Long productionLotId,
            Long materialLotId
    );

    boolean existsByProductionLotProductionLotIdAndMaterialLotMaterialLotId(
            Long productionLotId,
            Long materialLotId
    );

    @EntityGraph(attributePaths = {"productionLot", "materialLot", "materialLot.material"})
    @Query("""
            select plm
            from ProductionLotMaterial plm
            where plm.productionLot.productionLotId in :productionLotIds
            order by plm.productionLot.productionLotId, plm.productionLotMaterialId
            """)
    List<ProductionLotMaterial> findByProductionLotIds(
            @Param("productionLotIds") Collection<Long> productionLotIds
    );

    long deleteByProductionLotProductionLotId(Long productionLotId);
}
