package com.human.linecup.repository;

import com.human.linecup.entity.BomItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface BomItemRepository extends JpaRepository<BomItem, Long> {

    @EntityGraph(attributePaths = {"rawMaterial", "manufacturingProcess"})
    List<BomItem> findByBomBomIdOrderByBomItemIdAsc(Long bomId);

    @EntityGraph(attributePaths = {"rawMaterial", "manufacturingProcess"})
    Optional<BomItem> findByBomBomIdAndRawMaterialMaterialId(Long bomId, Long materialId);

    boolean existsByBomBomIdAndRawMaterialMaterialId(Long bomId, Long materialId);

    @EntityGraph(attributePaths = {"rawMaterial", "manufacturingProcess"})
    @Query("""
            select bi
            from BomItem bi
            where bi.bom.bomId in :bomIds
            order by bi.bom.bomId, bi.bomItemId
            """)
    List<BomItem> findByBomIds(@Param("bomIds") Collection<Long> bomIds);

    long deleteByBomBomId(Long bomId);
}
