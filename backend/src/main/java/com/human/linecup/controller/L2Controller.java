package com.human.linecup.controller;

import com.human.linecup.dto.request.DefectIngestRequest;
import com.human.linecup.dto.request.HourlyProductionRequest;
import com.human.linecup.dto.request.L2HeartbeatRequest;
import com.human.linecup.dto.request.TelemetryBatchRequest;
import com.human.linecup.dto.response.DefectSummaryResponse;
import com.human.linecup.dto.response.HourlyProductionResponse;
import com.human.linecup.dto.response.L2ActiveWorkOrderResponse;
import com.human.linecup.dto.response.L2StatusResponse;
import com.human.linecup.service.DefectService;
import com.human.linecup.service.EquipmentTelemetryService;
import com.human.linecup.service.HourlyProductionService;
import com.human.linecup.service.L2CollectorService;
import com.human.linecup.service.WorkOrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseStatus;

/** C 기반 L2 수집기가 사용하는 외부 계약을 한 곳에서 관리한다. */
@Validated
@RestController
@RequestMapping("/api/l2")
@RequiredArgsConstructor
public class L2Controller {

    private final WorkOrderService workOrderService;
    private final EquipmentTelemetryService equipmentTelemetryService;
    private final HourlyProductionService hourlyProductionService;
    private final DefectService defectService;
    private final L2CollectorService l2CollectorService;

    @GetMapping("/work-orders/active")
    public ResponseEntity<L2ActiveWorkOrderResponse> getActiveWorkOrder(
            @RequestParam @NotBlank String collectorCode
    ) {
        return workOrderService.getActiveWorkOrderForL2(collectorCode)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PostMapping("/telemetry/batch")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void ingestTelemetry(@Valid @RequestBody TelemetryBatchRequest request) {
        equipmentTelemetryService.ingest(request);
    }

    @PostMapping("/hourly-productions")
    public HourlyProductionResponse saveHourlyProduction(
            @Valid @RequestBody HourlyProductionRequest request
    ) {
        return hourlyProductionService.saveHourlyProduction(request);
    }

    @PostMapping("/defects")
    public DefectSummaryResponse ingestDefect(@Valid @RequestBody DefectIngestRequest request) {
        return defectService.ingest(request);
    }

    @PostMapping("/status/heartbeat")
    public L2StatusResponse heartbeat(@Valid @RequestBody L2HeartbeatRequest request) {
        return l2CollectorService.processHeartbeat(request);
    }
}
