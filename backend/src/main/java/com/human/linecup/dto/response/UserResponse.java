package com.human.linecup.dto.response;

import com.human.linecup.entity.ApprovalStatus;
import com.human.linecup.entity.User;
import com.human.linecup.entity.UserRole;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String userId,
        String name,
        String email,
        String phone,
        UserRole role,
        ApprovalStatus approvalStatus,
        boolean active,
        LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getEmpNo(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getApprovalStatus(),
                user.isActive(),
                user.getCreatedAt()
        );
    }
}
