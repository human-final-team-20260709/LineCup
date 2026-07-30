package com.human.linecup.dto.response;

import com.human.linecup.entity.WorkerProfile.ShiftType;

import java.time.LocalDate;
import java.util.List;

public record WorkerProfileResponse(
        Long workerProfileId,
        Long userId,
        String empNo,
        String name,
        String teamName,
        ShiftType shiftType,
        String shiftTypeLabel,
        LocalDate joinedDate,
        Long primaryProcessId,
        String primaryProcessCode,
        String primaryProcessName,
        List<String> skills
) {
    public WorkerProfileResponse {
        skills = skills == null ? List.of() : List.copyOf(skills);
    }
}
