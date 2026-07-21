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
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "defect_handling_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DefectHandlingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "defect_handling_history_id")
    private Long defectHandlingHistoryId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "defect_id", nullable = false)
    private Defect defect;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DefectStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "handle_method", length = 20)
    private DefectHandleMethod handleMethod;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "handled_by_id", nullable = false)
    private User handledBy;

    @Column(name = "handled_at", nullable = false)
    private Instant handledAt;

    public static DefectHandlingHistory record(
            Defect defect,
            DefectStatus status,
            DefectHandleMethod handleMethod,
            String content,
            User handledBy,
            Instant handledAt
    ) {
        DefectHandlingHistory history = new DefectHandlingHistory();
        history.defect = Objects.requireNonNull(defect, "불량은 필수입니다.");
        history.status = Objects.requireNonNull(status, "불량 처리 상태는 필수입니다.");
        history.handleMethod = handleMethod;
        history.content = content == null || content.isBlank() ? null : content.trim();
        history.handledBy = Objects.requireNonNull(handledBy, "처리자는 필수입니다.");
        history.handledAt = handledAt == null ? Instant.now() : handledAt;
        return history;
    }
}
