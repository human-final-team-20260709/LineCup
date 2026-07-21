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
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Objects;

@Getter
@Entity
@Table(
        name = "hourly_production",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_hourly_production_order_bucket",
                columnNames = {"work_order_id", "bucket_start"}
        ),
        check = {
                @CheckConstraint(
                        name = "ck_hourly_production_quantities_nonnegative",
                        constraint = "target_qty >= 0 and production_qty >= 0 and good_qty >= 0 and defect_qty >= 0"
                ),
                @CheckConstraint(
                        name = "ck_hourly_production_quantity_sum",
                        constraint = "production_qty = good_qty + defect_qty"
                )
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HourlyProduction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hourly_production_id")
    private Long hourlyProductionId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @Column(name = "bucket_start", nullable = false)
    private Instant bucketStart;

    @Column(name = "bucket_end", nullable = false)
    private Instant bucketEnd;

    @Column(name = "target_qty", nullable = false)
    private int targetQty;

    @Column(name = "production_qty", nullable = false)
    private int productionQty;

    @Column(name = "good_qty", nullable = false)
    private int goodQty;

    @Column(name = "defect_qty", nullable = false)
    private int defectQty;

    @Column(name = "is_partial", nullable = false)
    private boolean partial;

    @Enumerated(EnumType.STRING)
    @Column(name = "close_reason", nullable = false, length = 30)
    private HourlyProductionCloseReason closeReason;

    @Column(name = "received_at", nullable = false, updatable = false)
    private Instant receivedAt;

    public static HourlyProduction create(
            WorkOrder workOrder,
            Instant bucketStart,
            Instant bucketEnd,
            int targetQty,
            int productionQty,
            int goodQty,
            int defectQty,
            boolean partial,
            HourlyProductionCloseReason closeReason
    ) {
        validate(bucketStart, bucketEnd, targetQty, productionQty, goodQty, defectQty, closeReason);
        HourlyProduction production = new HourlyProduction();
        production.workOrder = Objects.requireNonNull(workOrder, "작업지시는 필수입니다.");
        production.bucketStart = bucketStart;
        production.applyAggregate(bucketEnd, targetQty, productionQty, goodQty, defectQty, partial, closeReason);
        return production;
    }

    public void updateAggregate(
            Instant bucketEnd,
            int targetQty,
            int productionQty,
            int goodQty,
            int defectQty,
            boolean partial,
            HourlyProductionCloseReason closeReason
    ) {
        validate(bucketStart, bucketEnd, targetQty, productionQty, goodQty, defectQty, closeReason);
        applyAggregate(bucketEnd, targetQty, productionQty, goodQty, defectQty, partial, closeReason);
    }

    private void applyAggregate(
            Instant bucketEnd,
            int targetQty,
            int productionQty,
            int goodQty,
            int defectQty,
            boolean partial,
            HourlyProductionCloseReason closeReason
    ) {
        this.bucketEnd = bucketEnd;
        this.targetQty = targetQty;
        this.productionQty = productionQty;
        this.goodQty = goodQty;
        this.defectQty = defectQty;
        this.partial = partial;
        this.closeReason = closeReason;
    }

    @PrePersist
    private void prePersist() {
        receivedAt = receivedAt == null ? Instant.now() : receivedAt;
    }

    private static void validate(
            Instant bucketStart,
            Instant bucketEnd,
            int targetQty,
            int productionQty,
            int goodQty,
            int defectQty,
            HourlyProductionCloseReason closeReason
    ) {
        if (bucketStart == null || bucketEnd == null || !bucketEnd.isAfter(bucketStart)) {
            throw new IllegalArgumentException("집계 종료 시각은 시작 시각보다 이후여야 합니다.");
        }
        ProductionQuantityPolicy.requireNonNegative(targetQty, "시간 목표 수량");
        ProductionQuantityPolicy.validate(productionQty, goodQty, defectQty);
        Objects.requireNonNull(closeReason, "시간별 집계 종료 사유는 필수입니다.");
    }
}
