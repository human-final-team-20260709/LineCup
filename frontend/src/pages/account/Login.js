import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { extractApiError } from '../../api/client';
import { FiArrowRight, FiLock, FiSearch, FiUserPlus } from 'react-icons/fi';
import AccountModal from './AccountModal';
import {
  ActionLink,
  AuthCard,
  AuthShell,
  Button,
  CardHeader,
  FeatureChip,
  FeatureList,
  Field,
  FieldGrid,
  Form,
  HelperLinkGroup,
  Input,
  Label,
  LoginLayout,
  MutedText,
  PageIntro,
  PageTitle,
  SectionLabel,
} from './LoginCss';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [modal, setModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsSubmitting(true);
    try {
      await login({
        empNo: String(formData.get('empNo') || '').trim(),
        password: String(formData.get('password') || ''),
      });
      navigate('/dashboard');
    } catch (error) {
      setModal({
        title: '로그인 실패',
        message: extractApiError(error, '사원 번호 또는 비밀번호를 확인해주세요.'),
        tone: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <LoginLayout>
        <PageIntro>
          <SectionLabel>ACCOUNT ACCESS</SectionLabel>
          <PageTitle>MES 계정 로그인</PageTitle>
          <MutedText>
            생산 라인 담당자는 계정으로 로그인해 작업 지시, 품질 기록,
            설비 현황을 확인합니다.
          </MutedText>
          <FeatureList>
            {['작업 지시', '품질 기록', '설비 현황'].map((item) => (
              <FeatureChip key={item}>{item}</FeatureChip>
            ))}
          </FeatureList>
        </PageIntro>

        <AuthCard>
          <CardHeader>
            <div>
              <SectionLabel>LOGIN FORM</SectionLabel>
              <h2>로그인 정보 입력</h2>
            </div>
          </CardHeader>

          <Form onSubmit={handleSubmit}>
            <FieldGrid>
              <Field>
                <Label htmlFor="login-user-id">사원 번호</Label>
                <Input
                  id="login-user-id"
                  name="empNo"
                  required
                  placeholder="사원 번호를 입력하세요"
                  autoComplete="username"
                />
              </Field>
              <Field>
                <Label htmlFor="login-password">비밀번호</Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                  required
                />
              </Field>
            </FieldGrid>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '로그인 중...' : '로그인'}
              <FiArrowRight aria-hidden="true" />
            </Button>

            <HelperLinkGroup aria-label="계정 도움말">
              <ActionLink to="/account/find/employee-number">
                <FiSearch aria-hidden="true" />
                사원 번호 찾기
              </ActionLink>
              <ActionLink to="/account/find/password">
                <FiLock aria-hidden="true" />
                비밀번호 찾기
              </ActionLink>
              <ActionLink to="/account/signup">
                <FiUserPlus aria-hidden="true" />
                회원가입
              </ActionLink>
            </HelperLinkGroup>
          </Form>
        </AuthCard>
      </LoginLayout>

      <AccountModal
        isOpen={Boolean(modal)}
        title={modal?.title}
        message={modal?.message}
        tone={modal?.tone}
        onConfirm={() => setModal(null)}
        onClose={() => setModal(null)}
      />
    </AuthShell>
  );
}

export default Login;
