package com.human.linecup.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PasswordResetRequest(
        @NotBlank(message = "사원 번호를 입력해주세요.")
        @Size(max = 50, message = "사원 번호는 50자를 초과할 수 없습니다.")
        String userId,

        @NotBlank(message = "이메일을 입력해주세요.")
        @Email(message = "올바른 이메일 형식으로 입력해주세요.")
        String email,

        @NotBlank(message = "새 비밀번호를 입력해주세요.")
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,20}$",
                message = "비밀번호는 영문과 숫자를 포함해 8~20자로 입력해주세요."
        )
        String password,

        @NotBlank(message = "새 비밀번호 확인을 입력해주세요.")
        String passwordConfirm
) {
    public boolean passwordMatches() {
        return password != null && password.equals(passwordConfirm);
    }
}
