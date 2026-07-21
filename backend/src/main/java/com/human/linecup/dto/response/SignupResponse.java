package com.human.linecup.dto.response;

import com.human.linecup.entity.ApprovalStatus;
import com.human.linecup.entity.User;
import com.human.linecup.entity.UserRole;

import java.time.LocalDateTime;

public record SignupResponse(
        Long id,
        String userId,
        String name,
        UserRole requestedRole,
        ApprovalStatus approvalStatus,
        LocalDateTime requestedAt
) {
    public static SignupResponse from(User user) {
        return new SignupResponse(
                user.getUserId(),
                user.getEmpNo(),
                user.getName(),
                user.getRole(),
                user.getApprovalStatus(),
                user.getCreatedAt()
        );
    }
}
