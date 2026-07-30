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

import java.util.Objects;

@Entity
@Table(
        name = "work_order_equipment",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_work_order_equipment",
                columnNames = {"work_order_id", "equipment_id"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkOrderEquipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "work_order_equipment_id")
    private Long workOrderEquipmentId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    public static WorkOrderEquipment create(WorkOrder workOrder, Equipment equipment) {
        WorkOrderEquipment mapping = new WorkOrderEquipment();
        mapping.workOrder = Objects.requireNonNull(workOrder, "작업지시는 필수입니다.");
        mapping.equipment = Objects.requireNonNull(equipment, "설비는 필수입니다.");
        return mapping;
    }
}
