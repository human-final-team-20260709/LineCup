package com.human.linecup.entity;

import jakarta.persistence.CheckConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(
        name = "raw_material_lot",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_material_lot_no", columnNames = "material_lot_no"),
                @UniqueConstraint(
                        name = "uk_raw_material_lot_supplier",
                        columnNames = {"supplier_name", "supplier_lot_no"}
                )
        },
        check = @CheckConstraint(
                name = "ck_raw_material_lot_quantity",
                constraint = "received_qty >= 0 and current_qty >= 0 and current_qty <= received_qty"
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RawMaterialLot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_lot_id")
    private Long materialLotId;

    @Column(name = "material_lot_no", nullable = false, length = 50)
    private String materialLotNo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "material_id", nullable = false)
    private RawMaterial material;

    @Column(name = "supplier_name", nullable = false, length = 100)
    private String supplierName;

    @Column(name = "supplier_lot_no", nullable = false, length = 50)
    private String supplierLotNo;

    @Column(name = "manufacture_date", nullable = false)
    private LocalDate manufactureDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "received_qty", nullable = false, precision = 12, scale = 3)
    private BigDecimal receivedQty;

    @Column(name = "current_qty", nullable = false, precision = 12, scale = 3)
    private BigDecimal currentQty;

    @Column(name = "received_date", nullable = false)
    private LocalDate receivedDate;

    public static RawMaterialLot receive(
            String materialLotNo,
            RawMaterial material,
            String supplierName,
            String supplierLotNo,
            LocalDate manufactureDate,
            LocalDate expiryDate,
            BigDecimal receivedQty,
            LocalDate receivedDate
    ) {
        if (manufactureDate == null || expiryDate == null || expiryDate.isBefore(manufactureDate)) {
            throw new IllegalArgumentException("유통기한은 제조일 이후여야 합니다.");
        }
        if (receivedQty == null || receivedQty.signum() < 0) {
            throw new IllegalArgumentException("입고 수량은 0 이상이어야 합니다.");
        }
        RawMaterialLot lot = new RawMaterialLot();
        lot.materialLotNo = requireText(materialLotNo, "원자재 LOT 번호");
        lot.material = Objects.requireNonNull(material, "원자재는 필수입니다.");
        lot.supplierName = requireText(supplierName, "공급사명");
        lot.supplierLotNo = requireText(supplierLotNo, "공급사 LOT 번호");
        lot.manufactureDate = manufactureDate;
        lot.expiryDate = expiryDate;
        lot.receivedQty = receivedQty;
        lot.currentQty = receivedQty;
        lot.receivedDate = Objects.requireNonNull(receivedDate, "입고일은 필수입니다.");
        return lot;
    }

    public void adjustCurrentQty(BigDecimal currentQty) {
        if (currentQty == null || currentQty.signum() < 0 || currentQty.compareTo(receivedQty) > 0) {
            throw new IllegalArgumentException("현재고는 0 이상이며 입고 수량 이하여야 합니다.");
        }
        this.currentQty = currentQty;
    }

    public InventoryStatus inventoryStatus() {
        return InventoryStatusPolicy.calculate(currentQty, material.getSafetyStockQty(), expiryDate);
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }
}
