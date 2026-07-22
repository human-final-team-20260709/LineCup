package com.human.linecup.repository;

import com.human.linecup.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    // equipment_code UNIQUE - 단건 조회 및 중복 검증
    Optional<Equipment> findByEquipmentCode(String equipmentCode);

    boolean existsByEquipmentCode(String equipmentCode);

    // equipment_name UNIQUE - 등록 시 중복 검증
    boolean existsByEquipmentName(String equipmentName);

    // 대시보드 - 상태별 설비 목록 (RUNNING / STOPPED / ERROR)
    List<Equipment> findAllByStatus(String status);

    long countByStatus(String status);
}
