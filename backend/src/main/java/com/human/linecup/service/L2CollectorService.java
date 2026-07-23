package com.human.linecup.service;

import com.human.linecup.dto.request.L2HeartbeatRequest;
import com.human.linecup.dto.response.L2StatusResponse;
import com.human.linecup.entity.CommunicationLog.CommunicationDirection;
import com.human.linecup.entity.ConnectionStatus;
import com.human.linecup.entity.L2Collector;
import com.human.linecup.repository.L2CollectorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

/**
 * L2 수집기 상태(백엔드 관점)를 관리한다.
 * 하트비트 처리는 두 단계로 나뉜다: (1) 수집기 자체의 상태 갱신, (2) 하트비트에 실려온
 * 개별 L1 장비 상태 위임 처리(L1DeviceService). 두 단계를 한 트랜잭션으로 묶어
 * 부분 반영(수집기는 갱신됐는데 장비 상태는 누락되는 등)을 방지한다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class L2CollectorService {

    private final L2CollectorRepository l2CollectorRepository;
    private final L1DeviceService l1DeviceService;
    private final CommunicationLogService communicationLogService;
    private final PlatformTransactionManager transactionManager;

    @Value("${mes.l2.stale-after:30s}")
    private Duration staleAfter;

    public List<L2StatusResponse> getAll() {
        return l2CollectorRepository.findAll().stream().map(this::toResponse).toList();
    }

    public L2StatusResponse getByCode(String collectorCode) {
        return toResponse(findByCode(collectorCode));
    }

    @Transactional
    public L2StatusResponse processHeartbeat(L2HeartbeatRequest request) {
        L2Collector collector = findOrCreate(request.collectorCode());
        collector.updateHeartbeat(
                L2Collector.CollectorStatus.RUNNING,
                request.connectedL1Count(),
                ConnectionStatus.CONNECTED,
                request.sentAt()
        );
        l2CollectorRepository.save(collector);

        request.devices().forEach(device -> l1DeviceService.applyHeartbeat(device, request.sentAt()));

        communicationLogService.recordCollectorLog(
                collector,
                CommunicationDirection.RX,
                true,
                null,
                request.sentAt()
        );

        return toResponse(collector);
    }

    private L2Collector findOrCreate(String collectorCode) {
        return l2CollectorRepository.findByCollectorCode(collectorCode)
                .orElseGet(() -> createSafely(collectorCode));
    }

    /**
     * collector_code UNIQUE 제약을 고려한 방어적 upsert. name은 최초 등록 시 collectorCode로
     * 초기화하고, 운영자가 설정 화면에서 나중에 사람이 읽기 좋은 이름으로 바꿀 수 있게 한다.
     */
    private L2Collector createSafely(String collectorCode) {
        TransactionTemplate registrationTransaction = new TransactionTemplate(transactionManager);
        registrationTransaction.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
        try {
            return Objects.requireNonNull(registrationTransaction.execute(status ->
                    l2CollectorRepository.saveAndFlush(L2Collector.create(collectorCode, collectorCode))
            ));
        } catch (DataIntegrityViolationException raceLoserException) {
            return l2CollectorRepository.findByCollectorCode(collectorCode)
                    .orElseThrow(() -> raceLoserException);
        }
    }

    private L2Collector findByCode(String collectorCode) {
        return l2CollectorRepository.findByCollectorCode(collectorCode)
                .orElseThrow(() -> new NoSuchElementException("L2 수집기를 찾을 수 없습니다. collectorCode=" + collectorCode));
    }

    private L2StatusResponse toResponse(L2Collector collector) {
        Instant lastSentAt = collector.getLastSentAt();
        boolean stale = lastSentAt == null || lastSentAt.isBefore(Instant.now().minus(staleAfter));
        L2Collector.CollectorStatus effectiveStatus = stale
                ? L2Collector.CollectorStatus.STOPPED
                : collector.getStatus();
        ConnectionStatus effectiveBackendStatus = stale
                ? ConnectionStatus.DISCONNECTED
                : collector.getBackendConnectionStatus();
        return new L2StatusResponse(
                collector.getCollectorId(),
                collector.getCollectorCode(),
                collector.getName(),
                effectiveStatus,
                effectiveStatus.getLabel(),
                stale ? 0 : collector.getConnectedL1Count(),
                L2EquipmentCatalog.EQUIPMENT_CODES.size(),
                effectiveBackendStatus,
                effectiveBackendStatus.getLabel(),
                lastSentAt
        );
    }
}
