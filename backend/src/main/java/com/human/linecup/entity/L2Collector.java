package com.human.linecup.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/** ERD: L2_COLLECTOR — L2 수집기 상태 */
@Entity
@Table(name = "l2_collector")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class L2Collector {

    public static final String RUNNING = "가동중";
    public static final String STOPPED = "정지";
    public static final String CONNECTED = "연결";
    public static final String DISCONNECTED = "끊김";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "collector_id")
    private Long collectorId;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "connected_l1_count", nullable = false)
    private int connectedL1Count;

    @Column(name = "backend_connection_status", nullable = false, length = 20)
    private String backendConnectionStatus;

    @Column(name = "last_sent_at")
    private LocalDateTime lastSentAt;

    @Builder
    public L2Collector(String name, String status, int connectedL1Count,
                        String backendConnectionStatus, LocalDateTime lastSentAt) {
        this.name = name;
        this.status = status;
        this.connectedL1Count = connectedL1Count;
        this.backendConnectionStatus = backendConnectionStatus;
        this.lastSentAt = lastSentAt;
    }

    public void update(String status, int connectedL1Count,
                        String backendConnectionStatus, LocalDateTime lastSentAt) {
        this.status = status;
        this.connectedL1Count = connectedL1Count;
        this.backendConnectionStatus = backendConnectionStatus;
        this.lastSentAt = lastSentAt;
    }
}
