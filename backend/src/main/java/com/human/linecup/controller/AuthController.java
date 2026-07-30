package com.human.linecup.controller;

import com.human.linecup.dto.request.FindEmployeeNumberRequest;
import com.human.linecup.dto.request.LoginRequest;
import com.human.linecup.dto.request.PasswordResetRequest;
import com.human.linecup.dto.request.PasswordResetVerificationRequest;
import com.human.linecup.dto.request.SignupRequest;
import com.human.linecup.dto.response.EmployeeNumberResponse;
import com.human.linecup.dto.response.LoginResponse;
import com.human.linecup.dto.response.PasswordResetVerificationResponse;
import com.human.linecup.dto.response.SignupResponse;
import com.human.linecup.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.net.URI;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest request) {
        SignupResponse response = userService.signup(request);
        return ResponseEntity.created(URI.create("/api/users/" + response.userId())).body(response);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @PostMapping("/find-employee-number")
    public EmployeeNumberResponse findEmployeeNumber(
            @Valid @RequestBody FindEmployeeNumberRequest request
    ) {
        return userService.findEmployeeNumber(request);
    }

    @PostMapping("/password-reset/verify")
    public PasswordResetVerificationResponse verifyPasswordResetIdentity(
            @Valid @RequestBody PasswordResetVerificationRequest request
    ) {
        return userService.verifyPasswordResetIdentity(request);
    }

    @PatchMapping("/password-reset")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        userService.resetPassword(request);
    }
}
