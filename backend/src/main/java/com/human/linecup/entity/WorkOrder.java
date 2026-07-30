package com.human.linecup.entity;

import jakarta.persistence.CheckConstraint;
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
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(
        name = "work_order",
        check = {
                @CheckConstraint(name = "ck_work_order_target_positive", constraint = "target_qty > 0"),
                @CheckConstraint(name = "ck_work_order_hourly_target_positive", constraint = "hourly_target_qty > 0"),
                @CheckConstraint(
                        name = "ck_work_order_quantities_nonnegative",
                        constraint = "current_qty >= 0 and good_qty >= 0 and defect_qty >= 0"
                ),
                @CheckConstraint(name = "ck_work_order_quantity_sum", constraint = "current_qty = good_qty + defect_qty")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "work_order_id")
    private Long workOrderId;

    @Column(name = "work_order_no", nullable = false, unique = true, length = 30)
    private String workOrderNo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "supervisor_id", nullable = false)
    private User supervisor;

    @Column(name = "target_qty", nullable = false)
    private int targetQty;

    @Column(name = "hourly_target_qty", nullable = false)
    private int hourlyTargetQty;

    @Column(name = "current_qty", nullable = false)
    private int currentQty;

    @Column(name = "good_qty", nullable = false)
    private int goodQty;

    @Column(name = "defect_qty", nullable = false)
    private int defectQty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    @Column(name = "planned_start_date", nullable = false)
    private LocalDate plannedStartDate;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "registered_at", nullable = false, updatable = false)
    private Instant registeredAt;

    public static WorkOrder create(
            String workOrderNo,
            Product product,
            User supervisor,
            int targetQty,
            int hourlyTargetQty,
            LocalDate plannedStartDate,
            String remarks
    ) {
        WorkOrder workOrder = new WorkOrder();
        workOrder.workOrderNo = requireText(workOrderNo, "작업지시 번호");
        workOrder.product = Objects.requireNonNull(product, "제품은 필수입니다.");
        workOrder.supervisor = Objects.requireNonNull(supervisor, "지시자는 필수입니다.");
        workOrder.targetQty = ProductionQuantityPolicy.requirePositive(targetQty, "목표 수량");
        workOrder.hourlyTargetQty = ProductionQuantityPolicy.requirePositive(hourlyTargetQty, "시간당 목표 수량");
        workOrder.plannedStartDate = Objects.requireNonNull(plannedStartDate, "작업 시작 예정일은 필수입니다.");
        workOrder.remarks = normalizeText(remarks);
        workOrder.status = Status.PENDING;
        return workOrder;
    }

    public void changeTargetQuantities(int targetQty, int hourlyTargetQty) {
        this.targetQty = ProductionQuantityPolicy.requirePositive(targetQty, "목표 수량");
        this.hourlyTargetQty = ProductionQuantityPolicy.requirePositive(hourlyTargetQty, "시간당 목표 수량");
    }

    public void changeSupervisor(User supervisor) {
        this.supervisor = Objects.requireNonNull(supervisor, "지시자는 필수입니다.");
    }

    public void updateQuantities(int currentQty, int goodQty, int defectQty) {
        ProductionQuantityPolicy.validate(currentQty, goodQty, defectQty);
        this.currentQty = currentQty;
        this.goodQty = goodQty;
        this.defectQty = defectQty;
    }

    public Status applyAction(Action action) {
        return applyAction(action, Instant.now());
    }

    public Status applyAction(Action action, Instant occurredAt) {
        Objects.requireNonNull(action, "작업 상태 변경 액션은 필수입니다.");
        Instant effectiveAt = Objects.requireNonNull(occurredAt, "상태 변경 시각은 필수입니다.");
        Status previous = status;
        status = action.nextStatus(previous);
        if (action == Action.START && startedAt == null) {
            startedAt = effectiveAt;
        }
        if (action == Action.COMPLETE) {
            completedAt = effectiveAt;
        }
        return previous;
    }

    public double getProgressRate() {
        return ProductionQuantityPolicy.percentage(currentQty, targetQty);
    }

    @PrePersist
    private void prePersist() {
        registeredAt = registeredAt == null ? Instant.now() : registeredAt;
        status = status == null ? Status.PENDING : status;
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }

    private static String normalizeText(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    public enum Status {
        PENDING("대기"),
        IN_PROGRESS("진행 중"),
        HOLD("보류"),
        DONE("완료");

        private final String label;

        Status(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }

    public enum Action {
        REGISTERED,
        START,
        HOLD,
        RESUME,
        COMPLETE;

        public Status nextStatus(Status current) {
            return switch (this) {
                case START -> transition(current, Status.PENDING, Status.IN_PROGRESS);
                case HOLD -> transition(current, Status.IN_PROGRESS, Status.HOLD);
                case RESUME -> transition(current, Status.HOLD, Status.IN_PROGRESS);
                case COMPLETE -> transition(current, Status.IN_PROGRESS, Status.DONE);
                case REGISTERED -> throw new InvalidWorkOrderTransitionException(current, this);
            };
        }

        private Status transition(Status current, Status required, Status next) {
            if (current != required) {
                throw new InvalidWorkOrderTransitionException(current, this);
            }
            return next;
        }
    }
}
