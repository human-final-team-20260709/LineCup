package com.human.linecup.service;

import com.human.linecup.dto.request.InventoryMovementRequest;
import com.human.linecup.dto.response.InventoryMovementResponse;
import com.human.linecup.entity.ApprovalStatus;
import com.human.linecup.entity.BusinessConflictException;
import com.human.linecup.entity.InventoryMovement;
import com.human.linecup.entity.InventoryMovement.InventoryItemType;
import com.human.linecup.entity.InventoryMovement.InventoryMovementType;
import com.human.linecup.entity.Product;
import com.human.linecup.entity.ProductInventory;
import com.human.linecup.entity.RawMaterial;
import com.human.linecup.entity.RawMaterialLot;
import com.human.linecup.entity.User;
import com.human.linecup.repository.InventoryMovementRepository;
import com.human.linecup.repository.ProductInventoryRepository;
import com.human.linecup.repository.RawMaterialLotRepository;
import com.human.linecup.repository.UserRepository;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryMovementService {

    private static final DateTimeFormatter MOVEMENT_TIME_FORMAT =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmss").withZone(ZoneOffset.UTC);

    private final InventoryMovementRepository inventoryMovementRepository;
    private final RawMaterialLotRepository rawMaterialLotRepository;
    private final ProductInventoryRepository productInventoryRepository;
    private final UserRepository userRepository;

    @Transactional
    public InventoryMovementResponse registerMovement(InventoryMovementRequest request) {
        validateTarget(request);
        User handledBy = userRepository.findById(request.handledById())
                .orElseThrow(() -> new NoSuchElementException(
                        "담당자를 찾을 수 없습니다: " + request.handledById()
                ));
        if (handledBy.getApprovalStatus() != ApprovalStatus.APPROVED || !handledBy.isActive()) {
            throw new BusinessConflictException("승인된 활성 사용자만 재고 이동을 처리할 수 있습니다.");
        }
        String movementNo = generateMovementNo();
        Instant occurredAt = request.occurredAt() == null ? Instant.now() : request.occurredAt();

        InventoryMovement movement;
        if (request.itemType() == InventoryItemType.RAW_MATERIAL) {
            RawMaterialLot lot = rawMaterialLotRepository.findByIdForUpdate(request.rawMaterialLotId())
                    .orElseThrow(() -> new NoSuchElementException(
                            "원자재 LOT를 찾을 수 없습니다: " + request.rawMaterialLotId()
                    ));
            applyRawMaterialMovement(lot, request.movementType(), request.quantity());
            movement = InventoryMovement.forRawMaterial(
                    movementNo,
                    request.movementType(),
                    lot,
                    request.quantity(),
                    handledBy,
                    occurredAt,
                    request.remarks()
            );
        } else {
            ProductInventory inventory = productInventoryRepository.findByIdForUpdate(request.productInventoryId())
                    .orElseThrow(() -> new NoSuchElementException(
                            "완제품 재고를 찾을 수 없습니다: " + request.productInventoryId()
                    ));
            applyProductMovement(inventory, request.movementType(), request.quantity());
            movement = InventoryMovement.forFinishedProduct(
                    movementNo,
                    request.movementType(),
                    inventory,
                    request.quantity(),
                    handledBy,
                    occurredAt,
                    request.remarks()
            );
        }

        return toResponse(inventoryMovementRepository.save(movement));
    }

    public InventoryMovementResponse getMovement(Long movementId) {
        InventoryMovement movement = inventoryMovementRepository.findById(movementId)
                .orElseThrow(() -> new NoSuchElementException(
                        "재고 이동 이력을 찾을 수 없습니다: " + movementId
                ));
        return toResponse(movement);
    }

    public InventoryMovementResponse getMovementByNumber(String movementNo) {
        InventoryMovement movement = inventoryMovementRepository.findByMovementNo(movementNo)
                .orElseThrow(() -> new NoSuchElementException(
                        "재고 이동 이력을 찾을 수 없습니다: " + movementNo
                ));
        return toResponse(movement);
    }

    public List<InventoryMovementResponse> getRecentMovements(Pageable pageable) {
        return inventoryMovementRepository.findAllByOrderByOccurredAtDesc(pageable).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<InventoryMovementResponse> getMovementsByRawMaterialLot(Long materialLotId) {
        return inventoryMovementRepository
                .findByRawMaterialLotMaterialLotIdOrderByOccurredAtDesc(materialLotId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<InventoryMovementResponse> getMovementsByProductInventory(Long inventoryId) {
        return inventoryMovementRepository
                .findByProductInventoryInventoryIdOrderByOccurredAtDesc(inventoryId).stream()
                .map(this::toResponse)
                .toList();
    }

    public Page<InventoryMovementResponse> searchMovements(
            String keyword,
            InventoryItemType itemType,
            InventoryMovementType movementType,
            Instant occurredFrom,
            Instant occurredTo,
            Pageable pageable
    ) {
        if ((occurredFrom == null) != (occurredTo == null)) {
            throw new IllegalArgumentException("조회 시작 시각과 종료 시각은 함께 입력해야 합니다.");
        }
        if (occurredFrom != null && !occurredTo.isAfter(occurredFrom)) {
            throw new IllegalArgumentException("조회 종료 시각은 시작 시각보다 늦어야 합니다.");
        }
        return inventoryMovementRepository.search(
                        normalizeKeyword(keyword),
                        itemType,
                        movementType,
                        occurredFrom,
                        occurredTo,
                        pageable
                )
                .map(this::toResponse);
    }

    private void validateTarget(InventoryMovementRequest request) {
        boolean hasRawMaterial = request.rawMaterialLotId() != null;
        boolean hasProduct = request.productInventoryId() != null;
        if (hasRawMaterial == hasProduct) {
            throw new IllegalArgumentException("원자재 LOT와 완제품 재고 중 하나만 지정해야 합니다.");
        }
        if (request.itemType() == InventoryItemType.RAW_MATERIAL && !hasRawMaterial) {
            throw new IllegalArgumentException("원자재 이동에는 원자재 LOT ID가 필요합니다.");
        }
        if (request.itemType() == InventoryItemType.FINISHED_PRODUCT && !hasProduct) {
            throw new IllegalArgumentException("완제품 이동에는 완제품 재고 ID가 필요합니다.");
        }
    }

    private void applyRawMaterialMovement(
            RawMaterialLot lot,
            InventoryMovementType movementType,
            BigDecimal quantity
    ) {
        BigDecimal nextQty = switch (movementType) {
            case INBOUND -> lot.getCurrentQty().add(quantity);
            case OUTBOUND -> lot.getCurrentQty().subtract(quantity);
            // 조정 수량은 실사 후 확인된 현재고로 해석한다.
            case ADJUSTMENT -> quantity;
        };
        if (nextQty.signum() < 0) {
            throw new IllegalArgumentException("원자재 출고 수량이 현재고보다 많습니다.");
        }
        lot.adjustCurrentQty(nextQty);
    }

    private void applyProductMovement(
            ProductInventory inventory,
            InventoryMovementType movementType,
            BigDecimal quantity
    ) {
        int movementQty;
        try {
            movementQty = quantity.intValueExact();
        } catch (ArithmeticException exception) {
            throw new IllegalArgumentException("완제품 수량은 정수여야 합니다.", exception);
        }

        int nextQty = switch (movementType) {
            case INBOUND -> Math.addExact(inventory.getCurrentQty(), movementQty);
            case OUTBOUND -> inventory.getCurrentQty() - movementQty;
            // 조정 수량은 실사 후 확인된 현재고로 해석한다.
            case ADJUSTMENT -> movementQty;
        };
        if (nextQty < 0) {
            throw new IllegalArgumentException("완제품 출고 수량이 현재고보다 많습니다.");
        }
        if (nextQty > inventory.getProductionLot().getGoodQty()) {
            throw new IllegalArgumentException("완제품 재고는 생산 LOT의 정상 수량을 초과할 수 없습니다.");
        }
        inventory.adjustCurrentQty(nextQty);
    }

    private String generateMovementNo() {
        for (int attempt = 0; attempt < 10; attempt++) {
            String randomPart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            String movementNo = "MV-" + MOVEMENT_TIME_FORMAT.format(Instant.now()) + "-" + randomPart;
            if (!inventoryMovementRepository.existsByMovementNo(movementNo)) {
                return movementNo;
            }
        }
        throw new IllegalStateException("재고 이동 번호를 생성하지 못했습니다. 다시 시도하세요.");
    }

    private InventoryMovementResponse toResponse(InventoryMovement movement) {
        RawMaterialLot rawMaterialLot = movement.getRawMaterialLot();
        ProductInventory productInventory = movement.getProductInventory();
        RawMaterial rawMaterial = rawMaterialLot == null ? null : rawMaterialLot.getMaterial();
        Product product = productInventory == null
                ? null
                : productInventory.getProductionLot().getWorkOrder().getProduct();
        User handledBy = movement.getHandledBy();

        return new InventoryMovementResponse(
                movement.getMovementId(),
                movement.getMovementNo(),
                movement.getItemType(),
                movement.getItemType().getLabel(),
                movement.getMovementType(),
                movement.getMovementType().getLabel(),
                rawMaterialLot == null ? null : rawMaterialLot.getMaterialLotId(),
                productInventory == null ? null : productInventory.getInventoryId(),
                rawMaterialLot == null
                        ? productInventory.getProductionLot().getLotNo()
                        : rawMaterialLot.getMaterialLotNo(),
                rawMaterial == null ? product.getProductCode() : rawMaterial.getMaterialCode(),
                rawMaterial == null ? product.getProductName() : rawMaterial.getMaterialName(),
                movement.getQuantity(),
                handledBy.getUserId(),
                handledBy.getEmpNo(),
                handledBy.getName(),
                movement.getOccurredAt(),
                movement.getRemarks()
        );
    }

    private String normalizeKeyword(String keyword) {
        return keyword == null || keyword.isBlank() ? null : keyword.trim();
    }
}
