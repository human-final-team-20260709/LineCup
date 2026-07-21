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

@Getter
@Entity
@Table(name = "alarm")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Alarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alarm_id")
    private Long alarmId;

    @Column(name = "alarm_no", nullable = false, unique = true, length = 30)
    private String alarmNo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "handler_id")
    private User handler;

    @Column(nullable = false, length = 255)
    private String message;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private AlarmSeverity severity;

    @Column(name = "handling_content", columnDefinition = "TEXT")
    private String handlingContent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AlarmStatus status;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    public static Alarm create(
            String alarmNo,
            Equipment equipment,
            String message,
            String description,
            AlarmSeverity severity,
            Instant occurredAt
    ) {
        Alarm alarm = new Alarm();
        alarm.alarmNo = requireText(alarmNo, "알람 번호");
        alarm.equipment = Objects.requireNonNull(equipment, "설비는 필수입니다.");
        alarm.message = requireText(message, "알람 메시지");
        alarm.description = normalizeText(description);
        alarm.severity = Objects.requireNonNull(severity, "알람 심각도는 필수입니다.");
        alarm.status = AlarmStatus.PENDING_CONFIRMATION;
        alarm.occurredAt = occurredAt == null ? Instant.now() : occurredAt;
        return alarm;
    }

    public void updateHandling(
            User handler,
            String handlingContent,
            AlarmStatus status,
            Instant resolvedAt
    ) {
        AlarmStatus next = Objects.requireNonNull(status, "알람 상태는 필수입니다.");
        if (this.status == AlarmStatus.RESOLVED && next != AlarmStatus.RESOLVED) {
            throw new IllegalStateException("처리 완료된 알람은 다시 열 수 없습니다.");
        }
        if (next == AlarmStatus.RESOLVED) {
            if (handler == null || handlingContent == null || handlingContent.isBlank()) {
                throw new IllegalArgumentException("처리 완료에는 처리자와 조치 내용이 필요합니다.");
            }
            Instant effectiveAt = resolvedAt == null ? Instant.now() : resolvedAt;
            if (effectiveAt.isBefore(occurredAt)) {
                throw new IllegalArgumentException("해제 시각은 발생 시각 이후여야 합니다.");
            }
            this.resolvedAt = effectiveAt;
        } else if (resolvedAt != null) {
            throw new IllegalArgumentException("처리 완료 상태가 아니면 해제 시각을 지정할 수 없습니다.");
        }
        this.handler = handler;
        this.handlingContent = normalizeText(handlingContent);
        this.status = next;
    }

    public boolean isHandled() {
        return status == AlarmStatus.RESOLVED && resolvedAt != null;
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
}
