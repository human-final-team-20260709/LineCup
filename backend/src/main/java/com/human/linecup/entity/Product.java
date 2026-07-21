package com.human.linecup.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * ERD 10.2 제품 (PRODUCT)
 *
 * ⚠️ 공용 참조 엔티티입니다. BOM/자재 섹션 담당자가 실제 제품 등록·BOM 연동 로직을
 * 구현할 예정이며, 작업지시 모듈에서는 WORK_ORDER.product_id FK 참조 및
 * 등록 화면(3.3)의 "제품 선택" 드롭다운 조회 용도로만 사용합니다.
 */
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

    @Column(name = "unit", length = 10)
    private String unit;

    @Column(name = "status", length = 20)
    private String status;
}
