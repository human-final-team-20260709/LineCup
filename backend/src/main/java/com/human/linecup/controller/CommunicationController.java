package com.human.linecup.controller;

import com.human.linecup.dto.response.CommunicationLogResponse;
import com.human.linecup.dto.response.L1DeviceResponse;
import com.human.linecup.dto.response.L2StatusResponse;
import com.human.linecup.service.CommunicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/communication")
@RequiredArgsConstructor
public class CommunicationController {

    private final CommunicationService communicationService;

    // 프론트 CommunicationStatus.js - L1_DEVICES
    @GetMapping("/l1-devices")
    public List<L1DeviceResponse> getL1Devices() {
        return communicationService.getL1Devices();
    }

    // 프론트 CommunicationStatus.js - L2_STATUS
    @GetMapping("/l2-status")
    public L2StatusResponse getL2Status() {
        return communicationService.getL2Status();
    }

    // 프론트 CommunicationStatus.js - COMM_LOGS
    @GetMapping("/logs")
    public List<CommunicationLogResponse> getLogs(
            @RequestParam(defaultValue = "20") int limit) {
        return communicationService.getRecentLogs(limit);
    }
}