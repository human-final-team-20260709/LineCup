package com.human.linecup.controller;

import com.human.linecup.dto.response.L1DeviceResponse;
import com.human.linecup.service.L1DeviceService;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.annotation.Validated;

import java.util.List;

/**
 * L1 장비(설비 제어기) 연결 상태 조회 전용. 상태 갱신은 L2 수집기 하트비트를 통해서만
 * 일어나므로(L2CollectorService.processHeartbeat -> L1DeviceService.applyHeartbeat),
 * 이 컨트롤러에는 쓰기 엔드포인트를 두지 않는다.
 */
@RestController
@RequestMapping("/api/l1-devices")
@RequiredArgsConstructor
@Validated
public class L1DeviceController {

    private final L1DeviceService l1DeviceService;

    @GetMapping
    public List<L1DeviceResponse> getAll() {
        return l1DeviceService.getAll();
    }

    @GetMapping("/equipments/{equipmentId}")
    public L1DeviceResponse getByEquipmentId(
            @PathVariable @Positive Long equipmentId
    ) {
        return l1DeviceService.getByEquipmentId(equipmentId);
    }
}
