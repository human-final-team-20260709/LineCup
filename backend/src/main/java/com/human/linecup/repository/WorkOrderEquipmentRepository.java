package com.human.linecup.repository;

import com.human.linecup.entity.WorkOrderEquipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkOrderEquipmentRepository extends JpaRepository<WorkOrderEquipment, Long> {

    List<WorkOrderEquipment> findByWorkOrder_WorkOrderId(Long workOrderId);

    List<WorkOrderEquipment> findByEquipment_EquipmentId(Long equipmentId);

    boolean existsByWorkOrder_WorkOrderIdAndEquipment_EquipmentId(Long workOrderId, Long equipmentId);

    void deleteByWorkOrder_WorkOrderIdAndEquipment_EquipmentId(Long workOrderId, Long equipmentId);
}
