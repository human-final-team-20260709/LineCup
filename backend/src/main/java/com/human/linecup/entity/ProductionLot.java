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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Objects;

@Entity
@Table(
        name = "production_lot",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_production_lot_work_order",
                columnNames = "work_order_id"
        ),
        check = {
                @CheckConstraint(
                        name = "ck_production_lot_quantities_nonnegative",
                        constraint = "production_qty >= 0 and good_qty >= 0 and defect_qty >= 0"
                ),
                @CheckConstraint(
                        name = "ck_production_lot_quantity_sum",
                        constraint = "production_qty = good_qty + defect_qty"
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductionLot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "production_lot_id")
    private Long productionLotId;

    @Column(name = "lot_no", nullable = false, unique = true, length = 50)
    private String lotNo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @Column(name = "production_qty", nullable = false)
    private int productionQty;

    @Column(name = "good_qty", nullable = false)
    private int goodQty;

    @Column(name = "defect_qty", nullable = false)
    private int defectQty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProductionLotStatus status;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    public static ProductionLot createPending(String lotNo, WorkOrder workOrder) {
        ProductionLot lot = new ProductionLot();
        lot.lotNo = requireText(lotNo, "생산 LOT 번호");
        lot.workOrder = Objects.requireNonNull(workOrder, "작업지시는 필수입니다.");
        lot.status = ProductionLotStatus.PENDING;
        return lot;
    }

    public void start(Instant startedAt) {
        requireStatus(ProductionLotStatus.PENDING, "대기 중인 생산 LOT만 시작할 수 있습니다.");
        status = ProductionLotStatus.IN_PROGRESS;
        this.startedAt = startedAt == null ? Instant.now() : startedAt;
    }

    public void updateQuantities(int productionQty, int goodQty, int defectQty) {
        ProductionQuantityPolicy.validate(productionQty, goodQty, defectQty);
        this.productionQty = productionQty;
        this.goodQty = goodQty;
        this.defectQty = defectQty;
    }

    public void hold() {
        requireStatus(ProductionLotStatus.IN_PROGRESS, "생산 중인 LOT만 보류할 수 있습니다.");
        status = ProductionLotStatus.HOLD;
    }

    public void resume() {
        requireStatus(ProductionLotStatus.HOLD, "보류된 LOT만 재개할 수 있습니다.");
        status = ProductionLotStatus.IN_PROGRESS;
    }

    public void complete(Instant completedAt) {
        requireStatus(ProductionLotStatus.IN_PROGRESS, "생산 중인 LOT만 완료할 수 있습니다.");
        Instant effectiveAt = completedAt == null ? Instant.now() : completedAt;
        if (startedAt == null || effectiveAt.isBefore(startedAt)) {
            throw new IllegalArgumentException("완료 시각은 시작 시각 이후여야 합니다.");
        }
        this.status = ProductionLotStatus.COMPLETED;
        this.completedAt = effectiveAt;
    }

    private void requireStatus(ProductionLotStatus required, String message) {
        if (status != required) {
            throw new BusinessConflictException(message);
        }
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }

    public enum ProductionLotStatus {
        PENDING("대기"),
        IN_PROGRESS("생산 중"),
        HOLD("보류"),
        COMPLETED("완료");

        private final String label;

        ProductionLotStatus(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
