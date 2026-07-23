package com.human.linecup.controller;

import com.human.linecup.dto.request.AlarmCreateRequest;
import com.human.linecup.dto.request.AlarmHandlingRequest;
import com.human.linecup.dto.request.AlarmSearchRequest;
import com.human.linecup.dto.response.AlarmDetailResponse;
import com.human.linecup.dto.response.AlarmSummaryResponse;
import com.human.linecup.service.AlarmService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/alarms")
@RequiredArgsConstructor
public class AlarmController {

    private final AlarmService alarmService;

    @GetMapping
    public Page<AlarmSummaryResponse> getAlarms(
            @Valid @ModelAttribute AlarmSearchRequest request,
            Pageable pageable
    ) {
        return alarmService.getAlarms(request, pageable);
    }

    @GetMapping("/current")
    public Page<AlarmSummaryResponse> getCurrentAlarms(Pageable pageable) {
        return alarmService.getCurrentAlarms(pageable);
    }

    @GetMapping("/period")
    public Page<AlarmSummaryResponse> getAlarmsByPeriod(
            @RequestParam Instant startAt,
            @RequestParam Instant endAt,
            Pageable pageable
    ) {
        return alarmService.getAlarmsByPeriod(startAt, endAt, pageable);
    }

    @GetMapping("/number/{alarmNo}")
    public AlarmDetailResponse getAlarmByNo(@PathVariable String alarmNo) {
        return alarmService.getAlarmByNo(alarmNo);
    }

    @GetMapping("/{alarmId}")
    public AlarmDetailResponse getAlarm(@PathVariable Long alarmId) {
        return alarmService.getAlarm(alarmId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AlarmDetailResponse createAlarm(
            @Valid @RequestBody AlarmCreateRequest request
    ) {
        return alarmService.createAlarm(request);
    }

    @PatchMapping("/{alarmId}/handling")
    public AlarmDetailResponse updateHandling(
            @PathVariable Long alarmId,
            @Valid @RequestBody AlarmHandlingRequest request
    ) {
        return alarmService.updateHandling(alarmId, request);
    }
}
