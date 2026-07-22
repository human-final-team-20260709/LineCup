package com.human.linecup.repository;

import com.human.linecup.entity.Alarm;
import com.human.linecup.entity.AlarmStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.Instant;
import java.util.Optional;

public interface AlarmRepository
        extends JpaRepository<Alarm, Long>, JpaSpecificationExecutor<Alarm> {

    Optional<Alarm> findByAlarmNo(String alarmNo);

    Page<Alarm> findByStatusNotOrderByOccurredAtDescAlarmIdDesc(
            AlarmStatus status,
            Pageable pageable
    );

    Page<Alarm> findByOccurredAtBetweenOrderByOccurredAtDescAlarmIdDesc(
            Instant startAt,
            Instant endAt,
            Pageable pageable
    );
}
