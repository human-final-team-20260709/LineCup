package com.human.linecup.entity;

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

import java.util.Objects;

@Entity
@Table(
        name = "bom",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_bom_code", columnNames = "bom_code"),
                @UniqueConstraint(name = "uk_bom_product_version", columnNames = {"product_id", "version"})
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Bom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bom_id")
    private Long bomId;

    @Column(name = "bom_code", nullable = false, length = 30)
    private String bomCode;

    @Column(nullable = false, length = 20)
    private String version;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BomStatus status;

    @Column(columnDefinition = "TEXT")
    private String note;

    public static Bom create(
            String bomCode,
            String version,
            Product product,
            BomStatus status,
            String note
    ) {
        Bom bom = new Bom();
        bom.bomCode = requireText(bomCode, "BOM 코드");
        bom.version = requireText(version, "BOM 버전");
        bom.product = Objects.requireNonNull(product, "제품은 필수입니다.");
        bom.status = Objects.requireNonNull(status, "BOM 상태는 필수입니다.");
        bom.note = normalizeText(note);
        return bom;
    }

    public void change(BomStatus status, String note) {
        this.status = Objects.requireNonNull(status, "BOM 상태는 필수입니다.");
        this.note = normalizeText(note);
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

    public enum BomStatus {
        ACTIVE("사용 중"),
        REVIEW("검토"),
        INACTIVE("사용 중지");

        private final String label;

        BomStatus(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
