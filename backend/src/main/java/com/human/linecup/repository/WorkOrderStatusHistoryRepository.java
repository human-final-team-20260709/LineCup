package com.human.linecup.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.human.linecup.entity.WorkOrderStatusHistory;

public interface WorkOrderStatusHistoryRepository extends JpaRepository<WorkOrderStatusHistory, Long> {

    List<WorkOrderStatusHistory> findByWorkOrder_WorkOrderIdOrderByChangedAtDesc(Long workOrderId);
}
