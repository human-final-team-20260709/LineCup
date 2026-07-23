package com.human.linecup.controller;

import com.human.linecup.dto.request.TelemetryBatchRequest;
import com.human.linecup.dto.response.TelemetryResponse;
import com.human.linecup.service.EquipmentTelemetryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 설비 텔레메트리(온도/습도/속도 등) 배치 적재와 조회를 다룬다.
 * 적재는 L2 수집기 쪽에서 주기적으로 배치 전송하는 것을 전제로 한다.
 */
@RestController
@RequestMapping("/api/telemetry")
@RequiredArgsConstructor
public class EquipmentTelemetryController {

    private final EquipmentTelemetryService equipmentTelemetryService;

    @PostMapping
    public ResponseEntity<Void> ingest(@Valid @RequestBody TelemetryBatchRequest request) {
        equipmentTelemetryService.ingest(request);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/equipments/{equipmentId}/latest")
    public ResponseEntity<List<TelemetryResponse>> getLatestByEquipment(@PathVariable Long equipmentId) {
        return ResponseEntity.ok(equipmentTelemetryService.getLatestByEquipment(equipmentId));
    }

    @GetMapping("/work-orders/{workOrderId}")
    public ResponseEntity<List<TelemetryResponse>> getHistoryByWorkOrder(@PathVariable Long workOrderId) {
        return ResponseEntity.ok(equipmentTelemetryService.getHistoryByWorkOrder(workOrderId));
    }
}
