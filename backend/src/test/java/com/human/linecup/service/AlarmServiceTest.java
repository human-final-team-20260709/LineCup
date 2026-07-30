package com.human.linecup.service;

import com.human.linecup.dto.request.AlarmSearchRequest;
import com.human.linecup.dto.response.AlarmSearchPageResponse;
import com.human.linecup.dto.response.CurrentAlarmPageResponse;
import com.human.linecup.entity.Alarm;
import com.human.linecup.entity.AlarmSeverity;
import com.human.linecup.entity.AlarmStatus;
import com.human.linecup.repository.AlarmRepository;
import com.human.linecup.repository.EquipmentRepository;
import com.human.linecup.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlarmServiceTest {

    @Mock
    private AlarmRepository alarmRepository;
    @Mock
    private EquipmentRepository equipmentRepository;
    @Mock
    private UserRepository userRepository;

    @Test
    void getAlarmsReturnsWholeFilteredHandlingSummary() {
        Pageable pageable = PageRequest.of(0, 20);
        when(alarmRepository.findAll(
                ArgumentMatchers.<Specification<Alarm>>any(),
                any(Pageable.class)
        )).thenReturn(new PageImpl<Alarm>(List.of(), pageable, 86L));
        when(alarmRepository.count(
                ArgumentMatchers.<Specification<Alarm>>any()
        )).thenReturn(51L);

        AlarmService service = new AlarmService(
                alarmRepository,
                equipmentRepository,
                userRepository
        );

        AlarmSearchPageResponse response =
                service.getAlarms(AlarmSearchRequest.empty(), pageable);

        assertEquals(86L, response.totalElements());
        assertEquals(86L, response.summary().totalCount());
        assertEquals(51L, response.summary().handledCount());
        assertEquals(35L, response.summary().pendingCount());
        verify(alarmRepository).count(
                ArgumentMatchers.<Specification<Alarm>>any()
        );
    }

    @Test
    void getAlarmsUsesSelectedHandledFilterWithoutAdditionalCount() {
        Pageable pageable = PageRequest.of(0, 20);
        AlarmSearchRequest condition = new AlarmSearchRequest(
                null,
                null,
                null,
                true,
                null,
                null,
                null
        );
        when(alarmRepository.findAll(
                ArgumentMatchers.<Specification<Alarm>>any(),
                any(Pageable.class)
        )).thenReturn(new PageImpl<Alarm>(List.of(), pageable, 51L));

        AlarmService service = new AlarmService(
                alarmRepository,
                equipmentRepository,
                userRepository
        );

        AlarmSearchPageResponse response =
                service.getAlarms(condition, pageable);

        assertEquals(51L, response.summary().totalCount());
        assertEquals(51L, response.summary().handledCount());
        assertEquals(0L, response.summary().pendingCount());
        verify(alarmRepository, never()).count(
                ArgumentMatchers.<Specification<Alarm>>any()
        );
    }

    @Test
    void getAlarmsUsesSelectedPendingFilterWithoutAdditionalCount() {
        Pageable pageable = PageRequest.of(0, 20);
        AlarmSearchRequest condition = new AlarmSearchRequest(
                null,
                null,
                null,
                false,
                null,
                null,
                null
        );
        when(alarmRepository.findAll(
                ArgumentMatchers.<Specification<Alarm>>any(),
                any(Pageable.class)
        )).thenReturn(new PageImpl<Alarm>(List.of(), pageable, 35L));

        AlarmService service = new AlarmService(
                alarmRepository,
                equipmentRepository,
                userRepository
        );

        AlarmSearchPageResponse response =
                service.getAlarms(condition, pageable);

        assertEquals(35L, response.summary().totalCount());
        assertEquals(0L, response.summary().handledCount());
        assertEquals(35L, response.summary().pendingCount());
        verify(alarmRepository, never()).count(
                ArgumentMatchers.<Specification<Alarm>>any()
        );
    }

    @Test
    void getCurrentAlarmsReturnsPageAndWholeActiveSeveritySummary() {
        Pageable pageable = PageRequest.of(1, 20);
        List<AlarmRepository.SeverityCount> severityCounts = List.of(
                severityCount(AlarmSeverity.CRITICAL, 11L),
                severityCount(AlarmSeverity.WARNING, 14L),
                severityCount(AlarmSeverity.CAUTION, 8L)
        );
        when(alarmRepository.findByStatusNotOrderByOccurredAtDescAlarmIdDesc(
                AlarmStatus.RESOLVED,
                pageable
        )).thenReturn(new PageImpl<Alarm>(List.of(), pageable, 33L));
        when(alarmRepository.countCurrentBySeverity(AlarmStatus.RESOLVED))
                .thenReturn(severityCounts);

        AlarmService service = new AlarmService(
                alarmRepository,
                equipmentRepository,
                userRepository
        );

        CurrentAlarmPageResponse response = service.getCurrentAlarms(pageable);

        assertEquals(33L, response.totalElements());
        assertEquals(2, response.totalPages());
        assertEquals(1, response.number());
        assertEquals(33L, response.summary().totalActive());
        assertEquals(11L, response.summary().criticalCount());
        assertEquals(14L, response.summary().warningCount());
        assertEquals(8L, response.summary().cautionCount());
        verify(alarmRepository).countCurrentBySeverity(AlarmStatus.RESOLVED);
    }

    @Test
    void getCurrentAlarmsUsesZeroForMissingSeverities() {
        Pageable pageable = PageRequest.of(0, 20);
        List<AlarmRepository.SeverityCount> severityCounts =
                List.of(severityCount(AlarmSeverity.CAUTION, 8L));
        when(alarmRepository.findByStatusNotOrderByOccurredAtDescAlarmIdDesc(
                AlarmStatus.RESOLVED,
                pageable
        )).thenReturn(new PageImpl<>(List.of(), pageable, 8L));
        when(alarmRepository.countCurrentBySeverity(AlarmStatus.RESOLVED))
                .thenReturn(severityCounts);

        AlarmService service = new AlarmService(
                alarmRepository,
                equipmentRepository,
                userRepository
        );

        CurrentAlarmPageResponse response = service.getCurrentAlarms(pageable);

        assertEquals(8L, response.summary().totalActive());
        assertEquals(0L, response.summary().criticalCount());
        assertEquals(0L, response.summary().warningCount());
        assertEquals(8L, response.summary().cautionCount());
    }

    private AlarmRepository.SeverityCount severityCount(
            AlarmSeverity severity,
            long alarmCount
    ) {
        AlarmRepository.SeverityCount count =
                mock(AlarmRepository.SeverityCount.class);
        when(count.getSeverity()).thenReturn(severity);
        when(count.getAlarmCount()).thenReturn(alarmCount);
        return count;
    }
}
