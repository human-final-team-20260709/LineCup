package com.human.linecup.repository;

import com.human.linecup.entity.Defect;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DefectRepository extends JpaRepository<Defect, Long> {

    Optional<Defect> findByDefectNo(String defectNo);

    @Query("""
            select d from Defect d
            where (:status is null or d.status = :status)
              and (:equipmentId is null or d.equipmentId = :equipmentId)
              and (:keyword is null
                   or lower(d.defectNo) like lower(concat('%', :keyword, '%'))
                   or lower(d.defectType) like lower(concat('%', :keyword, '%')))
            """)
    Page<Defect> search(@Param("keyword") String keyword,
                         @Param("status") String status,
                         @Param("equipmentId") Long equipmentId,
                         Pageable pageable);

    List<Defect> findTop10ByOrderByOccurredAtDesc();

    // PRODUCTION_LOT.defect_qty와의 정합성 검증용.
    // PRODUCTION_LOT 엔티티가 별도 모듈에 있어 여기서는 합계만 제공하고,
    // 실제 LOT.defect_qty와의 비교는 해당 모듈 쪽 서비스에서 수행해야 한다.
    @Query("select coalesce(sum(d.quantity), 0) from Defect d where d.productionLotId = :productionLotId")
    long sumQuantityByProductionLotId(@Param("productionLotId") Long productionLotId);

    @Query("""
            select d.equipmentId as equipmentId, sum(d.quantity) as total
            from Defect d
            group by d.equipmentId
            order by total desc
            """)
    List<EquipmentQuantity> sumQuantityByEquipment();

    @Query("""
            select d.defectType as label, count(d) as total
            from Defect d
            group by d.defectType
            order by total desc
            """)
    List<GroupCount> countByType();

    @Query("""
            select function('date', d.occurredAt) as label, count(d) as total
            from Defect d
            group by function('date', d.occurredAt)
            order by function('date', d.occurredAt) asc
            """)
    List<GroupCount> countByDate();

    @Query("""
            select d.defectType as type, d.equipmentId as equipmentId, count(d) as total
            from Defect d
            group by d.defectType, d.equipmentId
            order by total desc
            """)
    List<TypeEquipmentCount> countByTypeAndEquipment();

    interface GroupCount {
        String getLabel();
        Long getTotal();
    }

    interface EquipmentQuantity {
        Long getEquipmentId();
        Long getTotal();
    }

    interface TypeEquipmentCount {
        String getType();
        Long getEquipmentId();
        Long getTotal();
    }
}