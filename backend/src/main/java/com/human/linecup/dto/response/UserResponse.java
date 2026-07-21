package com.human.linecup.dto.response;

import com.human.linecup.entity.ApprovalStatus;
import com.human.linecup.entity.UserRole;

import java.time.Instant;

public record UserResponse(
        Long userId,
        String empNo,
        String name,
        String email,
        String phone,
        UserRole role,
        String roleLabel,
        ApprovalStatus approvalStatus,
        String approvalStatusLabel,
        boolean active,
        Instant createdAt,
        Instant lastAccessAt
) {
}
