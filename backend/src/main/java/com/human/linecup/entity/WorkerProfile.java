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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "worker_profile")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "worker_profile_id")
    private Long workerProfileId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "team_name", nullable = false, length = 50)
    private String teamName;

    @Enumerated(EnumType.STRING)
    @Column(name = "shift_type", nullable = false, length = 20)
    private ShiftType shiftType;

    @Column(name = "joined_date", nullable = false)
    private LocalDate joinedDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "primary_process_id", nullable = false)
    private ManufacturingProcess primaryProcess;

    public static WorkerProfile create(
            User user,
            String teamName,
            ShiftType shiftType,
            LocalDate joinedDate,
            ManufacturingProcess primaryProcess
    ) {
        WorkerProfile profile = new WorkerProfile();
        profile.user = Objects.requireNonNull(user, "사용자는 필수입니다.");
        profile.change(teamName, shiftType, joinedDate, primaryProcess);
        return profile;
    }

    public void change(
            String teamName,
            ShiftType shiftType,
            LocalDate joinedDate,
            ManufacturingProcess primaryProcess
    ) {
        if (teamName == null || teamName.isBlank()) {
            throw new IllegalArgumentException("팀명은 필수입니다.");
        }
        this.teamName = teamName.trim();
        this.shiftType = Objects.requireNonNull(shiftType, "교대조는 필수입니다.");
        this.joinedDate = Objects.requireNonNull(joinedDate, "입사일은 필수입니다.");
        this.primaryProcess = Objects.requireNonNull(primaryProcess, "주 공정은 필수입니다.");
    }

    public enum ShiftType {
        DAY("주간"),
        NIGHT("야간"),
        ROTATING("교대");

        private final String label;

        ShiftType(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
