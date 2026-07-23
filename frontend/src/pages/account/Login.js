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
    <AuthShell
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}
    >
      <LoginLayout
        style={{
          width: '100%',
          maxWidth: '1080px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: '28px',
          alignItems: 'stretch',
        }}
      >
        <PageIntro
          style={{
            minHeight: '380px',
            justifyContent: 'center',
            boxSizing: 'border-box',
            padding: '40px',
          }}
        >
          <SectionLabel style={{ fontSize: '13px', lineHeight: '18px' }}>
            ACCOUNT ACCESS
          </SectionLabel>
          <PageTitle style={{ fontSize: '56px', lineHeight: '64px' }}>
            MES 계정 로그인
          </PageTitle>
          <MutedText style={{ fontSize: '18px', lineHeight: '30px' }}>
            생산 라인 담당자는 계정으로 로그인해 작업 지시, 품질 기록,
            설비 현황을 확인합니다.
          </MutedText>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '32px',
            }}
          >
            {['작업 지시', '품질 기록', '설비 현황'].map((item) => (
              <span
                key={item}
                style={{
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  background: '#171f33',
                  color: '#dae2fd',
                  padding: '10px 14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  lineHeight: '20px',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </PageIntro>

        <AuthCard
          style={{
            boxSizing: 'border-box',
            alignSelf: 'stretch',
            padding: '40px',
          }}
        >
          <CardHeader style={{ marginBottom: '28px' }}>
            <div>
              <SectionLabel style={{ fontSize: '13px', lineHeight: '18px' }}>
                LOGIN FORM
              </SectionLabel>
              <h2 style={{ fontSize: '32px', lineHeight: '40px' }}>
                로그인 정보 입력
              </h2>
            </div>
          </CardHeader>

          <Form onSubmit={handleSubmit} style={{ gap: '22px' }}>
            <FieldGrid style={{ gap: '22px' }}>
              <Field>
                <Label htmlFor="login-user-id" style={{ fontSize: '17px' }}>
                  사원 번호
                </Label>
                <Input
                  id="login-user-id"
                  name="empNo"
                  required
                  placeholder="사원 번호를 입력하세요"
                  autoComplete="username"
                  style={{ minHeight: '56px', fontSize: '18px' }}
                />
              </Field>
              <Field>
                <Label htmlFor="login-password" style={{ fontSize: '17px' }}>
                  비밀번호
                </Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                  required
                  style={{ minHeight: '56px', fontSize: '18px' }}
                />
              </Field>
            </FieldGrid>

            <Button type="submit" disabled={isSubmitting} style={{ minHeight: '60px', fontSize: '19px' }}>
              {isSubmitting ? '로그인 중...' : '로그인'}
              <FiArrowRight aria-hidden="true" />
            </Button>

            <HelperLinkGroup aria-label="계정 도움말" style={{ gap: '10px' }}>
              <ActionLink
                to="/account/find/employee-number"
                style={{ minHeight: '50px', fontSize: '16px' }}
              >
                <FiSearch aria-hidden="true" />
                사원 번호 찾기
              </ActionLink>
              <ActionLink
                to="/account/find/password"
                style={{ minHeight: '50px', fontSize: '16px' }}
              >
                <FiLock aria-hidden="true" />
                비밀번호 찾기
              </ActionLink>
              <ActionLink
                to="/account/signup"
                style={{ minHeight: '50px', fontSize: '16px' }}
              >
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
