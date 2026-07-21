package com.human.linecup.entity;

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
import java.util.Objects;

@Entity
@Table(
        name = "production_lot_material",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_production_lot_material",
                columnNames = {"production_lot_id", "material_lot_id"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductionLotMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "production_lot_material_id")
    private Long productionLotMaterialId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "production_lot_id", nullable = false)
    private ProductionLot productionLot;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "material_lot_id", nullable = false)
    private RawMaterialLot materialLot;

    @Column(name = "used_qty", nullable = false, precision = 12, scale = 3)
    private BigDecimal usedQty;

    public static ProductionLotMaterial create(
            ProductionLot productionLot,
            RawMaterialLot materialLot,
            BigDecimal usedQty
    ) {
        if (usedQty == null || usedQty.signum() <= 0) {
            throw new IllegalArgumentException("사용 수량은 0보다 커야 합니다.");
        }
        ProductionLotMaterial usage = new ProductionLotMaterial();
        usage.productionLot = Objects.requireNonNull(productionLot, "생산 LOT는 필수입니다.");
        usage.materialLot = Objects.requireNonNull(materialLot, "원자재 LOT는 필수입니다.");
        usage.usedQty = usedQty;
        return usage;
    }
}
