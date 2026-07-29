package com.human.linecup.service;

import com.human.linecup.dto.request.ProductionLotMaterialRequest;
import com.human.linecup.dto.request.MaterialUsageReversalRequest;
import com.human.linecup.dto.request.InventoryMovementRequest;
import com.human.linecup.dto.response.ProcessProgressResponse;
import com.human.linecup.dto.response.ProductionLotMaterialResponse;
import com.human.linecup.dto.response.ProductionLotResponse;
import com.human.linecup.entity.Bom;
import com.human.linecup.entity.Bom.BomStatus;
import com.human.linecup.entity.BomItem;
import com.human.linecup.entity.Equipment;
import com.human.linecup.entity.BusinessConflictException;
import com.human.linecup.entity.InventoryMovement.InventoryItemType;
import com.human.linecup.entity.InventoryMovement.InventoryMovementType;
import com.human.linecup.entity.ManufacturingProcess;
import com.human.linecup.entity.ProductionLot;
import com.human.linecup.entity.ProductionLot.ProductionLotStatus;
import com.human.linecup.entity.ProductionLotMaterial;
import com.human.linecup.entity.ProductionProcessProgress;
import com.human.linecup.entity.ProductionProcessProgress.ProcessProgressStatus;
import com.human.linecup.entity.RawMaterial;
import com.human.linecup.entity.RawMaterialLot;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.entity.WorkOrderEquipment;
import com.human.linecup.repository.ManufacturingProcessRepository;
import com.human.linecup.repository.BomItemRepository;
import com.human.linecup.repository.BomRepository;
import com.human.linecup.repository.ProductionLotMaterialRepository;
import com.human.linecup.repository.ProductionLotRepository;
import com.human.linecup.repository.ProductionProcessProgressRepository;
import com.human.linecup.repository.RawMaterialLotRepository;
import com.human.linecup.repository.WorkOrderEquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.EnumSet;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductionLotService {

    private static final int MATERIAL_QUANTITY_SCALE = 3;

    private final ProductionLotRepository productionLotRepository;
    private final ProductionLotMaterialRepository productionLotMaterialRepository;
    private final ProductionProcessProgressRepository processProgressRepository;
    private final RawMaterialLotRepository rawMaterialLotRepository;
    private final BomRepository bomRepository;
    private final BomItemRepository bomItemRepository;
    private final WorkOrderEquipmentRepository workOrderEquipmentRepository;
    private final ManufacturingProcessRepository manufacturingProcessRepository;
    private final InventoryMovementService inventoryMovementService;

    @Transactional
    public ProductionLot createPendingForWorkOrder(WorkOrder workOrder) {
        String lotNo = deriveLotNo(workOrder.getWorkOrderNo());
        if (productionLotRepository.existsByLotNo(lotNo)
                || productionLotRepository.existsByWorkOrderWorkOrderId(workOrder.getWorkOrderId())) {
            throw new BusinessConflictException("작업지시에 이미 생산 LOT가 있습니다: " + workOrder.getWorkOrderNo());
        }
        if (workOrder.getStatus() != WorkOrder.Status.PENDING) {
            throw new BusinessConflictException("대기 중인 작업지시에만 생산 LOT를 생성할 수 있습니다.");
        }

        ProductionLot lot = productionLotRepository.saveAndFlush(
                ProductionLot.createPending(lotNo, workOrder)
        );
        initializeProcessProgresses(lot, workOrder);
        return lot;
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
                .orElseThrow(() -> new NoSuchElementException("생산 LOT를 찾을 수 없습니다: " + lotNo));
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
    public ProductionLot applyWorkOrderAction(Long workOrderId, WorkOrder.Action action, Instant occurredAt) {
        Instant effectiveAt = occurredAt == null ? Instant.now() : occurredAt;
        ProductionLotStatus requiredStatus = switch (action) {
            case START -> ProductionLotStatus.PENDING;
            case HOLD, COMPLETE -> ProductionLotStatus.IN_PROGRESS;
            case RESUME -> ProductionLotStatus.HOLD;
            case REGISTERED -> throw new IllegalArgumentException("등록 액션은 생산 LOT 전환에 사용할 수 없습니다.");
        };
        ProductionLot lot = productionLotRepository
                .findFirstByWorkOrderWorkOrderIdAndStatusInOrderByStartedAtDesc(
                        workOrderId,
                        EnumSet.of(requiredStatus)
                )
                .orElseThrow(() -> new BusinessConflictException(
                        "작업 상태 변경에 필요한 생산 LOT가 없습니다: workOrderId=" + workOrderId
                                + ", requiredStatus=" + requiredStatus
                ));
        List<ProductionProcessProgress> progresses = processProgressRepository
                .findByProductionLotProductionLotIdOrderByManufacturingProcessSequenceAsc(
                        lot.getProductionLotId()
                );
        validateProgressTransition(progresses, action);

        switch (action) {
            case START -> lot.start(effectiveAt);
            case HOLD -> lot.hold();
            case RESUME -> lot.resume();
            case COMPLETE -> lot.complete(effectiveAt);
            case REGISTERED -> throw new IllegalArgumentException("등록 액션은 생산 LOT 전환에 사용할 수 없습니다.");
        }
        transitionProgresses(progresses, action, effectiveAt);
        return lot;
    }

    public ProductionLot getActiveProductionLot(Long workOrderId) {
        return productionLotRepository
                .findFirstByWorkOrderWorkOrderIdAndStatusInOrderByStartedAtDesc(
                        workOrderId,
                        EnumSet.of(ProductionLotStatus.IN_PROGRESS, ProductionLotStatus.HOLD)
                )
                .orElseThrow(() -> new NoSuchElementException(
                        "활성 생산 LOT가 없습니다: workOrderId=" + workOrderId
                ));
    }

    @Transactional
    public void registerBomMaterialUsageForStart(
            ProductionLot lot,
            int targetQty,
            Long handledById
    ) {
        if (lot.getStatus() != ProductionLotStatus.IN_PROGRESS) {
            throw new BusinessConflictException("생산 시작 상태의 LOT만 BOM 자재를 자동 투입할 수 있습니다.");
        }
        Bom bom = findActiveBom(lot);
        List<BomItem> items = bomItemRepository
                .findByBomBomIdOrderByBomItemIdAsc(bom.getBomId())
                .stream()
                .sorted(Comparator.comparing(item -> item.getRawMaterial().getMaterialId()))
                .toList();
        if (items.isEmpty()) {
            throw new BusinessConflictException("활성 BOM에 원자재 항목이 없습니다: " + bom.getBomCode());
        }

        List<ProductionLotMaterial> existingUsages = productionLotMaterialRepository
                .findByProductionLotProductionLotIdOrderByProductionLotMaterialIdAsc(
                        lot.getProductionLotId()
                );
        Map<Long, BigDecimal> existingQtyByMaterialId = summarizeExistingBomUsage(
                items,
                existingUsages
        );
        List<MaterialAllocation> allocations = planMaterialAllocations(
                items,
                existingQtyByMaterialId,
                targetQty
        );

        for (MaterialAllocation allocation : allocations) {
            recordMaterialUsage(
                    lot,
                    allocation.materialLot(),
                    allocation.quantity(),
                    handledById,
                    "생산 LOT BOM 자동 투입: " + lot.getLotNo()
            );
        }
    }

    @Transactional
    public ProductionLotMaterialResponse registerMaterialUsage(
            Long productionLotId,
            ProductionLotMaterialRequest request
    ) {
        ProductionLot lot = findLot(productionLotId);
        if (lot.getStatus() != ProductionLotStatus.IN_PROGRESS
                && lot.getStatus() != ProductionLotStatus.HOLD) {
            throw new BusinessConflictException("생산 중이거나 보류 중인 LOT에만 원자재를 추가 투입할 수 있습니다.");
        }

        RawMaterialLot materialLot = rawMaterialLotRepository.findByIdForUpdate(request.materialLotId())
                .orElseThrow(() -> new NoSuchElementException(
                        "원자재 LOT를 찾을 수 없습니다: " + request.materialLotId()
                ));
        if (materialLot.getExpiryDate().isBefore(LocalDate.now())) {
            throw new BusinessConflictException("유통기한이 지난 원자재 LOT는 투입할 수 없습니다.");
        }
        Bom bom = findActiveBom(lot);
        if (!bomItemRepository.existsByBomBomIdAndRawMaterialMaterialId(
                bom.getBomId(),
                materialLot.getMaterial().getMaterialId()
        )) {
            throw new BusinessConflictException(
                    "활성 BOM에 포함되지 않은 원자재는 추가 투입할 수 없습니다: "
                            + materialLot.getMaterial().getMaterialName()
            );
        }

        ProductionLotMaterial usage = recordMaterialUsage(
                lot,
                materialLot,
                request.usedQty(),
                request.handledById(),
                "생산 LOT 원자재 투입: " + lot.getLotNo()
        );
        return toMaterialResponse(usage);
    }

    @Transactional
    public void reverseMaterialUsage(
            Long productionLotId,
            Long materialLotId,
            MaterialUsageReversalRequest request
    ) {
        ProductionLot lot = findLot(productionLotId);
        if (lot.getStatus() == ProductionLotStatus.COMPLETED) {
            throw new BusinessConflictException("완료된 생산 LOT의 원자재 투입 내역은 취소할 수 없습니다.");
        }
        ProductionLotMaterial usage = productionLotMaterialRepository
                .findByProductionLotProductionLotIdAndMaterialLotMaterialLotId(
                        productionLotId,
                        materialLotId
                )
                .orElseThrow(() -> new NoSuchElementException("원자재 투입 내역을 찾을 수 없습니다."));
        inventoryMovementService.registerMovement(new InventoryMovementRequest(
                InventoryItemType.RAW_MATERIAL,
                InventoryMovementType.INBOUND,
                materialLotId,
                null,
                usage.getUsedQty(),
                request.handledById(),
                Instant.now(),
                "생산 LOT 원자재 투입 취소: " + request.reason().trim()
        ));
        productionLotMaterialRepository.delete(usage);
    }

    private Bom findActiveBom(ProductionLot lot) {
        Long productId = lot.getWorkOrder().getProduct().getProductId();
        return bomRepository.findFirstByProductProductIdAndStatusOrderByBomIdDesc(
                        productId,
                        BomStatus.ACTIVE
                )
                .orElseThrow(() -> new BusinessConflictException(
                        "제품의 활성 BOM이 없어 작업을 시작하거나 자재를 투입할 수 없습니다: productId="
                                + productId
                ));
    }

    private Map<Long, BigDecimal> summarizeExistingBomUsage(
            List<BomItem> items,
            List<ProductionLotMaterial> existingUsages
    ) {
        Map<Long, BomItem> itemByMaterialId = items.stream()
                .collect(Collectors.toMap(
                        item -> item.getRawMaterial().getMaterialId(),
                        Function.identity()
                ));
        Map<Long, BigDecimal> quantities = new HashMap<>();
        for (ProductionLotMaterial usage : existingUsages) {
            Long materialId = usage.getMaterialLot().getMaterial().getMaterialId();
            if (!itemByMaterialId.containsKey(materialId)) {
                throw new BusinessConflictException(
                        "활성 BOM에 포함되지 않은 기존 사용 자재가 있어 작업을 시작할 수 없습니다: "
                                + usage.getMaterialLot().getMaterial().getMaterialName()
                );
            }
            quantities.merge(materialId, usage.getUsedQty(), BigDecimal::add);
        }
        return quantities;
    }

    private List<MaterialAllocation> planMaterialAllocations(
            List<BomItem> items,
            Map<Long, BigDecimal> existingQtyByMaterialId,
            int targetQty
    ) {
        List<MaterialAllocation> allocations = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (BomItem item : items) {
            RawMaterial material = item.getRawMaterial();
            BigDecimal requiredQty = calculateRequiredQuantity(item, targetQty);
            BigDecimal existingQty = existingQtyByMaterialId.getOrDefault(
                    material.getMaterialId(),
                    BigDecimal.ZERO
            );
            BigDecimal remainingQty = requiredQty.subtract(existingQty);
            if (remainingQty.signum() <= 0) {
                continue;
            }

            List<RawMaterialLot> availableLots = rawMaterialLotRepository
                    .findAvailableByMaterialIdForUpdate(material.getMaterialId(), today);
            BigDecimal availableQty = availableLots.stream()
                    .map(RawMaterialLot::getCurrentQty)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            if (availableQty.compareTo(remainingQty) < 0) {
                throw new BusinessConflictException(
                        "원자재 재고가 부족하여 작업을 시작할 수 없습니다: "
                                + material.getMaterialName()
                                + " (필요 " + formatQuantity(remainingQty)
                                + material.getUnit()
                                + ", 가용 " + formatQuantity(availableQty)
                                + material.getUnit() + ")"
                );
            }

            BigDecimal unallocatedQty = remainingQty;
            for (RawMaterialLot materialLot : availableLots) {
                if (unallocatedQty.signum() <= 0) {
                    break;
                }
                BigDecimal allocatedQty = materialLot.getCurrentQty().min(unallocatedQty);
                allocations.add(new MaterialAllocation(materialLot, allocatedQty));
                unallocatedQty = unallocatedQty.subtract(allocatedQty);
            }
        }
        return allocations;
    }

    private BigDecimal calculateRequiredQuantity(BomItem item, int targetQty) {
        BigDecimal lossMultiplier = BigDecimal.ONE.add(
                item.getLossRate().movePointLeft(2)
        );
        return item.getRequiredQty()
                .multiply(BigDecimal.valueOf(targetQty))
                .multiply(lossMultiplier)
                .setScale(MATERIAL_QUANTITY_SCALE, RoundingMode.CEILING);
    }

    private ProductionLotMaterial recordMaterialUsage(
            ProductionLot lot,
            RawMaterialLot materialLot,
            BigDecimal quantity,
            Long handledById,
            String remarks
    ) {
        inventoryMovementService.registerMovement(new InventoryMovementRequest(
                InventoryItemType.RAW_MATERIAL,
                InventoryMovementType.OUTBOUND,
                materialLot.getMaterialLotId(),
                null,
                quantity,
                handledById,
                Instant.now(),
                remarks
        ));
        ProductionLotMaterial usage = productionLotMaterialRepository
                .findByProductionLotProductionLotIdAndMaterialLotMaterialLotId(
                        lot.getProductionLotId(),
                        materialLot.getMaterialLotId()
                )
                .map(existing -> {
                    existing.increaseUsedQty(quantity);
                    return existing;
                })
                .orElseGet(() -> ProductionLotMaterial.create(lot, materialLot, quantity));
        return productionLotMaterialRepository.save(usage);
    }

    private String formatQuantity(BigDecimal quantity) {
        return quantity.stripTrailingZeros().toPlainString();
    }

    private record MaterialAllocation(RawMaterialLot materialLot, BigDecimal quantity) {
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

    private List<ProductionProcessProgress> initializeProcessProgresses(
            ProductionLot lot,
            WorkOrder workOrder
    ) {
        Map<Long, Equipment> equipmentByProcessId = workOrderEquipmentRepository
                .findByWorkOrder_WorkOrderId(workOrder.getWorkOrderId())
                .stream()
                .map(WorkOrderEquipment::getEquipment)
                .collect(Collectors.toMap(
                        equipment -> equipment.getManufacturingProcess().getProcessId(),
                        Function.identity(),
                        (left, right) -> Comparator.comparing(Equipment::getEquipmentId).compare(left, right) <= 0
                                ? left
                                : right
                ));

        List<ProductionProcessProgress> progresses = manufacturingProcessRepository
                .findByActiveTrueOrderBySequenceAsc()
                .stream()
                .map(process -> ProductionProcessProgress.create(
                        lot,
                        process,
                        equipmentByProcessId.get(process.getProcessId()),
                        workOrder.getTargetQty()
                ))
                .toList();
        return processProgressRepository.saveAll(progresses);
    }

    private void transitionProgresses(
            List<ProductionProcessProgress> progresses,
            WorkOrder.Action action,
            Instant occurredAt
    ) {
        int transitionedCount = 0;
        for (ProductionProcessProgress progress : progresses) {
            switch (action) {
                case START -> {
                    progress.start(occurredAt);
                    transitionedCount++;
                }
                case HOLD -> {
                    if (progress.getStatus() == ProcessProgressStatus.IN_PROGRESS) {
                        progress.hold();
                        transitionedCount++;
                    }
                }
                case RESUME -> {
                    if (progress.getStatus() == ProcessProgressStatus.HOLD) {
                        progress.resume();
                        transitionedCount++;
                    }
                }
                case COMPLETE -> {
                    if (progress.getStatus() == ProcessProgressStatus.IN_PROGRESS) {
                        progress.complete(occurredAt);
                        transitionedCount++;
                    }
                }
                case REGISTERED -> throw new IllegalArgumentException("등록 액션은 공정 전환에 사용할 수 없습니다.");
            }
        }
        if ((action == WorkOrder.Action.HOLD || action == WorkOrder.Action.RESUME)
                && transitionedCount == 0) {
            throw new BusinessConflictException(
                    action == WorkOrder.Action.HOLD
                            ? "보류할 수 있는 진행 중 공정이 없습니다."
                            : "재개할 수 있는 보류 공정이 없습니다."
            );
        }
    }

    private void validateProgressTransition(
            List<ProductionProcessProgress> progresses,
            WorkOrder.Action action
    ) {
        if (action != WorkOrder.Action.COMPLETE) {
            return;
        }
        boolean hasIncompleteProcess = progresses.stream().anyMatch(progress ->
                progress.getStatus() == ProcessProgressStatus.PENDING
                        || progress.getStatus() == ProcessProgressStatus.HOLD
        );
        if (hasIncompleteProcess) {
            throw new BusinessConflictException(
                    "대기 또는 보류 중인 공정이 남아 있어 작업지시를 완료할 수 없습니다."
            );
        }
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
        List<String> activeProcesses = progresses.stream()
                .filter(progress -> progress.getStatus() == ProcessProgressStatus.IN_PROGRESS)
                .map(progress -> progress.getManufacturingProcess().getProcessName())
                .toList();
        String currentProcess = activeProcesses.isEmpty()
                ? null
                : activeProcesses.size() == 1
                        ? activeProcesses.get(0)
                        : "독립 설비 " + activeProcesses.size() + "개 진행 중";
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
                .orElseThrow(() -> new NoSuchElementException(
                        "생산 LOT를 찾을 수 없습니다: " + productionLotId
                ));
    }

    private String deriveLotNo(String workOrderNo) {
        return workOrderNo.startsWith("WO-")
                ? "LOT-" + workOrderNo.substring(3)
                : "LOT-" + workOrderNo;
    }

    private String normalizeKeyword(String keyword) {
        return keyword == null || keyword.isBlank() ? null : keyword.trim();
    }
}
