package com.human.linecup.service;

import com.human.linecup.dto.request.ManufacturingProcessRequest;
import com.human.linecup.dto.response.ManufacturingProcessResponse;
import com.human.linecup.entity.ManufacturingProcess;
import com.human.linecup.repository.ManufacturingProcessRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ManufacturingProcessService {

    private final ManufacturingProcessRepository manufacturingProcessRepository;

    @Transactional
    public ManufacturingProcessResponse create(ManufacturingProcessRequest request) {
        if (manufacturingProcessRepository.existsByProcessCode(request.processCode())) {
            throw new IllegalArgumentException("이미 사용 중인 공정 코드입니다: " + request.processCode());
        }
        ManufacturingProcess process = ManufacturingProcess.create(
                request.processCode(),
                request.processName(),
                request.sequence(),
                request.active()
        );
        return toResponse(manufacturingProcessRepository.save(process));
    }

    @Transactional
    public ManufacturingProcessResponse update(Long processId, ManufacturingProcessRequest request) {
        ManufacturingProcess process = findProcess(processId);
        if (!process.getProcessCode().equals(request.processCode())) {
            throw new IllegalArgumentException("공정 코드는 변경할 수 없습니다.");
        }
        process.changeInfo(request.processName(), request.sequence(), request.active());
        return toResponse(process);
    }

    public ManufacturingProcessResponse get(Long processId) {
        return toResponse(findProcess(processId));
    }

    public List<ManufacturingProcessResponse> getAll(boolean activeOnly) {
        List<ManufacturingProcess> processes = activeOnly
                ? manufacturingProcessRepository.findByActiveTrueOrderBySequenceAsc()
                : manufacturingProcessRepository.findAllByOrderBySequenceAsc();
        return processes.stream().map(this::toResponse).toList();
    }

    private ManufacturingProcess findProcess(Long processId) {
        return manufacturingProcessRepository.findById(processId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 공정입니다: " + processId));
    }

    private ManufacturingProcessResponse toResponse(ManufacturingProcess process) {
        return new ManufacturingProcessResponse(
                process.getProcessId(),
                process.getProcessCode(),
                process.getProcessName(),
                process.getSequence(),
                process.isActive()
        );
    }
}
