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
        name = "production_process_progress",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_process_progress_lot_process",
                columnNames = {"production_lot_id", "process_id"}
        ),
        check = {
                @CheckConstraint(
                        name = "ck_process_progress_quantities_nonnegative",
                        constraint = "target_qty >= 0 and production_qty >= 0 and good_qty >= 0 and defect_qty >= 0"
                ),
                @CheckConstraint(
                        name = "ck_process_progress_quantity_sum",
                        constraint = "production_qty = good_qty + defect_qty"
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductionProcessProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "process_progress_id")
    private Long processProgressId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "production_lot_id", nullable = false)
    private ProductionLot productionLot;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "process_id", nullable = false)
    private ManufacturingProcess manufacturingProcess;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProcessProgressStatus status;

    @Column(name = "target_qty", nullable = false)
    private int targetQty;

    @Column(name = "production_qty", nullable = false)
    private int productionQty;

    @Column(name = "good_qty", nullable = false)
    private int goodQty;

    @Column(name = "defect_qty", nullable = false)
    private int defectQty;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    public static ProductionProcessProgress create(
            ProductionLot productionLot,
            ManufacturingProcess manufacturingProcess,
            Equipment equipment,
            int targetQty
    ) {
        ProductionProcessProgress progress = new ProductionProcessProgress();
        progress.productionLot = Objects.requireNonNull(productionLot, "생산 LOT는 필수입니다.");
        progress.manufacturingProcess = Objects.requireNonNull(manufacturingProcess, "공정은 필수입니다.");
        progress.equipment = equipment;
        progress.targetQty = ProductionQuantityPolicy.requireNonNegative(targetQty, "공정 목표 수량");
        progress.status = ProcessProgressStatus.PENDING;
        return progress;
    }

    public void start(Instant startedAt) {
        requireStatus(ProcessProgressStatus.PENDING, "대기 중인 공정만 시작할 수 있습니다.");
        status = ProcessProgressStatus.IN_PROGRESS;
        this.startedAt = startedAt == null ? Instant.now() : startedAt;
    }

    public void hold() {
        requireStatus(ProcessProgressStatus.IN_PROGRESS, "진행 중인 공정만 보류할 수 있습니다.");
        status = ProcessProgressStatus.HOLD;
    }

    public void resume() {
        requireStatus(ProcessProgressStatus.HOLD, "보류된 공정만 재개할 수 있습니다.");
        status = ProcessProgressStatus.IN_PROGRESS;
    }

    public void updateQuantities(int productionQty, int goodQty, int defectQty) {
        ProductionQuantityPolicy.validate(productionQty, goodQty, defectQty);
        this.productionQty = productionQty;
        this.goodQty = goodQty;
        this.defectQty = defectQty;
    }

    public void complete(Instant completedAt) {
        requireStatus(ProcessProgressStatus.IN_PROGRESS, "진행 중인 공정만 완료할 수 있습니다.");
        Instant effectiveAt = completedAt == null ? Instant.now() : completedAt;
        if (startedAt == null || effectiveAt.isBefore(startedAt)) {
            throw new IllegalStateException("시작된 공정만 정상 시각으로 완료할 수 있습니다.");
        }
        status = ProcessProgressStatus.COMPLETED;
        this.completedAt = effectiveAt;
    }

    private void requireStatus(ProcessProgressStatus required, String message) {
        if (status != required) {
            throw new IllegalStateException(message);
        }
    }

    public enum ProcessProgressStatus {
        PENDING("대기"),
        IN_PROGRESS("진행 중"),
        HOLD("보류"),
        COMPLETED("완료");

        private final String label;

        ProcessProgressStatus(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
