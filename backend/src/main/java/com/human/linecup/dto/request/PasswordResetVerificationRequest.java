package com.human.linecup.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordResetVerificationRequest(
        @NotBlank(message = "사원 번호를 입력해주세요.")
        @Size(max = 50, message = "사원 번호는 50자를 초과할 수 없습니다.")
        String userId,

        @NotBlank(message = "이름을 입력해주세요.")
        @Size(max = 50, message = "이름은 50자를 초과할 수 없습니다.")
        String name,

        @NotBlank(message = "이메일을 입력해주세요.")
        @Email(message = "올바른 이메일 형식으로 입력해주세요.")
        String email
) {
}
