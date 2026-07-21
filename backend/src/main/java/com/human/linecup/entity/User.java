package com.human.linecup.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * ERD 10.1 사용자 (USER)
 *
 * ⚠️ 공용 참조 엔티티입니다. "사용자 계정" 섹션 담당자가 회원가입/로그인/권한변경 등 실제
 * 도메인 로직을 구현할 예정입니다. 작업지시 모듈에서는 지시자/작업자/처리자 FK 참조 및
 * 단순 조회 용도로만 사용하기 때문에 생성자/빌더를 열어두지 않았습니다. 회원가입 기능을
 * 구현할 때 이 파일에 생성자(or Builder)를 추가해서 쓰면 됩니다.
 *
 * Role/ApprovalStatus는 User를 떠나서는 의미가 없는 타입이라 중첩시켰다.
 * 바깥에서는 User.Role / User.ApprovalStatus 로 참조한다.
 *
 * MySQL에서 USER는 예약어이므로 테이블명을 백틱으로 감쌌습니다.
 */
@Entity
@Table(name = "`user`")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "emp_no", nullable = false, unique = true, length = 50)
    private String empNo;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, length = 20)
    private ApprovalStatus approvalStatus;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /** ERD 10.1 USER.role : admin(관리자) / operator(작업자) / supervisor(지시자) */
    public enum Role {
        ADMIN,
        OPERATOR,
        SUPERVISOR
    }

    /** ERD 10.1 USER.approval_status : 대기 / 승인 / 거부 */
    public enum ApprovalStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}
