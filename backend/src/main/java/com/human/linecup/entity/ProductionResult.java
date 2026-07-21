package com.human.linecup.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Getter
@Entity
@Table(
        name = "production_result",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_production_result_no", columnNames = "result_no"),
                @UniqueConstraint(
                        name = "uk_production_result_order_lot",
                        columnNames = {"work_order_id", "production_lot_id"}
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

    @Column(name = "work_order_id", nullable = false)
    private Long workOrderId;

    @Column(name = "production_lot_id", nullable = false)
    private Long productionLotId;

    @Column(name = "target_qty", nullable = false)
    private int targetQty;

    @Column(name = "production_qty", nullable = false)
    private int productionQty;

    @Column(name = "good_qty", nullable = false)
    private int goodQty;

    @Column(name = "defect_qty", nullable = false)
    private int defectQty;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
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
            Long workOrderId,
            Long productionLotId,
            int targetQty,
            Instant startedAt
    ) {
        if (targetQty < 0) {
            throw new IllegalArgumentException("목표 수량은 0 이상이어야 합니다.");
        }

        ProductionResult result = new ProductionResult();
        result.resultNo = requireText(resultNo, "생산 실적 번호");
        result.workOrderId = requirePositiveId(workOrderId, "작업지시 ID");
        result.productionLotId = requirePositiveId(productionLotId, "생산 LOT ID");
        result.targetQty = targetQty;
        result.status = ProductionResultStatus.COLLECTING;
        result.startedAt = startedAt == null ? Instant.now() : startedAt;
        return result;
    }

    public void updateAggregate(
            int productionQty,
            int goodQty,
            int defectQty,
            Instant lastAggregatedAt
    ) {
        validateQuantities(productionQty, goodQty, defectQty);
        this.productionQty = productionQty;
        this.goodQty = goodQty;
        this.defectQty = defectQty;
        this.lastAggregatedAt = lastAggregatedAt;
    }

    public void complete(Instant completedAt) {
        this.status = ProductionResultStatus.COMPLETED;
        this.completedAt = completedAt == null ? Instant.now() : completedAt;
    }

    public void cancel(Instant canceledAt) {
        this.status = ProductionResultStatus.CANCELED;
        this.completedAt = canceledAt == null ? Instant.now() : canceledAt;
    }

    @PrePersist
    private void prePersist() {
        Instant now = Instant.now();
        status = status == null ? ProductionResultStatus.COLLECTING : status;
        startedAt = startedAt == null ? now : startedAt;
        createdAt = createdAt == null ? now : createdAt;
        updatedAt = now;
    }

    @PreUpdate
    private void preUpdate() {
        updatedAt = Instant.now();
    }

    private static void validateQuantities(int productionQty, int goodQty, int defectQty) {
        if (productionQty < 0 || goodQty < 0 || defectQty < 0) {
            throw new IllegalArgumentException("생산 실적 수량은 0 이상이어야 합니다.");
        }
        if (productionQty != goodQty + defectQty) {
            throw new IllegalArgumentException("생산 수량은 정상 수량과 불량 수량의 합이어야 합니다.");
        }
    }

    private static Long requirePositiveId(Long value, String fieldName) {
        if (value == null || value <= 0) {
            throw new IllegalArgumentException(fieldName + "는 1 이상이어야 합니다.");
        }
        return value;
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }
}
