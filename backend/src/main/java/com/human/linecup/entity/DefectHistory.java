package com.human.linecup.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * ERD 정식 테이블은 아니며, 프론트 DefectDetailPage 타임라인(history) 표시를 위한 보조 테이블.
 * 팀 ERD에 별도 처리이력 테이블이 이미 있다면 이 클래스는 제거하고 그쪽에 맞춰도 무방합니다.
 */
@Entity
@Table(name = "defect_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DefectHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "defect_id", nullable = false)
    private Defect defect;

    @Column(name = "occurred_at", nullable = false)
    private LocalDateTime occurredAt;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(nullable = false, length = 200)
    private String description;

    @Column(length = 20)
    private String tone;

    @Builder
    public DefectHistory(Defect defect, LocalDateTime occurredAt, String title,
                          String description, String tone) {
        this.defect = defect;
        this.occurredAt = occurredAt;
        this.title = title;
        this.description = description;
        this.tone = tone;
    }

    void assignDefect(Defect defect) {
        this.defect = defect;
    }
}
