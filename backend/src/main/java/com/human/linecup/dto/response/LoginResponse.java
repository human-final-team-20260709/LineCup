package com.human.linecup.dto.response;

import com.human.linecup.entity.User;

public record LoginResponse(
        UserResponse user
) {
    public static LoginResponse from(User user) {
        return new LoginResponse(UserResponse.from(user));
    }
}
