package com.human.linecup.controller;

import com.human.linecup.dto.request.InventoryMovementRequest;
import com.human.linecup.dto.response.InventoryMovementResponse;
import com.human.linecup.entity.InventoryMovement.InventoryItemType;
import com.human.linecup.entity.InventoryMovement.InventoryMovementType;
import com.human.linecup.service.InventoryMovementService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/inventory-movements")
@RequiredArgsConstructor
@Validated
public class InventoryMovementController {

    private final InventoryMovementService inventoryMovementService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InventoryMovementResponse registerMovement(
            @Valid @RequestBody InventoryMovementRequest request
    ) {
        return inventoryMovementService.registerMovement(request);
    }

    @GetMapping
    public Page<InventoryMovementResponse> searchMovements(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) InventoryItemType itemType,
            @RequestParam(required = false) InventoryMovementType movementType,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant occurredFrom,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant occurredTo,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return inventoryMovementService.searchMovements(
                keyword,
                itemType,
                movementType,
                occurredFrom,
                occurredTo,
                pageable
        );
    }

    @GetMapping("/{movementId}")
    public InventoryMovementResponse getMovement(@PathVariable @Positive Long movementId) {
        return inventoryMovementService.getMovement(movementId);
    }

    @GetMapping("/number/{movementNo}")
    public InventoryMovementResponse getMovementByNumber(@PathVariable String movementNo) {
        return inventoryMovementService.getMovementByNumber(movementNo);
    }

    @GetMapping("/recent")
    public List<InventoryMovementResponse> getRecentMovements(
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return inventoryMovementService.getRecentMovements(pageable);
    }

    @GetMapping("/raw-material-lot/{materialLotId}")
    public List<InventoryMovementResponse> getMovementsByRawMaterialLot(
            @PathVariable @Positive Long materialLotId
    ) {
        return inventoryMovementService.getMovementsByRawMaterialLot(materialLotId);
    }

    @GetMapping("/product-inventory/{inventoryId}")
    public List<InventoryMovementResponse> getMovementsByProductInventory(
            @PathVariable @Positive Long inventoryId
    ) {
        return inventoryMovementService.getMovementsByProductInventory(inventoryId);
    }
}
