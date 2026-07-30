package com.human.linecup.repository;

import com.human.linecup.entity.CommunicationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;

public interface CommunicationLogRepository extends JpaRepository<CommunicationLog, Long> {

    Page<CommunicationLog> findAllByOrderByOccurredAtDescLogIdDesc(Pageable pageable);

    Page<CommunicationLog> findAllByDevice_DeviceIdOrderByOccurredAtDescLogIdDesc(Long deviceId, Pageable pageable);

    Page<CommunicationLog> findAllByCollector_CollectorIdOrderByOccurredAtDescLogIdDesc(
            Long collectorId,
            Pageable pageable
    );

    Page<CommunicationLog> findAllBySuccessOrderByOccurredAtDescLogIdDesc(boolean success, Pageable pageable);

    Page<CommunicationLog> findAllByOccurredAtGreaterThanEqualAndOccurredAtLessThanOrderByOccurredAtDescLogIdDesc(
            Instant from,
            Instant to,
            Pageable pageable
    );

    long countBySuccessFalseAndOccurredAtGreaterThanEqualAndOccurredAtLessThan(Instant from, Instant to);
}
