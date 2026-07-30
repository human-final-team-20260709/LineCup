package com.human.linecup.repository;

import com.human.linecup.entity.Bom;
import com.human.linecup.entity.Bom.BomStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Collection;
import java.util.Optional;

public interface BomRepository extends JpaRepository<Bom, Long> {

    @EntityGraph(attributePaths = "product")
    Optional<Bom> findByBomCode(String bomCode);

    @EntityGraph(attributePaths = "product")
    Optional<Bom> findByProductProductIdAndVersion(Long productId, String version);

    boolean existsByBomCode(String bomCode);

    boolean existsByProductProductIdAndVersion(Long productId, String version);

    @EntityGraph(attributePaths = "product")
    Optional<Bom> findFirstByProductProductIdAndStatusOrderByBomIdDesc(
            Long productId,
            BomStatus status
    );

    @EntityGraph(attributePaths = "product")
    List<Bom> findByProductProductIdOrderByBomIdDesc(Long productId);

    @EntityGraph(attributePaths = "product")
    List<Bom> findByProductProductIdInAndStatusOrderByBomIdDesc(
            Collection<Long> productIds,
            BomStatus status
    );

    @EntityGraph(attributePaths = "product")
    @Query("""
            select b
            from Bom b
            join b.product p
            where (:status is null or b.status = :status)
              and (:keyword is null or :keyword = ''
                   or lower(b.bomCode) like lower(concat('%', :keyword, '%'))
                   or lower(b.version) like lower(concat('%', :keyword, '%'))
                   or lower(p.productCode) like lower(concat('%', :keyword, '%'))
                   or lower(p.productName) like lower(concat('%', :keyword, '%')))
            """)
    Page<Bom> search(
            @Param("keyword") String keyword,
            @Param("status") BomStatus status,
            Pageable pageable
    );
}
