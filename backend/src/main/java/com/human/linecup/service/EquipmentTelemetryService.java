package com.human.linecup.service;

import com.human.linecup.dto.request.TelemetryBatchRequest;
import com.human.linecup.dto.request.TelemetryBatchRequest.TelemetrySampleRequest;
import com.human.linecup.dto.response.TelemetryResponse;
import com.human.linecup.entity.Equipment;
import com.human.linecup.entity.EquipmentTelemetry;
import com.human.linecup.entity.TelemetryMetricType;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.exception.ResourceNotFoundException;
import com.human.linecup.repository.EquipmentRepository;
import com.human.linecup.repository.EquipmentTelemetryRepository;
import com.human.linecup.repository.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 설비 텔레메트리(온도/습도/속도) 적재 및 조회를 담당한다.
 * L2 수집기가 초 단위로 보내는 배치를 한 번의 트랜잭션/한 번의 insert 묶음으로 처리해
 * 라운드트립과 쿼리 수를 최소화하는 데 초점을 둔다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EquipmentTelemetryService {

    private final EquipmentTelemetryRepository telemetryRepository;
    private final EquipmentRepository equipmentRepository;
    private final WorkOrderRepository workOrderRepository;

    /**
     * 배치 내 동일 설비/작업지시가 여러 샘플에 걸쳐 반복 등장하는 경우가 많아
     * 요청 1건당 조회 1회로 끝나도록 로컬 캐시를 사용한다(N+1 방지).
     */
    @Transactional
    public void ingest(TelemetryBatchRequest request) {
        Map<String, Equipment> equipmentCache = new HashMap<>();
        Map<Long, WorkOrder> workOrderCache = new HashMap<>();
        List<EquipmentTelemetry> entities = new ArrayList<>(request.samples().size());

        for (TelemetrySampleRequest sample : request.samples()) {
            Equipment equipment = equipmentCache.computeIfAbsent(
                    sample.equipmentCode(),
                    this::getEquipmentByCode
            );
            WorkOrder workOrder = workOrderCache.computeIfAbsent(
                    sample.workOrderId(),
                    this::getWorkOrder
            );

            entities.add(EquipmentTelemetry.record(
                    equipment,
                    workOrder,
                    sample.metricType(),
                    sample.value(),
                    sample.unit(),
                    sample.measuredAt()
            ));
        }

        telemetryRepository.saveAll(entities);
    }

    public List<TelemetryResponse> getLatestByEquipment(Long equipmentId) {
        List<TelemetryResponse> latest = new ArrayList<>(TelemetryMetricType.values().length);
        for (TelemetryMetricType metricType : TelemetryMetricType.values()) {
            telemetryRepository
                    .findFirstByEquipmentEquipmentIdAndMetricTypeOrderByMeasuredAtDescTelemetryIdDesc(
                            equipmentId,
                            metricType
                    )
                    .ifPresent(telemetry -> latest.add(toResponse(telemetry)));
        }
        return latest;
    }

    public List<TelemetryResponse> getHistoryByWorkOrder(Long workOrderId) {
        return telemetryRepository.findByWorkOrderWorkOrderIdOrderByMeasuredAtAscTelemetryIdAsc(workOrderId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private Equipment getEquipmentByCode(String equipmentCode) {
        return equipmentRepository.findByEquipmentCode(equipmentCode)
                .orElseThrow(() -> new ResourceNotFoundException("설비를 찾을 수 없습니다. equipmentCode=" + equipmentCode));
    }

    private WorkOrder getWorkOrder(Long workOrderId) {
        return workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> ResourceNotFoundException.of("작업지시", workOrderId));
    }

    private TelemetryResponse toResponse(EquipmentTelemetry telemetry) {
        return new TelemetryResponse(
                telemetry.getTelemetryId(),
                telemetry.getEquipment().getEquipmentId(),
                telemetry.getEquipment().getEquipmentCode(),
                telemetry.getWorkOrder().getWorkOrderId(),
                telemetry.getMetricType(),
                telemetry.getMetricType().getLabel(),
                telemetry.getValue(),
                telemetry.getUnit(),
                telemetry.getMeasuredAt()
        );
    }
}
