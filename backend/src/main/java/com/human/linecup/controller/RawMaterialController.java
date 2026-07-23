package com.human.linecup.controller;

import com.human.linecup.dto.response.RawMaterialResponse;
import com.human.linecup.entity.RawMaterial.RawMaterialStatus;
import com.human.linecup.service.RawMaterialService;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/raw-materials")
@RequiredArgsConstructor
public class RawMaterialController {

    private final RawMaterialService rawMaterialService;

    @GetMapping
    public Page<RawMaterialResponse> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) RawMaterialStatus status,
            @PageableDefault(size = 20, sort = {"materialName", "materialId"}) Pageable pageable
    ) {
        return rawMaterialService.search(keyword, status, pageable);
    }

    @GetMapping("/{materialId}")
    public RawMaterialResponse get(@PathVariable @Positive Long materialId) {
        return rawMaterialService.get(materialId);
    }
}
