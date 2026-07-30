package com.human.linecup.entity;

import jakarta.persistence.CheckConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(
        name = "product_inventory",
        check = @CheckConstraint(
                name = "ck_product_inventory_quantity_nonnegative",
                constraint = "current_qty >= 0 and safety_stock_qty >= 0"
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long inventoryId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "production_lot_id", nullable = false, unique = true)
    private ProductionLot productionLot;

    @Column(name = "current_qty", nullable = false)
    private int currentQty;

    @Column(name = "safety_stock_qty", nullable = false)
    private int safetyStockQty;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public static ProductInventory create(
            ProductionLot productionLot,
            int currentQty,
            int safetyStockQty,
            LocalDate expiryDate
    ) {
        ProductInventory inventory = new ProductInventory();
        inventory.productionLot = Objects.requireNonNull(productionLot, "생산 LOT는 필수입니다.");
        inventory.currentQty = ProductionQuantityPolicy.requireNonNegative(currentQty, "현재고");
        inventory.safetyStockQty = ProductionQuantityPolicy.requireNonNegative(safetyStockQty, "안전 재고");
        inventory.expiryDate = expiryDate;
        return inventory;
    }

    public void adjustCurrentQty(int currentQty) {
        this.currentQty = ProductionQuantityPolicy.requireNonNegative(currentQty, "현재고");
    }

    public InventoryStatus inventoryStatus() {
        return InventoryStatusPolicy.calculate(
                BigDecimal.valueOf(currentQty),
                BigDecimal.valueOf(safetyStockQty),
                expiryDate
        );
    }

    @PrePersist
    private void prePersist() {
        createdAt = createdAt == null ? Instant.now() : createdAt;
    }
}
