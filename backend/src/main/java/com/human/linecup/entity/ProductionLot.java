package com.human.linecup.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "PRODUCTION_LOT")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductionLot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "production_lot_id")
    private Long productionLotId;

    @Column(name = "lot_no", nullable = false, unique = true, length = 50)
    private String lotNo;

    // WORK_ORDER 엔티티가 합쳐지기 전까지 외래 키 값을 직접 보관한다.
    @Column(name = "work_order_id", nullable = false)
    private Long workOrderId;

    @Column(name = "production_qty", nullable = false)
    private Integer productionQty;

    @Column(name = "good_qty", nullable = false)
    private Integer goodQty;

    @Column(name = "defect_qty", nullable = false)
    private Integer defectQty;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
