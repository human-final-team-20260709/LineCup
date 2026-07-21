package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EquipmentSaveRequest {

    @NotBlank
    private String equipmentName;

    @NotBlank
    private String equipmentCode;

    // 미기재 시 서비스에서 STOPPED 기본값 적용
    private String status;
}
