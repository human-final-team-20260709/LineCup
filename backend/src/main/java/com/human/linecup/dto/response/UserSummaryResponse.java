package com.human.linecup.dto.response;

public record UserSummaryResponse(
        long totalUserCount,
        long activeUserCount,
        long adminCount,
        long pendingApprovalCount
) {
}
