package com.human.linecup.repository;

import com.human.linecup.entity.InventoryStatus;
import com.human.linecup.entity.ProductInventory;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface ProductInventoryRepository extends JpaRepository<ProductInventory, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @EntityGraph(attributePaths = {
            "productionLot",
            "productionLot.workOrder",
            "productionLot.workOrder.product"
    })
    @Query("select pi from ProductInventory pi where pi.inventoryId = :inventoryId")
    Optional<ProductInventory> findByIdForUpdate(@Param("inventoryId") Long inventoryId);

    @EntityGraph(attributePaths = {
            "productionLot",
            "productionLot.workOrder",
            "productionLot.workOrder.product"
    })
    Optional<ProductInventory> findByProductionLotProductionLotId(Long productionLotId);

    boolean existsByProductionLotProductionLotId(Long productionLotId);

    @EntityGraph(attributePaths = {
            "productionLot",
            "productionLot.workOrder",
            "productionLot.workOrder.product"
    })
    @Query("""
            select pi
            from ProductInventory pi
            join pi.productionLot pl
            join pl.workOrder wo
            join wo.product p
            where (:keyword is null or :keyword = ''
                   or lower(pl.lotNo) like lower(concat('%', :keyword, '%'))
                   or lower(p.productCode) like lower(concat('%', :keyword, '%'))
                   or lower(p.productName) like lower(concat('%', :keyword, '%')))
              and (:expiryFrom is null or pi.expiryDate >= :expiryFrom)
              and (:expiryTo is null or pi.expiryDate <= :expiryTo)
              and (
                   :inventoryStatus is null
                   or (:inventoryStatus = com.human.linecup.entity.InventoryStatus.EXPIRED
                       and pi.expiryDate is not null and pi.expiryDate < :today)
                   or (:inventoryStatus = com.human.linecup.entity.InventoryStatus.OUT_OF_STOCK
                       and (pi.expiryDate is null or pi.expiryDate >= :today) and pi.currentQty = 0)
                   or (:inventoryStatus = com.human.linecup.entity.InventoryStatus.LOW
                       and (pi.expiryDate is null or pi.expiryDate >= :today)
                       and pi.currentQty > 0 and pi.currentQty < pi.safetyStockQty)
                   or (:inventoryStatus = com.human.linecup.entity.InventoryStatus.NORMAL
                       and (pi.expiryDate is null or pi.expiryDate >= :today)
                       and pi.currentQty > 0 and pi.currentQty >= pi.safetyStockQty)
              )
            """)
    Page<ProductInventory> search(
            @Param("keyword") String keyword,
            @Param("inventoryStatus") InventoryStatus inventoryStatus,
            @Param("today") LocalDate today,
            @Param("expiryFrom") LocalDate expiryFrom,
            @Param("expiryTo") LocalDate expiryTo,
            Pageable pageable
    );
}
