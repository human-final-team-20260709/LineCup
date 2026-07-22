package com.human.linecup.repository;

import com.human.linecup.entity.WorkOrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkOrderStatusHistoryRepository extends JpaRepository<WorkOrderStatusHistory, Long> {

    List<WorkOrderStatusHistory> findByWorkOrder_WorkOrderIdOrderByChangedAtDesc(Long workOrderId);

    Optional<WorkOrderStatusHistory> findTopByWorkOrder_WorkOrderIdOrderByChangedAtDesc(Long workOrderId);
}
