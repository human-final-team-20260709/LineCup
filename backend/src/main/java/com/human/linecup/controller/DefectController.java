package com.human.linecup.controller;

import com.human.linecup.dto.request.DefectCreateRequest;
import com.human.linecup.dto.request.DefectUpdateRequest;
import com.human.linecup.dto.response.DefectDashboardResponse;
import com.human.linecup.dto.response.DefectDetailResponse;
import com.human.linecup.dto.response.DefectListItemResponse;
import com.human.linecup.dto.response.DefectStatisticsResponse;
import com.human.linecup.service.DefectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quality/defects")
@RequiredArgsConstructor
public class DefectController {

    private final DefectService defectService;

    // 프론트 DefectListPage.js
    @GetMapping
    public Page<DefectListItemResponse> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(required = false) Long equipmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("occurredAt").descending());
        return defectService.search(keyword, status, equipmentId, pageable);
    }

    // 프론트 DefectDetailPage.js
    @GetMapping("/{id}")
    public DefectDetailResponse getDetail(@PathVariable Long id) {
        return defectService.getDetail(id);
    }

    // 프론트 DefectFormPage.js
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DefectDetailResponse create(@Valid @RequestBody DefectCreateRequest request) {
        return defectService.create(request);
    }

    // 프론트 DefectDetailPage.js - 처리 방법/담당자/상태 갱신
    @PatchMapping("/{id}")
    public DefectDetailResponse updateTreatment(@PathVariable Long id,
                                                 @Valid @RequestBody DefectUpdateRequest request) {
        return defectService.updateTreatment(id, request);
    }

    // 프론트 DefectDashboardPage.js
    @GetMapping("/dashboard")
    public DefectDashboardResponse getDashboard() {
        return defectService.getDashboard();
    }

    // 프론트 DefectStatisticsPage.js
    @GetMapping("/statistics")
    public DefectStatisticsResponse getStatistics() {
        return defectService.getStatistics();
    }
}
