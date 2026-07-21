package com.human.linecup.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    private Integer port;

    @Column(name = "connection_status", nullable = false, length = 20)
    private String connectionStatus;

    @Column(name = "last_received_at")
    private LocalDateTime lastReceivedAt;

    @Builder
    public L1Device(Long equipmentId, String ipAddress, Integer port,
                     String connectionStatus, LocalDateTime lastReceivedAt) {
        this.equipmentId = equipmentId;
        this.ipAddress = ipAddress;
        this.port = port;
        this.connectionStatus = connectionStatus;
        this.lastReceivedAt = lastReceivedAt;
    }

    public void updateStatus(String connectionStatus, LocalDateTime receivedAt) {
        this.connectionStatus = connectionStatus;
        this.lastReceivedAt = receivedAt;
    }

    public boolean isConnected() {
        return CONNECTED.equals(connectionStatus);
    }
}