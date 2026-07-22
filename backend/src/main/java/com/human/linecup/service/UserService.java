package com.human.linecup.service;

import com.human.linecup.dto.request.FindEmployeeNumberRequest;
import com.human.linecup.dto.request.LoginRequest;
import com.human.linecup.dto.request.PasswordResetRequest;
import com.human.linecup.dto.request.PasswordResetVerificationRequest;
import com.human.linecup.dto.request.SignupRequest;
import com.human.linecup.dto.request.UserActivationUpdateRequest;
import com.human.linecup.dto.request.UserApprovalUpdateRequest;
import com.human.linecup.dto.request.UserRoleUpdateRequest;
import com.human.linecup.dto.response.EmployeeNumberResponse;
import com.human.linecup.dto.response.LoginResponse;
import com.human.linecup.dto.response.PasswordResetVerificationResponse;
import com.human.linecup.dto.response.SignupResponse;
import com.human.linecup.dto.response.UserResponse;
import com.human.linecup.dto.response.UserSummaryResponse;
import com.human.linecup.entity.ApprovalStatus;
import com.human.linecup.entity.User;
import com.human.linecup.entity.UserRole;
import com.human.linecup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private static final String PASSWORD_SCHEME = "pbkdf2-sha256";
    private static final String PASSWORD_ALGORITHM = "PBKDF2WithHmacSHA256";
    private static final int PASSWORD_ITERATIONS = 210_000;
    private static final int PASSWORD_SALT_BYTES = 16;
    private static final int PASSWORD_HASH_BYTES = 32;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;

    @Transactional
    public SignupResponse signup(SignupRequest request) {
        Objects.requireNonNull(request, "회원가입 요청은 필수입니다.");
        if (!request.passwordMatches()) {
            throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }
        if (!request.privacyAgreement()) {
            throw new IllegalArgumentException("개인정보 수집 및 계정 승인 절차에 동의해야 합니다.");
        }

        String empNo = requireText(request.empNo(), "사원 번호");
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmpNo(empNo)) {
            throw new IllegalStateException("이미 사용 중인 사원 번호입니다.");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException("이미 사용 중인 이메일입니다.");
        }

        User user = User.createPending(
                empNo,
                encodePassword(request.password()),
                request.name(),
                email,
                request.phone(),
                request.role()
        );

        try {
            User saved = userRepository.saveAndFlush(user);
            return toSignupResponse(saved);
        } catch (DataIntegrityViolationException exception) {
            throw new IllegalStateException("이미 등록된 사원 번호 또는 이메일입니다.", exception);
        }
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Objects.requireNonNull(request, "로그인 요청은 필수입니다.");
        User user = userRepository.findByEmpNo(requireText(request.empNo(), "사원 번호"))
                .orElseThrow(() -> new IllegalArgumentException("사원 번호 또는 비밀번호가 일치하지 않습니다."));

        if (!matchesPassword(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("사원 번호 또는 비밀번호가 일치하지 않습니다.");
        }
        if (user.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new IllegalStateException("가입 승인이 완료되지 않은 계정입니다.");
        }
        if (!user.isActive()) {
            throw new IllegalStateException("비활성화된 계정입니다.");
        }

        user.recordAccess(Instant.now());
        return new LoginResponse(toUserResponse(user));
    }

    public EmployeeNumberResponse findEmployeeNumber(FindEmployeeNumberRequest request) {
        Objects.requireNonNull(request, "사원 번호 찾기 요청은 필수입니다.");
        User user = userRepository.findByNameAndEmail(
                        requireText(request.name(), "이름"),
                        normalizeEmail(request.email())
                )
                .orElseThrow(() -> new NoSuchElementException("입력한 정보와 일치하는 계정을 찾을 수 없습니다."));
        return new EmployeeNumberResponse(maskEmployeeNumber(user.getEmpNo()));
    }

    public PasswordResetVerificationResponse verifyPasswordResetIdentity(
            PasswordResetVerificationRequest request
    ) {
        Objects.requireNonNull(request, "비밀번호 재설정 본인 확인 요청은 필수입니다.");
        return userRepository.findByEmpNoAndNameAndEmail(
                        requireText(request.empNo(), "사원 번호"),
                        requireText(request.name(), "이름"),
                        normalizeEmail(request.email())
                )
                .map(user -> new PasswordResetVerificationResponse(true, user.getEmpNo()))
                .orElseGet(() -> new PasswordResetVerificationResponse(false, null));
    }

    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        Objects.requireNonNull(request, "비밀번호 재설정 요청은 필수입니다.");
        if (!request.passwordMatches()) {
            throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        User user = userRepository.findByEmpNoAndEmail(
                        requireText(request.empNo(), "사원 번호"),
                        normalizeEmail(request.email())
                )
                .orElseThrow(() -> new NoSuchElementException("입력한 정보와 일치하는 계정을 찾을 수 없습니다."));
        user.changePassword(encodePassword(request.password()));
    }

    public Page<UserResponse> searchUsers(String keyword, UserRole role, Pageable pageable) {
        Objects.requireNonNull(pageable, "페이지 정보는 필수입니다.");
        return userRepository.search(normalizeKeyword(keyword), role, pageable)
                .map(this::toUserResponse);
    }

    public List<UserResponse> getPendingApprovals() {
        return userRepository.findByApprovalStatusOrderByCreatedAtDesc(ApprovalStatus.PENDING).stream()
                .map(this::toUserResponse)
                .toList();
    }

    public UserSummaryResponse getUserSummary() {
        return new UserSummaryResponse(
                userRepository.count(),
                userRepository.countByActiveTrue(),
                userRepository.countByRole(UserRole.ADMIN),
                userRepository.countByApprovalStatus(ApprovalStatus.PENDING)
        );
    }

    public UserResponse getUser(Long userId) {
        return toUserResponse(getUserOrThrow(userId));
    }

    @Transactional
    public UserResponse updateRole(Long userId, UserRoleUpdateRequest request) {
        Objects.requireNonNull(request, "사용자 역할 변경 요청은 필수입니다.");
        User user = getUserOrThrow(userId);
        user.changeRole(Objects.requireNonNull(request.role(), "변경할 사용자 역할은 필수입니다."));
        return toUserResponse(user);
    }

    @Transactional
    public UserResponse updateActivation(Long userId, UserActivationUpdateRequest request) {
        Objects.requireNonNull(request, "계정 활성 상태 변경 요청은 필수입니다.");
        User user = getUserOrThrow(userId);
        user.changeActive(request.active());
        return toUserResponse(user);
    }

    @Transactional
    public UserResponse updateApproval(Long userId, UserApprovalUpdateRequest request) {
        Objects.requireNonNull(request, "가입 승인 처리 요청은 필수입니다.");
        User user = getUserOrThrow(userId);
        ApprovalStatus nextStatus = Objects.requireNonNull(
                request.approvalStatus(),
                "가입 승인 처리 상태는 필수입니다."
        );

        switch (nextStatus) {
            case APPROVED -> user.approve();
            case REJECTED -> user.reject();
            case PENDING -> throw new IllegalArgumentException("가입 요청은 승인 또는 거부로 처리해야 합니다.");
        }
        return toUserResponse(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = getUserOrThrow(userId);
        userRepository.delete(user);
        userRepository.flush();
    }

    private User getUserOrThrow(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("사용자 ID는 양수여야 합니다.");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다: " + userId));
    }

    private SignupResponse toSignupResponse(User user) {
        return new SignupResponse(
                user.getUserId(),
                user.getEmpNo(),
                user.getName(),
                user.getRole(),
                user.getRole().getLabel(),
                user.getApprovalStatus(),
                user.getApprovalStatus().getLabel(),
                user.getCreatedAt()
        );
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getEmpNo(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getRole().getLabel(),
                user.getApprovalStatus(),
                user.getApprovalStatus().getLabel(),
                user.isActive(),
                user.getCreatedAt(),
                user.getLastAccessAt()
        );
    }

    private String normalizeKeyword(String keyword) {
        return keyword == null || keyword.isBlank() ? null : keyword.trim();
    }

    private String normalizeEmail(String email) {
        return requireText(email, "이메일").toLowerCase(Locale.ROOT);
    }

    private String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다.");
        }
        return value.trim();
    }

    private String maskEmployeeNumber(String empNo) {
        int length = empNo.length();
        if (length <= 2) {
            return "*".repeat(length);
        }
        if (length <= 4) {
            return empNo.substring(0, 1) + "*".repeat(length - 2) + empNo.substring(length - 1);
        }
        return empNo.substring(0, 2) + "*".repeat(length - 4) + empNo.substring(length - 2);
    }

    private String encodePassword(String rawPassword) {
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalArgumentException("비밀번호는 필수입니다.");
        }

        byte[] salt = new byte[PASSWORD_SALT_BYTES];
        SECURE_RANDOM.nextBytes(salt);
        byte[] hash = derivePassword(rawPassword, salt, PASSWORD_ITERATIONS);
        Base64.Encoder encoder = Base64.getEncoder().withoutPadding();
        return String.join(
                ":",
                PASSWORD_SCHEME,
                Integer.toString(PASSWORD_ITERATIONS),
                encoder.encodeToString(salt),
                encoder.encodeToString(hash)
        );
    }

    private boolean matchesPassword(String rawPassword, String encodedPassword) {
        if (rawPassword == null || encodedPassword == null) {
            return false;
        }

        String[] parts = encodedPassword.split(":", -1);
        if (parts.length != 4 || !PASSWORD_SCHEME.equals(parts[0])) {
            return false;
        }

        try {
            int iterations = Integer.parseInt(parts[1]);
            if (iterations <= 0 || iterations > 1_000_000) {
                return false;
            }
            byte[] salt = Base64.getDecoder().decode(parts[2]);
            byte[] expected = Base64.getDecoder().decode(parts[3]);
            byte[] actual = derivePassword(rawPassword, salt, iterations);
            return MessageDigest.isEqual(expected, actual);
        } catch (IllegalArgumentException exception) {
            return false;
        }
    }

    private byte[] derivePassword(String rawPassword, byte[] salt, int iterations) {
        PBEKeySpec keySpec = new PBEKeySpec(
                rawPassword.toCharArray(),
                salt,
                iterations,
                PASSWORD_HASH_BYTES * Byte.SIZE
        );
        try {
            return SecretKeyFactory.getInstance(PASSWORD_ALGORITHM)
                    .generateSecret(keySpec)
                    .getEncoded();
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("비밀번호를 안전하게 처리할 수 없습니다.", exception);
        } finally {
            keySpec.clearPassword();
        }
    }
}
