package com.human.linecup.controller;

import com.human.linecup.dto.response.HourlyProductionResponse;
import com.human.linecup.service.HourlyProductionService;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@Validated
@RestController
@RequestMapping("/api/hourly-productions")
@RequiredArgsConstructor
public class HourlyProductionController {

    private final HourlyProductionService hourlyProductionService;

    @GetMapping("/{hourlyProductionId}")
    public HourlyProductionResponse getHourlyProduction(
            @PathVariable @Positive Long hourlyProductionId
    ) {
        return hourlyProductionService.getHourlyProduction(hourlyProductionId);
    }

    @GetMapping
    public List<HourlyProductionResponse> getHourlyProductions(
            @RequestParam(required = false) @Positive Long workOrderId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to
    ) {
        boolean hasFrom = from != null;
        boolean hasTo = to != null;
        if (hasFrom != hasTo) {
            throw new IllegalArgumentException("조회 시작 시각과 종료 시각은 함께 입력해야 합니다.");
        }

        if (workOrderId != null && hasFrom) {
            return hourlyProductionService.getHourlyProductionsByWorkOrderAndPeriod(workOrderId, from, to);
        }
        if (workOrderId != null) {
            return hourlyProductionService.getHourlyProductionsByWorkOrder(workOrderId);
        }
        if (hasFrom) {
            return hourlyProductionService.getHourlyProductionsByPeriod(from, to);
        }
        throw new IllegalArgumentException("작업지시 ID 또는 조회 기간을 입력해야 합니다.");
    }
}
