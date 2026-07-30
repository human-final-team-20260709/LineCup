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
        name = "worker_skill",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_worker_skill_name",
                columnNames = {"worker_profile_id", "skill_name"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkerSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "worker_skill_id")
    private Long workerSkillId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "worker_profile_id", nullable = false)
    private WorkerProfile workerProfile;

    @Column(name = "skill_name", nullable = false, length = 100)
    private String skillName;

    public static WorkerSkill create(WorkerProfile workerProfile, String skillName) {
        if (skillName == null || skillName.isBlank()) {
            throw new IllegalArgumentException("기능명은 필수입니다.");
        }
        WorkerSkill skill = new WorkerSkill();
        skill.workerProfile = Objects.requireNonNull(workerProfile, "작업자 프로필은 필수입니다.");
        skill.skillName = skillName.trim();
        return skill;
    }
}
