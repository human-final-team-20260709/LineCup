package com.human.linecup.repository;

import com.human.linecup.entity.CommunicationLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunicationLogRepository extends JpaRepository<CommunicationLog, Long> {
    List<CommunicationLog> findAllByOrderByOccurredAtDesc(Pageable pageable);
}
