package com.human.linecup.dto.response;

import java.time.LocalDateTime;

import com.human.linecup.entity.WorkOrder;
import com.human.linecup.entity.WorkOrderStatusHistory;

import lombok.Builder;
import lombok.Getter;

/**작업 상태 변경 이력 확인 */
@Getter
@Builder
public class WorkOrderStatusHistoryResponse {

    private Long historyId;
    private WorkOrder.Status prevStatus;
    private WorkOrder.Status newStatus;
    private String changedByName;
    private LocalDateTime changedAt;

    public static WorkOrderStatusHistoryResponse from(WorkOrderStatusHistory history) {
        return WorkOrderStatusHistoryResponse.builder()
                .historyId(history.getHistoryId())
                .prevStatus(history.getPrevStatus())
                .newStatus(history.getNewStatus())
                .changedByName(history.getChangedBy().getName())
                .changedAt(history.getChangedAt())
                .build();
    }
}
