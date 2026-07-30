package com.human.linecup.repository;

import com.human.linecup.entity.DefectType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DefectTypeRepository extends JpaRepository<DefectType, Long> {

    Optional<DefectType> findByCode(String code);

    List<DefectType> findAllByActiveTrueOrderByNameAsc();
}
