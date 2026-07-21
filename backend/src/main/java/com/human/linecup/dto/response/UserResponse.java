package com.human.linecup.dto.response;

import com.human.linecup.entity.User;

import lombok.Builder;
import lombok.Getter;

/**
 * 사용자 정보 응답 공용 DTO.
 * - 작업지시에 배정된 작업자 목록
 * - 지시자·작업자 배정 드롭다운 옵션
 * 원래 WorkerSummaryResponse / UserOptionResponse 두 개였는데 필드가 사실상 같아서
 * (UserOptionResponse에만 있던 role도 굳이 못 쓸 이유가 없어서) 하나로 합쳤다.
 */
@Getter
@Builder
public class UserResponse {

    private Long userId;
    private String empNo;
    private String name;
    private User.Role role;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .empNo(user.getEmpNo())
                .name(user.getName())
                .role(user.getRole())
                .build();
    }
}
