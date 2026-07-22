package com.human.linecup.service;

import com.human.linecup.dto.request.L2HeartbeatRequest.L1HeartbeatDeviceRequest;
import com.human.linecup.dto.response.L1DeviceResponse;
import com.human.linecup.entity.CommunicationLog.CommunicationDirection;
import com.human.linecup.entity.ConnectionStatus;
import com.human.linecup.entity.Equipment;
import com.human.linecup.entity.L1Device;
import com.human.linecup.repository.EquipmentRepository;
import com.human.linecup.repository.L1DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

/**
 * L1 장비(TCP 서버로 동작하는 개별 설비 제어기)의 연결 상태를 관리한다.
 * L1_DEVICE 행은 설비 등록 시점이 아니라 L2가 최초로 해당 설비의 연결 상태를 보고하는 시점에
 * 자동 생성된다(self-registration) — 설비 마스터 등록과 통신 인프라 등록의 책임을 분리하기 위함이다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class L1DeviceService {

    private final L1DeviceRepository l1DeviceRepository;
    private final EquipmentRepository equipmentRepository;
    private final CommunicationLogService communicationLogService;
    private final PlatformTransactionManager transactionManager;

    public List<L1DeviceResponse> getAll() {
        return l1DeviceRepository.findAllByOrderByEquipmentEquipmentIdAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public L1DeviceResponse getByEquipmentId(Long equipmentId) {
        return toResponse(findByEquipmentId(equipmentId));
    }

    /**
     * L2 하트비트 한 건에 포함된 개별 장비 상태를 반영한다.
     * 연결 상태 전이는 통신 로그로도 함께 남겨 장애 발생 시점 추적이 가능하도록 한다.
     */
    @Transactional
    public void applyHeartbeat(L1HeartbeatDeviceRequest deviceReport, Instant sentAt) {
        Equipment equipment = equipmentRepository.findByEquipmentCode(deviceReport.equipmentCode())
                .orElseThrow(() -> new NoSuchElementException(
                        "설비를 찾을 수 없습니다. equipmentCode=" + deviceReport.equipmentCode()
                ));

        L1Device device = findOrCreate(equipment);
        boolean success = deviceReport.connectionStatus() == ConnectionStatus.CONNECTED;
        // 리포트에 마지막 수신 시각이 실려오면 그 값을 신뢰하고,
        // 없으면 연결 중일 때만 하트비트 시각으로 갱신한다(끊긴 상태에서 시각을 갱신하면 장애 감지가 왜곡된다).
        Instant lastReceivedAt = deviceReport.lastReceivedAt() != null
                ? deviceReport.lastReceivedAt()
                : (success ? sentAt : device.getLastReceivedAt());

        device.updateConnection(deviceReport.connectionStatus(), deviceReport.port(), lastReceivedAt);
        l1DeviceRepository.save(device);

        String failReason = success ? null : "L1 장비 연결 끊김: " + deviceReport.equipmentCode();
        communicationLogService.recordDeviceLog(device, CommunicationDirection.RX, success, failReason, sentAt);
    }

    private L1Device findOrCreate(Equipment equipment) {
        return l1DeviceRepository.findByEquipmentEquipmentId(equipment.getEquipmentId())
                .orElseGet(() -> createSafely(equipment));
    }

    /**
     * equipment_id UNIQUE 제약 위반 가능성을 대비한 방어적 upsert.
     * 동시에 여러 하트비트 스레드가 같은 설비에 대해 최초 생성을 시도하는 극단적인 경쟁 상황에서도
     * 예외 없이 기존 행을 재조회해 반환한다.
     */
    private L1Device createSafely(Equipment equipment) {
        TransactionTemplate registrationTransaction = new TransactionTemplate(transactionManager);
        registrationTransaction.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
        try {
            return Objects.requireNonNull(registrationTransaction.execute(status ->
                    l1DeviceRepository.saveAndFlush(L1Device.create(equipment, null, null))
            ));
        } catch (DataIntegrityViolationException raceLoserException) {
            return l1DeviceRepository.findByEquipmentEquipmentId(equipment.getEquipmentId())
                    .orElseThrow(() -> raceLoserException);
        }
    }

    private L1Device findByEquipmentId(Long equipmentId) {
        return l1DeviceRepository.findByEquipmentEquipmentId(equipmentId)
                .orElseThrow(() -> new NoSuchElementException("L1 장비 연결 정보를 찾을 수 없습니다. equipmentId=" + equipmentId));
    }

    private L1DeviceResponse toResponse(L1Device device) {
        Equipment equipment = device.getEquipment();
        return new L1DeviceResponse(
                device.getDeviceId(),
                equipment.getEquipmentId(),
                equipment.getEquipmentCode(),
                equipment.getEquipmentName(),
                device.getIpAddress(),
                device.getPort(),
                device.getConnectionStatus(),
                device.getConnectionStatus().getLabel(),
                device.getLastReceivedAt()
        );
    }
}
