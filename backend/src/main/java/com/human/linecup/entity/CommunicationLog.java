package com.human.linecup.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "communication_log", indexes = {
        @Index(name = "idx_comm_log_device_time", columnList = "device_id, occurred_at"),
        @Index(name = "idx_comm_log_collector_time", columnList = "collector_id, occurred_at"),
        @Index(name = "idx_comm_log_success_time", columnList = "success, occurred_at")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CommunicationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id")
    private L1Device device;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collector_id")
    private L2Collector collector;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private CommunicationDirection direction;

    @Column(nullable = false)
    private boolean success;

    @Column(name = "fail_reason", length = 255)
    private String failReason;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    public static CommunicationLog record(
            L1Device device,
            L2Collector collector,
            CommunicationDirection direction,
            boolean success,
            String failReason,
            Instant occurredAt
    ) {
        if ((device == null) == (collector == null)) {
            throw new IllegalArgumentException("L1 장비 또는 L2 수집기 중 하나만 지정해야 합니다.");
        }
        CommunicationLog log = new CommunicationLog();
        log.device = device;
        log.collector = collector;
        log.direction = Objects.requireNonNull(direction, "통신 방향은 필수입니다.");
        log.success = success;
        log.failReason = failReason == null || failReason.isBlank() ? null : failReason.trim();
        log.occurredAt = Objects.requireNonNull(occurredAt, "통신 시각은 필수입니다.");
        return log;
    }

    public enum CommunicationDirection {
        RX("수신"),
        TX("송신");

        private final String label;

        CommunicationDirection(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
