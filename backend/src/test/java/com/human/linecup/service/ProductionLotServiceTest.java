package com.human.linecup.service;

import com.human.linecup.dto.request.InventoryMovementRequest;
import com.human.linecup.dto.request.ProductionLotMaterialRequest;
import com.human.linecup.entity.Bom;
import com.human.linecup.entity.BomItem;
import com.human.linecup.entity.BusinessConflictException;
import com.human.linecup.entity.Product;
import com.human.linecup.entity.ProductionLot;
import com.human.linecup.entity.ProductionLotMaterial;
import com.human.linecup.entity.ProductionProcessProgress;
import com.human.linecup.entity.ProductionProcessProgress.ProcessProgressStatus;
import com.human.linecup.entity.RawMaterial;
import com.human.linecup.entity.RawMaterialLot;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.repository.BomItemRepository;
import com.human.linecup.repository.BomRepository;
import com.human.linecup.repository.ManufacturingProcessRepository;
import com.human.linecup.repository.ProductionLotMaterialRepository;
import com.human.linecup.repository.ProductionLotRepository;
import com.human.linecup.repository.ProductionProcessProgressRepository;
import com.human.linecup.repository.RawMaterialLotRepository;
import com.human.linecup.repository.WorkOrderEquipmentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductionLotServiceTest {

    @Mock
    private ProductionLotRepository productionLotRepository;
    @Mock
    private ProductionLotMaterialRepository productionLotMaterialRepository;
    @Mock
    private ProductionProcessProgressRepository processProgressRepository;
    @Mock
    private RawMaterialLotRepository rawMaterialLotRepository;
    @Mock
    private BomRepository bomRepository;
    @Mock
    private BomItemRepository bomItemRepository;
    @Mock
    private WorkOrderEquipmentRepository workOrderEquipmentRepository;
    @Mock
    private ManufacturingProcessRepository manufacturingProcessRepository;
    @Mock
    private InventoryMovementService inventoryMovementService;
    @InjectMocks
    private ProductionLotService productionLotService;

    @Test
    void holdTransitionsOnlyInProgressProcesses() {
        ProductionLot lot = activeLot(10L);
        ProductionProcessProgress completed = progress(ProcessProgressStatus.COMPLETED);
        ProductionProcessProgress inProgress = progress(ProcessProgressStatus.IN_PROGRESS);
        ProductionProcessProgress pending = progress(ProcessProgressStatus.PENDING);
        stubLotAndProgresses(lot, List.of(completed, inProgress, pending));

        productionLotService.applyWorkOrderAction(1L, WorkOrder.Action.HOLD, Instant.now());

        verify(lot).hold();
        verify(inProgress).hold();
        verify(completed, never()).hold();
        verify(pending, never()).hold();
    }

    @Test
    void resumeTransitionsOnlyHeldProcesses() {
        ProductionLot lot = activeLot(10L);
        ProductionProcessProgress completed = progress(ProcessProgressStatus.COMPLETED);
        ProductionProcessProgress held = progress(ProcessProgressStatus.HOLD);
        ProductionProcessProgress pending = progress(ProcessProgressStatus.PENDING);
        stubLotAndProgresses(lot, List.of(completed, held, pending));

        productionLotService.applyWorkOrderAction(1L, WorkOrder.Action.RESUME, Instant.now());

        verify(lot).resume();
        verify(held).resume();
        verify(completed, never()).resume();
        verify(pending, never()).resume();
    }

    @Test
    void completeTransitionsInProgressAndSkipsCompletedProcesses() {
        ProductionLot lot = activeLot(10L);
        ProductionProcessProgress completed = progress(ProcessProgressStatus.COMPLETED);
        ProductionProcessProgress inProgress = progress(ProcessProgressStatus.IN_PROGRESS);
        stubLotAndProgresses(lot, List.of(completed, inProgress));
        Instant completedAt = Instant.now();

        productionLotService.applyWorkOrderAction(1L, WorkOrder.Action.COMPLETE, completedAt);

        verify(lot).complete(completedAt);
        verify(inProgress).complete(completedAt);
        verify(completed, never()).complete(completedAt);
    }

    @Test
    void completeRejectsPendingProcessBeforeLotTransition() {
        ProductionLot lot = activeLot(10L);
        ProductionProcessProgress pending = progress(ProcessProgressStatus.PENDING);
        stubLotAndProgresses(lot, List.of(pending));
        Instant completedAt = Instant.now();

        assertThrows(
                BusinessConflictException.class,
                () -> productionLotService.applyWorkOrderAction(
                        1L,
                        WorkOrder.Action.COMPLETE,
                        completedAt
                )
        );

        verify(lot, never()).complete(completedAt);
        verify(pending, never()).complete(completedAt);
    }

    @Test
    void startMaterialUsageAllocatesAcrossLotsInFefoOrder() {
        ProductionLot lot = lotForMaterialUsage();
        Bom bom = mock(Bom.class);
        BomItem item = mock(BomItem.class);
        RawMaterial material = mock(RawMaterial.class);
        RawMaterialLot firstLot = rawMaterialLot(101L, new BigDecimal("4.000"));
        RawMaterialLot secondLot = rawMaterialLot(102L, new BigDecimal("10.000"));
        when(bom.getBomId()).thenReturn(5L);
        when(item.getRawMaterial()).thenReturn(material);
        when(item.getRequiredQty()).thenReturn(new BigDecimal("0.600"));
        when(item.getLossRate()).thenReturn(BigDecimal.ZERO);
        when(material.getMaterialId()).thenReturn(7L);
        when(bomRepository.findFirstByProductProductIdAndStatusOrderByBomIdDesc(
                5L,
                Bom.BomStatus.ACTIVE
        )).thenReturn(Optional.of(bom));
        when(bomItemRepository.findByBomBomIdOrderByBomItemIdAsc(5L))
                .thenReturn(List.of(item));
        when(productionLotMaterialRepository
                .findByProductionLotProductionLotIdOrderByProductionLotMaterialIdAsc(10L))
                .thenReturn(List.of());
        when(rawMaterialLotRepository.findAvailableByMaterialIdForUpdate(
                eq(7L),
                any(LocalDate.class)
        )).thenReturn(List.of(firstLot, secondLot));
        when(productionLotMaterialRepository
                .findByProductionLotProductionLotIdAndMaterialLotMaterialLotId(
                        eq(10L),
                        any(Long.class)
                ))
                .thenReturn(Optional.empty());
        when(productionLotMaterialRepository.save(any(ProductionLotMaterial.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        productionLotService.registerBomMaterialUsageForStart(lot, 10, 9L);

        ArgumentCaptor<InventoryMovementRequest> movementCaptor =
                ArgumentCaptor.forClass(InventoryMovementRequest.class);
        verify(inventoryMovementService, org.mockito.Mockito.times(2))
                .registerMovement(movementCaptor.capture());
        List<InventoryMovementRequest> movements = movementCaptor.getAllValues();
        assertEquals(101L, movements.get(0).rawMaterialLotId());
        assertEquals(0, movements.get(0).quantity().compareTo(new BigDecimal("4.000")));
        assertEquals(102L, movements.get(1).rawMaterialLotId());
        assertEquals(0, movements.get(1).quantity().compareTo(new BigDecimal("2.000")));
    }

    @Test
    void startMaterialUsageAppliesLossRateAndRoundsUpToThreeDecimals() {
        ProductionLot lot = lotForMaterialUsage();
        Bom bom = mock(Bom.class);
        BomItem item = mock(BomItem.class);
        RawMaterial material = mock(RawMaterial.class);
        RawMaterialLot materialLot = rawMaterialLot(101L, new BigDecimal("10.000"));
        when(bom.getBomId()).thenReturn(5L);
        when(item.getRawMaterial()).thenReturn(material);
        when(item.getRequiredQty()).thenReturn(new BigDecimal("0.333"));
        when(item.getLossRate()).thenReturn(new BigDecimal("1.00"));
        when(material.getMaterialId()).thenReturn(7L);
        when(bomRepository.findFirstByProductProductIdAndStatusOrderByBomIdDesc(
                5L,
                Bom.BomStatus.ACTIVE
        )).thenReturn(Optional.of(bom));
        when(bomItemRepository.findByBomBomIdOrderByBomItemIdAsc(5L))
                .thenReturn(List.of(item));
        when(productionLotMaterialRepository
                .findByProductionLotProductionLotIdOrderByProductionLotMaterialIdAsc(10L))
                .thenReturn(List.of());
        when(rawMaterialLotRepository.findAvailableByMaterialIdForUpdate(
                eq(7L),
                any(LocalDate.class)
        )).thenReturn(List.of(materialLot));
        when(productionLotMaterialRepository
                .findByProductionLotProductionLotIdAndMaterialLotMaterialLotId(10L, 101L))
                .thenReturn(Optional.empty());
        when(productionLotMaterialRepository.save(any(ProductionLotMaterial.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        productionLotService.registerBomMaterialUsageForStart(lot, 3, 9L);

        ArgumentCaptor<InventoryMovementRequest> movementCaptor =
                ArgumentCaptor.forClass(InventoryMovementRequest.class);
        verify(inventoryMovementService).registerMovement(movementCaptor.capture());
        assertEquals(
                0,
                movementCaptor.getValue().quantity().compareTo(new BigDecimal("1.009"))
        );
    }

    @Test
    void startMaterialUsageRejectsInsufficientStockBeforeMovement() {
        ProductionLot lot = lotForMaterialUsage();
        Bom bom = mock(Bom.class);
        BomItem item = mock(BomItem.class);
        RawMaterial material = mock(RawMaterial.class);
        RawMaterialLot materialLot = mock(RawMaterialLot.class);
        when(materialLot.getCurrentQty()).thenReturn(new BigDecimal("5.000"));
        when(bom.getBomId()).thenReturn(5L);
        when(item.getRawMaterial()).thenReturn(material);
        when(item.getRequiredQty()).thenReturn(new BigDecimal("0.600"));
        when(item.getLossRate()).thenReturn(BigDecimal.ZERO);
        when(material.getMaterialId()).thenReturn(7L);
        when(material.getMaterialName()).thenReturn("소맥분");
        when(material.getUnit()).thenReturn("kg");
        when(bomRepository.findFirstByProductProductIdAndStatusOrderByBomIdDesc(
                5L,
                Bom.BomStatus.ACTIVE
        )).thenReturn(Optional.of(bom));
        when(bomItemRepository.findByBomBomIdOrderByBomItemIdAsc(5L))
                .thenReturn(List.of(item));
        when(productionLotMaterialRepository
                .findByProductionLotProductionLotIdOrderByProductionLotMaterialIdAsc(10L))
                .thenReturn(List.of());
        when(rawMaterialLotRepository.findAvailableByMaterialIdForUpdate(
                eq(7L),
                any(LocalDate.class)
        )).thenReturn(List.of(materialLot));

        assertThrows(
                BusinessConflictException.class,
                () -> productionLotService.registerBomMaterialUsageForStart(lot, 10, 9L)
        );

        verifyNoInteractions(inventoryMovementService);
    }

    @Test
    void startMaterialUsageRejectsMissingActiveBom() {
        ProductionLot lot = lotForMaterialUsage();
        when(bomRepository.findFirstByProductProductIdAndStatusOrderByBomIdDesc(
                5L,
                Bom.BomStatus.ACTIVE
        )).thenReturn(Optional.empty());

        assertThrows(
                BusinessConflictException.class,
                () -> productionLotService.registerBomMaterialUsageForStart(lot, 10, 9L)
        );

        verifyNoInteractions(inventoryMovementService);
    }

    @Test
    void manualMaterialUsageRejectsPendingLot() {
        ProductionLot lot = mock(ProductionLot.class);
        when(productionLotRepository.findById(10L)).thenReturn(Optional.of(lot));
        when(lot.getStatus()).thenReturn(ProductionLot.ProductionLotStatus.PENDING);

        assertThrows(
                BusinessConflictException.class,
                () -> productionLotService.registerMaterialUsage(
                        10L,
                        new ProductionLotMaterialRequest(
                                101L,
                                BigDecimal.ONE,
                                9L
                        )
                )
        );

        verifyNoInteractions(inventoryMovementService);
    }

    @Test
    void manualMaterialUsageRejectsMaterialOutsideActiveBom() {
        ProductionLot lot = lotForMaterialUsage();
        Bom bom = mock(Bom.class);
        RawMaterial material = mock(RawMaterial.class);
        RawMaterialLot materialLot = mock(RawMaterialLot.class);
        when(productionLotRepository.findById(10L)).thenReturn(Optional.of(lot));
        when(rawMaterialLotRepository.findByIdForUpdate(101L))
                .thenReturn(Optional.of(materialLot));
        when(materialLot.getExpiryDate()).thenReturn(LocalDate.now().plusDays(1));
        when(materialLot.getMaterial()).thenReturn(material);
        when(material.getMaterialId()).thenReturn(7L);
        when(material.getMaterialName()).thenReturn("BOM 외 자재");
        when(bom.getBomId()).thenReturn(5L);
        when(bomRepository.findFirstByProductProductIdAndStatusOrderByBomIdDesc(
                5L,
                Bom.BomStatus.ACTIVE
        )).thenReturn(Optional.of(bom));
        when(bomItemRepository.existsByBomBomIdAndRawMaterialMaterialId(5L, 7L))
                .thenReturn(false);

        assertThrows(
                BusinessConflictException.class,
                () -> productionLotService.registerMaterialUsage(
                        10L,
                        new ProductionLotMaterialRequest(
                                101L,
                                new BigDecimal("1.000"),
                                9L
                        )
                )
        );

        verifyNoInteractions(inventoryMovementService);
    }

    @Test
    void manualMaterialUsageIncreasesExistingLotUsage() {
        ProductionLot lot = lotForMaterialUsage();
        Bom bom = mock(Bom.class);
        RawMaterial material = mock(RawMaterial.class);
        RawMaterialLot materialLot = mock(RawMaterialLot.class);
        ProductionLotMaterial usage = mock(ProductionLotMaterial.class);
        BigDecimal additionalQty = new BigDecimal("1.250");
        when(productionLotRepository.findById(10L)).thenReturn(Optional.of(lot));
        when(lot.getLotNo()).thenReturn("LOT-001");
        when(rawMaterialLotRepository.findByIdForUpdate(101L))
                .thenReturn(Optional.of(materialLot));
        when(materialLot.getMaterialLotId()).thenReturn(101L);
        when(materialLot.getMaterialLotNo()).thenReturn("RM-LOT-001");
        when(materialLot.getExpiryDate()).thenReturn(LocalDate.now().plusDays(1));
        when(materialLot.getMaterial()).thenReturn(material);
        when(material.getMaterialId()).thenReturn(7L);
        when(material.getMaterialCode()).thenReturn("RM-001");
        when(material.getMaterialName()).thenReturn("소맥분");
        when(material.getUnit()).thenReturn("kg");
        when(bom.getBomId()).thenReturn(5L);
        when(bomRepository.findFirstByProductProductIdAndStatusOrderByBomIdDesc(
                5L,
                Bom.BomStatus.ACTIVE
        )).thenReturn(Optional.of(bom));
        when(bomItemRepository.existsByBomBomIdAndRawMaterialMaterialId(5L, 7L))
                .thenReturn(true);
        when(productionLotMaterialRepository
                .findByProductionLotProductionLotIdAndMaterialLotMaterialLotId(10L, 101L))
                .thenReturn(Optional.of(usage));
        when(productionLotMaterialRepository.save(usage)).thenReturn(usage);
        when(usage.getMaterialLot()).thenReturn(materialLot);

        productionLotService.registerMaterialUsage(
                10L,
                new ProductionLotMaterialRequest(101L, additionalQty, 9L)
        );

        verify(usage).increaseUsedQty(additionalQty);
        verify(inventoryMovementService).registerMovement(any(InventoryMovementRequest.class));
    }

    private ProductionLot activeLot(Long productionLotId) {
        ProductionLot lot = mock(ProductionLot.class);
        when(lot.getProductionLotId()).thenReturn(productionLotId);
        return lot;
    }

    private ProductionProcessProgress progress(ProcessProgressStatus status) {
        ProductionProcessProgress progress = mock(ProductionProcessProgress.class);
        when(progress.getStatus()).thenReturn(status);
        return progress;
    }

    private ProductionLot lotForMaterialUsage() {
        ProductionLot lot = mock(ProductionLot.class);
        WorkOrder workOrder = mock(WorkOrder.class);
        Product product = mock(Product.class);
        lenient().when(lot.getProductionLotId()).thenReturn(10L);
        when(lot.getStatus()).thenReturn(ProductionLot.ProductionLotStatus.IN_PROGRESS);
        when(lot.getWorkOrder()).thenReturn(workOrder);
        when(workOrder.getProduct()).thenReturn(product);
        when(product.getProductId()).thenReturn(5L);
        return lot;
    }

    private RawMaterialLot rawMaterialLot(Long id, BigDecimal currentQty) {
        RawMaterialLot lot = mock(RawMaterialLot.class);
        when(lot.getMaterialLotId()).thenReturn(id);
        when(lot.getCurrentQty()).thenReturn(currentQty);
        return lot;
    }

    private void stubLotAndProgresses(
            ProductionLot lot,
            List<ProductionProcessProgress> progresses
    ) {
        when(productionLotRepository
                .findFirstByWorkOrderWorkOrderIdAndStatusInOrderByStartedAtDesc(
                        eq(1L),
                        org.mockito.ArgumentMatchers.<Collection<ProductionLot.ProductionLotStatus>>any()
                ))
                .thenReturn(Optional.of(lot));
        when(processProgressRepository
                .findByProductionLotProductionLotIdOrderByManufacturingProcessSequenceAsc(
                        lot.getProductionLotId()
                ))
                .thenReturn(progresses);
    }
}
