package com.human.linecup.service;

import com.human.linecup.dto.request.ProductInventoryRequest;
import com.human.linecup.dto.request.InventoryMovementRequest;
import com.human.linecup.dto.response.ProductInventoryResponse;
import com.human.linecup.entity.InventoryStatus;
import com.human.linecup.entity.BusinessConflictException;
import com.human.linecup.entity.Product;
import com.human.linecup.entity.ProductInventory;
import com.human.linecup.entity.ProductionLot;
import com.human.linecup.entity.ProductionLot.ProductionLotStatus;
import com.human.linecup.entity.InventoryMovement.InventoryItemType;
import com.human.linecup.entity.InventoryMovement.InventoryMovementType;
import com.human.linecup.repository.ProductInventoryRepository;
import com.human.linecup.repository.ProductionLotRepository;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.time.Instant;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductInventoryService {

    private final ProductInventoryRepository productInventoryRepository;
    private final ProductionLotRepository productionLotRepository;
    private final InventoryMovementService inventoryMovementService;

    @Transactional
    public ProductInventoryResponse createInventory(ProductInventoryRequest request) {
        if (productInventoryRepository.existsByProductionLotProductionLotId(request.productionLotId())) {
            throw new BusinessConflictException("해당 생산 LOT의 완제품 재고가 이미 등록되어 있습니다.");
        }
        ProductionLot lot = productionLotRepository.findById(request.productionLotId())
                .orElseThrow(() -> new NoSuchElementException(
                        "생산 LOT를 찾을 수 없습니다: " + request.productionLotId()
                ));
        if (lot.getStatus() != ProductionLotStatus.COMPLETED) {
            throw new BusinessConflictException("완료된 생산 LOT만 완제품 재고로 등록할 수 있습니다.");
        }
        if (lot.getGoodQty() <= 0) {
            throw new BusinessConflictException("정상 생산 수량이 있는 LOT만 완제품 재고로 등록할 수 있습니다.");
        }
        ProductInventory inventory = ProductInventory.create(
                lot,
                0,
                request.safetyStockQty(),
                request.expiryDate()
        );
        ProductInventory saved = productInventoryRepository.saveAndFlush(inventory);
        inventoryMovementService.registerMovement(new InventoryMovementRequest(
                InventoryItemType.FINISHED_PRODUCT,
                InventoryMovementType.INBOUND,
                null,
                saved.getInventoryId(),
                BigDecimal.valueOf(lot.getGoodQty()),
                request.handledById(),
                Instant.now(),
                "생산 LOT 완제품 최초 입고"
        ));
        return toResponse(saved);
    }

    public ProductInventoryResponse getInventory(Long inventoryId) {
        return toResponse(findInventory(inventoryId));
    }

    public ProductInventoryResponse getInventoryByProductionLot(Long productionLotId) {
        ProductInventory inventory = productInventoryRepository
                .findByProductionLotProductionLotId(productionLotId)
                .orElseThrow(() -> new NoSuchElementException(
                        "생산 LOT의 완제품 재고를 찾을 수 없습니다: " + productionLotId
                ));
        return toResponse(inventory);
    }

    public Page<ProductInventoryResponse> searchInventories(
            String keyword,
            InventoryStatus status,
            LocalDate expiryFrom,
            LocalDate expiryTo,
            Pageable pageable
    ) {
        validateExpiryRange(expiryFrom, expiryTo);
        return productInventoryRepository.search(
                        normalizeKeyword(keyword),
                        status == null ? "ALL" : status.name(),
                        LocalDate.now(),
                        expiryFrom,
                        expiryTo,
                        pageable
                )
                .map(this::toResponse);
    }

    private ProductInventory findInventory(Long inventoryId) {
        return productInventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new NoSuchElementException(
                        "완제품 재고를 찾을 수 없습니다: " + inventoryId
                ));
    }

    private ProductInventoryResponse toResponse(ProductInventory inventory) {
        ProductionLot lot = inventory.getProductionLot();
        Product product = lot.getWorkOrder().getProduct();
        InventoryStatus status = inventory.inventoryStatus();
        return new ProductInventoryResponse(
                inventory.getInventoryId(),
                lot.getProductionLotId(),
                lot.getLotNo(),
                product.getProductId(),
                product.getProductCode(),
                product.getProductName(),
                inventory.getCurrentQty(),
                inventory.getSafetyStockQty(),
                product.getUnit(),
                inventory.getExpiryDate(),
                status,
                status.getLabel(),
                inventory.getCreatedAt()
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
