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
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Objects;

@Entity
@Table(
        name = "production_lot",
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

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    public static ProductionLot start(String lotNo, WorkOrder workOrder, Instant startedAt) {
        ProductionLot lot = new ProductionLot();
        lot.lotNo = requireText(lotNo, "생산 LOT 번호");
        lot.workOrder = Objects.requireNonNull(workOrder, "작업지시는 필수입니다.");
        lot.status = ProductionLotStatus.IN_PROGRESS;
        lot.startedAt = startedAt == null ? Instant.now() : startedAt;
        return lot;
    }

    public void updateQuantities(int productionQty, int goodQty, int defectQty) {
        ProductionQuantityPolicy.validate(productionQty, goodQty, defectQty);
        this.productionQty = productionQty;
        this.goodQty = goodQty;
        this.defectQty = defectQty;
    }

    public void hold() {
        status = ProductionLotStatus.HOLD;
    }

    public void resume() {
        status = ProductionLotStatus.IN_PROGRESS;
    }

    public void complete(Instant completedAt) {
        this.status = ProductionLotStatus.COMPLETED;
        this.completedAt = completedAt == null ? Instant.now() : completedAt;
        if (this.completedAt.isBefore(startedAt)) {
            throw new IllegalArgumentException("완료 시각은 시작 시각 이후여야 합니다.");
        }
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }

    public enum ProductionLotStatus {
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
