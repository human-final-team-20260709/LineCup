package com.human.linecup.controller;

import com.human.linecup.dto.request.ProductInventoryRequest;
import com.human.linecup.dto.response.ProductInventoryResponse;
import com.human.linecup.entity.InventoryStatus;
import com.human.linecup.service.ProductInventoryService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

import static org.springframework.data.domain.Sort.Direction.DESC;

@RestController
@RequestMapping("/api/product-inventories")
@RequiredArgsConstructor
@Validated
public class ProductInventoryController {

    private final ProductInventoryService productInventoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductInventoryResponse createInventory(
            @Valid @RequestBody ProductInventoryRequest request
    ) {
        return productInventoryService.createInventory(request);
    }

    @GetMapping
    public Page<ProductInventoryResponse> searchInventories(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) InventoryStatus status,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expiryFrom,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expiryTo,
            @PageableDefault(size = 20, sort = "createdAt", direction = DESC) Pageable pageable
    ) {
        return productInventoryService.searchInventories(
                keyword,
                status,
                expiryFrom,
                expiryTo,
                pageable
        );
    }

    @GetMapping("/{inventoryId}")
    public ProductInventoryResponse getInventory(@PathVariable @Positive Long inventoryId) {
        return productInventoryService.getInventory(inventoryId);
    }

    @GetMapping("/production-lot/{productionLotId}")
    public ProductInventoryResponse getInventoryByProductionLot(
            @PathVariable @Positive Long productionLotId
    ) {
        return productInventoryService.getInventoryByProductionLot(productionLotId);
    }

    @PatchMapping("/{inventoryId}/quantity")
    public ProductInventoryResponse adjustCurrentQty(
            @PathVariable @Positive Long inventoryId,
            @RequestParam @PositiveOrZero int currentQty
    ) {
        return productInventoryService.adjustCurrentQty(inventoryId, currentQty);
    }
}
