package com.human.linecup.dto.request;

import com.human.linecup.entity.UserRole;
import jakarta.validation.constraints.NotNull;

public record UserRoleUpdateRequest(
        @NotNull(message = "변경할 사용자 역할을 선택해주세요.")
        UserRole role
) {
}
