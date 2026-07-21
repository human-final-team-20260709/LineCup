package com.human.linecup.service;

import com.human.linecup.dto.request.AlarmCreateRequest;
import com.human.linecup.dto.request.AlarmHandlingRequest;
import com.human.linecup.dto.request.AlarmSearchRequest;
import com.human.linecup.dto.response.AlarmDetailResponse;
import com.human.linecup.dto.response.AlarmSummaryResponse;
import com.human.linecup.entity.Alarm;
import com.human.linecup.entity.AlarmSeverity;
import com.human.linecup.entity.AlarmStatus;
import com.human.linecup.exception.alarm.AlarmNotFoundException;
import com.human.linecup.exception.alarm.InvalidAlarmHandlingException;
import com.human.linecup.exception.alarm.InvalidAlarmSearchConditionException;
import com.human.linecup.repository.AlarmRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlarmServiceTest {

    private static final ZoneId SEOUL = ZoneId.of("Asia/Seoul");
    private static final LocalDateTime NOW = LocalDateTime.of(2026, 7, 21, 10, 0);
    private static final Clock FIXED_CLOCK = Clock.fixed(
            Instant.parse("2026-07-21T01:00:00Z"),
            SEOUL
    );

    @Mock
    private AlarmRepository alarmRepository;

    private AlarmService alarmService;

    @BeforeEach
    void setUp() {
        alarmService = new AlarmService(alarmRepository, FIXED_CLOCK);
    }

    @Nested
    @DisplayName("알람 등록")
    class CreateAlarm {

        @Test
        @DisplayName("사용자가 상태를 선택하지 않고 확인 대기 상태로 생성한다")
        void createsPendingAlarmWithoutHandlingFields() {
            AlarmCreateRequest request = new AlarmCreateRequest(
                    8L,
                    "  유탕 온도 상한 초과  ",
                    AlarmSeverity.CRITICAL,
                    null
            );
            when(alarmRepository.save(any(Alarm.class))).thenAnswer(invocation -> invocation.getArgument(0));

            AlarmDetailResponse response = alarmService.createAlarm(request);

            ArgumentCaptor<Alarm> captor = ArgumentCaptor.forClass(Alarm.class);
            verify(alarmRepository).save(captor.capture());
            Alarm saved = captor.getValue();
            assertThat(saved.getStatus()).isEqualTo(AlarmStatus.PENDING_CONFIRMATION);
            assertThat(saved.getHandlerId()).isNull();
            assertThat(saved.getHandlingContent()).isNull();
            assertThat(saved.getResolvedAt()).isNull();
            assertThat(saved.getOccurredAt()).isEqualTo(NOW);
            assertThat(saved.getContent()).isEqualTo("유탕 온도 상한 초과");
            assertThat(response.status()).isEqualTo(AlarmStatus.PENDING_CONFIRMATION);
            assertThat(response.handled()).isFalse();
        }

        @Test
        @DisplayName("미래 발생 시각은 거부한다")
        void rejectsFutureOccurredAt() {
            AlarmCreateRequest request = new AlarmCreateRequest(
                    8L,
                    "압력 초과",
                    AlarmSeverity.WARNING,
                    NOW.plusSeconds(1)
            );

            assertThatThrownBy(() -> alarmService.createAlarm(request))
                    .isInstanceOf(InvalidAlarmHandlingException.class)
                    .hasMessageContaining("발생 시각");
            verify(alarmRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("알람 조회")
    class FindAlarm {

        @Test
        @SuppressWarnings("unchecked")
        @DisplayName("복합 검색은 Specification과 기본 최신순 정렬을 적용한다")
        void searchesWithCombinedConditionAndDefaultSort() {
            Alarm alarm = alarm(11L, AlarmStatus.IN_PROGRESS, null);
            Pageable requestedPage = PageRequest.of(1, 20);
            AlarmSearchRequest condition = new AlarmSearchRequest(
                    3L,
                    AlarmSeverity.WARNING,
                    AlarmStatus.IN_PROGRESS,
                    false,
                    NOW.minusDays(2),
                    NOW,
                    "온도"
            );
            when(alarmRepository.findAll(any(Specification.class), any(Pageable.class)))
                    .thenReturn(new PageImpl<>(List.of(alarm)));

            Page<AlarmSummaryResponse> result = alarmService.getAlarms(condition, requestedPage);

            ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
            verify(alarmRepository).findAll(any(Specification.class), pageableCaptor.capture());
            Pageable effectivePage = pageableCaptor.getValue();
            assertThat(effectivePage.getPageNumber()).isEqualTo(1);
            assertThat(effectivePage.getPageSize()).isEqualTo(20);
            assertThat(effectivePage.getSort().getOrderFor("occurredAt").getDirection().isDescending()).isTrue();
            assertThat(result.getContent()).singleElement()
                    .extracting(AlarmSummaryResponse::alarmId)
                    .isEqualTo(11L);
        }

        @Test
        @DisplayName("현재 알람은 처리 완료 상태를 제외한다")
        void findsCurrentAlarmsExcludingResolved() {
            Pageable pageable = PageRequest.of(0, 10);
            when(alarmRepository.findByStatusNotOrderByOccurredAtDescAlarmIdDesc(
                    AlarmStatus.RESOLVED,
                    pageable
            ))
                    .thenReturn(new PageImpl<>(List.of(alarm(2L, AlarmStatus.PENDING_CONFIRMATION, null))));

            Page<AlarmSummaryResponse> response = alarmService.getCurrentAlarms(pageable);

            verify(alarmRepository).findByStatusNotOrderByOccurredAtDescAlarmIdDesc(
                    AlarmStatus.RESOLVED,
                    pageable
            );
            assertThat(response.getContent()).singleElement()
                    .extracting(AlarmSummaryResponse::handled)
                    .isEqualTo(false);
        }

        @Test
        @DisplayName("없는 알람 상세 조회는 도메인 예외를 발생시킨다")
        void throwsWhenAlarmDoesNotExist() {
            when(alarmRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> alarmService.getAlarm(999L))
                    .isInstanceOf(AlarmNotFoundException.class)
                    .hasMessageContaining("999");
        }

        @Test
        @DisplayName("조회 시작일이 종료일보다 늦으면 조회하지 않는다")
        void rejectsReversedPeriod() {
            assertThatThrownBy(() -> alarmService.getAlarmsByPeriod(
                    NOW,
                    NOW.minusDays(1),
                    PageRequest.of(0, 10)
            ))
                    .isInstanceOf(InvalidAlarmSearchConditionException.class)
                    .hasMessageContaining("시작 시각");
            verify(alarmRepository, never()).findByOccurredAtBetweenOrderByOccurredAtDescAlarmIdDesc(
                    any(), any(), any()
            );
        }
    }

    @Nested
    @DisplayName("알람 처리")
    class UpdateHandling {

        @Test
        @DisplayName("처리 완료 시 누락된 해제 시각을 Clock 기준 현재 시각으로 저장한다")
        void resolvesAlarmUsingClock() {
            Alarm alarm = alarm(17L, AlarmStatus.IN_PROGRESS, null);
            when(alarmRepository.findById(17L)).thenReturn(Optional.of(alarm));
            AlarmHandlingRequest request = new AlarmHandlingRequest(
                    5L,
                    "  스팀 밸브 재조정  ",
                    AlarmStatus.RESOLVED,
                    null
            );

            AlarmDetailResponse response = alarmService.updateHandling(17L, request);

            assertThat(response.handlerId()).isEqualTo(5L);
            assertThat(response.handlingContent()).isEqualTo("스팀 밸브 재조정");
            assertThat(response.status()).isEqualTo(AlarmStatus.RESOLVED);
            assertThat(response.resolvedAt()).isEqualTo(NOW);
            assertThat(response.handled()).isTrue();
        }

        @Test
        @DisplayName("이미 완료된 알람을 편집할 때 기존 해제 시각을 보존한다")
        void preservesExistingResolvedAt() {
            LocalDateTime originalResolvedAt = NOW.minusMinutes(10);
            Alarm alarm = alarm(17L, AlarmStatus.RESOLVED, originalResolvedAt);
            when(alarmRepository.findById(17L)).thenReturn(Optional.of(alarm));

            AlarmDetailResponse response = alarmService.updateHandling(
                    17L,
                    new AlarmHandlingRequest(7L, "조치 메모 수정", AlarmStatus.RESOLVED, null)
            );

            assertThat(response.resolvedAt()).isEqualTo(originalResolvedAt);
        }

        @Test
        @DisplayName("처리 완료에는 처리자와 조치 내용이 모두 필수다")
        void requiresHandlerAndContentWhenResolved() {
            Alarm alarm = alarm(17L, AlarmStatus.IN_PROGRESS, null);
            when(alarmRepository.findById(17L)).thenReturn(Optional.of(alarm));

            assertThatThrownBy(() -> alarmService.updateHandling(
                    17L,
                    new AlarmHandlingRequest(null, " ", AlarmStatus.RESOLVED, null)
            ))
                    .isInstanceOf(InvalidAlarmHandlingException.class)
                    .hasMessageContaining("처리자");
            assertThat(alarm.getStatus()).isEqualTo(AlarmStatus.IN_PROGRESS);
        }

        @Test
        @DisplayName("해제 시각은 발생 시각 이후이고 현재 이전이어야 한다")
        void validatesResolvedAtRange() {
            Alarm alarm = alarm(17L, AlarmStatus.IN_PROGRESS, null);
            when(alarmRepository.findById(17L)).thenReturn(Optional.of(alarm));

            assertThatThrownBy(() -> alarmService.updateHandling(
                    17L,
                    new AlarmHandlingRequest(
                            5L,
                            "조치 완료",
                            AlarmStatus.RESOLVED,
                            NOW.minusDays(2)
                    )
            ))
                    .isInstanceOf(InvalidAlarmHandlingException.class)
                    .hasMessageContaining("발생 시각");

            assertThatThrownBy(() -> alarmService.updateHandling(
                    17L,
                    new AlarmHandlingRequest(
                            5L,
                            "조치 완료",
                            AlarmStatus.RESOLVED,
                            NOW.plusSeconds(1)
                    )
            ))
                    .isInstanceOf(InvalidAlarmHandlingException.class)
                    .hasMessageContaining("현재");
        }

        @Test
        @DisplayName("처리 완료가 아닌 상태에 해제 시각을 보낼 수 없다")
        void rejectsResolvedAtForOpenAlarm() {
            Alarm alarm = alarm(17L, AlarmStatus.PENDING_CONFIRMATION, null);
            when(alarmRepository.findById(17L)).thenReturn(Optional.of(alarm));

            assertThatThrownBy(() -> alarmService.updateHandling(
                    17L,
                    new AlarmHandlingRequest(5L, "조치 중", AlarmStatus.IN_PROGRESS, NOW)
            ))
                    .isInstanceOf(InvalidAlarmHandlingException.class)
                    .hasMessageContaining("처리 완료가 아닌");
            assertThat(alarm.getStatus()).isEqualTo(AlarmStatus.PENDING_CONFIRMATION);
        }

        @Test
        @DisplayName("처리 완료된 알람은 다시 미처리 상태로 되돌릴 수 없다")
        void doesNotReopenResolvedAlarm() {
            Alarm alarm = alarm(17L, AlarmStatus.RESOLVED, NOW.minusMinutes(10));
            when(alarmRepository.findById(17L)).thenReturn(Optional.of(alarm));

            assertThatThrownBy(() -> alarmService.updateHandling(
                    17L,
                    new AlarmHandlingRequest(5L, "재점검", AlarmStatus.MONITORING, null)
            ))
                    .isInstanceOf(InvalidAlarmHandlingException.class)
                    .hasMessageContaining("다시 미처리");
            assertThat(alarm.getStatus()).isEqualTo(AlarmStatus.RESOLVED);
            assertThat(alarm.getResolvedAt()).isEqualTo(NOW.minusMinutes(10));
        }

        @Test
        @DisplayName("확인 대기 상태에는 처리 정보를 등록할 수 없다")
        void rejectsHandlingInformationWhilePendingConfirmation() {
            Alarm alarm = alarm(17L, AlarmStatus.PENDING_CONFIRMATION, null);
            when(alarmRepository.findById(17L)).thenReturn(Optional.of(alarm));

            assertThatThrownBy(() -> alarmService.updateHandling(
                    17L,
                    new AlarmHandlingRequest(5L, "선조치", AlarmStatus.PENDING_CONFIRMATION, null)
            ))
                    .isInstanceOf(InvalidAlarmHandlingException.class)
                    .hasMessageContaining("확인 대기");
            assertThat(alarm.getHandlerId()).isNull();
            assertThat(alarm.getHandlingContent()).isNull();
        }
    }

    private Alarm alarm(Long id, AlarmStatus status, LocalDateTime resolvedAt) {
        return Alarm.builder()
                .alarmId(id)
                .equipmentId(3L)
                .handlerId(status == AlarmStatus.RESOLVED ? 5L : null)
                .content("스팀 압력 상한 초과")
                .severity(AlarmSeverity.WARNING)
                .handlingContent(status == AlarmStatus.RESOLVED ? "밸브 재조정" : null)
                .status(status)
                .occurredAt(NOW.minusDays(1))
                .resolvedAt(resolvedAt)
                .build();
    }
}
