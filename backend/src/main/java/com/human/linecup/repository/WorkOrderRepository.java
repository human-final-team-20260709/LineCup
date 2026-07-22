package com.human.linecup.repository;

import com.human.linecup.entity.WorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.support.JpaSpecificationExecutor;

import java.util.Optional;

public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long>, JpaSpecificationExecutor<WorkOrder> {

    Optional<WorkOrder> findByWorkOrderNo(String workOrderNo);

    boolean existsByWorkOrderNo(String workOrderNo);

    // 작업지시 번호(work_order_no) 자동 채번용. 접두사(예: "WO-20260722-")로 시작하는 가장 최근 번호를 조회한다.
    Optional<WorkOrder> findTopByWorkOrderNoStartingWithOrderByWorkOrderNoDesc(String prefix);

    long countByStatus(WorkOrder.Status status);
}
