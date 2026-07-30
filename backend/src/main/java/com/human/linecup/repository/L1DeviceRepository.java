package com.human.linecup.repository;

import com.human.linecup.entity.ConnectionStatus;
import com.human.linecup.entity.L1Device;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface L1DeviceRepository extends JpaRepository<L1Device, Long> {

    @EntityGraph(attributePaths = "equipment")
    List<L1Device> findAllByOrderByEquipmentEquipmentIdAsc();

    @EntityGraph(attributePaths = "equipment")
    Optional<L1Device> findByEquipmentEquipmentId(Long equipmentId);

    @EntityGraph(attributePaths = "equipment")
    Optional<L1Device> findByEquipmentEquipmentCode(String equipmentCode);

    @EntityGraph(attributePaths = "equipment")
    List<L1Device> findAllByConnectionStatus(ConnectionStatus connectionStatus);

    long countByConnectionStatus(ConnectionStatus connectionStatus);
}
