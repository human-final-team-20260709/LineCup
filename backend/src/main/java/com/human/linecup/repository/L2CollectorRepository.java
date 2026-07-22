package com.human.linecup.repository;

import com.human.linecup.entity.L2Collector;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface L2CollectorRepository extends JpaRepository<L2Collector, Long> {

    // name UNIQUE - 수집기 단건 조회
    Optional<L2Collector> findByName(String name);

    // 가동중 / 정지 상태별 목록 (수집기가 여러 대인 환경 대비)
    List<L2Collector> findAllByStatus(String status);

    // 백엔드 연결이 끊긴 수집기 감지용
    List<L2Collector> findAllByBackendConnectionStatus(String backendConnectionStatus);
}
