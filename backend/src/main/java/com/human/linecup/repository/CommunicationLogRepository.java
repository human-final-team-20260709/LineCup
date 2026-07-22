package com.human.linecup.repository;

import com.human.linecup.entity.CommunicationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface CommunicationLogRepository extends JpaRepository<CommunicationLog, Long> {

    // 통신 로그 화면 - 최신순 전체 조회
    Page<CommunicationLog> findAllByOrderByOccurredAtDesc(Pageable pageable);

    // idx_comm_log_device_time - 특정 L1 장비의 통신 이력
    Page<CommunicationLog> findAllByDevice_DeviceIdOrderByOccurredAtDesc(Long deviceId, Pageable pageable);

    // idx_comm_log_collector_time - 특정 L2 수집기의 통신 이력
    Page<CommunicationLog> findAllByCollector_CollectorIdOrderByOccurredAtDesc(Long collectorId, Pageable pageable);

    // idx_comm_log_success_time - 실패 로그만 조회 (장애 대응용)
    Page<CommunicationLog> findAllBySuccessOrderByOccurredAtDesc(boolean success, Pageable pageable);

    // 기간 내 통신 로그 조회 (통계/대시보드용)
    Page<CommunicationLog> findAllByOccurredAtBetweenOrderByOccurredAtDesc(
            LocalDateTime from, LocalDateTime to, Pageable pageable);

    // 특정 구간 내 실패 건수 (장애율 산출)
    long countBySuccessFalseAndOccurredAtBetween(LocalDateTime from, LocalDateTime to);
}
