package com.human.linecup.controller;

import com.human.linecup.dto.request.BomRequest;
import com.human.linecup.dto.response.BomResponse;
import com.human.linecup.entity.Bom.BomStatus;
import com.human.linecup.service.BomService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.net.URI;

import static org.springframework.data.domain.Sort.Direction.DESC;

@RestController
@RequestMapping("/api/boms")
@RequiredArgsConstructor
@Validated
public class BomController {

    private final BomService bomService;

    @PostMapping
    public ResponseEntity<BomResponse> createBom(@Valid @RequestBody BomRequest request) {
        BomResponse response = bomService.createBom(request);
        return ResponseEntity.created(URI.create("/api/boms/" + response.bomId())).body(response);
    }

    @GetMapping
    public Page<BomResponse> searchBoms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) BomStatus status,
            @PageableDefault(size = 20, sort = "bomId", direction = DESC) Pageable pageable
    ) {
        return bomService.searchBoms(keyword, status, pageable);
    }

    @GetMapping("/{bomId}")
    public BomResponse getBom(@PathVariable @Positive Long bomId) {
        return bomService.getBom(bomId);
    }

    @GetMapping("/code/{bomCode}")
    public BomResponse getBomByCode(@PathVariable String bomCode) {
        return bomService.getBomByCode(bomCode);
    }

    @GetMapping("/product/{productId}")
    public List<BomResponse> getBomsByProduct(@PathVariable @Positive Long productId) {
        return bomService.getBomsByProduct(productId);
    }

    @PutMapping("/{bomId}")
    public BomResponse updateBom(
            @PathVariable @Positive Long bomId,
            @Valid @RequestBody BomRequest request
    ) {
        return bomService.updateBom(bomId, request);
    }

    @DeleteMapping("/{bomId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBom(@PathVariable @Positive Long bomId) {
        bomService.deleteBom(bomId);
    }
}
