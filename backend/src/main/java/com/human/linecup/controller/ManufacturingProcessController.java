package com.human.linecup.controller;

import com.human.linecup.dto.response.ManufacturingProcessResponse;
import com.human.linecup.service.ManufacturingProcessService;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/manufacturing-processes")
@RequiredArgsConstructor
public class ManufacturingProcessController {

    private final ManufacturingProcessService manufacturingProcessService;

    @GetMapping
    public List<ManufacturingProcessResponse> getAll(
            @RequestParam(defaultValue = "true") boolean activeOnly
    ) {
        return manufacturingProcessService.getAll(activeOnly);
    }

    @GetMapping("/{processId}")
    public ManufacturingProcessResponse get(@PathVariable @Positive Long processId) {
        return manufacturingProcessService.get(processId);
    }
}
