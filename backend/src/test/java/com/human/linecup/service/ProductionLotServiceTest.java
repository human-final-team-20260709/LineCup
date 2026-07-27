package com.human.linecup.service;

import com.human.linecup.entity.ProductionLot;
import com.human.linecup.entity.ProductionProcessProgress;
import com.human.linecup.entity.ProductionProcessProgress.ProcessProgressStatus;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.repository.ManufacturingProcessRepository;
import com.human.linecup.repository.ProductionLotMaterialRepository;
import com.human.linecup.repository.ProductionLotRepository;
import com.human.linecup.repository.ProductionProcessProgressRepository;
import com.human.linecup.repository.RawMaterialLotRepository;
import com.human.linecup.repository.WorkOrderEquipmentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
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
