package com.human.linecup.repository;

import com.human.linecup.entity.L1Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface L1DeviceRepository extends JpaRepository<L1Device, Long> {

    // 통신 상태 화면 - L1 장비 목록 (설비 ID 기준 정렬)
    List<L1Device> findAllByOrderByEquipmentIdAsc();

    // EQUIPMENT 1:1 매핑 조회 (equipment_id UNIQUE)
    Optional<L1Device> findByEquipmentId(Long equipmentId);

    // 연결 상태 필터 (연결 / 끊김 목록 및 카운트)
    List<L1Device> findAllByConnectionStatus(String connectionStatus);

    long countByConnectionStatus(String connectionStatus);
}
