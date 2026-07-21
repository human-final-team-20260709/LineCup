package com.human.linecup.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "l2_collector")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class L2Collector {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "collector_id")
    private Long collectorId;

    @Column(name = "collector_code", nullable = false, unique = true, length = 50)
    private String collectorCode;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CollectorStatus status;

    @Column(name = "connected_l1_count", nullable = false)
    private int connectedL1Count;

    @Enumerated(EnumType.STRING)
    @Column(name = "backend_connection_status", nullable = false, length = 20)
    private ConnectionStatus backendConnectionStatus;

    @Column(name = "last_sent_at")
    private Instant lastSentAt;

    public static L2Collector create(String collectorCode, String name) {
        L2Collector collector = new L2Collector();
        collector.collectorCode = requireText(collectorCode, "수집기 코드");
        collector.name = requireText(name, "수집기명");
        collector.status = CollectorStatus.STOPPED;
        collector.backendConnectionStatus = ConnectionStatus.DISCONNECTED;
        return collector;
    }

    public void updateHeartbeat(
            CollectorStatus status,
            int connectedL1Count,
            ConnectionStatus backendConnectionStatus,
            Instant lastSentAt
    ) {
        if (connectedL1Count < 0) {
            throw new IllegalArgumentException("연결된 L1 수는 0 이상이어야 합니다.");
        }
        this.status = Objects.requireNonNull(status, "수집기 상태는 필수입니다.");
        this.connectedL1Count = connectedL1Count;
        this.backendConnectionStatus = Objects.requireNonNull(
                backendConnectionStatus,
                "백엔드 연결 상태는 필수입니다."
        );
        this.lastSentAt = Objects.requireNonNull(lastSentAt, "최종 전송 시각은 필수입니다.");
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }

    public enum CollectorStatus {
        RUNNING("가동 중"),
        STOPPED("정지");

        private final String label;

        CollectorStatus(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
