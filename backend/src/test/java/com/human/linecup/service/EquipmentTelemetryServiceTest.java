package com.human.linecup.service;

import com.human.linecup.dto.request.TelemetryBatchRequest;
import com.human.linecup.dto.request.TelemetryBatchRequest.TelemetrySampleRequest;
import com.human.linecup.entity.AlarmSeverity;
import com.human.linecup.entity.Equipment;
import com.human.linecup.entity.TelemetryMetricType;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.repository.EquipmentRepository;
import com.human.linecup.repository.EquipmentTelemetryRepository;
import com.human.linecup.repository.WorkOrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EquipmentTelemetryServiceTest {

    @Mock
    private EquipmentTelemetryRepository telemetryRepository;
    @Mock
    private EquipmentRepository equipmentRepository;
    @Mock
    private WorkOrderRepository workOrderRepository;
    @Mock
    private AlarmService alarmService;
    @InjectMocks
    private EquipmentTelemetryService equipmentTelemetryService;

    @Test
    void ingestCreatesCautionAlarmWhenTelemetryApproachesOperatingBoundary() {
        Instant measuredAt = Instant.parse("2026-07-28T02:30:00Z");
        Equipment equipment = equipment();
        WorkOrder workOrder = workOrder();
        when(equipmentRepository.findByEquipmentCode("MIXER-01"))
                .thenReturn(Optional.of(equipment));
        when(workOrderRepository.findById(1L)).thenReturn(Optional.of(workOrder));

        equipmentTelemetryService.ingest(batch("39.8", measuredAt));

        verify(alarmService).createTelemetryAlarmIfAbsent(
                eq(equipment),
                eq("혼합기 1호 온도 기준값 접근"),
                contains("상한 접근 상태"),
                eq(AlarmSeverity.CAUTION),
                eq(measuredAt)
        );
    }

    @Test
    void ingestCreatesWarningAlarmAtTwoPercentOutsideOperatingRange() {
        Instant measuredAt = Instant.parse("2026-07-28T02:30:00Z");
        Equipment equipment = equipment();
        WorkOrder workOrder = workOrder();
        when(equipmentRepository.findByEquipmentCode("MIXER-01"))
                .thenReturn(Optional.of(equipment));
        when(workOrderRepository.findById(1L)).thenReturn(Optional.of(workOrder));

        equipmentTelemetryService.ingest(batch("40.4", measuredAt));

        verify(alarmService).createTelemetryAlarmIfAbsent(
                eq(equipment),
                eq("혼합기 1호 온도 허용 범위 경미 이탈"),
                contains("상한 경미 이탈 상태"),
                eq(AlarmSeverity.WARNING),
                eq(measuredAt)
        );
    }

    @Test
    void ingestCreatesCriticalAlarmBeyondTwoPercentOutsideOperatingRange() {
        Instant measuredAt = Instant.parse("2026-07-28T02:30:00Z");
        Equipment equipment = equipment();
        WorkOrder workOrder = workOrder();
        when(equipmentRepository.findByEquipmentCode("MIXER-01"))
                .thenReturn(Optional.of(equipment));
        when(workOrderRepository.findById(1L)).thenReturn(Optional.of(workOrder));

        equipmentTelemetryService.ingest(batch("40.41", measuredAt));

        verify(alarmService).createTelemetryAlarmIfAbsent(
                eq(equipment),
                eq("혼합기 1호 온도 허용 범위 심각 이탈"),
                contains("상한 심각 이탈 상태"),
                eq(AlarmSeverity.CRITICAL),
                eq(measuredAt)
        );
    }

    @Test
    void ingestDoesNotCreateAlarmWhenTelemetryIsInsideOperatingRange() {
        Instant measuredAt = Instant.parse("2026-07-28T02:30:00Z");
        Equipment equipment = equipment();
        WorkOrder workOrder = workOrder();
        when(equipmentRepository.findByEquipmentCode("MIXER-01"))
                .thenReturn(Optional.of(equipment));
        when(workOrderRepository.findById(1L)).thenReturn(Optional.of(workOrder));

        equipmentTelemetryService.ingest(batch("30", measuredAt));

        verify(alarmService, never()).createTelemetryAlarmIfAbsent(
                eq(equipment),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any()
        );
    }

    private TelemetryBatchRequest batch(String value, Instant measuredAt) {
        return new TelemetryBatchRequest(List.of(new TelemetrySampleRequest(
                "MIXER-01",
                1L,
                TelemetryMetricType.TEMPERATURE,
                new BigDecimal(value),
                "C",
                measuredAt
        )));
    }

    private Equipment equipment() {
        Equipment equipment = mock(Equipment.class);
        when(equipment.getEquipmentId()).thenReturn(1L);
        when(equipment.getEquipmentCode()).thenReturn("MIXER-01");
        lenient().when(equipment.getEquipmentName()).thenReturn("혼합기 1호");
        return equipment;
    }

    private WorkOrder workOrder() {
        WorkOrder workOrder = mock(WorkOrder.class);
        when(workOrder.getWorkOrderId()).thenReturn(1L);
        return workOrder;
    }
}
