package com.human.linecup.service;

import com.human.linecup.dto.request.HourlyProductionRequest;
import com.human.linecup.entity.HourlyProduction;
import com.human.linecup.entity.HourlyProductionCloseReason;
import com.human.linecup.entity.ProductionLot;
import com.human.linecup.entity.ProductionProcessProgress;
import com.human.linecup.entity.ProductionResult;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.repository.HourlyProductionRepository;
import com.human.linecup.repository.ProductionLotRepository;
import com.human.linecup.repository.ProductionProcessProgressRepository;
import com.human.linecup.repository.ProductionResultRepository;
import com.human.linecup.repository.WorkOrderRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Collection;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HourlyProductionServiceTest {

    @Mock
    private HourlyProductionRepository hourlyProductionRepository;
    @Mock
    private WorkOrderRepository workOrderRepository;
    @Mock
    private ProductionLotRepository productionLotRepository;
    @Mock
    private ProductionProcessProgressRepository processProgressRepository;
    @Mock
    private ProductionResultRepository productionResultRepository;
    @Mock
    private EntityManager entityManager;
    @InjectMocks
    private HourlyProductionService hourlyProductionService;

    @Test
    void aggregateUpdatesInspectionProcessWithLotTotals() {
        WorkOrder workOrder = mock(WorkOrder.class);
        ProductionLot productionLot = mock(ProductionLot.class);
        ProductionProcessProgress inspectionProgress = mock(ProductionProcessProgress.class);
        ProductionResult productionResult = mock(ProductionResult.class);
        HourlyProductionRepository.QuantityTotals totals =
                mock(HourlyProductionRepository.QuantityTotals.class);
        Instant bucketStart = Instant.parse("2026-07-29T08:00:00Z");
        Instant bucketEnd = Instant.parse("2026-07-29T08:10:00Z");
        HourlyProductionRequest request = new HourlyProductionRequest(
                1L,
                bucketStart,
                bucketEnd,
                100,
                12,
                11,
                1,
                true,
                HourlyProductionCloseReason.IN_PROGRESS
        );

        when(workOrderRepository.findById(1L)).thenReturn(Optional.of(workOrder));
        when(workOrder.getWorkOrderId()).thenReturn(1L);
        when(workOrder.getStatus()).thenReturn(WorkOrder.Status.IN_PROGRESS);
        when(hourlyProductionRepository
                .findByWorkOrderWorkOrderIdAndBucketStart(1L, bucketStart))
                .thenReturn(Optional.empty());
        when(hourlyProductionRepository.saveAndFlush(any(HourlyProduction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(productionLotRepository
                .findFirstByWorkOrderWorkOrderIdAndStatusInOrderByStartedAtDesc(
                        eq(1L),
                        org.mockito.ArgumentMatchers
                                .<Collection<ProductionLot.ProductionLotStatus>>any()
                ))
                .thenReturn(Optional.of(productionLot));
        when(productionLot.getProductionLotId()).thenReturn(10L);
        when(hourlyProductionRepository.summarizeByWorkOrderId(1L)).thenReturn(totals);
        when(totals.getProductionQty()).thenReturn(12L);
        when(totals.getGoodQty()).thenReturn(11L);
        when(totals.getDefectQty()).thenReturn(1L);
        when(totals.getLastAggregatedAt()).thenReturn(bucketEnd);
        when(processProgressRepository
                .findByProductionLotProductionLotIdAndManufacturingProcessProcessCode(
                        10L,
                        "INSPECTION"
                ))
                .thenReturn(Optional.of(inspectionProgress));
        when(productionResultRepository.findByProductionLotProductionLotId(10L))
                .thenReturn(Optional.of(productionResult));

        hourlyProductionService.saveHourlyProduction(request);

        verify(workOrder).updateQuantities(12, 11, 1);
        verify(productionLot).updateQuantities(12, 11, 1);
        verify(inspectionProgress).updateQuantities(12, 11, 1);
        verify(productionResult).updateAggregate(12, 11, 1, bucketEnd);
    }
}
