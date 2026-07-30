package com.human.linecup.controller;

import com.human.linecup.dto.request.WorkerProfileRequest;
import com.human.linecup.dto.request.WorkerSkillRequest;
import com.human.linecup.dto.response.WorkerProfileResponse;
import com.human.linecup.service.WorkerProfileService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.net.URI;

@Validated
@RestController
@RequestMapping("/api/worker-profiles")
@RequiredArgsConstructor
public class WorkerProfileController {

    private final WorkerProfileService workerProfileService;

    @PostMapping
    public ResponseEntity<WorkerProfileResponse> create(
            @Valid @RequestBody WorkerProfileRequest request
    ) {
        WorkerProfileResponse response = workerProfileService.create(request);
        return ResponseEntity.created(URI.create(
                "/api/worker-profiles/" + response.workerProfileId()
        )).body(response);
    }

    @PutMapping("/{workerProfileId}")
    public WorkerProfileResponse update(
            @PathVariable @Positive Long workerProfileId,
            @Valid @RequestBody WorkerProfileRequest request
    ) {
        return workerProfileService.update(workerProfileId, request);
    }

    @GetMapping("/{workerProfileId}")
    public WorkerProfileResponse get(@PathVariable @Positive Long workerProfileId) {
        return workerProfileService.get(workerProfileId);
    }

    @GetMapping("/by-user/{userId}")
    public WorkerProfileResponse getByUser(@PathVariable @Positive Long userId) {
        return workerProfileService.getByUser(userId);
    }

    @GetMapping
    public Page<WorkerProfileResponse> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size
    ) {
        PageRequest pageable = PageRequest.of(
                page,
                size,
                Sort.by(
                        Sort.Order.asc("user.name"),
                        Sort.Order.asc("workerProfileId")
                )
        );
        return workerProfileService.search(keyword, pageable);
    }

    @PostMapping("/{workerProfileId}/skills")
    public WorkerProfileResponse addSkill(
            @PathVariable @Positive Long workerProfileId,
            @Valid @RequestBody WorkerSkillRequest request
    ) {
        return workerProfileService.addSkill(workerProfileId, request);
    }

    @DeleteMapping("/{workerProfileId}/skills/{skillName}")
    public WorkerProfileResponse removeSkill(
            @PathVariable @Positive Long workerProfileId,
            @PathVariable String skillName
    ) {
        return workerProfileService.removeSkill(workerProfileId, skillName);
    }

    @DeleteMapping("/{workerProfileId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable @Positive Long workerProfileId) {
        workerProfileService.delete(workerProfileId);
    }
}
