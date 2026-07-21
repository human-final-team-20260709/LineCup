package com.human.linecup.service;

import com.human.linecup.dto.request.alarm.AlarmSearchRequest;
import com.human.linecup.entity.Alarm;
import com.human.linecup.entity.AlarmSeverity;
import com.human.linecup.entity.AlarmStatus;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@SuppressWarnings("unchecked")
class AlarmSpecificationsTest {

    @Test
    @DisplayName("복합 검색의 모든 조건을 하나의 AND 조건으로 구성한다")
    void combinesAllSearchConditions() {
        LocalDateTime startAt = LocalDateTime.of(2026, 7, 1, 0, 0);
        LocalDateTime endAt = LocalDateTime.of(2026, 7, 21, 23, 59);
        AlarmSearchRequest request = new AlarmSearchRequest(
                3L,
                AlarmSeverity.WARNING,
                AlarmStatus.IN_PROGRESS,
                true,
                startAt,
                endAt,
                "ALM-260721-017"
        );
        Root<Alarm> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder criteriaBuilder = mock(CriteriaBuilder.class);
        Specification<Alarm> specification = AlarmSpecifications.from(request);

        specification.toPredicate(root, query, criteriaBuilder);

        verify(root).get("equipmentId");
        verify(root, atLeast(1)).get("severity");
        verify(root, atLeast(1)).get("status");
        verify(root, atLeast(2)).get("occurredAt");
        verify(root).get("content");
        verify(root).get("alarmId");
        verify(criteriaBuilder, atLeast(1)).and(any(jakarta.persistence.criteria.Predicate[].class));
    }

    @Test
    @DisplayName("조건이 없으면 항상 참인 조건을 생성한다")
    void createsConjunctionForEmptyRequest() {
        Root<Alarm> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder criteriaBuilder = mock(CriteriaBuilder.class);

        AlarmSpecifications.from(AlarmSearchRequest.empty())
                .toPredicate(root, query, criteriaBuilder);

        verify(criteriaBuilder).conjunction();
    }
}
