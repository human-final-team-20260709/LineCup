package com.human.linecup.controller;

import com.human.linecup.dto.request.ProductionLotMaterialRequest;
import com.human.linecup.dto.request.ProductionLotRequest;
import com.human.linecup.dto.response.ProductionLotMaterialResponse;
import com.human.linecup.dto.response.ProductionLotResponse;
import com.human.linecup.entity.ProductionLot.ProductionLotStatus;
import com.human.linecup.service.ProductionLotService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.data.domain.Sort.Direction.DESC;

@RestController
@RequestMapping("/api/production-lots")
@RequiredArgsConstructor
@Validated
public class ProductionLotController {

    private final ProductionLotService productionLotService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductionLotResponse createProductionLot(
            @Valid @RequestBody ProductionLotRequest request
    ) {
        return productionLotService.createProductionLot(request);
    }

    @GetMapping
    public Page<ProductionLotResponse> searchProductionLots(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<ProductionLotStatus> statuses,
            @PageableDefault(size = 20, sort = "startedAt", direction = DESC) Pageable pageable
    ) {
        return productionLotService.searchProductionLots(keyword, statuses, pageable);
    }

    @GetMapping("/{productionLotId}")
    public ProductionLotResponse getProductionLot(
            @PathVariable @Positive Long productionLotId
    ) {
        return productionLotService.getProductionLot(productionLotId);
    }

    @GetMapping("/number/{lotNo}")
    public ProductionLotResponse getProductionLotByNumber(@PathVariable String lotNo) {
        return productionLotService.getProductionLotByNumber(lotNo);
    }

    @GetMapping("/work-order/{workOrderId}")
    public List<ProductionLotResponse> getProductionLotsByWorkOrder(
            @PathVariable @Positive Long workOrderId
    ) {
        return productionLotService.getProductionLotsByWorkOrder(workOrderId);
    }

    @PatchMapping("/{productionLotId}/quantities")
    public ProductionLotResponse updateQuantities(
            @PathVariable @Positive Long productionLotId,
            @RequestParam @PositiveOrZero int productionQty,
            @RequestParam @PositiveOrZero int goodQty,
            @RequestParam @PositiveOrZero int defectQty
    ) {
        return productionLotService.updateQuantities(
                productionLotId,
                productionQty,
                goodQty,
                defectQty
        );
    }

    @PostMapping("/materials")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductionLotMaterialResponse registerMaterialUsage(
            @Valid @RequestBody ProductionLotMaterialRequest request
    ) {
        return productionLotService.registerMaterialUsage(request);
    }

    @DeleteMapping("/{productionLotId}/materials/{materialLotId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMaterialUsage(
            @PathVariable @Positive Long productionLotId,
            @PathVariable @Positive Long materialLotId
    ) {
        productionLotService.removeMaterialUsage(productionLotId, materialLotId);
    }
}
