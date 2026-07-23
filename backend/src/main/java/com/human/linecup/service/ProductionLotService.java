package com.human.linecup.service;

import com.human.linecup.dto.request.ProductionLotMaterialRequest;
import com.human.linecup.dto.request.MaterialUsageReversalRequest;
import com.human.linecup.dto.request.InventoryMovementRequest;
import com.human.linecup.dto.response.ProcessProgressResponse;
import com.human.linecup.dto.response.ProductionLotMaterialResponse;
import com.human.linecup.dto.response.ProductionLotResponse;
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

import java.time.Instant;
import java.util.Collection;
import java.util.EnumSet;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductionLotService {

    private final ProductionLotRepository productionLotRepository;
    private final ProductionLotMaterialRepository productionLotMaterialRepository;
    private final ProductionProcessProgressRepository processProgressRepository;
    private final RawMaterialLotRepository rawMaterialLotRepository;
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
    public void applyWorkOrderAction(Long workOrderId, WorkOrder.Action action, Instant occurredAt) {
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

        switch (action) {
            case START -> lot.start(effectiveAt);
            case HOLD -> lot.hold();
            case RESUME -> lot.resume();
            case COMPLETE -> lot.complete(effectiveAt);
            case REGISTERED -> throw new IllegalArgumentException("등록 액션은 생산 LOT 전환에 사용할 수 없습니다.");
        }
        transitionProgresses(lot.getProductionLotId(), action, effectiveAt);
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
    public ProductionLotMaterialResponse registerMaterialUsage(
            Long productionLotId,
            ProductionLotMaterialRequest request
    ) {
        ProductionLot lot = findLot(productionLotId);
        if (lot.getStatus() == ProductionLotStatus.COMPLETED) {
            throw new BusinessConflictException("완료된 생산 LOT에는 원자재를 추가 투입할 수 없습니다.");
        }
        if (productionLotMaterialRepository
                .existsByProductionLotProductionLotIdAndMaterialLotMaterialLotId(
                        productionLotId,
                        request.materialLotId()
                )) {
            throw new BusinessConflictException("해당 원자재 LOT가 이미 생산 LOT에 등록되어 있습니다.");
        }

        RawMaterialLot materialLot = rawMaterialLotRepository.findById(request.materialLotId())
                .orElseThrow(() -> new NoSuchElementException(
                        "원자재 LOT를 찾을 수 없습니다: " + request.materialLotId()
                ));
        inventoryMovementService.registerMovement(new InventoryMovementRequest(
                InventoryItemType.RAW_MATERIAL,
                InventoryMovementType.OUTBOUND,
                request.materialLotId(),
                null,
                request.usedQty(),
                request.handledById(),
                Instant.now(),
                "생산 LOT 원자재 투입: " + lot.getLotNo()
        ));
        ProductionLotMaterial usage = ProductionLotMaterial.create(lot, materialLot, request.usedQty());
        return toMaterialResponse(productionLotMaterialRepository.save(usage));
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
            Long productionLotId,
            WorkOrder.Action action,
            Instant occurredAt
    ) {
        List<ProductionProcessProgress> progresses = processProgressRepository
                .findByProductionLotProductionLotIdOrderByManufacturingProcessSequenceAsc(productionLotId);
        for (ProductionProcessProgress progress : progresses) {
            switch (action) {
                case START -> progress.start(occurredAt);
                case HOLD -> progress.hold();
                case RESUME -> progress.resume();
                case COMPLETE -> progress.complete(occurredAt);
                case REGISTERED -> throw new IllegalArgumentException("등록 액션은 공정 전환에 사용할 수 없습니다.");
            }
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
