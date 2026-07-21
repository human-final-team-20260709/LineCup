package com.human.linecup.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.human.linecup.entity.WorkOrderWorker;

public interface WorkOrderWorkerRepository extends JpaRepository<WorkOrderWorker, Long> {

    List<WorkOrderWorker> findByWorkOrder_WorkOrderIdOrderById(Long workOrderId);

    boolean existsByWorkOrder_WorkOrderIdAndUser_UserId(Long workOrderId, Long userId);

    Optional<WorkOrderWorker> findByWorkOrder_WorkOrderIdAndUser_UserId(Long workOrderId, Long userId);
}
