package com.human.linecup.service;

import com.human.linecup.dto.response.CommunicationLogResponse;
import com.human.linecup.entity.CommunicationLog;
import com.human.linecup.entity.CommunicationLog.CommunicationDirection;
import com.human.linecup.entity.L1Device;
import com.human.linecup.entity.L2Collector;
import com.human.linecup.repository.CommunicationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * L1↔L2, L2↔백엔드 통신 이력을 기록/조회한다.
 * 기록 자체는 다른 서비스(L1DeviceService, L2CollectorService)가 하트비트를 처리하는
 * 과정에서 호출하는 부수 동작이라 트랜잭션 전파는 호출부 트랜잭션에 편승한다(REQUIRED 기본값).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommunicationLogService {

    private final CommunicationLogRepository communicationLogRepository;

    @Transactional
    public void recordDeviceLog(L1Device device, CommunicationDirection direction, boolean success, String failReason, Instant occurredAt) {
        communicationLogRepository.save(
                CommunicationLog.record(device, null, direction, success, failReason, occurredAt)
        );
    }

    @Transactional
    public void recordCollectorLog(L2Collector collector, CommunicationDirection direction, boolean success, String failReason, Instant occurredAt) {
        communicationLogRepository.save(
                CommunicationLog.record(null, collector, direction, success, failReason, occurredAt)
        );
    }

    public Page<CommunicationLogResponse> getRecentLogs(Pageable pageable) {
        return communicationLogRepository.findAllByOrderByOccurredAtDesc(pageable).map(this::toResponse);
    }

    public Page<CommunicationLogResponse> getLogsByDevice(Long deviceId, Pageable pageable) {
        return communicationLogRepository
                .findAllByDevice_DeviceIdOrderByOccurredAtDesc(deviceId, pageable)
                .map(this::toResponse);
    }

    public Page<CommunicationLogResponse> getLogsByCollector(Long collectorId, Pageable pageable) {
        return communicationLogRepository
                .findAllByCollector_CollectorIdOrderByOccurredAtDesc(collectorId, pageable)
                .map(this::toResponse);
    }

    public Page<CommunicationLogResponse> getLogsBySuccess(boolean success, Pageable pageable) {
        return communicationLogRepository.findAllBySuccessOrderByOccurredAtDesc(success, pageable).map(this::toResponse);
    }

    public Page<CommunicationLogResponse> getLogsBetween(Instant from, Instant to, Pageable pageable) {
        if (!from.isBefore(to)) {
            throw new IllegalArgumentException("조회 시작 시각은 종료 시각보다 이전이어야 합니다.");
        }
        return communicationLogRepository
                .findAllByOccurredAtBetweenOrderByOccurredAtDesc(from, to, pageable)
                .map(this::toResponse);
    }

    public long getFailureCount(Instant from, Instant to) {
        return communicationLogRepository.countBySuccessFalseAndOccurredAtBetween(from, to);
    }

    private CommunicationLogResponse toResponse(CommunicationLog log) {
        return new CommunicationLogResponse(
                log.getLogId(),
                log.getDirection(),
                log.getDirection().getLabel(),
                log.getDevice() == null ? null : log.getDevice().getDeviceId(),
                log.getCollector() == null ? null : log.getCollector().getCollectorId(),
                log.isSuccess(),
                log.getFailReason(),
                log.getOccurredAt()
        );
    }
}
