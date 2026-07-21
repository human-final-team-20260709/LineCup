package com.human.linecup.dto.response;

public record EmployeeNumberResponse(
        String maskedUserId
) {
    public static EmployeeNumberResponse from(String empNo) {
        if (empNo == null || empNo.isBlank()) {
            throw new IllegalArgumentException("마스킹할 사원 번호가 없습니다.");
        }

        int visibleLength = Math.min(2, empNo.length());
        String masked = empNo.substring(0, visibleLength)
                + "*".repeat(Math.max(1, empNo.length() - visibleLength));
        return new EmployeeNumberResponse(masked);
    }
}
