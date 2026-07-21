package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EquipmentStatusUpdateRequest {

    // RUNNING / STOPPED / ERROR
    @NotBlank
    private String status;
}
