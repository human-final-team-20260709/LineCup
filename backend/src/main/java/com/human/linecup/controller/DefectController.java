package com.human.linecup.controller;

import com.human.linecup.dto.request.DefectCreateRequest;
import com.human.linecup.dto.request.DefectIngestRequest;
import com.human.linecup.dto.request.DefectSearchCondition;
import com.human.linecup.dto.request.UpdateDefectCauseRequest;
import com.human.linecup.dto.request.UpdateDefectHandlingRequest;
import com.human.linecup.dto.response.DefectDashboardResponse;
import com.human.linecup.dto.response.DefectDetailResponse;
import com.human.linecup.dto.response.DefectSummaryResponse;
import com.human.linecup.service.DefectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DefectController {

    private final DefectService defectService;

    @GetMapping("/quality/defects")
    public Page<DefectSummaryResponse> getDefects(
            @Valid @ModelAttribute DefectSearchCondition condition,
            Pageable pageable
    ) {
        return defectService.search(condition, pageable);
    }

    @GetMapping("/quality/defects/dashboard")
    public DefectDashboardResponse getDashboard() {
        return defectService.getDashboard();
    }

    @GetMapping("/quality/defects/number/{defectNo}")
    public DefectDetailResponse getDefectByNo(@PathVariable String defectNo) {
        return defectService.getByDefectNo(defectNo);
    }

    @GetMapping("/quality/defects/{defectId}")
    public DefectDetailResponse getDefect(@PathVariable Long defectId) {
        return defectService.getDetail(defectId);
    }

    @PostMapping("/quality/defects")
    @ResponseStatus(HttpStatus.CREATED)
    public DefectDetailResponse createDefect(
            @Valid @RequestBody DefectCreateRequest request
    ) {
        return defectService.create(request);
    }

    @PostMapping("/l2/defects")
    public DefectSummaryResponse ingestDefect(
            @Valid @RequestBody DefectIngestRequest request
    ) {
        return defectService.ingest(request);
    }

    @PatchMapping("/quality/defects/{defectId}/cause")
    public DefectDetailResponse updateCause(
            @PathVariable Long defectId,
            @Valid @RequestBody UpdateDefectCauseRequest request
    ) {
        return defectService.updateCause(defectId, request);
    }

    @PatchMapping("/quality/defects/{defectId}/handling")
    public DefectDetailResponse updateHandling(
            @PathVariable Long defectId,
            @Valid @RequestBody UpdateDefectHandlingRequest request
    ) {
        return defectService.updateHandling(defectId, request);
    }
}
