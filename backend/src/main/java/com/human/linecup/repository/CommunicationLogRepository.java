package com.human.linecup.repository;

import com.human.linecup.entity.CommunicationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;

public interface CommunicationLogRepository extends JpaRepository<CommunicationLog, Long> {

    Page<CommunicationLog> findAllByOrderByOccurredAtDesc(Pageable pageable);

    Page<CommunicationLog> findAllByDevice_DeviceIdOrderByOccurredAtDesc(Long deviceId, Pageable pageable);

    Page<CommunicationLog> findAllByCollector_CollectorIdOrderByOccurredAtDesc(Long collectorId, Pageable pageable);

    Page<CommunicationLog> findAllBySuccessOrderByOccurredAtDesc(boolean success, Pageable pageable);

    Page<CommunicationLog> findAllByOccurredAtBetweenOrderByOccurredAtDesc(
            Instant from,
            Instant to,
            Pageable pageable
    );

    long countBySuccessFalseAndOccurredAtBetween(Instant from, Instant to);
}
