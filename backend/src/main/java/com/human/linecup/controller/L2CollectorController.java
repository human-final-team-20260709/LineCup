package com.human.linecup.controller;

import com.human.linecup.dto.request.L2HeartbeatRequest;
import com.human.linecup.dto.response.L2StatusResponse;
import com.human.linecup.service.L2CollectorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * L2 수집기(현장 게이트웨이) 상태 관리 컨트롤러
 * 
 * 1. L2 수집기(C 프로그램)로부터 주기적인 Heartbeat를 수신하여 상태를 갱신합니다.
 * 2. 관리 시스템 UI에 현재 수집기의 연결 상태 및 L1 장비 연결 수를 제공합니다.
 */
@RestController
@RequestMapping("/api/l2-collectors")
@RequiredArgsConstructor
public class L2CollectorController {

    private final L2CollectorService l2CollectorService;

    /**
     * 모든 L2 수집기의 상태 목록 조회
     * 관리자 대시보드에서 각 라인의 수집기 상태를 모니터링할 때 사용합니다.
     */
    @GetMapping
    public ResponseEntity<List<L2StatusResponse>> getAll() {
        return ResponseEntity.ok(l2CollectorService.getAll());
    }

    /**
     * 특정 수집기 상세 상태 조회
     * @param collectorCode 수집기 식별 코드
     */
    @GetMapping("/{collectorCode}")
    public ResponseEntity<L2StatusResponse> getByCode(@PathVariable String collectorCode) {
        return ResponseEntity.ok(l2CollectorService.getByCode(collectorCode));
    }

    /**
     * L2 수집기 하트비트 수신
     * C 클라이언트(L2)가 주기적으로 호출하여 자신의 생존 여부와 
     * 자신이 관리하는 L1 장비들의 연결 상태를 백엔드에 전송합니다.
     * 
     * @param request 하트비트 데이터 (수집기코드, 연결된 L1 수, 개별 장비 상태 등)
     */
    @PostMapping("/heartbeat")
    public ResponseEntity<L2StatusResponse> heartbeat(@Valid @RequestBody L2HeartbeatRequest request) {
        // 하트비트 수신 시 서비스에서 L2_COLLECTOR 테이블과 L1_DEVICE 테이블의 상태가 자동 갱신됩니다.
        L2StatusResponse response = l2CollectorService.processHeartbeat(request);
        return ResponseEntity.ok(response);
    }
}