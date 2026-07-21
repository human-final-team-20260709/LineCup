package com.human.linecup.entity;

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
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Objects;

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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "changed_by_id", nullable = false)
    private User changedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false, length = 20)
    private WorkOrder.Action action;

    @Enumerated(EnumType.STRING)
    @Column(name = "prev_status", length = 20)
    private WorkOrder.Status prevStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false, length = 20)
    private WorkOrder.Status newStatus;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "changed_at", nullable = false, updatable = false)
    private Instant changedAt;

    public static WorkOrderStatusHistory record(
            WorkOrder workOrder,
            User changedBy,
            WorkOrder.Action action,
            WorkOrder.Status prevStatus,
            WorkOrder.Status newStatus,
            String note,
            Instant changedAt
    ) {
        WorkOrderStatusHistory history = new WorkOrderStatusHistory();
        history.workOrder = Objects.requireNonNull(workOrder, "작업지시는 필수입니다.");
        history.changedBy = Objects.requireNonNull(changedBy, "처리자는 필수입니다.");
        history.action = Objects.requireNonNull(action, "처리 액션은 필수입니다.");
        history.prevStatus = prevStatus;
        history.newStatus = Objects.requireNonNull(newStatus, "변경 상태는 필수입니다.");
        history.note = note == null || note.isBlank() ? null : note.trim();
        history.changedAt = changedAt;
        return history;
    }

    @PrePersist
    private void prePersist() {
        changedAt = changedAt == null ? Instant.now() : changedAt;
    }
}
