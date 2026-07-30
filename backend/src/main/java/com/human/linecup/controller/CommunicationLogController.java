package com.human.linecup.controller;

import com.human.linecup.dto.response.CommunicationLogResponse;
import com.human.linecup.service.CommunicationLogService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.constraints.Positive;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.annotation.Validated;

import java.time.Instant;

/**
 * L1↔L2, L2↔백엔드 통신 이력 조회를 다룬다. 기록(적재)은 L1DeviceService/L2CollectorService가
 * 하트비트 처리 과정에서 내부적으로 수행하므로 이 컨트롤러에는 쓰기 엔드포인트가 없다.
 */
@RestController
@RequestMapping("/api/communication-logs")
@RequiredArgsConstructor
@Validated
public class CommunicationLogController {

    private final CommunicationLogService communicationLogService;

    @GetMapping
    public Page<CommunicationLogResponse> getRecentLogs(
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return communicationLogService.getRecentLogs(pageable);
    }

    @GetMapping("/devices/{deviceId}")
    public Page<CommunicationLogResponse> getLogsByDevice(
            @PathVariable @Positive Long deviceId,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return communicationLogService.getLogsByDevice(deviceId, pageable);
    }

    @GetMapping("/collectors/{collectorId}")
    public Page<CommunicationLogResponse> getLogsByCollector(
            @PathVariable @Positive Long collectorId,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return communicationLogService.getLogsByCollector(collectorId, pageable);
    }

    @GetMapping("/success/{success}")
    public Page<CommunicationLogResponse> getLogsBySuccess(
            @PathVariable boolean success,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return communicationLogService.getLogsBySuccess(success, pageable);
    }

    @GetMapping("/between")
    public Page<CommunicationLogResponse> getLogsBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return communicationLogService.getLogsBetween(from, to, pageable);
    }

    @GetMapping("/failures/count")
    public long getFailureCount(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to
    ) {
        return communicationLogService.getFailureCount(from, to);
    }
}
