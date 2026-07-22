package com.human.linecup.repository;

import com.human.linecup.entity.RawMaterial;
import com.human.linecup.entity.RawMaterial.RawMaterialStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RawMaterialRepository extends JpaRepository<RawMaterial, Long> {

    Optional<RawMaterial> findByMaterialCode(String materialCode);

    boolean existsByMaterialCode(String materialCode);

    List<RawMaterial> findAllByOrderByMaterialNameAsc();

    List<RawMaterial> findByStatusOrderByMaterialNameAsc(RawMaterialStatus status);

    @Query("""
            select rm
            from RawMaterial rm
            where (:status is null or rm.status = :status)
              and (:keyword is null or :keyword = ''
                   or lower(rm.materialCode) like lower(concat('%', :keyword, '%'))
                   or lower(rm.materialName) like lower(concat('%', :keyword, '%')))
            """)
    Page<RawMaterial> search(
            @Param("keyword") String keyword,
            @Param("status") RawMaterialStatus status,
            Pageable pageable
    );
}
