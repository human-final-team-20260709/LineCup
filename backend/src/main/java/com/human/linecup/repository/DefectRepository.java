package com.human.linecup.repository;

import com.human.linecup.entity.Defect;
import com.human.linecup.entity.DefectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface DefectRepository
        extends JpaRepository<Defect, Long>, JpaSpecificationExecutor<Defect> {

    Optional<Defect> findByDefectNo(String defectNo);

    Optional<Defect> findByIdempotencyKey(String idempotencyKey);

    long countByStatus(DefectStatus status);

    List<Defect> findTop5ByOrderByOccurredAtDescDefectIdDesc();

    List<Defect> findByOccurredAtGreaterThanEqualAndOccurredAtLessThan(
            Instant from,
            Instant to
    );

    @Query("""
            select coalesce(sum(d.quantity), 0)
            from Defect d
            where d.occurredAt >= :startAt
              and d.occurredAt < :endAt
            """)
    long sumQuantityByOccurredAt(
            @Param("startAt") Instant startAt,
            @Param("endAt") Instant endAt
    );

    @Query("""
            select coalesce(sum(d.quantity), 0)
            from Defect d
            where d.productionLot.productionLotId = :productionLotId
            """)
    long sumQuantityByProductionLotId(@Param("productionLotId") Long productionLotId);
}
