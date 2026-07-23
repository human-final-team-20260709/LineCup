package com.human.linecup.controller;

import com.human.linecup.dto.response.DefectTypeResponse;
import com.human.linecup.service.DefectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/quality/defect-types")
@RequiredArgsConstructor
public class DefectTypeController {

    private final DefectService defectService;

    @GetMapping
    public List<DefectTypeResponse> getActiveDefectTypes() {
        return defectService.getActiveDefectTypes();
    }
}
