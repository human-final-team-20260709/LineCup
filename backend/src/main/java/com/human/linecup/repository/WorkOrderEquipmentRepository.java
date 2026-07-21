package com.human.linecup.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.human.linecup.entity.WorkOrderEquipment;

public interface WorkOrderEquipmentRepository extends JpaRepository<WorkOrderEquipment, Long> {

    List<WorkOrderEquipment> findByWorkOrder_WorkOrderIdOrderById(Long workOrderId);

    boolean existsByWorkOrder_WorkOrderIdAndEquipment_EquipmentId(Long workOrderId, Long equipmentId);

    Optional<WorkOrderEquipment> findByWorkOrder_WorkOrderIdAndEquipment_EquipmentId(Long workOrderId, Long equipmentId);
}
