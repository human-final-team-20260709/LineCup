package com.human.linecup.repository;

import com.human.linecup.entity.InventoryStatus;
import com.human.linecup.entity.RawMaterialLot;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RawMaterialLotRepository extends JpaRepository<RawMaterialLot, Long> {

    @EntityGraph(attributePaths = "material")
    Optional<RawMaterialLot> findByMaterialLotNo(String materialLotNo);

    boolean existsByMaterialLotNo(String materialLotNo);

    boolean existsBySupplierNameAndSupplierLotNo(String supplierName, String supplierLotNo);

    @EntityGraph(attributePaths = "material")
    List<RawMaterialLot> findByMaterialMaterialIdOrderByExpiryDateAsc(Long materialId);

    @EntityGraph(attributePaths = "material")
    @Query("""
            select rml
            from RawMaterialLot rml
            join rml.material rm
            where (:keyword is null or :keyword = ''
                   or lower(rml.materialLotNo) like lower(concat('%', :keyword, '%'))
                   or lower(rml.supplierName) like lower(concat('%', :keyword, '%'))
                   or lower(rml.supplierLotNo) like lower(concat('%', :keyword, '%'))
                   or lower(rm.materialCode) like lower(concat('%', :keyword, '%'))
                   or lower(rm.materialName) like lower(concat('%', :keyword, '%')))
              and (:expiryFrom is null or rml.expiryDate >= :expiryFrom)
              and (:expiryTo is null or rml.expiryDate <= :expiryTo)
              and (
                   :inventoryStatus is null
                   or (:inventoryStatus = com.human.linecup.entity.InventoryStatus.EXPIRED
                       and rml.expiryDate < :today)
                   or (:inventoryStatus = com.human.linecup.entity.InventoryStatus.OUT_OF_STOCK
                       and rml.expiryDate >= :today and rml.currentQty = 0)
                   or (:inventoryStatus = com.human.linecup.entity.InventoryStatus.LOW
                       and rml.expiryDate >= :today and rml.currentQty > 0
                       and rml.currentQty < rm.safetyStockQty)
                   or (:inventoryStatus = com.human.linecup.entity.InventoryStatus.NORMAL
                       and rml.expiryDate >= :today and rml.currentQty > 0
                       and rml.currentQty >= rm.safetyStockQty)
              )
            """)
    Page<RawMaterialLot> search(
            @Param("keyword") String keyword,
            @Param("inventoryStatus") InventoryStatus inventoryStatus,
            @Param("today") LocalDate today,
            @Param("expiryFrom") LocalDate expiryFrom,
            @Param("expiryTo") LocalDate expiryTo,
            Pageable pageable
    );
}
