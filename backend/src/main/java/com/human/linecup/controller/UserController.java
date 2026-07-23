package com.human.linecup.controller;

import com.human.linecup.dto.request.UserActivationUpdateRequest;
import com.human.linecup.dto.request.UserApprovalUpdateRequest;
import com.human.linecup.dto.request.UserRoleUpdateRequest;
import com.human.linecup.dto.response.UserResponse;
import com.human.linecup.dto.response.UserSummaryResponse;
import com.human.linecup.entity.UserRole;
import com.human.linecup.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public Page<UserResponse> searchUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size
    ) {
        UserRole userRole = role == null || role.isBlank() ? null : UserRole.fromCode(role);
        PageRequest pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return userService.searchUsers(keyword, userRole, pageable);
    }

    @GetMapping("/summary")
    public UserSummaryResponse getUserSummary() {
        return userService.getUserSummary();
    }

    @GetMapping("/pending-approvals")
    public List<UserResponse> getPendingApprovals() {
        return userService.getPendingApprovals();
    }

    @GetMapping("/{userId}")
    public UserResponse getUser(@PathVariable @Positive Long userId) {
        return userService.getUser(userId);
    }

    @PatchMapping("/{userId}/role")
    public UserResponse updateRole(
            @PathVariable @Positive Long userId,
            @Valid @RequestBody UserRoleUpdateRequest request
    ) {
        return userService.updateRole(userId, request);
    }

    @PatchMapping("/{userId}/activation")
    public UserResponse updateActivation(
            @PathVariable @Positive Long userId,
            @Valid @RequestBody UserActivationUpdateRequest request
    ) {
        return userService.updateActivation(userId, request);
    }

    @PatchMapping("/{userId}/approval")
    public UserResponse updateApproval(
            @PathVariable @Positive Long userId,
            @Valid @RequestBody UserApprovalUpdateRequest request
    ) {
        return userService.updateApproval(userId, request);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable @Positive Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
