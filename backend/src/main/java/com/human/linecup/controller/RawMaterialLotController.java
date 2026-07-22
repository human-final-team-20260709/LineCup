package com.human.linecup.controller;

import com.human.linecup.dto.request.RawMaterialLotRequest;
import com.human.linecup.dto.response.RawMaterialLotResponse;
import com.human.linecup.entity.InventoryStatus;
import com.human.linecup.service.RawMaterialLotService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Positive;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.springframework.data.domain.Sort.Direction.DESC;

@RestController
@RequestMapping("/api/raw-material-lots")
@RequiredArgsConstructor
@Validated
public class RawMaterialLotController {

    private final RawMaterialLotService rawMaterialLotService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RawMaterialLotResponse receiveLot(@Valid @RequestBody RawMaterialLotRequest request) {
        return rawMaterialLotService.receiveLot(request);
    }

    @GetMapping
    public Page<RawMaterialLotResponse> searchLots(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) InventoryStatus status,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expiryFrom,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expiryTo,
            @PageableDefault(size = 20, sort = "receivedDate", direction = DESC) Pageable pageable
    ) {
        return rawMaterialLotService.searchLots(
                keyword,
                status,
                expiryFrom,
                expiryTo,
                pageable
        );
    }

    @GetMapping("/{materialLotId}")
    public RawMaterialLotResponse getLot(@PathVariable @Positive Long materialLotId) {
        return rawMaterialLotService.getLot(materialLotId);
    }

    @GetMapping("/number/{materialLotNo}")
    public RawMaterialLotResponse getLotByNumber(@PathVariable String materialLotNo) {
        return rawMaterialLotService.getLotByNumber(materialLotNo);
    }

    @GetMapping("/material/{materialId}")
    public List<RawMaterialLotResponse> getLotsByMaterial(
            @PathVariable @Positive Long materialId
    ) {
        return rawMaterialLotService.getLotsByMaterial(materialId);
    }

    @PatchMapping("/{materialLotId}/quantity")
    public RawMaterialLotResponse adjustCurrentQty(
            @PathVariable @Positive Long materialLotId,
            @RequestParam @DecimalMin("0.0") BigDecimal currentQty
    ) {
        return rawMaterialLotService.adjustCurrentQty(materialLotId, currentQty);
    }
}
