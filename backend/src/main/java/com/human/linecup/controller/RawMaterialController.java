package com.human.linecup.controller;

import com.human.linecup.dto.request.RawMaterialRequest;
import com.human.linecup.dto.response.RawMaterialResponse;
import com.human.linecup.entity.RawMaterial.RawMaterialStatus;
import com.human.linecup.service.RawMaterialService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

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

    @PostMapping
    public ResponseEntity<RawMaterialResponse> create(
            @Valid @RequestBody RawMaterialRequest request
    ) {
        RawMaterialResponse response = rawMaterialService.create(request);
        return ResponseEntity.created(URI.create(
                "/api/raw-materials/" + response.materialId()
        )).body(response);
    }

    @PutMapping("/{materialId}")
    public RawMaterialResponse update(
            @PathVariable @Positive Long materialId,
            @Valid @RequestBody RawMaterialRequest request
    ) {
        return rawMaterialService.update(materialId, request);
    }
}
