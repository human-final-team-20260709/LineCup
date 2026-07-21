package com.human.linecup.dto.request;

import com.human.linecup.entity.UserRole;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @NotBlank(message = "사원 번호를 입력해주세요.")
        @Pattern(
                regexp = "^[A-Za-z0-9._-]{4,20}$",
                message = "사원 번호는 영문, 숫자, 특수문자(._-)를 사용해 4~20자로 입력해주세요."
        )
        String userId,

        @NotBlank(message = "비밀번호를 입력해주세요.")
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,20}$",
                message = "비밀번호는 영문과 숫자를 포함해 8~20자로 입력해주세요."
        )
        String password,

        @NotBlank(message = "비밀번호 확인을 입력해주세요.")
        String passwordConfirm,

        @NotBlank(message = "이름을 입력해주세요.")
        @Size(min = 2, max = 30, message = "이름은 2~30자로 입력해주세요.")
        String name,

        @NotBlank(message = "이메일을 입력해주세요.")
        @Email(message = "올바른 이메일 형식으로 입력해주세요.")
        @Size(max = 100, message = "이메일은 100자를 초과할 수 없습니다.")
        String email,

        @NotBlank(message = "연락처를 입력해주세요.")
        @Pattern(regexp = "^010-\\d{4}-\\d{4}$", message = "연락처는 010-0000-0000 형식으로 입력해주세요.")
        String phone,

        @NotNull(message = "사용자 역할을 선택해주세요.")
        UserRole role,

        @AssertTrue(message = "개인정보 수집 및 계정 승인 절차에 동의해주세요.")
        boolean privacyAgreement
) {
    public boolean passwordMatches() {
        return password != null && password.equals(passwordConfirm);
    }
}
