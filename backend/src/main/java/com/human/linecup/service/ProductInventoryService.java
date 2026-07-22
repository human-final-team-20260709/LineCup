package com.human.linecup.service;

import com.human.linecup.dto.request.ProductInventoryRequest;
import com.human.linecup.dto.response.ProductInventoryResponse;
import com.human.linecup.entity.InventoryStatus;
import com.human.linecup.entity.Product;
import com.human.linecup.entity.ProductInventory;
import com.human.linecup.entity.ProductionLot;
import com.human.linecup.entity.ProductionLot.ProductionLotStatus;
import com.human.linecup.repository.ProductInventoryRepository;
import com.human.linecup.repository.ProductionLotRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductInventoryService {

    private final ProductInventoryRepository productInventoryRepository;
    private final ProductionLotRepository productionLotRepository;

    @Transactional
    public ProductInventoryResponse createInventory(ProductInventoryRequest request) {
        if (productInventoryRepository.existsByProductionLotProductionLotId(request.productionLotId())) {
            throw new IllegalArgumentException("해당 생산 LOT의 완제품 재고가 이미 등록되어 있습니다.");
        }
        ProductionLot lot = productionLotRepository.findById(request.productionLotId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "생산 LOT를 찾을 수 없습니다: " + request.productionLotId()
                ));
        if (lot.getStatus() != ProductionLotStatus.COMPLETED) {
            throw new IllegalStateException("완료된 생산 LOT만 완제품 재고로 등록할 수 있습니다.");
        }
        validateMaximumQty(request.currentQty(), lot);

        ProductInventory inventory = ProductInventory.create(
                lot,
                request.currentQty(),
                request.safetyStockQty(),
                request.expiryDate()
        );
        return toResponse(productInventoryRepository.save(inventory));
    }

    public ProductInventoryResponse getInventory(Long inventoryId) {
        return toResponse(findInventory(inventoryId));
    }

    public ProductInventoryResponse getInventoryByProductionLot(Long productionLotId) {
        ProductInventory inventory = productInventoryRepository
                .findByProductionLotProductionLotId(productionLotId)
                .orElseThrow(() -> new EntityNotFoundException(
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
                        status,
                        LocalDate.now(),
                        expiryFrom,
                        expiryTo,
                        pageable
                )
                .map(this::toResponse);
    }

    @Transactional
    public ProductInventoryResponse adjustCurrentQty(Long inventoryId, int currentQty) {
        ProductInventory inventory = findInventory(inventoryId);
        validateMaximumQty(currentQty, inventory.getProductionLot());
        inventory.adjustCurrentQty(currentQty);
        return toResponse(inventory);
    }

    private ProductInventory findInventory(Long inventoryId) {
        return productInventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "완제품 재고를 찾을 수 없습니다: " + inventoryId
                ));
    }

    private void validateMaximumQty(int currentQty, ProductionLot lot) {
        if (currentQty > lot.getGoodQty()) {
            throw new IllegalArgumentException("완제품 재고는 생산 LOT의 정상 수량을 초과할 수 없습니다.");
        }
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
