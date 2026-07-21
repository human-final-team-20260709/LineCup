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
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * WORK_ORDER_EQUIPMENT - (설비 매핑)
 * (work_order_id, equipment_id) 조합에 UNIQUE 제약 → 같은 작업지시에 같은 설비 중복 매핑 방지
 */
@Entity
@Table(
        name = "work_order_equipment",
        uniqueConstraints = @UniqueConstraint(columnNames = {"work_order_id", "equipment_id"})
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkOrderEquipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Builder
    public WorkOrderEquipment(WorkOrder workOrder, Equipment equipment) {
        this.workOrder = workOrder;
        this.equipment = equipment;
    }
}
