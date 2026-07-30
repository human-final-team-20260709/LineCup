package com.human.linecup.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Entity
@Table(
        name = "work_order_worker",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_work_order_worker",
                columnNames = {"work_order_id", "user_id"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkOrderWorker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "work_order_worker_id")
    private Long workOrderWorkerId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public static WorkOrderWorker create(WorkOrder workOrder, User user) {
        WorkOrderWorker mapping = new WorkOrderWorker();
        mapping.workOrder = Objects.requireNonNull(workOrder, "작업지시는 필수입니다.");
        mapping.user = Objects.requireNonNull(user, "작업자는 필수입니다.");
        return mapping;
    }
}
