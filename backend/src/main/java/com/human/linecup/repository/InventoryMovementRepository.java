package com.human.linecup.repository;

import com.human.linecup.entity.InventoryMovement;
import com.human.linecup.entity.InventoryMovement.InventoryItemType;
import com.human.linecup.entity.InventoryMovement.InventoryMovementType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {

    @EntityGraph(attributePaths = {
            "rawMaterialLot",
            "rawMaterialLot.material",
            "productInventory",
            "productInventory.productionLot",
            "productInventory.productionLot.workOrder",
            "productInventory.productionLot.workOrder.product",
            "handledBy"
    })
    Optional<InventoryMovement> findByMovementNo(String movementNo);

    boolean existsByMovementNo(String movementNo);

    @EntityGraph(attributePaths = {
            "rawMaterialLot",
            "rawMaterialLot.material",
            "productInventory",
            "productInventory.productionLot",
            "productInventory.productionLot.workOrder",
            "productInventory.productionLot.workOrder.product",
            "handledBy"
    })
    List<InventoryMovement> findAllByOrderByOccurredAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = {"rawMaterialLot", "rawMaterialLot.material", "handledBy"})
    List<InventoryMovement> findByRawMaterialLotMaterialLotIdOrderByOccurredAtDesc(Long materialLotId);

    @EntityGraph(attributePaths = {
            "productInventory",
            "productInventory.productionLot",
            "productInventory.productionLot.workOrder",
            "productInventory.productionLot.workOrder.product",
            "handledBy"
    })
    List<InventoryMovement> findByProductInventoryInventoryIdOrderByOccurredAtDesc(Long inventoryId);

    @EntityGraph(attributePaths = {
            "rawMaterialLot",
            "rawMaterialLot.material",
            "productInventory",
            "productInventory.productionLot",
            "productInventory.productionLot.workOrder",
            "productInventory.productionLot.workOrder.product",
            "handledBy"
    })
    @Query("""
            select im
            from InventoryMovement im
            left join im.rawMaterialLot rml
            left join rml.material rm
            left join im.productInventory pi
            left join pi.productionLot pl
            left join pl.workOrder wo
            left join wo.product p
            left join im.handledBy u
            where (:itemType is null or im.itemType = :itemType)
              and (:movementType is null or im.movementType = :movementType)
              and (:occurredFrom is null or im.occurredAt >= :occurredFrom)
              and (:occurredTo is null or im.occurredAt < :occurredTo)
              and (:keyword is null or :keyword = ''
                   or lower(im.movementNo) like lower(concat('%', :keyword, '%'))
                   or lower(rml.materialLotNo) like lower(concat('%', :keyword, '%'))
                   or lower(rm.materialCode) like lower(concat('%', :keyword, '%'))
                   or lower(rm.materialName) like lower(concat('%', :keyword, '%'))
                   or lower(pl.lotNo) like lower(concat('%', :keyword, '%'))
                   or lower(wo.workOrderNo) like lower(concat('%', :keyword, '%'))
                   or lower(p.productCode) like lower(concat('%', :keyword, '%'))
                   or lower(p.productName) like lower(concat('%', :keyword, '%'))
                   or lower(u.empNo) like lower(concat('%', :keyword, '%'))
                   or lower(u.name) like lower(concat('%', :keyword, '%')))
            """)
    Page<InventoryMovement> search(
            @Param("keyword") String keyword,
            @Param("itemType") InventoryItemType itemType,
            @Param("movementType") InventoryMovementType movementType,
            @Param("occurredFrom") Instant occurredFrom,
            @Param("occurredTo") Instant occurredTo,
            Pageable pageable
    );
}
