package com.human.linecup.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Objects;

@Entity
@Table(
        name = "equipment_assignment",
        indexes = @Index(name = "idx_equipment_assignment_active", columnList = "equipment_id, ended_at")
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EquipmentAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_assignment_id")
    private Long equipmentAssignmentId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "ended_at")
    private Instant endedAt;

    public static EquipmentAssignment assign(User user, Equipment equipment, Instant startedAt) {
        EquipmentAssignment assignment = new EquipmentAssignment();
        assignment.user = Objects.requireNonNull(user, "작업자는 필수입니다.");
        assignment.equipment = Objects.requireNonNull(equipment, "설비는 필수입니다.");
        assignment.startedAt = startedAt == null ? Instant.now() : startedAt;
        return assignment;
    }

    public void end(Instant endedAt) {
        Instant effectiveAt = endedAt == null ? Instant.now() : endedAt;
        if (effectiveAt.isBefore(startedAt)) {
            throw new IllegalArgumentException("배정 종료 시각은 시작 시각 이후여야 합니다.");
        }
        this.endedAt = effectiveAt;
    }

    public boolean isActive() {
        return endedAt == null;
    }
}
