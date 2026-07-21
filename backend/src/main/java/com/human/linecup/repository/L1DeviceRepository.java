package com.human.linecup.repository;

import com.human.linecup.entity.L1Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface L1DeviceRepository extends JpaRepository<L1Device, Long> {
    Optional<L1Device> findByEquipmentId(Long equipmentId);

    List<L1Device> findByCollectorId(Long collectorId);

    long countByCollectorIdAndConnectionStatus(Long collectorId, String connectionStatus);
}