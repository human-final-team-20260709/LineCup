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
import java.util.Objects;

@Entity
@Table(
        name = "bom_item",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_bom_item_material",
                columnNames = {"bom_id", "material_id"}
        ),
        check = @CheckConstraint(
                name = "ck_bom_item_quantity",
                constraint = "required_qty > 0 and loss_rate >= 0"
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BomItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bom_item_id")
    private Long bomItemId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bom_id", nullable = false)
    private Bom bom;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "material_id", nullable = false)
    private RawMaterial rawMaterial;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "process_id", nullable = false)
    private ManufacturingProcess manufacturingProcess;

    @Column(nullable = false, length = 50)
    private String spec;

    @Column(name = "required_qty", nullable = false, precision = 10, scale = 3)
    private BigDecimal requiredQty;

    @Column(name = "loss_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal lossRate;

    @Column(columnDefinition = "TEXT")
    private String note;

    public static BomItem create(
            Bom bom,
            RawMaterial rawMaterial,
            ManufacturingProcess manufacturingProcess,
            String spec,
            BigDecimal requiredQty,
            BigDecimal lossRate,
            String note
    ) {
        if (requiredQty == null || requiredQty.signum() <= 0) {
            throw new IllegalArgumentException("필요 수량은 0보다 커야 합니다.");
        }
        if (lossRate == null || lossRate.signum() < 0) {
            throw new IllegalArgumentException("손실률은 0 이상이어야 합니다.");
        }
        BomItem item = new BomItem();
        item.bom = Objects.requireNonNull(bom, "BOM은 필수입니다.");
        item.rawMaterial = Objects.requireNonNull(rawMaterial, "원자재는 필수입니다.");
        item.manufacturingProcess = Objects.requireNonNull(manufacturingProcess, "투입 공정은 필수입니다.");
        item.spec = requireText(spec, "규격");
        item.requiredQty = requiredQty;
        item.lossRate = lossRate;
        item.note = note == null || note.isBlank() ? null : note.trim();
        return item;
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }
}
