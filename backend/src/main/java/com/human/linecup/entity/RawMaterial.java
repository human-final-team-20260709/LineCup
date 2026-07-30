package com.human.linecup.entity;

import jakarta.persistence.CheckConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(
        name = "raw_material",
        check = @CheckConstraint(
                name = "ck_raw_material_safety_stock_nonnegative",
                constraint = "safety_stock_qty >= 0"
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RawMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_id")
    private Long materialId;

    @Column(name = "material_code", nullable = false, unique = true, length = 30)
    private String materialCode;

    @Column(name = "material_name", nullable = false, length = 100)
    private String materialName;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(name = "safety_stock_qty", nullable = false, precision = 12, scale = 3)
    private BigDecimal safetyStockQty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RawMaterialStatus status;

    public static RawMaterial create(
            String materialCode,
            String materialName,
            String unit,
            BigDecimal safetyStockQty,
            RawMaterialStatus status
    ) {
        RawMaterial material = new RawMaterial();
        material.changeInfo(materialCode, materialName, unit, safetyStockQty, status);
        return material;
    }

    public void changeInfo(
            String materialCode,
            String materialName,
            String unit,
            BigDecimal safetyStockQty,
            RawMaterialStatus status
    ) {
        this.materialCode = requireText(materialCode, "원자재 코드");
        this.materialName = requireText(materialName, "원자재명");
        this.unit = requireText(unit, "단위");
        this.safetyStockQty = requireNonNegative(safetyStockQty, "안전 재고");
        this.status = Objects.requireNonNull(status, "원자재 상태는 필수입니다.");
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }

    private static BigDecimal requireNonNegative(BigDecimal value, String fieldName) {
        if (value == null || value.signum() < 0) {
            throw new IllegalArgumentException(fieldName + "은(는) 0 이상이어야 합니다.");
        }
        return value;
    }

    public enum RawMaterialStatus {
        ACTIVE("사용 중"),
        INACTIVE("사용 중지");

        private final String label;

        RawMaterialStatus(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
