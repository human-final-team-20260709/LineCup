package com.human.linecup.dto.response;

import com.human.linecup.entity.ApprovalStatus;
import com.human.linecup.entity.UserRole;

import java.time.Instant;

public record SignupResponse(
        Long userId,
        String empNo,
        String name,
        UserRole requestedRole,
        String requestedRoleLabel,
        ApprovalStatus approvalStatus,
        String approvalStatusLabel,
        Instant requestedAt
) {
}
