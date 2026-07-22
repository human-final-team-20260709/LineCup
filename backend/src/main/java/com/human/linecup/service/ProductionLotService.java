package com.human.linecup.service;

import com.human.linecup.dto.request.ProductionLotMaterialRequest;
import com.human.linecup.dto.request.ProductionLotRequest;
import com.human.linecup.dto.response.ProcessProgressResponse;
import com.human.linecup.dto.response.ProductionLotMaterialResponse;
import com.human.linecup.dto.response.ProductionLotResponse;
import com.human.linecup.entity.Equipment;
import com.human.linecup.entity.ManufacturingProcess;
import com.human.linecup.entity.ProductionLot;
import com.human.linecup.entity.ProductionLot.ProductionLotStatus;
import com.human.linecup.entity.ProductionLotMaterial;
import com.human.linecup.entity.ProductionProcessProgress;
import com.human.linecup.entity.ProductionProcessProgress.ProcessProgressStatus;
import com.human.linecup.entity.RawMaterial;
import com.human.linecup.entity.RawMaterialLot;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.repository.ProductionLotMaterialRepository;
import com.human.linecup.repository.ProductionLotRepository;
import com.human.linecup.repository.ProductionProcessProgressRepository;
import com.human.linecup.repository.RawMaterialLotRepository;
import com.human.linecup.repository.WorkOrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collection;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductionLotService {

    private final ProductionLotRepository productionLotRepository;
    private final ProductionLotMaterialRepository productionLotMaterialRepository;
    private final ProductionProcessProgressRepository processProgressRepository;
    private final RawMaterialLotRepository rawMaterialLotRepository;
    private final WorkOrderRepository workOrderRepository;

    @Transactional
    public ProductionLotResponse createProductionLot(ProductionLotRequest request) {
        if (productionLotRepository.existsByLotNo(request.lotNo())) {
            throw new IllegalArgumentException("이미 사용 중인 생산 LOT 번호입니다: " + request.lotNo());
        }
        WorkOrder workOrder = workOrderRepository.findById(request.workOrderId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "작업지시를 찾을 수 없습니다: " + request.workOrderId()
                ));
        ProductionLot lot = ProductionLot.start(request.lotNo(), workOrder, request.startedAt());
        productionLotRepository.save(lot);
        return toResponse(lot, List.of(), List.of());
    }

    public ProductionLotResponse getProductionLot(Long productionLotId) {
        ProductionLot lot = findLot(productionLotId);
        return toResponse(
                lot,
                processProgressRepository
                        .findByProductionLotProductionLotIdOrderByManufacturingProcessSequenceAsc(productionLotId),
                productionLotMaterialRepository
                        .findByProductionLotProductionLotIdOrderByProductionLotMaterialIdAsc(productionLotId)
        );
    }

    public ProductionLotResponse getProductionLotByNumber(String lotNo) {
        ProductionLot lot = productionLotRepository.findByLotNo(lotNo)
                .orElseThrow(() -> new EntityNotFoundException("생산 LOT를 찾을 수 없습니다: " + lotNo));
        return getProductionLot(lot.getProductionLotId());
    }

    public List<ProductionLotResponse> getProductionLotsByWorkOrder(Long workOrderId) {
        return mapLots(productionLotRepository
                .findByWorkOrderWorkOrderIdOrderByStartedAtDesc(workOrderId));
    }

    public Page<ProductionLotResponse> searchProductionLots(
            String keyword,
            Collection<ProductionLotStatus> statuses,
            Pageable pageable
    ) {
        Collection<ProductionLotStatus> effectiveStatuses = statuses == null || statuses.isEmpty()
                ? EnumSet.allOf(ProductionLotStatus.class)
                : statuses;
        Page<ProductionLot> page = productionLotRepository.search(
                normalizeKeyword(keyword),
                effectiveStatuses,
                pageable
        );
        Map<Long, List<ProductionProcessProgress>> progresses = getProgressesByLotId(page.getContent());
        Map<Long, List<ProductionLotMaterial>> materials = getMaterialsByLotId(page.getContent());
        return page.map(lot -> toResponse(
                lot,
                progresses.getOrDefault(lot.getProductionLotId(), List.of()),
                materials.getOrDefault(lot.getProductionLotId(), List.of())
        ));
    }

    @Transactional
    public ProductionLotResponse updateQuantities(
            Long productionLotId,
            int productionQty,
            int goodQty,
            int defectQty
    ) {
        ProductionLot lot = findLot(productionLotId);
        if (lot.getStatus() == ProductionLotStatus.COMPLETED) {
            throw new IllegalStateException("완료된 생산 LOT의 수량은 변경할 수 없습니다.");
        }
        lot.updateQuantities(productionQty, goodQty, defectQty);
        return getProductionLot(productionLotId);
    }

    @Transactional
    public ProductionLotResponse holdProductionLot(Long productionLotId) {
        ProductionLot lot = findLot(productionLotId);
        requireStatus(lot, ProductionLotStatus.IN_PROGRESS, "생산 중인 LOT만 보류할 수 있습니다.");
        lot.hold();
        return getProductionLot(productionLotId);
    }

    @Transactional
    public ProductionLotResponse resumeProductionLot(Long productionLotId) {
        ProductionLot lot = findLot(productionLotId);
        requireStatus(lot, ProductionLotStatus.HOLD, "보류된 LOT만 생산을 재개할 수 있습니다.");
        lot.resume();
        return getProductionLot(productionLotId);
    }

    @Transactional
    public ProductionLotResponse completeProductionLot(Long productionLotId, Instant completedAt) {
        ProductionLot lot = findLot(productionLotId);
        requireStatus(lot, ProductionLotStatus.IN_PROGRESS, "생산 중인 LOT만 완료할 수 있습니다.");
        lot.complete(completedAt);
        return getProductionLot(productionLotId);
    }

    @Transactional
    public ProductionLotMaterialResponse registerMaterialUsage(ProductionLotMaterialRequest request) {
        ProductionLot lot = findLot(request.productionLotId());
        if (lot.getStatus() == ProductionLotStatus.COMPLETED) {
            throw new IllegalStateException("완료된 생산 LOT에는 원자재를 추가 투입할 수 없습니다.");
        }
        if (productionLotMaterialRepository
                .existsByProductionLotProductionLotIdAndMaterialLotMaterialLotId(
                        request.productionLotId(),
                        request.materialLotId()
                )) {
            throw new IllegalArgumentException("해당 원자재 LOT가 이미 생산 LOT에 등록되어 있습니다.");
        }

        RawMaterialLot materialLot = rawMaterialLotRepository.findById(request.materialLotId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "원자재 LOT를 찾을 수 없습니다: " + request.materialLotId()
                ));
        BigDecimal remainingQty = materialLot.getCurrentQty().subtract(request.usedQty());
        if (remainingQty.signum() < 0) {
            throw new IllegalArgumentException("원자재 LOT의 현재고보다 많은 수량을 투입할 수 없습니다.");
        }

        materialLot.adjustCurrentQty(remainingQty);
        ProductionLotMaterial usage = ProductionLotMaterial.create(lot, materialLot, request.usedQty());
        return toMaterialResponse(productionLotMaterialRepository.save(usage));
    }

    @Transactional
    public void removeMaterialUsage(Long productionLotId, Long materialLotId) {
        ProductionLot lot = findLot(productionLotId);
        if (lot.getStatus() == ProductionLotStatus.COMPLETED) {
            throw new IllegalStateException("완료된 생산 LOT의 원자재 투입 내역은 삭제할 수 없습니다.");
        }
        ProductionLotMaterial usage = productionLotMaterialRepository
                .findByProductionLotProductionLotIdAndMaterialLotMaterialLotId(
                        productionLotId,
                        materialLotId
                )
                .orElseThrow(() -> new EntityNotFoundException("원자재 투입 내역을 찾을 수 없습니다."));
        RawMaterialLot materialLot = usage.getMaterialLot();
        materialLot.adjustCurrentQty(materialLot.getCurrentQty().add(usage.getUsedQty()));
        productionLotMaterialRepository.delete(usage);
    }

    private List<ProductionLotResponse> mapLots(List<ProductionLot> lots) {
        Map<Long, List<ProductionProcessProgress>> progresses = getProgressesByLotId(lots);
        Map<Long, List<ProductionLotMaterial>> materials = getMaterialsByLotId(lots);
        return lots.stream()
                .map(lot -> toResponse(
                        lot,
                        progresses.getOrDefault(lot.getProductionLotId(), List.of()),
                        materials.getOrDefault(lot.getProductionLotId(), List.of())
                ))
                .toList();
    }

    private Map<Long, List<ProductionProcessProgress>> getProgressesByLotId(List<ProductionLot> lots) {
        if (lots.isEmpty()) {
            return Map.of();
        }
        List<Long> lotIds = lots.stream().map(ProductionLot::getProductionLotId).toList();
        return processProgressRepository.findByProductionLotIds(lotIds).stream()
                .collect(Collectors.groupingBy(progress -> progress.getProductionLot().getProductionLotId()));
    }

    private Map<Long, List<ProductionLotMaterial>> getMaterialsByLotId(List<ProductionLot> lots) {
        if (lots.isEmpty()) {
            return Map.of();
        }
        List<Long> lotIds = lots.stream().map(ProductionLot::getProductionLotId).toList();
        return productionLotMaterialRepository.findByProductionLotIds(lotIds).stream()
                .collect(Collectors.groupingBy(usage -> usage.getProductionLot().getProductionLotId()));
    }

    private ProductionLotResponse toResponse(
            ProductionLot lot,
            List<ProductionProcessProgress> progresses,
            List<ProductionLotMaterial> materials
    ) {
        WorkOrder workOrder = lot.getWorkOrder();
        String currentProcess = progresses.stream()
                .filter(progress -> progress.getStatus() == ProcessProgressStatus.IN_PROGRESS)
                .map(progress -> progress.getManufacturingProcess().getProcessName())
                .findFirst()
                .orElse(null);
        return new ProductionLotResponse(
                lot.getProductionLotId(),
                lot.getLotNo(),
                workOrder.getWorkOrderId(),
                workOrder.getWorkOrderNo(),
                workOrder.getProduct().getProductId(),
                workOrder.getProduct().getProductCode(),
                workOrder.getProduct().getProductName(),
                lot.getProductionQty(),
                lot.getGoodQty(),
                lot.getDefectQty(),
                lot.getStatus(),
                lot.getStatus().getLabel(),
                lot.getStartedAt(),
                lot.getCompletedAt(),
                currentProcess,
                progresses.stream().map(this::toProgressResponse).toList(),
                materials.stream().map(this::toMaterialResponse).toList()
        );
    }

    private ProcessProgressResponse toProgressResponse(ProductionProcessProgress progress) {
        ManufacturingProcess process = progress.getManufacturingProcess();
        Equipment equipment = progress.getEquipment();
        return new ProcessProgressResponse(
                progress.getProcessProgressId(),
                process.getProcessId(),
                process.getProcessCode(),
                process.getProcessName(),
                equipment == null ? null : equipment.getEquipmentId(),
                equipment == null ? null : equipment.getEquipmentCode(),
                equipment == null ? null : equipment.getEquipmentName(),
                progress.getStatus(),
                progress.getStatus().getLabel(),
                progress.getTargetQty(),
                progress.getProductionQty(),
                progress.getGoodQty(),
                progress.getDefectQty(),
                progress.getStartedAt(),
                progress.getCompletedAt()
        );
    }

    private ProductionLotMaterialResponse toMaterialResponse(ProductionLotMaterial usage) {
        RawMaterialLot materialLot = usage.getMaterialLot();
        RawMaterial material = materialLot.getMaterial();
        return new ProductionLotMaterialResponse(
                usage.getProductionLotMaterialId(),
                materialLot.getMaterialLotId(),
                materialLot.getMaterialLotNo(),
                material.getMaterialCode(),
                material.getMaterialName(),
                usage.getUsedQty(),
                material.getUnit()
        );
    }

    private ProductionLot findLot(Long productionLotId) {
        return productionLotRepository.findById(productionLotId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "생산 LOT를 찾을 수 없습니다: " + productionLotId
                ));
    }

    private void requireStatus(ProductionLot lot, ProductionLotStatus status, String message) {
        if (lot.getStatus() != status) {
            throw new IllegalStateException(message);
        }
    }

    private String normalizeKeyword(String keyword) {
        return keyword == null || keyword.isBlank() ? null : keyword.trim();
    }
}
