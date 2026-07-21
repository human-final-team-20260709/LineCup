package com.human.linecup.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.human.linecup.entity.WorkOrder;

import lombok.Builder;
import lombok.Getter;

/** 작업지시 목록 한 행 */
@Getter
@Builder
public class WorkOrderListResponse {

    private Long workOrderId;
    private String workOrderNo;
    private String productName;
    private WorkOrder.Status status;
    private Integer targetQty;
    private Integer currentQty;
    private Double progressRate;
    private LocalDate plannedStartDate;
    private LocalDateTime registeredAt;
    private String supervisorName;

    public static WorkOrderListResponse from(WorkOrder workOrder) {
        return WorkOrderListResponse.builder()
                .workOrderId(workOrder.getWorkOrderId())
                .workOrderNo(workOrder.getWorkOrderNo())
                .productName(workOrder.getProduct().getProductName())
                .status(workOrder.getStatus())
                .targetQty(workOrder.getTargetQty())
                .currentQty(workOrder.getCurrentQty())
                .progressRate(workOrder.getProgressRate())
                .plannedStartDate(workOrder.getPlannedStartDate())
                .registeredAt(workOrder.getRegisteredAt())
                .supervisorName(workOrder.getSupervisor().getName())
                .build();
    }
}
