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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "l1_device")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class L1Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_id")
    private Long deviceId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipment_id", nullable = false, unique = true)
    private Equipment equipment;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    private Integer port;

    @Enumerated(EnumType.STRING)
    @Column(name = "connection_status", nullable = false, length = 20)
    private ConnectionStatus connectionStatus;

    @Column(name = "last_received_at")
    private Instant lastReceivedAt;

    public static L1Device create(Equipment equipment, String ipAddress, Integer port) {
        L1Device device = new L1Device();
        device.equipment = Objects.requireNonNull(equipment, "설비는 필수입니다.");
        device.ipAddress = normalizeText(ipAddress);
        device.port = port;
        device.connectionStatus = ConnectionStatus.DISCONNECTED;
        return device;
    }

    public void updateConnection(ConnectionStatus connectionStatus, Integer port, Instant lastReceivedAt) {
        this.connectionStatus = Objects.requireNonNull(connectionStatus, "연결 상태는 필수입니다.");
        this.port = port;
        this.lastReceivedAt = lastReceivedAt;
    }

    public boolean isConnected() {
        return connectionStatus == ConnectionStatus.CONNECTED;
    }

    private static String normalizeText(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
