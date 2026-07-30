package com.human.linecup.repository;

import com.human.linecup.entity.EquipmentAssignment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * 통합된 {@code equipment_assignment} 모델의 작업자-설비 배정 조회를 담당한다.
 * 활성 배정은 데이터 중복을 숨기지 않도록 목록으로 반환한다.
 */
public interface EquipmentAssignmentRepository extends JpaRepository<EquipmentAssignment, Long> {

    @EntityGraph(attributePaths = {"user", "equipment", "equipment.manufacturingProcess"})
    List<EquipmentAssignment> findAllByEndedAtIsNull();

    @EntityGraph(attributePaths = {"user", "equipment", "equipment.manufacturingProcess"})
    List<EquipmentAssignment> findByEquipmentEquipmentIdAndEndedAtIsNullOrderByStartedAtDesc(
            Long equipmentId
    );

    @EntityGraph(attributePaths = {"user", "equipment", "equipment.manufacturingProcess"})
    List<EquipmentAssignment> findByUserUserIdAndEndedAtIsNullOrderByStartedAtDesc(Long userId);

    boolean existsByEquipmentEquipmentIdAndEndedAtIsNull(Long equipmentId);

    boolean existsByUserUserIdAndEndedAtIsNull(Long userId);

    @EntityGraph(attributePaths = {"user", "equipment", "equipment.manufacturingProcess"})
    List<EquipmentAssignment> findByEquipmentEquipmentIdOrderByStartedAtDesc(Long equipmentId);

    @EntityGraph(attributePaths = {"user", "equipment", "equipment.manufacturingProcess"})
    List<EquipmentAssignment> findByUserUserIdOrderByStartedAtDesc(Long userId);
}
