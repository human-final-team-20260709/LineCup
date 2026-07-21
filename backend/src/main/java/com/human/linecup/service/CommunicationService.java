package com.human.linecup.service;

import com.human.linecup.dto.response.CommunicationLogResponse;
import com.human.linecup.dto.response.L1DeviceResponse;
import com.human.linecup.dto.response.L2StatusResponse;
import com.human.linecup.entity.CommunicationLog;
import com.human.linecup.entity.L1Device;
import com.human.linecup.entity.L2Collector;
import com.human.linecup.repository.CommunicationLogRepository;
import com.human.linecup.repository.L1DeviceRepository;
import com.human.linecup.repository.L2CollectorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommunicationService {

    private final L1DeviceRepository l1DeviceRepository;
    private final CommunicationLogRepository communicationLogRepository;
    private final L2CollectorRepository l2CollectorRepository;

    public List<L1DeviceResponse> getL1Devices() {
        return l1DeviceRepository.findAll(Sort.by("equipmentId")).stream()
                .map(L1DeviceResponse::from)
                .toList();
    }

    public L2StatusResponse getL2Status() {
        L2Collector collector = l2CollectorRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("L2 수집기 상태 정보가 없습니다."));
        return L2StatusResponse.from(collector, l1DeviceRepository.count());
    }

    public List<CommunicationLogResponse> getRecentLogs(int limit) {
        return communicationLogRepository
                .findAllByOrderByOccurredAtDesc(PageRequest.of(0, limit)).stream()
                .map(CommunicationLogResponse::from)
                .toList();
    }

    /** L1 설비로부터 수신 시 상태 갱신 + 통신 로그 적재 (C 수집기 연동용) */
    @Transactional
    public void recordReceive(Long equipmentId, boolean success, String failReason) {
        LocalDateTime now = LocalDateTime.now();
        L1Device device = l1DeviceRepository.findByEquipmentId(equipmentId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 L1 설비입니다: equipmentId=" + equipmentId));

        device.updateStatus(success ? L1Device.CONNECTED : L1Device.DISCONNECTED, now);

        communicationLogRepository.save(CommunicationLog.builder()
                .device(device)
                .direction(CommunicationLog.RECEIVE)
                .success(success)
                .failReason(success ? null : failReason)
                .occurredAt(now)
                .build());
    }

    /** L2 -> 백엔드 전송 결과 로그 적재 */
    @Transactional
    public void recordSend(Long collectorId, boolean success, String failReason) {
        LocalDateTime now = LocalDateTime.now();
        L2Collector collector = l2CollectorRepository.findById(collectorId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 L2 수집기입니다: " + collectorId));

        communicationLogRepository.save(CommunicationLog.builder()
                .collector(collector)
                .direction(CommunicationLog.SEND)
                .success(success)
                .failReason(success ? null : failReason)
                .occurredAt(now)
                .build());

        // 이 수집기(collectorId) 산하의 L1 장비 중 연결된 것만 카운트.
        // collector_id가 아직 배정되지 않은 L1 장비는 집계에서 제외된다.
        long connected = l1DeviceRepository.countByCollectorIdAndConnectionStatus(
                collectorId, L1Device.CONNECTED);
        collector.update(L2Collector.RUNNING, (int) connected,
                success ? L2Collector.CONNECTED : L2Collector.DISCONNECTED, now);
    }
}