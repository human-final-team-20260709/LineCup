package com.human.linecup.repository;

import com.human.linecup.entity.ConnectionStatus;
import com.human.linecup.entity.L2Collector;
import com.human.linecup.entity.L2Collector.CollectorStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface L2CollectorRepository extends JpaRepository<L2Collector, Long> {

    Optional<L2Collector> findByCollectorCode(String collectorCode);

    boolean existsByCollectorCode(String collectorCode);

    List<L2Collector> findAllByStatus(CollectorStatus status);

    List<L2Collector> findAllByBackendConnectionStatus(ConnectionStatus backendConnectionStatus);
}
