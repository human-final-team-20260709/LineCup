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

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table(
        name = "inventory_movement",
        check = {
                @CheckConstraint(
                        name = "ck_inventory_movement_one_target",
                        constraint = "(raw_material_lot_id is not null and product_inventory_id is null) or "
                                + "(raw_material_lot_id is null and product_inventory_id is not null)"
                ),
                @CheckConstraint(name = "ck_inventory_movement_quantity_positive", constraint = "quantity > 0")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class InventoryMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movement_id")
    private Long movementId;

    @Column(name = "movement_no", nullable = false, unique = true, length = 30)
    private String movementNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false, length = 30)
    private InventoryItemType itemType;

    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false, length = 20)
    private InventoryMovementType movementType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raw_material_lot_id")
    private RawMaterialLot rawMaterialLot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_inventory_id")
    private ProductInventory productInventory;

    @Column(nullable = false, precision = 12, scale = 3)
    private BigDecimal quantity;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "handled_by_id", nullable = false)
    private User handledBy;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    public static InventoryMovement forRawMaterial(
            String movementNo,
            InventoryMovementType movementType,
            RawMaterialLot rawMaterialLot,
            BigDecimal quantity,
            User handledBy,
            Instant occurredAt,
            String remarks
    ) {
        return create(
                movementNo,
                InventoryItemType.RAW_MATERIAL,
                movementType,
                rawMaterialLot,
                null,
                quantity,
                handledBy,
                occurredAt,
                remarks
        );
    }

    public static InventoryMovement forFinishedProduct(
            String movementNo,
            InventoryMovementType movementType,
            ProductInventory productInventory,
            BigDecimal quantity,
            User handledBy,
            Instant occurredAt,
            String remarks
    ) {
        return create(
                movementNo,
                InventoryItemType.FINISHED_PRODUCT,
                movementType,
                null,
                productInventory,
                quantity,
                handledBy,
                occurredAt,
                remarks
        );
    }

    private static InventoryMovement create(
            String movementNo,
            InventoryItemType itemType,
            InventoryMovementType movementType,
            RawMaterialLot rawMaterialLot,
            ProductInventory productInventory,
            BigDecimal quantity,
            User handledBy,
            Instant occurredAt,
            String remarks
    ) {
        if (quantity == null || quantity.signum() <= 0) {
            throw new IllegalArgumentException("이동 수량은 0보다 커야 합니다.");
        }
        InventoryMovement movement = new InventoryMovement();
        movement.movementNo = requireText(movementNo, "재고 이동 번호");
        movement.itemType = itemType;
        movement.movementType = Objects.requireNonNull(movementType, "재고 이동 유형은 필수입니다.");
        movement.rawMaterialLot = rawMaterialLot;
        movement.productInventory = productInventory;
        movement.quantity = quantity;
        movement.handledBy = Objects.requireNonNull(handledBy, "처리자는 필수입니다.");
        movement.occurredAt = occurredAt == null ? Instant.now() : occurredAt;
        movement.remarks = remarks == null || remarks.isBlank() ? null : remarks.trim();
        return movement;
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }

    public enum InventoryItemType {
        RAW_MATERIAL("원자재"),
        FINISHED_PRODUCT("완제품");

        private final String label;

        InventoryItemType(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }

    public enum InventoryMovementType {
        INBOUND("입고"),
        OUTBOUND("출고"),
        ADJUSTMENT("조정");

        private final String label;

        InventoryMovementType(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
