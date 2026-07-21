package com.human.linecup.entity;

import jakarta.persistence.Column;
import jakarta.persistence.CheckConstraint;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Positive;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(
        name = "defect",
        uniqueConstraints = @UniqueConstraint(name = "uk_defect_no", columnNames = "defect_no"),
        check = @CheckConstraint(name = "ck_defect_quantity_positive", constraint = "quantity > 0")
)
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Defect {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "defect_id")
    private Long defectId;

    @Column(name = "defect_no", nullable = false, length = 30)
    private String defectNo;

    @Column(name = "production_lot_id", nullable = false)
    private Long productionLotId;

    @Column(name = "equipment_id", nullable = false)
    private Long equipmentId;

    @Column(name = "handler_id")
    private Long handlerId;

    @Column(name = "defect_type", nullable = false, length = 50)
    private String defectType;

    @Positive
    @Column(nullable = false)
    private Integer quantity;

    @Column(columnDefinition = "TEXT")
    private String cause;

    @Enumerated(EnumType.STRING)
    @Column(name = "handle_method", length = 20)
    private DefectHandleMethod handleMethod;

    @Column(name = "handling_content", columnDefinition = "TEXT")
    private String handlingContent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DefectStatus status;

    @Column(name = "occurred_at", nullable = false)
    private LocalDateTime occurredAt;

    public void updateHandling(
            Long handlerId,
            DefectHandleMethod handleMethod,
            DefectStatus status
    ) {
        updateHandling(handlerId, handleMethod, status, handlingContent);
    }

    public void updateHandling(
            Long handlerId,
            DefectHandleMethod handleMethod,
            DefectStatus status,
            String handlingContent
    ) {
        this.handlerId = handlerId;
        this.handleMethod = handleMethod;
        this.handlingContent = normalizeNullableText(handlingContent);
        this.status = status;
    }

    public void updateCause(String cause) {
        this.cause = normalizeNullableText(cause);
    }

    private static String normalizeNullableText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
