package com.human.linecup.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.human.linecup.entity.WorkOrder;

import lombok.Builder;
import lombok.Getter;

/**
 * 작업지시 상세
 * - 기본 정보 + 제품 정보 + 지시자 정보
 * - workers: 배정된 작업자 목록
 * - equipments: 매핑된 설비 목록 (공정 진행 현황도 이 목록 기준으로 프론트에서 구성)
 * - statusHistories: 상태 변경 이력
 */
@Getter
@Builder
public class WorkOrderDetailResponse {

    private Long workOrderId;
    private String workOrderNo;

    private Long productId;
    private String productCode;
    private String productName;
    private String productUnit;

    private WorkOrder.Status status;
    private Integer targetQty;
    private Integer currentQty;
    private Integer goodQty;
    private Integer defectQty;
    private Double progressRate;

    private LocalDate plannedStartDate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime registeredAt;
    private String remarks;

    private Long supervisorId;
    private String supervisorName;
    private String supervisorEmpNo;

    private List<UserResponse> workers;
    private List<EquipmentResponse> equipments;
    private List<WorkOrderStatusHistoryResponse> statusHistories;

    public static WorkOrderDetailResponse of(WorkOrder workOrder,
                                              List<UserResponse> workers,
                                              List<EquipmentResponse> equipments,
                                              List<WorkOrderStatusHistoryResponse> statusHistories) {
        return WorkOrderDetailResponse.builder()
                .workOrderId(workOrder.getWorkOrderId())
                .workOrderNo(workOrder.getWorkOrderNo())
                .productId(workOrder.getProduct().getProductId())
                .productCode(workOrder.getProduct().getProductCode())
                .productName(workOrder.getProduct().getProductName())
                .productUnit(workOrder.getProduct().getUnit())
                .status(workOrder.getStatus())
                .targetQty(workOrder.getTargetQty())
                .currentQty(workOrder.getCurrentQty())
                .goodQty(workOrder.getGoodQty())
                .defectQty(workOrder.getDefectQty())
                .progressRate(workOrder.getProgressRate())
                .plannedStartDate(workOrder.getPlannedStartDate())
                .startTime(workOrder.getStartTime())
                .endTime(workOrder.getEndTime())
                .registeredAt(workOrder.getRegisteredAt())
                .remarks(workOrder.getRemarks())
                .supervisorId(workOrder.getSupervisor().getUserId())
                .supervisorName(workOrder.getSupervisor().getName())
                .supervisorEmpNo(workOrder.getSupervisor().getEmpNo())
                .workers(workers)
                .equipments(equipments)
                .statusHistories(statusHistories)
                .build();
    }
}
