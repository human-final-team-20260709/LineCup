package com.human.linecup.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/** ERD: L1_DEVICE — L1 장비 연결 상태 */
@Entity
@Table(name = "l1_device")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class L1Device {

    public static final String CONNECTED = "연결";
    public static final String DISCONNECTED = "끊김";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_id")
    private Long deviceId;

    // FK -> EQUIPMENT, UNIQUE (EQUIPMENT 엔티티는 별도 모듈에서 관리 — 현재는 ID 컬럼만 보유)
    @Column(name = "equipment_id", nullable = false, unique = true)
    private Long equipmentId;

    // FK -> L2_COLLECTOR. 어느 L2 수집기 산하의 장비인지 명시 (기존 ERD에는 누락되어 있던 관계)
    @Column(name = "collector_id")
    private Long collectorId;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    private Integer port;

    @Column(name = "connection_status", nullable = false, length = 20)
    private String connectionStatus;

    @Column(name = "last_received_at")
    private LocalDateTime lastReceivedAt;

    @Builder
    public L1Device(Long equipmentId, Long collectorId, String ipAddress, Integer port,
                     String connectionStatus, LocalDateTime lastReceivedAt) {
        this.equipmentId = equipmentId;
        this.collectorId = collectorId;
        this.ipAddress = ipAddress;
        this.port = port;
        this.connectionStatus = connectionStatus;
        this.lastReceivedAt = lastReceivedAt;
    }

    public void updateStatus(String connectionStatus, LocalDateTime receivedAt) {
        this.connectionStatus = connectionStatus;
        this.lastReceivedAt = receivedAt;
    }

    public void assignCollector(Long collectorId) {
        this.collectorId = collectorId;
    }

    public boolean isConnected() {
        return CONNECTED.equals(connectionStatus);
    }
}