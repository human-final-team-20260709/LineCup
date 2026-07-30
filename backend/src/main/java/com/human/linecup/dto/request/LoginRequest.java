package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "사원 번호를 입력해주세요.")
        @Size(max = 50, message = "사원 번호는 50자를 초과할 수 없습니다.")
        String empNo,

        @NotBlank(message = "비밀번호를 입력해주세요.")
        String password
) {
}
