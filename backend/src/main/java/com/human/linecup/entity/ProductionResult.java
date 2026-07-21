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
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Objects;

@Getter
@Entity
@Table(
        name = "production_result",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_production_result_no", columnNames = "result_no"),
                @UniqueConstraint(name = "uk_production_result_lot", columnNames = "production_lot_id")
        },
        check = {
                @CheckConstraint(
                        name = "ck_production_result_quantities_nonnegative",
                        constraint = "target_qty >= 0 and production_qty >= 0 and good_qty >= 0 and defect_qty >= 0"
                ),
                @CheckConstraint(
                        name = "ck_production_result_quantity_sum",
                        constraint = "production_qty = good_qty + defect_qty"
                )
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "production_result_id")
    private Long productionResultId;

    @Column(name = "result_no", nullable = false, length = 30)
    private String resultNo;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "production_lot_id", nullable = false)
    private ProductionLot productionLot;

    @Column(name = "target_qty", nullable = false)
    private int targetQty;

    @Column(name = "production_qty", nullable = false)
    private int productionQty;

    @Column(name = "good_qty", nullable = false)
    private int goodQty;

    @Column(name = "defect_qty", nullable = false)
    private int defectQty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProductionResultStatus status;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "last_aggregated_at")
    private Instant lastAggregatedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public static ProductionResult start(
            String resultNo,
            ProductionLot productionLot,
            int targetQty,
            Instant startedAt
    ) {
        ProductionResult result = new ProductionResult();
        result.resultNo = requireText(resultNo, "생산 실적 번호");
        result.productionLot = Objects.requireNonNull(productionLot, "생산 LOT는 필수입니다.");
        result.targetQty = ProductionQuantityPolicy.requireNonNegative(targetQty, "목표 수량");
        result.status = ProductionResultStatus.COLLECTING;
        result.startedAt = startedAt == null ? Instant.now() : startedAt;
        return result;
    }

    public void updateAggregate(int productionQty, int goodQty, int defectQty, Instant aggregatedAt) {
        ProductionQuantityPolicy.validate(productionQty, goodQty, defectQty);
        this.productionQty = productionQty;
        this.goodQty = goodQty;
        this.defectQty = defectQty;
        this.lastAggregatedAt = Objects.requireNonNull(aggregatedAt, "최종 집계 시각은 필수입니다.");
    }

    public void complete(Instant completedAt) {
        Instant effectiveAt = completedAt == null ? Instant.now() : completedAt;
        if (effectiveAt.isBefore(startedAt)) {
            throw new IllegalArgumentException("완료 시각은 시작 시각 이후여야 합니다.");
        }
        status = ProductionResultStatus.COMPLETED;
        this.completedAt = effectiveAt;
    }

    public void cancel(Instant canceledAt) {
        status = ProductionResultStatus.CANCELED;
        completedAt = canceledAt == null ? Instant.now() : canceledAt;
    }

    public WorkOrder getWorkOrder() {
        return productionLot.getWorkOrder();
    }

    @PrePersist
    private void prePersist() {
        Instant now = Instant.now();
        createdAt = createdAt == null ? now : createdAt;
        updatedAt = now;
    }

    @PreUpdate
    private void preUpdate() {
        updatedAt = Instant.now();
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }
}
