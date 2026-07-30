package com.human.linecup.service;

import com.human.linecup.dto.request.RawMaterialLotRequest;
import com.human.linecup.dto.request.InventoryMovementRequest;
import com.human.linecup.dto.response.RawMaterialLotResponse;
import com.human.linecup.entity.InventoryStatus;
import com.human.linecup.entity.BusinessConflictException;
import com.human.linecup.entity.RawMaterial;
import com.human.linecup.entity.RawMaterialLot;
import com.human.linecup.entity.InventoryMovement.InventoryItemType;
import com.human.linecup.entity.InventoryMovement.InventoryMovementType;
import com.human.linecup.repository.RawMaterialLotRepository;
import com.human.linecup.repository.RawMaterialRepository;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneOffset;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RawMaterialLotService {

    private final RawMaterialLotRepository rawMaterialLotRepository;
    private final RawMaterialRepository rawMaterialRepository;
    private final InventoryMovementService inventoryMovementService;

    @Transactional
    public RawMaterialLotResponse receiveLot(RawMaterialLotRequest request) {
        if (rawMaterialLotRepository.existsByMaterialLotNo(request.materialLotNo())) {
            throw new BusinessConflictException("이미 사용 중인 원자재 LOT 번호입니다: " + request.materialLotNo());
        }
        if (rawMaterialLotRepository.existsBySupplierNameAndSupplierLotNo(
                request.supplierName(),
                request.supplierLotNo()
        )) {
            throw new BusinessConflictException("해당 공급사의 LOT 번호가 이미 등록되어 있습니다.");
        }

        RawMaterial material = rawMaterialRepository.findById(request.materialId())
                .orElseThrow(() -> new NoSuchElementException(
                        "원자재를 찾을 수 없습니다: " + request.materialId()
                ));
        RawMaterialLot lot = RawMaterialLot.receive(
                request.materialLotNo(),
                material,
                request.supplierName(),
                request.supplierLotNo(),
                request.manufactureDate(),
                request.expiryDate(),
                request.receivedQty(),
                request.receivedDate()
        );
        RawMaterialLot saved = rawMaterialLotRepository.saveAndFlush(lot);
        inventoryMovementService.registerMovement(new InventoryMovementRequest(
                InventoryItemType.RAW_MATERIAL,
                InventoryMovementType.INBOUND,
                saved.getMaterialLotId(),
                null,
                request.receivedQty(),
                request.handledById(),
                request.receivedDate().atStartOfDay(ZoneOffset.UTC).toInstant(),
                "원자재 LOT 최초 입고"
        ));
        return toResponse(saved);
    }

    public RawMaterialLotResponse getLot(Long materialLotId) {
        return toResponse(findLot(materialLotId));
    }

    public RawMaterialLotResponse getLotByNumber(String materialLotNo) {
        RawMaterialLot lot = rawMaterialLotRepository.findByMaterialLotNo(materialLotNo)
                .orElseThrow(() -> new NoSuchElementException(
                        "원자재 LOT를 찾을 수 없습니다: " + materialLotNo
                ));
        return toResponse(lot);
    }

    public List<RawMaterialLotResponse> getLotsByMaterial(Long materialId) {
        return rawMaterialLotRepository.findByMaterialMaterialIdOrderByExpiryDateAsc(materialId).stream()
                .map(this::toResponse)
                .toList();
    }

    public Page<RawMaterialLotResponse> searchLots(
            String keyword,
            InventoryStatus status,
            LocalDate expiryFrom,
            LocalDate expiryTo,
            Pageable pageable
    ) {
        validateExpiryRange(expiryFrom, expiryTo);
        return rawMaterialLotRepository.search(
                        normalizeKeyword(keyword),
                        status == null ? "ALL" : status.name(),
                        LocalDate.now(),
                        expiryFrom,
                        expiryTo,
                        pageable
                )
                .map(this::toResponse);
    }

    private RawMaterialLot findLot(Long materialLotId) {
        return rawMaterialLotRepository.findById(materialLotId)
                .orElseThrow(() -> new NoSuchElementException(
                        "원자재 LOT를 찾을 수 없습니다: " + materialLotId
                ));
    }

    private RawMaterialLotResponse toResponse(RawMaterialLot lot) {
        RawMaterial material = lot.getMaterial();
        InventoryStatus status = lot.inventoryStatus();
        return new RawMaterialLotResponse(
                lot.getMaterialLotId(),
                lot.getMaterialLotNo(),
                material.getMaterialId(),
                material.getMaterialCode(),
                material.getMaterialName(),
                lot.getSupplierName(),
                lot.getSupplierLotNo(),
                lot.getManufactureDate(),
                lot.getExpiryDate(),
                lot.getReceivedQty(),
                lot.getCurrentQty(),
                material.getSafetyStockQty(),
                material.getUnit(),
                status,
                status.getLabel(),
                lot.getReceivedDate()
        );
    }

    private void validateExpiryRange(LocalDate expiryFrom, LocalDate expiryTo) {
        if (expiryFrom != null && expiryTo != null && expiryTo.isBefore(expiryFrom)) {
            throw new IllegalArgumentException("유통기한 종료일은 시작일보다 빠를 수 없습니다.");
        }
    }

    private String normalizeKeyword(String keyword) {
        return keyword == null || keyword.isBlank() ? null : keyword.trim();
    }
}
