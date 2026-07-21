package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class DefectUpdateRequest {

    @NotBlank
    private String handleMethod;

    private Long handlerId;

    @NotBlank
    private String status;

    // 처리 이력에 남길 메모 (선택)
    private String note;
}
