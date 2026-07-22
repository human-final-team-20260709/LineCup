package com.human.linecup.repository;

import com.human.linecup.entity.ManufacturingProcess;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ManufacturingProcessRepository extends JpaRepository<ManufacturingProcess, Long> {

    Optional<ManufacturingProcess> findByProcessCode(String processCode);

    boolean existsByProcessCode(String processCode);

    List<ManufacturingProcess> findAllByOrderBySequenceAsc();

    List<ManufacturingProcess> findByActiveTrueOrderBySequenceAsc();
}
