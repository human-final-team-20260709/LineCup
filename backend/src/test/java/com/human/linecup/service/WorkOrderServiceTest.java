package com.human.linecup.service;

import com.human.linecup.dto.request.WorkOrderStatusChangeRequest;
import com.human.linecup.entity.ApprovalStatus;
import com.human.linecup.entity.BusinessConflictException;
import com.human.linecup.entity.User;
import com.human.linecup.entity.WorkOrder;
import com.human.linecup.repository.EquipmentRepository;
import com.human.linecup.repository.ProductRepository;
import com.human.linecup.repository.ProductionProcessProgressRepository;
import com.human.linecup.repository.ProductionResultRepository;
import com.human.linecup.repository.UserRepository;
import com.human.linecup.repository.WorkOrderEquipmentRepository;
import com.human.linecup.repository.WorkOrderRepository;
import com.human.linecup.repository.WorkOrderStatusHistoryRepository;
import com.human.linecup.repository.WorkOrderWorkerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WorkOrderServiceTest {

    @Mock
    private WorkOrderRepository workOrderRepository;
    @Mock
    private WorkOrderEquipmentRepository workOrderEquipmentRepository;
    @Mock
    private WorkOrderWorkerRepository workOrderWorkerRepository;
    @Mock
    private WorkOrderStatusHistoryRepository workOrderStatusHistoryRepository;
    @Mock
    private ProductionProcessProgressRepository productionProcessProgressRepository;
    @Mock
    private ProductionResultRepository productionResultRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private EquipmentRepository equipmentRepository;
    @Mock
    private ProductionLotService productionLotService;
    @InjectMocks
    private WorkOrderService workOrderService;

    @Test
    void completeRejectsWorkOrderBelowTargetQuantity() {
        WorkOrder workOrder = mock(WorkOrder.class);
        User changedBy = mock(User.class);
        when(workOrderRepository.findById(1L)).thenReturn(Optional.of(workOrder));
        when(userRepository.findById(9L)).thenReturn(Optional.of(changedBy));
        when(changedBy.getApprovalStatus()).thenReturn(ApprovalStatus.APPROVED);
        when(changedBy.isActive()).thenReturn(true);
        when(workOrder.getCurrentQty()).thenReturn(99);
        when(workOrder.getTargetQty()).thenReturn(100);

        WorkOrderStatusChangeRequest request = new WorkOrderStatusChangeRequest(
                WorkOrder.Action.COMPLETE,
                9L,
                "목표 미달 완료 시도"
        );

        assertThrows(
                BusinessConflictException.class,
                () -> workOrderService.changeStatus(1L, request)
        );

        verify(workOrder, never()).applyAction(
                eq(WorkOrder.Action.COMPLETE),
                any(Instant.class)
        );
        verifyNoInteractions(productionLotService);
    }
}
