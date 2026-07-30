package com.human.linecup.repository;

import com.human.linecup.entity.WorkOrderWorker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkOrderWorkerRepository extends JpaRepository<WorkOrderWorker, Long> {

    List<WorkOrderWorker> findByWorkOrder_WorkOrderId(Long workOrderId);

    // 작업자별 담당 작업 확인용 (특정 작업자가 배정된 모든 작업지시 조회)
    List<WorkOrderWorker> findByUser_UserId(Long userId);

    boolean existsByWorkOrder_WorkOrderIdAndUser_UserId(Long workOrderId, Long userId);

    void deleteByWorkOrder_WorkOrderIdAndUser_UserId(Long workOrderId, Long userId);

    void deleteByWorkOrder_WorkOrderId(Long workOrderId);
}
