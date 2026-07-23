package com.human.linecup.controller;

import com.human.linecup.dto.response.L2StatusResponse;
import com.human.linecup.service.L2CollectorService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.annotation.Validated;

import java.util.List;

/**
 * L2 수집기(현장 게이트웨이) 상태 관리 컨트롤러
 * 
 * 관리 시스템 UI에 현재 수집기의 연결 상태 및 L1 장비 연결 수를 제공합니다.
 * 하트비트 수신은 L2Controller가 담당합니다.
 */
@RestController
@RequestMapping("/api/l2-collectors")
@RequiredArgsConstructor
@Validated
public class L2CollectorController {

    private final L2CollectorService l2CollectorService;

    /**
     * 모든 L2 수집기의 상태 목록 조회
     * 관리자 대시보드에서 각 라인의 수집기 상태를 모니터링할 때 사용합니다.
     */
    @GetMapping
    public List<L2StatusResponse> getAll() {
        return l2CollectorService.getAll();
    }

    /**
     * 특정 수집기 상세 상태 조회
     * @param collectorCode 수집기 식별 코드
     */
    @GetMapping("/{collectorCode}")
    public L2StatusResponse getByCode(@PathVariable @NotBlank String collectorCode) {
        return l2CollectorService.getByCode(collectorCode);
    }

}
