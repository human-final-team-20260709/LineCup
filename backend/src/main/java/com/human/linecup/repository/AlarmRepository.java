package com.human.linecup.repository;

import com.human.linecup.entity.Alarm;
import com.human.linecup.entity.AlarmSeverity;
import com.human.linecup.entity.AlarmStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface AlarmRepository
        extends JpaRepository<Alarm, Long>, JpaSpecificationExecutor<Alarm> {

    Optional<Alarm> findByAlarmNo(String alarmNo);

    boolean existsByEquipmentEquipmentIdAndMessageAndOccurredAt(
            Long equipmentId,
            String message,
            Instant occurredAt
    );

    boolean existsByEquipmentEquipmentIdAndMessageAndStatusNot(
            Long equipmentId,
            String message,
            AlarmStatus status
    );

    Page<Alarm> findByStatusNotOrderByOccurredAtDescAlarmIdDesc(
            AlarmStatus status,
            Pageable pageable
    );

    @Query("""
            select a.severity as severity, count(a) as alarmCount
            from Alarm a
            where a.status <> :resolvedStatus
            group by a.severity
            """)
    List<SeverityCount> countCurrentBySeverity(
            @Param("resolvedStatus") AlarmStatus resolvedStatus
    );

    List<Alarm> findByOccurredAtGreaterThanEqualAndOccurredAtLessThan(
            Instant from,
            Instant to
    );

    interface SeverityCount {
        AlarmSeverity getSeverity();

        long getAlarmCount();
    }
}
