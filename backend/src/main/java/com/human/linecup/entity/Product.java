package com.human.linecup.entity;

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

import java.util.Objects;

@Entity
@Table(name = "product")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_code", nullable = false, unique = true, length = 30)
    private String productCode;

    @Column(name = "product_name", nullable = false, length = 100)
    private String productName;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 10)
    private String unit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProductStatus status;

    public static Product create(
            String productCode,
            String productName,
            String category,
            String unit,
            ProductStatus status
    ) {
        Product product = new Product();
        product.changeInfo(productCode, productName, category, unit, status);
        return product;
    }

    public void changeInfo(
            String productCode,
            String productName,
            String category,
            String unit,
            ProductStatus status
    ) {
        this.productCode = requireText(productCode, "제품 코드");
        this.productName = requireText(productName, "제품명");
        this.category = requireText(category, "제품 분류");
        this.unit = requireText(unit, "단위");
        this.status = Objects.requireNonNull(status, "제품 상태는 필수입니다.");
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }

    public enum ProductStatus {
        ACTIVE("사용 중"),
        REVIEW("검토"),
        INACTIVE("사용 중지");

        private final String label;

        ProductStatus(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
