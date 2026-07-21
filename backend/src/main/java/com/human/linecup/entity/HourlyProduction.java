package com.human.linecup.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Getter
@Entity
@Table(
        name = "hourly_production",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_hourly_production_order_bucket",
                columnNames = {"work_order_id", "bucket_start"}
        )
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HourlyProduction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hourly_production_id")
    private Long hourlyProductionId;

    @Column(name = "work_order_id", nullable = false)
    private Long workOrderId;

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
            Long workOrderId,
            Instant bucketStart,
            Instant bucketEnd,
            int targetQty,
            int productionQty,
            int goodQty,
            int defectQty,
            boolean partial,
            HourlyProductionCloseReason closeReason
    ) {
        validate(workOrderId, bucketStart, bucketEnd, targetQty, productionQty, goodQty, defectQty, closeReason);

        HourlyProduction production = new HourlyProduction();
        production.workOrderId = workOrderId;
        production.bucketStart = bucketStart;
        production.bucketEnd = bucketEnd;
        production.targetQty = targetQty;
        production.productionQty = productionQty;
        production.goodQty = goodQty;
        production.defectQty = defectQty;
        production.partial = partial;
        production.closeReason = closeReason;
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
        validate(workOrderId, bucketStart, bucketEnd, targetQty, productionQty, goodQty, defectQty, closeReason);
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
            Long workOrderId,
            Instant bucketStart,
            Instant bucketEnd,
            int targetQty,
            int productionQty,
            int goodQty,
            int defectQty,
            HourlyProductionCloseReason closeReason
    ) {
        if (workOrderId == null || workOrderId <= 0) {
            throw new IllegalArgumentException("작업지시 ID는 1 이상이어야 합니다.");
        }
        if (bucketStart == null || bucketEnd == null || !bucketEnd.isAfter(bucketStart)) {
            throw new IllegalArgumentException("집계 종료 시각은 시작 시각보다 이후여야 합니다.");
        }
        if (targetQty < 0 || productionQty < 0 || goodQty < 0 || defectQty < 0) {
            throw new IllegalArgumentException("시간별 생산 수량은 0 이상이어야 합니다.");
        }
        if (productionQty != goodQty + defectQty) {
            throw new IllegalArgumentException("생산 수량은 정상 수량과 불량 수량의 합이어야 합니다.");
        }
        if (closeReason == null) {
            throw new IllegalArgumentException("시간별 집계 종료 사유는 필수입니다.");
        }
    }
}
