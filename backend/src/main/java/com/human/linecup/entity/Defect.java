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

@Getter
@Entity
@Table(
        name = "defect",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_defect_no", columnNames = "defect_no"),
                @UniqueConstraint(name = "uk_defect_idempotency_key", columnNames = "idempotency_key")
        },
        check = @CheckConstraint(name = "ck_defect_quantity_positive", constraint = "quantity > 0")
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Defect {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "defect_id")
    private Long defectId;

    @Column(name = "defect_no", nullable = false, length = 30)
    private String defectNo;

    @Column(name = "idempotency_key", nullable = false, length = 100)
    private String idempotencyKey;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "production_lot_id", nullable = false)
    private ProductionLot productionLot;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "defect_type_id", nullable = false)
    private DefectType defectType;

    @Column(nullable = false)
    private int quantity;

    @Column(columnDefinition = "TEXT")
    private String cause;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DefectStatus status;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    public static Defect create(
            String defectNo,
            String idempotencyKey,
            ProductionLot productionLot,
            Equipment equipment,
            DefectType defectType,
            int quantity,
            String cause,
            Instant occurredAt
    ) {
        Defect defect = new Defect();
        defect.defectNo = requireText(defectNo, "불량 번호");
        defect.idempotencyKey = requireText(idempotencyKey, "멱등성 키");
        defect.productionLot = Objects.requireNonNull(productionLot, "생산 LOT는 필수입니다.");
        defect.equipment = Objects.requireNonNull(equipment, "설비는 필수입니다.");
        defect.defectType = Objects.requireNonNull(defectType, "불량 유형은 필수입니다.");
        defect.quantity = ProductionQuantityPolicy.requirePositive(quantity, "불량 수량");
        defect.cause = normalizeText(cause);
        defect.status = DefectStatus.UNHANDLED;
        defect.occurredAt = occurredAt == null ? Instant.now() : occurredAt;
        return defect;
    }

    public void changeCause(String cause) {
        this.cause = normalizeText(cause);
    }

    public void changeStatus(DefectStatus status) {
        DefectStatus next = Objects.requireNonNull(status, "불량 처리 상태는 필수입니다.");
        if (this.status == DefectStatus.COMPLETED && next != DefectStatus.COMPLETED) {
            throw new IllegalStateException("처리 완료된 불량은 다시 열 수 없습니다.");
        }
        this.status = next;
    }

    public boolean belongsToWorkOrder(Long workOrderId) {
        return workOrderId != null
                && productionLot.getWorkOrder().getWorkOrderId() != null
                && productionLot.getWorkOrder().getWorkOrderId().equals(workOrderId);
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
}
