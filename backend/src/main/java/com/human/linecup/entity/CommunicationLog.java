package com.human.linecup.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/** ERD: COMMUNICATION_LOG — 통신 로그 */
@Entity
@Table(name = "communication_log", indexes = {
        @Index(name = "idx_comm_log_device_time", columnList = "device_id, occurred_at"),
        @Index(name = "idx_comm_log_collector_time", columnList = "collector_id, occurred_at"),
        @Index(name = "idx_comm_log_success_time", columnList = "success, occurred_at")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CommunicationLog {

    public static final String SEND = "송신";
    public static final String RECEIVE = "수신";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    // L1 <-> L2 로그인 경우 사용, nullable
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id")
    private L1Device device;

    // L2 <-> 백엔드 로그인 경우 사용, nullable
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collector_id")
    private L2Collector collector;

    // 송신 / 수신
    @Column(nullable = false, length = 10)
    private String direction;

    @Column(nullable = false)
    private boolean success;

    @Column(name = "fail_reason", length = 255)
    private String failReason;

    @Column(name = "occurred_at", nullable = false)
    private LocalDateTime occurredAt;

    @Builder
    public CommunicationLog(L1Device device, L2Collector collector, String direction,
                             boolean success, String failReason, LocalDateTime occurredAt) {
        this.device = device;
        this.collector = collector;
        this.direction = direction;
        this.success = success;
        this.failReason = failReason;
        this.occurredAt = occurredAt;
    }
}
