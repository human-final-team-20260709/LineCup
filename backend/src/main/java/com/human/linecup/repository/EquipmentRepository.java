package com.human.linecup.repository;

import com.human.linecup.entity.Equipment;
import com.human.linecup.entity.Equipment.EquipmentStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    @EntityGraph(attributePaths = "manufacturingProcess")
    Optional<Equipment> findByEquipmentCode(String equipmentCode);

    boolean existsByEquipmentCode(String equipmentCode);

    boolean existsByEquipmentName(String equipmentName);

    @EntityGraph(attributePaths = "manufacturingProcess")
    List<Equipment> findAllByEquipmentCodeIn(Collection<String> equipmentCodes);

    @EntityGraph(attributePaths = "manufacturingProcess")
    List<Equipment> findAllByStatus(EquipmentStatus status);

    long countByStatus(EquipmentStatus status);
}
