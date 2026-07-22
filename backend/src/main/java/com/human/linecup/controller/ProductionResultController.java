package com.human.linecup.controller;

import com.human.linecup.dto.response.ProductionGroupResponse;
import com.human.linecup.dto.response.ProductionResultResponse;
import com.human.linecup.dto.response.ProductionSummaryResponse;
import com.human.linecup.service.ProductionResultService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
@RequestMapping("/api/production-results")
@RequiredArgsConstructor
public class ProductionResultController {

    private final ProductionResultService productionResultService;

    @GetMapping
    public List<ProductionResultResponse> getProductionResults(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to
    ) {
        return productionResultService.getProductionResults(from, to);
    }

    @GetMapping("/recent")
    public List<ProductionResultResponse> getRecentProductionResults(
            @RequestParam(defaultValue = "5") @Min(1) @Max(100) int limit
    ) {
        return productionResultService.getRecentProductionResults(limit);
    }

    @GetMapping("/summary")
    public ProductionSummaryResponse getProductionSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to
    ) {
        return productionResultService.getProductionSummary(from, to);
    }

    @GetMapping("/by-product")
    public List<ProductionGroupResponse> getProductionByProduct(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to
    ) {
        return productionResultService.getProductionByProduct(from, to);
    }

    @GetMapping("/by-work-order")
    public List<ProductionGroupResponse> getProductionByWorkOrder(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to
    ) {
        return productionResultService.getProductionByWorkOrder(from, to);
    }

    @GetMapping("/by-process")
    public List<ProductionGroupResponse> getProductionByProcess(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to
    ) {
        return productionResultService.getProductionByProcess(from, to);
    }

    @GetMapping("/lot/{productionLotId}")
    public ProductionResultResponse getProductionResultByLot(
            @PathVariable @Positive Long productionLotId
    ) {
        return productionResultService.getProductionResultByLot(productionLotId);
    }

    @GetMapping("/{resultNo}")
    public ProductionResultResponse getProductionResult(@PathVariable String resultNo) {
        return productionResultService.getProductionResult(resultNo);
    }
}
