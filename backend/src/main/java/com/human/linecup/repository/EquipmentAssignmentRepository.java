package com.human.linecup.repository;

import com.human.linecup.entity.EquipmentEmp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * 설비-작업자 배정(EQUIPMENT_EMP) 전용 Repository.
 * 엔티티명은 EquipmentEmp 그대로 유지하되(ERD 기준), 실제 역할이 "배정 관리"에 가까워
 * Repository 이름만 EquipmentAssignmentRepository로 명확히 정리했다.
 */
public interface EquipmentAssignmentRepository extends JpaRepository<EquipmentEmp, Long> {

    // 설비 상세 - 현재 배정된 작업자 (endTime IS NULL, 설비당 최대 1건)
    Optional<EquipmentEmp> findByEquipmentIdAndEndTimeIsNull(Long equipmentId);

    // 작업자가 현재 배정 중인 설비 (userId 기준 활성 배정 조회)
    Optional<EquipmentEmp> findByUserIdAndEndTimeIsNull(Long userId);

    // 설비별 배정 이력 (최신순)
    List<EquipmentEmp> findAllByEquipmentIdOrderByStartTimeDesc(Long equipmentId);

    // 작업자별 배정 이력 (최신순)
    List<EquipmentEmp> findAllByUserIdOrderByStartTimeDesc(Long userId);
}
