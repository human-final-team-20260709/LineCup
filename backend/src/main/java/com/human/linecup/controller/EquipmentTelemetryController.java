package com.human.linecup.controller;

import com.human.linecup.dto.response.TelemetryResponse;
import com.human.linecup.service.EquipmentTelemetryService;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.annotation.Validated;

import java.util.List;

/**
 * 설비 텔레메트리 조회를 다룬다. L2 배치 적재는 L2Controller가 담당한다.
 */
@RestController
@RequestMapping("/api/telemetry")
@RequiredArgsConstructor
@Validated
public class EquipmentTelemetryController {

    private final EquipmentTelemetryService equipmentTelemetryService;

    @GetMapping("/equipments/{equipmentId}/latest")
    public ResponseEntity<List<TelemetryResponse>> getLatestByEquipment(
            @PathVariable @Positive Long equipmentId
    ) {
        return ResponseEntity.ok(equipmentTelemetryService.getLatestByEquipment(equipmentId));
    }

    @GetMapping("/work-orders/{workOrderId}")
    public ResponseEntity<List<TelemetryResponse>> getHistoryByWorkOrder(
            @PathVariable @Positive Long workOrderId
    ) {
        return ResponseEntity.ok(equipmentTelemetryService.getHistoryByWorkOrder(workOrderId));
    }
}
