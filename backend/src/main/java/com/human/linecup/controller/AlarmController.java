package com.human.linecup.controller;

import com.human.linecup.dto.request.AlarmCreateRequest;
import com.human.linecup.dto.request.AlarmHandlingRequest;
import com.human.linecup.dto.request.AlarmSearchRequest;
import com.human.linecup.dto.response.AlarmDetailResponse;
import com.human.linecup.dto.response.AlarmSummaryResponse;
import com.human.linecup.service.AlarmService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

import static org.springframework.data.domain.Sort.Direction.DESC;

@RestController
@RequestMapping("/api/alarms")
@RequiredArgsConstructor
@Validated
public class AlarmController {

    private final AlarmService alarmService;

    @GetMapping
    public Page<AlarmSummaryResponse> getAlarms(
            @Valid @ModelAttribute AlarmSearchRequest request,
            @PageableDefault(size = 20, sort = "occurredAt", direction = DESC) Pageable pageable
    ) {
        return alarmService.getAlarms(request, pageable);
    }

    @GetMapping("/current")
    public Page<AlarmSummaryResponse> getCurrentAlarms(
            @PageableDefault(size = 20, sort = "occurredAt", direction = DESC) Pageable pageable
    ) {
        return alarmService.getCurrentAlarms(pageable);
    }

    @GetMapping("/number/{alarmNo}")
    public AlarmDetailResponse getAlarmByNo(@PathVariable String alarmNo) {
        return alarmService.getAlarmByNo(alarmNo);
    }

    @GetMapping("/{alarmId}")
    public AlarmDetailResponse getAlarm(@PathVariable @Positive Long alarmId) {
        return alarmService.getAlarm(alarmId);
    }

    @PostMapping
    public ResponseEntity<AlarmDetailResponse> createAlarm(
            @Valid @RequestBody AlarmCreateRequest request
    ) {
        AlarmDetailResponse response = alarmService.createAlarm(request);
        return ResponseEntity.created(URI.create("/api/alarms/" + response.summary().alarmId())).body(response);
    }

    @PatchMapping("/{alarmId}/handling")
    public AlarmDetailResponse updateHandling(
            @PathVariable @Positive Long alarmId,
            @Valid @RequestBody AlarmHandlingRequest request
    ) {
        return alarmService.updateHandling(alarmId, request);
    }
}
