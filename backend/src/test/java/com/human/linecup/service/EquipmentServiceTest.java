package com.human.linecup.service;

import com.human.linecup.dto.request.EquipmentAssignRequest;
import com.human.linecup.dto.response.EquipmentResponse;
import com.human.linecup.entity.ApprovalStatus;
import com.human.linecup.entity.Equipment;
import com.human.linecup.entity.EquipmentAssignment;
import com.human.linecup.entity.ManufacturingProcess;
import com.human.linecup.entity.User;
import com.human.linecup.entity.UserRole;
import com.human.linecup.repository.EquipmentAssignmentRepository;
import com.human.linecup.repository.EquipmentRepository;
import com.human.linecup.repository.ManufacturingProcessRepository;
import com.human.linecup.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EquipmentServiceTest {

    @Mock
    private EquipmentRepository equipmentRepository;
    @Mock
    private ManufacturingProcessRepository manufacturingProcessRepository;
    @Mock
    private EquipmentAssignmentRepository equipmentAssignmentRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private EquipmentTelemetryService equipmentTelemetryService;
    @InjectMocks
    private EquipmentService equipmentService;

    @Test
    void getEquipmentsUsesNewestActiveAssignmentWhenLegacyDataContainsDuplicates() {
        Equipment equipment = equipment(30L);
        EquipmentAssignment older = assignment(
                100L, equipment, user(6L, "이전 작업자"), Instant.parse("2026-07-27T01:00:00Z")
        );
        EquipmentAssignment newer = assignment(
                101L, equipment, user(15L, "최근 작업자"), Instant.parse("2026-07-27T02:00:00Z")
        );
        when(equipmentRepository.findAll()).thenReturn(List.of(equipment));
        when(equipmentAssignmentRepository.findAllByEndedAtIsNull()).thenReturn(List.of(older, newer));

        List<EquipmentResponse> responses = equipmentService.getEquipments(null);

        assertEquals(1, responses.size());
        assertEquals(15L, responses.get(0).currentUserId());
        assertEquals("최근 작업자", responses.get(0).currentUserName());
    }

    @Test
    void assigningWorkerEndsEveryLegacyActiveAssignment() {
        Equipment equipment = equipment(30L);
        User nextUser = user(16L, "교대 작업자");
        when(nextUser.getApprovalStatus()).thenReturn(ApprovalStatus.APPROVED);
        when(nextUser.isActive()).thenReturn(true);
        when(nextUser.getRole()).thenReturn(UserRole.OPERATOR);
        EquipmentAssignment first = mock(EquipmentAssignment.class);
        EquipmentAssignment second = mock(EquipmentAssignment.class);
        when(equipmentRepository.findByIdForUpdate(30L)).thenReturn(Optional.of(equipment));
        when(userRepository.findById(16L)).thenReturn(Optional.of(nextUser));
        when(equipmentAssignmentRepository
                .findByEquipmentEquipmentIdAndEndedAtIsNullOrderByStartedAtDesc(30L))
                .thenReturn(List.of(first, second));

        equipmentService.assignWorker(30L, new EquipmentAssignRequest(16L));

        verify(first).end(org.mockito.ArgumentMatchers.any(Instant.class));
        verify(second).end(org.mockito.ArgumentMatchers.any(Instant.class));
        verify(equipmentAssignmentRepository).save(org.mockito.ArgumentMatchers.any(EquipmentAssignment.class));
    }

    private Equipment equipment(Long equipmentId) {
        ManufacturingProcess process = mock(ManufacturingProcess.class);
        lenient().when(process.getProcessId()).thenReturn(1L);
        lenient().when(process.getProcessCode()).thenReturn("MIXING");
        lenient().when(process.getProcessName()).thenReturn("혼합");

        Equipment equipment = mock(Equipment.class);
        lenient().when(equipment.getEquipmentId()).thenReturn(equipmentId);
        lenient().when(equipment.getEquipmentCode()).thenReturn("MIXER-01");
        lenient().when(equipment.getEquipmentName()).thenReturn("혼합기 1호");
        lenient().when(equipment.getManufacturingProcess()).thenReturn(process);
        lenient().when(equipment.getLocation()).thenReturn("제1생산라인");
        lenient().when(equipment.getStatus()).thenReturn(Equipment.EquipmentStatus.STOPPED);
        return equipment;
    }

    private User user(Long userId, String name) {
        User user = mock(User.class);
        lenient().when(user.getUserId()).thenReturn(userId);
        lenient().when(user.getEmpNo()).thenReturn("operator" + userId);
        lenient().when(user.getName()).thenReturn(name);
        return user;
    }

    private EquipmentAssignment assignment(
            Long assignmentId,
            Equipment equipment,
            User user,
        Instant startedAt
    ) {
        EquipmentAssignment assignment = mock(EquipmentAssignment.class);
        lenient().when(assignment.getEquipmentAssignmentId()).thenReturn(assignmentId);
        when(assignment.getEquipment()).thenReturn(equipment);
        lenient().when(assignment.getUser()).thenReturn(user);
        when(assignment.getStartedAt()).thenReturn(startedAt);
        return assignment;
    }
}
