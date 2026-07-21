package com.human.linecup.dto.request;

import com.human.linecup.entity.ApprovalStatus;
import jakarta.validation.constraints.NotNull;

public record UserApprovalUpdateRequest(
        @NotNull(message = "가입 승인 처리 상태를 선택해주세요.")
        ApprovalStatus approvalStatus
) {
}
