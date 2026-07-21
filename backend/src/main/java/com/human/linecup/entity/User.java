package com.human.linecup.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Entity
@Table(
        name = "user",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_user_emp_no", columnNames = "emp_no"),
                @UniqueConstraint(name = "uk_user_email", columnNames = "email")
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "emp_no", nullable = false, length = 50)
    private String empNo;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Convert(converter = UserRoleConverter.class)
    @Column(name = "role", nullable = false, length = 20)
    private UserRole role;

    @Convert(converter = ApprovalStatusConverter.class)
    @Column(name = "approval_status", nullable = false, length = 20)
    private ApprovalStatus approvalStatus;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public static User createPending(
            String empNo,
            String encodedPassword,
            String name,
            String email,
            String phone,
            UserRole role
    ) {
        User user = new User();
        user.empNo = requireText(empNo, "사원번호");
        user.password = requireText(encodedPassword, "비밀번호");
        user.name = requireText(name, "이름");
        user.email = requireText(email, "이메일");
        user.phone = requireText(phone, "연락처");
        user.role = Objects.requireNonNull(role, "사용자 역할은 필수입니다.");
        user.approvalStatus = ApprovalStatus.PENDING;
        user.active = false;
        return user;
    }

    public void changeRole(UserRole role) {
        this.role = Objects.requireNonNull(role, "사용자 역할은 필수입니다.");
    }

    public void changePassword(String encodedPassword) {
        this.password = requireText(encodedPassword, "비밀번호");
    }

    public void approve() {
        this.approvalStatus = ApprovalStatus.APPROVED;
        this.active = true;
    }

    public void reject() {
        this.approvalStatus = ApprovalStatus.REJECTED;
        this.active = false;
    }

    public void changeActive(boolean active) {
        if (active && approvalStatus != ApprovalStatus.APPROVED) {
            throw new IllegalStateException("승인된 계정만 활성화할 수 있습니다.");
        }
        this.active = active;
    }

    @PrePersist
    private void prePersist() {
        if (approvalStatus == null) {
            approvalStatus = ApprovalStatus.PENDING;
        }
        createdAt = createdAt == null ? LocalDateTime.now() : createdAt;
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }
}
