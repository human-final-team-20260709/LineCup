package com.human.linecup.service;

import com.human.linecup.dto.request.DefectCreateRequest;
import com.human.linecup.dto.request.DefectSearchCondition;
import com.human.linecup.dto.request.UpdateDefectCauseRequest;
import com.human.linecup.dto.request.UpdateDefectHandlingRequest;
import com.human.linecup.dto.response.DefectDashboardResponse;
import com.human.linecup.dto.response.DefectDetailResponse;
import com.human.linecup.dto.response.DefectSummaryResponse;
import com.human.linecup.entity.Defect;
import com.human.linecup.entity.DefectHandleMethod;
import com.human.linecup.entity.DefectStatus;
import com.human.linecup.exception.quality.DefectNotFoundException;
import com.human.linecup.exception.quality.DuplicateDefectNumberException;
import com.human.linecup.exception.quality.InvalidDefectRequestException;
import com.human.linecup.exception.quality.InvalidDefectStateException;
import com.human.linecup.repository.DefectRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.dao.DataIntegrityViolationException;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DefectServiceTest {

    private static final ZoneId SEOUL = ZoneId.of("Asia/Seoul");
    private static final Clock FIXED_CLOCK = Clock.fixed(
            Instant.parse("2026-07-21T03:34:56Z"),
            SEOUL
    );

    private DefectRepository defectRepository;
    private DefectService defectService;

    @BeforeEach
    void setUp() {
        defectRepository = mock(DefectRepository.class);
        defectService = new DefectService(defectRepository, FIXED_CLOCK);
    }

    @Test
    void createRegistersUnhandledDefectAndUsesInjectedClock() {
        CreateDefectRequest request = new CreateDefectRequest(
                " DF-260721-024 ",
                31L,
                7L,
                " 실링 불량 ",
                12,
                " 필름 장력 편차 ",
                null
        );
        when(defectRepository.findByDefectNo("DF-260721-024"))
                .thenReturn(Optional.empty());
        when(defectRepository.saveAndFlush(any(Defect.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        DefectResponse response = defectService.create(request);

        ArgumentCaptor<Defect> captor = ArgumentCaptor.forClass(Defect.class);
        verify(defectRepository).saveAndFlush(captor.capture());
        Defect saved = captor.getValue();
        assertThat(saved.getDefectNo()).isEqualTo("DF-260721-024");
        assertThat(saved.getDefectType()).isEqualTo("실링 불량");
        assertThat(saved.getCause()).isEqualTo("필름 장력 편차");
        assertThat(saved.getStatus()).isEqualTo(DefectStatus.UNHANDLED);
        assertThat(saved.getHandlerId()).isNull();
        assertThat(saved.getHandleMethod()).isNull();
        assertThat(saved.getOccurredAt())
                .isEqualTo(LocalDateTime.of(2026, 7, 21, 12, 34, 56));
        assertThat(response.statusLabel()).isEqualTo("미처리");
    }

    @Test
    void createRejectsExistingDefectNumber() {
        Defect existing = defect(1L, DefectStatus.UNHANDLED);
        when(defectRepository.findByDefectNo(existing.getDefectNo()))
                .thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> defectService.create(createRequest(existing.getDefectNo())))
                .isInstanceOf(DuplicateDefectNumberException.class)
                .hasMessageContaining(existing.getDefectNo());
        verify(defectRepository, never()).saveAndFlush(any(Defect.class));
    }

    @Test
    void createConvertsDatabaseUniqueConstraintViolation() {
        CreateDefectRequest request = createRequest("DF-260721-025");
        when(defectRepository.findByDefectNo(request.defectNo()))
                .thenReturn(Optional.empty());
        when(defectRepository.saveAndFlush(any(Defect.class)))
                .thenThrow(new DataIntegrityViolationException("uk_defect_no"));

        assertThatThrownBy(() -> defectService.create(request))
                .isInstanceOf(DuplicateDefectNumberException.class)
                .hasMessageContaining(request.defectNo());
    }

    @Test
    void createDoesNotMisclassifyOtherDatabaseConstraintViolations() {
        CreateDefectRequest request = createRequest("DF-260721-026");
        DataIntegrityViolationException databaseException =
                new DataIntegrityViolationException("fk_defect_equipment");
        when(defectRepository.findByDefectNo(request.defectNo()))
                .thenReturn(Optional.empty());
        when(defectRepository.saveAndFlush(any(Defect.class)))
                .thenThrow(databaseException);

        assertThatThrownBy(() -> defectService.create(request))
                .isSameAs(databaseException);
    }

    @Test
    void createRejectsFutureOccurrenceTime() {
        CreateDefectRequest request = new CreateDefectRequest(
                "DF-260721-027",
                31L,
                7L,
                "실링 불량",
                1,
                null,
                LocalDateTime.of(2026, 7, 21, 12, 34, 57)
        );
        when(defectRepository.findByDefectNo(request.defectNo()))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> defectService.create(request))
                .isInstanceOf(InvalidDefectRequestException.class)
                .hasMessageContaining("future");
        verify(defectRepository, never()).saveAndFlush(any(Defect.class));
    }

    @Test
    @SuppressWarnings("unchecked")
    void searchPassesAllFiltersAsOneSpecificationAndAppliesDefaultSort() {
        DefectSearchCondition condition = new DefectSearchCondition(
                "실링",
                DefectStatus.IN_PROGRESS,
                31L,
                7L,
                LocalDateTime.of(2026, 7, 1, 0, 0),
                LocalDateTime.of(2026, 7, 21, 23, 59)
        );
        PageRequest request = PageRequest.of(2, 10);
        Page<Defect> entityPage = new PageImpl<>(
                List.of(defect(24L, DefectStatus.IN_PROGRESS)),
                request,
                21
        );
        when(defectRepository.findAll(
                any(Specification.class),
                any(Pageable.class)
        )).thenReturn(entityPage);

        Page<DefectResponse> result = defectService.search(condition, request);

        ArgumentCaptor<Specification<Defect>> specificationCaptor =
                ArgumentCaptor.forClass(Specification.class);
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(defectRepository).findAll(
                specificationCaptor.capture(),
                pageableCaptor.capture()
        );
        assertAllSearchPredicatesAreCombined(specificationCaptor.getValue());
        assertThat(pageableCaptor.getValue().getSort().getOrderFor("occurredAt"))
                .isNotNull()
                .extracting(order -> order.getDirection().name())
                .isEqualTo("DESC");
        assertThat(result.getContent())
                .extracting(DefectResponse::defectId)
                .containsExactly(24L);
    }

    @Test
    void searchRejectsReversedPeriod() {
        DefectSearchCondition condition = new DefectSearchCondition(
                null,
                null,
                null,
                null,
                LocalDateTime.of(2026, 7, 22, 0, 0),
                LocalDateTime.of(2026, 7, 21, 0, 0)
        );

        assertThatThrownBy(() -> defectService.search(condition, PageRequest.of(0, 20)))
                .isInstanceOf(InvalidDefectRequestException.class)
                .hasMessageContaining("startAt");
        verify(defectRepository, never()).findAll(
                any(Specification.class),
                any(Pageable.class)
        );
    }

    @Test
    void getDashboardUsesSeoulDayBoundaryAndReturnsRequiredMetrics() {
        Defect recent = defect(24L, DefectStatus.UNHANDLED);
        LocalDateTime startAt = LocalDateTime.of(2026, 7, 21, 0, 0);
        LocalDateTime endAt = LocalDateTime.of(2026, 7, 22, 0, 0);
        when(defectRepository.sumQuantityByOccurredAt(startAt, endAt)).thenReturn(100L);
        when(defectRepository.countByStatus(DefectStatus.UNHANDLED)).thenReturn(4L);
        when(defectRepository.findTop5ByOrderByOccurredAtDescDefectIdDesc())
                .thenReturn(List.of(recent));

        DefectDashboardResponse dashboard = defectService.getDashboard();

        assertThat(dashboard.date().toString()).isEqualTo("2026-07-21");
        assertThat(dashboard.todayDefectQuantity()).isEqualTo(100L);
        assertThat(dashboard.unhandledDefectCount()).isEqualTo(4L);
        assertThat(dashboard.recentDefects())
                .extracting(DefectResponse::defectId)
                .containsExactly(24L);
        verify(defectRepository).sumQuantityByOccurredAt(startAt, endAt);
    }

    @Test
    void updateHandlingCompletesDefectWithHandlerAndMethod() {
        Defect defect = defect(24L, DefectStatus.IN_PROGRESS);
        when(defectRepository.findById(24L)).thenReturn(Optional.of(defect));
        UpdateDefectHandlingRequest request = new UpdateDefectHandlingRequest(
                3L,
                DefectHandleMethod.REWORK,
                DefectStatus.COMPLETED
        );

        DefectResponse response = defectService.updateHandling(24L, request);

        assertThat(response.handlerId()).isEqualTo(3L);
        assertThat(response.handleMethod()).isEqualTo(DefectHandleMethod.REWORK);
        assertThat(response.status()).isEqualTo(DefectStatus.COMPLETED);
    }

    @Test
    void updateHandlingRequiresHandlerAndMethodWhenCompleted() {
        Defect defect = defect(24L, DefectStatus.IN_PROGRESS);
        when(defectRepository.findById(24L)).thenReturn(Optional.of(defect));
        UpdateDefectHandlingRequest request = new UpdateDefectHandlingRequest(
                null,
                null,
                DefectStatus.COMPLETED
        );

        assertThatThrownBy(() -> defectService.updateHandling(24L, request))
                .isInstanceOf(InvalidDefectStateException.class)
                .hasMessageContaining("handlerId");
        assertThat(defect.getStatus()).isEqualTo(DefectStatus.IN_PROGRESS);
    }

    @Test
    void updateHandlingDoesNotReopenCompletedDefect() {
        Defect defect = defect(24L, DefectStatus.COMPLETED);
        when(defectRepository.findById(24L)).thenReturn(Optional.of(defect));
        UpdateDefectHandlingRequest request = new UpdateDefectHandlingRequest(
                3L,
                DefectHandleMethod.REWORK,
                DefectStatus.IN_PROGRESS
        );

        assertThatThrownBy(() -> defectService.updateHandling(24L, request))
                .isInstanceOf(InvalidDefectStateException.class)
                .hasMessageContaining("COMPLETED -> IN_PROGRESS");
        assertThat(defect.getStatus()).isEqualTo(DefectStatus.COMPLETED);
    }

    @Test
    void updateCauseNormalizesBlankCauseToNull() {
        Defect defect = defect(24L, DefectStatus.UNHANDLED);
        when(defectRepository.findById(24L)).thenReturn(Optional.of(defect));

        DefectResponse response = defectService.updateCause(
                24L,
                new UpdateDefectCauseRequest("   ")
        );

        assertThat(defect.getCause()).isNull();
        assertThat(response.cause()).isNull();
    }

    @Test
    void getByIdThrowsDomainExceptionWhenMissing() {
        when(defectRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> defectService.getById(999L))
                .isInstanceOf(DefectNotFoundException.class)
                .hasMessageContaining("999");
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    private static void assertAllSearchPredicatesAreCombined(
            Specification<Defect> specification
    ) {
        Root<Defect> root = mock(Root.class);
        CriteriaQuery query = mock(CriteriaQuery.class);
        CriteriaBuilder criteriaBuilder = mock(CriteriaBuilder.class);
        Path path = mock(Path.class);
        Expression<String> loweredPath = mock(Expression.class);
        Predicate leaf = mock(Predicate.class);
        Predicate combined = mock(Predicate.class);

        doReturn(path).when(root).get(anyString());
        doReturn(loweredPath).when(criteriaBuilder).lower(any(Expression.class));
        doReturn(leaf).when(criteriaBuilder).like(
                any(Expression.class),
                anyString(),
                eq('\\')
        );
        doReturn(leaf).when(criteriaBuilder).or(any(Predicate[].class));
        doReturn(leaf).when(criteriaBuilder).equal(any(Expression.class), any());
        doReturn(leaf).when(criteriaBuilder).greaterThanOrEqualTo(
                any(Expression.class),
                any(Comparable.class)
        );
        doReturn(leaf).when(criteriaBuilder).lessThanOrEqualTo(
                any(Expression.class),
                any(Comparable.class)
        );
        doReturn(combined).when(criteriaBuilder).and(any(Predicate[].class));

        Predicate result = specification.toPredicate(root, query, criteriaBuilder);

        ArgumentCaptor<Predicate[]> predicates = ArgumentCaptor.forClass(Predicate[].class);
        verify(criteriaBuilder).and(predicates.capture());
        assertThat(predicates.getValue()).hasSize(6);
        assertThat(result).isSameAs(combined);
    }

    private static CreateDefectRequest createRequest(String defectNo) {
        return new CreateDefectRequest(
                defectNo,
                31L,
                7L,
                "실링 불량",
                12,
                "필름 장력 편차",
                LocalDateTime.of(2026, 7, 21, 12, 0)
        );
    }

    private static Defect defect(Long defectId, DefectStatus status) {
        return Defect.builder()
                .defectId(defectId)
                .defectNo("DF-260721-" + String.format("%03d", defectId))
                .productionLotId(31L)
                .equipmentId(7L)
                .handlerId(status == DefectStatus.UNHANDLED ? null : 3L)
                .defectType("실링 불량")
                .quantity(12)
                .cause("필름 장력 편차")
                .handleMethod(status == DefectStatus.UNHANDLED
                        ? null
                        : DefectHandleMethod.REWORK)
                .status(status)
                .occurredAt(LocalDateTime.of(2026, 7, 21, 12, 0))
                .build();
    }
}
