import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiSend, FiX } from "react-icons/fi";
import {
  Button,
  CheckboxGrid,
  ErrorText,
  Field,
  FieldGrid,
  Form,
  FormCard,
  FormLayout,
  Input,
  Label,
  ModalBackdrop,
  ModalCard,
  ModalFooter,
  OutlineButton,
  PageHeader,
  PageShell,
  RadioCard,
  RadioHeader,
  RadioGrid,
  SectionLabel,
  Select,
  TopLink,
} from "./SignupCss";

const roleOptions = [
  {
    value: "admin",
    label: "관리자",
    description: "사용자 승인, 기준 정보, 설비 운영 권한을 관리합니다.",
  },
  {
    value: "operator",
    label: "작업자",
    description: "작업 지시 확인과 알람 처리 입력을 수행합니다.",
  },
  {
    value: "supervisor",
    label: "지시자",
    description: "작업 지시 등록과 배정, 생산 진행 현황을 관리합니다.",
  },
];

const validateSignupForm = (formData) => {
  const errors = {};
  const userId = String(formData.get("userId") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const password = String(formData.get("password") || "");
  const passwordConfirm = String(formData.get("passwordConfirm") || "");
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  if (!userId) {
    errors.userId = "아이디를 입력해주세요.";
  } else if (!/^[A-Za-z0-9._-]{4,20}$/.test(userId)) {
    errors.userId = "영문, 숫자, 특수문자(._-)를 사용해 4~20자로 입력해주세요.";
  }

  if (!name) {
    errors.name = "이름을 입력해주세요.";
  } else if (name.length < 2 || name.length > 30) {
    errors.name = "이름은 2~30자로 입력해주세요.";
  }

  if (!password) {
    errors.password = "비밀번호를 입력해주세요.";
  } else if (password.length < 8 || password.length > 20) {
    errors.password = "비밀번호는 8~20자로 입력해주세요.";
  } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    errors.password = "비밀번호에는 영문과 숫자가 모두 포함되어야 합니다.";
  }

  if (!passwordConfirm) {
    errors.passwordConfirm = "비밀번호를 다시 입력해주세요.";
  } else if (password !== passwordConfirm) {
    errors.passwordConfirm = "입력한 비밀번호가 일치하지 않습니다.";
  }

  if (!email) {
    errors.email = "이메일을 입력해주세요.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "올바른 이메일 형식으로 입력해주세요.";
  }

  if (!phone) {
    errors.phone = "연락처를 입력해주세요.";
  } else if (!/^010-\d{4}-\d{4}$/.test(phone)) {
    errors.phone = "010-0000-0000 형식으로 입력해주세요.";
  }

  if (!formData.get("privacyAgreement")) {
    errors.privacyAgreement = "개인정보 수집 및 계정 승인 절차에 동의해주세요.";
  }

  return errors;
};

function Signup() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("operator");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const validationErrors = validateSignupForm(new FormData(form));

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstInvalidField = form.elements.namedItem(
        Object.keys(validationErrors)[0],
      );
      firstInvalidField?.focus();
      return;
    }

    setErrors({});
    setIsModalOpen(true);
  };

  const handleFieldChange = (event) => {
    const { name } = event.target;

    setErrors((currentErrors) => {
      if (
        !currentErrors[name] &&
        !(name === "password" && currentErrors.passwordConfirm)
      ) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors, [name]: "" };
      if (name === "password") {
        nextErrors.passwordConfirm = "";
      }
      return nextErrors;
    });
  };

  const handleSignupComplete = () => {
    setIsModalOpen(false);
    navigate("/account/login");
  };

  return (
    <PageShell>
      <PageHeader>
        <div>
          <SectionLabel>ACCOUNT REGISTRATION</SectionLabel>
          <h1>회원가입</h1>
          <p>
            MES 접근 권한 신청에 필요한 사용자 정보와 역할을 입력하는
            화면입니다.
          </p>
        </div>
        <TopLink to="/account/login">
          <FiArrowLeft aria-hidden="true" />
          로그인으로 이동
        </TopLink>
      </PageHeader>

      <FormLayout>
        <FormCard>
          <Form onSubmit={handleSubmit} onChange={handleFieldChange} noValidate>
            <SectionLabel>USER PROFILE</SectionLabel>
            <FieldGrid>
              <Field>
                <Label htmlFor="signup-user-id">아이디</Label>
                <Input
                  id="signup-user-id"
                  name="userId"
                  placeholder="예: operator.01"
                  autoComplete="username"
                  maxLength={20}
                  aria-invalid={Boolean(errors.userId)}
                  aria-describedby="signup-user-id-error"
                  $invalid={Boolean(errors.userId)}
                />
                <ErrorText
                  id="signup-user-id-error"
                  role="alert"
                  $visible={Boolean(errors.userId)}
                >
                  {errors.userId || "입력 오류 없음"}
                </ErrorText>
              </Field>
              <Field>
                <Label htmlFor="signup-name">이름</Label>
                <Input
                  id="signup-name"
                  name="name"
                  placeholder="이름을 입력하세요"
                  autoComplete="name"
                  maxLength={30}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby="signup-name-error"
                  $invalid={Boolean(errors.name)}
                />
                <ErrorText
                  id="signup-name-error"
                  role="alert"
                  $visible={Boolean(errors.name)}
                >
                  {errors.name || "입력 오류 없음"}
                </ErrorText>
              </Field>
              <Field>
                <Label htmlFor="signup-password">비밀번호</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="new-password"
                  maxLength={20}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby="signup-password-error"
                  $invalid={Boolean(errors.password)}
                />
                <ErrorText
                  id="signup-password-error"
                  role="alert"
                  $visible={Boolean(errors.password)}
                >
                  {errors.password || "입력 오류 없음"}
                </ErrorText>
              </Field>
              <Field>
                <Label htmlFor="signup-password-confirm">비밀번호 확인</Label>
                <Input
                  id="signup-password-confirm"
                  name="passwordConfirm"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  autoComplete="new-password"
                  maxLength={20}
                  aria-invalid={Boolean(errors.passwordConfirm)}
                  aria-describedby="signup-password-confirm-error"
                  $invalid={Boolean(errors.passwordConfirm)}
                />
                <ErrorText
                  id="signup-password-confirm-error"
                  role="alert"
                  $visible={Boolean(errors.passwordConfirm)}
                >
                  {errors.passwordConfirm || "입력 오류 없음"}
                </ErrorText>
              </Field>
              <Field>
                <Label htmlFor="signup-email">이메일</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="name@factory.local"
                  autoComplete="email"
                  maxLength={100}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby="signup-email-error"
                  $invalid={Boolean(errors.email)}
                />
                <ErrorText
                  id="signup-email-error"
                  role="alert"
                  $visible={Boolean(errors.email)}
                >
                  {errors.email || "입력 오류 없음"}
                </ErrorText>
              </Field>
              <Field>
                <Label htmlFor="signup-phone">연락처</Label>
                <Input
                  id="signup-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="010-0000-0000"
                  autoComplete="tel"
                  maxLength={13}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby="signup-phone-error"
                  $invalid={Boolean(errors.phone)}
                />
                <ErrorText
                  id="signup-phone-error"
                  role="alert"
                  $visible={Boolean(errors.phone)}
                >
                  {errors.phone || "입력 오류 없음"}
                </ErrorText>
              </Field>
              <Field>
                <Label htmlFor="signup-assignment">소속 및 담당 영역</Label>
                <Select
                  id="signup-assignment"
                  name="assignmentScope"
                  defaultValue="production-line-01"
                >
                  <option value="production-line-01">
                    생산운영팀 · LINE-01
                  </option>
                  <option value="production-line-02">
                    생산운영팀 · LINE-02
                  </option>
                  <option value="quality-all">품질관리팀 · 전체 라인</option>
                  <option value="equipment-all">설비관리팀 · 전체 라인</option>
                  <option value="system-all">시스템운영팀 · 전체 범위</option>
                </Select>
              </Field>
              <Field>
                <Label htmlFor="signup-purpose">요청 사유</Label>
                <Select
                  id="signup-purpose"
                  name="requestPurpose"
                  defaultValue="production-record"
                >
                  <option value="production-record">
                    작업지시 확인 및 생산실적 처리
                  </option>
                  <option value="quality-history">
                    품질 검사 및 품질이력 조회
                  </option>
                  <option value="equipment-alarm">
                    설비 상태 및 알람 모니터링
                  </option>
                  <option value="master-user-management">
                    기준정보 및 사용자 관리
                  </option>
                  <option value="other">기타 업무</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionLabel>ROLE SELECTION</SectionLabel>
            <RadioGrid>
              {roleOptions.map((role) => (
                <RadioCard
                  key={role.value}
                  $active={selectedRole === role.value}
                >
                  <RadioHeader>
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={selectedRole === role.value}
                      onChange={() => setSelectedRole(role.value)}
                    />
                    <strong>{role.label}</strong>
                  </RadioHeader>
                  <span>{role.description}</span>
                </RadioCard>
              ))}
            </RadioGrid>

            <CheckboxGrid>
              <label>
                <input
                  type="checkbox"
                  name="privacyAgreement"
                  aria-invalid={Boolean(errors.privacyAgreement)}
                  aria-describedby="signup-agreement-error"
                />
                개인정보 수집 및 계정 승인 절차에 동의합니다.
              </label>
              <ErrorText
                id="signup-agreement-error"
                role="alert"
                $visible={Boolean(errors.privacyAgreement)}
              >
                {errors.privacyAgreement || "입력 오류 없음"}
              </ErrorText>
            </CheckboxGrid>

            <Button type="submit">
              회원가입 신청
              <FiSend aria-hidden="true" />
            </Button>
          </Form>
        </FormCard>
      </FormLayout>

      {isModalOpen && (
        <ModalBackdrop role="presentation">
          <ModalCard
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-modal-title"
          >
            <button
              type="button"
              onClick={handleSignupComplete}
              aria-label="로그인으로 이동"
            >
              <FiX aria-hidden="true" />
            </button>
            <FiCheckCircle aria-hidden="true" />
            <h2 id="signup-modal-title">회원가입 신청 완료</h2>
            <p>회원가입 신청이 완료되었습니다. 로그인 화면으로 이동해주세요.</p>
            <ModalFooter>
              <OutlineButton type="button" onClick={handleSignupComplete}>
                로그인으로 이동
              </OutlineButton>
            </ModalFooter>
          </ModalCard>
        </ModalBackdrop>
      )}
    </PageShell>
  );
}

export default Signup;
