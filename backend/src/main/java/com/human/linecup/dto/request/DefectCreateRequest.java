package com.human.linecup.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class DefectCreateRequest {

    @NotNull
    private Long productionLotId;

    @NotNull
    private Long equipmentId;

    private Long handlerId;

    @NotBlank
    private String defectType;

    @Min(1)
    private int quantity;

    private String cause;

    // 정상 승인 / 재작업 / 폐기
    private String handleMethod;

    // 미기재 시 서비스에서 "미처리" 기본값 적용
    private String status;
}
