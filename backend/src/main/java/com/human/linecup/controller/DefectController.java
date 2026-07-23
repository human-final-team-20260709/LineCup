package com.human.linecup.controller;

import com.human.linecup.dto.request.DefectCreateRequest;
import com.human.linecup.dto.request.DefectSearchCondition;
import com.human.linecup.dto.request.UpdateDefectCauseRequest;
import com.human.linecup.dto.request.UpdateDefectHandlingRequest;
import com.human.linecup.dto.response.DefectDashboardResponse;
import com.human.linecup.dto.response.DefectDetailResponse;
import com.human.linecup.dto.response.DefectSummaryResponse;
import com.human.linecup.dto.response.DefectStatisticsResponse;
import com.human.linecup.service.DefectService;
import com.human.linecup.service.DefectStatisticsService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.validation.annotation.Validated;

import java.net.URI;
import java.time.Instant;

@RestController
@RequestMapping("/api/quality/defects")
@RequiredArgsConstructor
@Validated
public class DefectController {

    private final DefectService defectService;
    private final DefectStatisticsService defectStatisticsService;

    @GetMapping
    public Page<DefectSummaryResponse> getDefects(
            @Valid @ModelAttribute DefectSearchCondition condition,
            Pageable pageable
    ) {
        return defectService.search(condition, pageable);
    }

    @GetMapping("/dashboard")
    public DefectDashboardResponse getDashboard() {
        return defectService.getDashboard();
    }

    @GetMapping("/statistics")
    public DefectStatisticsResponse getStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to
    ) {
        return defectStatisticsService.getStatistics(from, to);
    }

    @GetMapping("/number/{defectNo}")
    public DefectDetailResponse getDefectByNo(@PathVariable String defectNo) {
        return defectService.getByDefectNo(defectNo);
    }

    @GetMapping("/{defectId}")
    public DefectDetailResponse getDefect(@PathVariable @Positive Long defectId) {
        return defectService.getDetail(defectId);
    }

    @PostMapping
    public ResponseEntity<DefectDetailResponse> createDefect(
            @Valid @RequestBody DefectCreateRequest request
    ) {
        DefectDetailResponse response = defectService.create(request);
        return ResponseEntity.created(URI.create(
                "/api/quality/defects/" + response.summary().defectId()
        )).body(response);
    }

    @PatchMapping("/{defectId}/cause")
    public DefectDetailResponse updateCause(
            @PathVariable @Positive Long defectId,
            @Valid @RequestBody UpdateDefectCauseRequest request
    ) {
        return defectService.updateCause(defectId, request);
    }

    @PatchMapping("/{defectId}/handling")
    public DefectDetailResponse updateHandling(
            @PathVariable @Positive Long defectId,
            @Valid @RequestBody UpdateDefectHandlingRequest request
    ) {
        return defectService.updateHandling(defectId, request);
    }
}
