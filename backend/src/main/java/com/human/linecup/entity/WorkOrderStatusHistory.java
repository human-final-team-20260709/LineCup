package com.human.linecup.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * WORK_ORDER_STATUS_HISTORY — (작업 상태 변경 이력 확인)
 *
 * 작업지시 "등록" 자체는 상태 변경(전이)이 아니라서 이력 행을 만들지 않는다.
 * (등록 시각은 WORK_ORDER.registered_at 에 이미 남는다.)
 * 이 테이블에는 applyAction(START/HOLD/RESUME/COMPLETE)으로 실제 상태가 바뀔 때만 쌓인다.
 */
@Entity
@Table(name = "work_order_status_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkOrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Long historyId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    /** 처리자 */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User changedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "prev_status", nullable = false, length = 20)
    private WorkOrder.Status prevStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false, length = 20)
    private WorkOrder.Status newStatus;

    @Column(name = "changed_at", nullable = false, updatable = false)
    private LocalDateTime changedAt;

    @Builder
    public WorkOrderStatusHistory(WorkOrder workOrder, User changedBy,
                                   WorkOrder.Status prevStatus, WorkOrder.Status newStatus) {
        this.workOrder = workOrder;
        this.changedBy = changedBy;
        this.prevStatus = prevStatus;
        this.newStatus = newStatus;
    }

    @PrePersist
    protected void onCreate() {
        this.changedAt = LocalDateTime.now();
    }
}
