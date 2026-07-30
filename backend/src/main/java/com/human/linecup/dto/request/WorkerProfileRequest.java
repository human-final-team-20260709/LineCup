package com.human.linecup.dto.request;

import com.human.linecup.entity.WorkerProfile.ShiftType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record WorkerProfileRequest(
        @NotNull @Positive Long userId,
        @NotBlank @Size(max = 50) String teamName,
        @NotNull ShiftType shiftType,
        @NotNull LocalDate joinedDate,
        @NotNull @Positive Long primaryProcessId
) {
}
