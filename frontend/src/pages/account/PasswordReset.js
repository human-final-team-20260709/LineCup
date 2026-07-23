import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/services';
import { extractApiError } from '../../api/client';
import { FiArrowLeft, FiLock, FiRefreshCw } from 'react-icons/fi';
import AccountModal from './AccountModal';
import {
  ActionBar,
  Badge,
  Button,
  Card,
  CardHeader,
  Field,
  Form,
  HelperText,
  Input,
  Label,
  PageHeader,
  PageShell,
  SectionLabel,
  TopLink,
} from './PasswordResetCss';

function PasswordReset() {
  const navigate = useNavigate();
  const location = useLocation();
  const verification = location.state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const resetMutation = useMutation({ mutationFn: authApi.resetPassword });

  if (!verification?.empNo || !verification?.email) {
    return <Navigate to="/account/find/password" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setErrorMessage('');
    try {
      await resetMutation.mutateAsync({
        empNo: verification.empNo,
        email: verification.email,
        password: String(data.get('password') || ''),
        passwordConfirm: String(data.get('passwordConfirm') || ''),
      });
      setIsModalOpen(true);
    } catch (error) {
      setErrorMessage(extractApiError(error));
    }
  };

  const handleComplete = () => {
    navigate('/account/login');
  };

  return (
    <PageShell>
      <PageHeader>
        <div>
          <SectionLabel>ACCOUNT RECOVERY</SectionLabel>
          <h1>비밀번호 재설정</h1>
          <p>인증된 계정의 비밀번호를 새 값으로 변경하는 화면입니다.</p>
        </div>
        <TopLink to="/account/find/password">
          <FiArrowLeft aria-hidden="true" />
          계정 찾기로 이동
        </TopLink>
      </PageHeader>

      <Card>
        <CardHeader>
          <div>
            <SectionLabel>RESET FORM</SectionLabel>
            <h2>새 비밀번호 입력</h2>
          </div>
          <Badge $tone="primary">
            <FiLock aria-hidden="true" />
            RESET
          </Badge>
        </CardHeader>

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="reset-password">새 비밀번호</Label>
            <Input
              id="reset-password"
              name="password"
              type="password"
              placeholder="새 비밀번호를 입력하세요"
            />
            <HelperText>8자 이상, 영문과 숫자를 포함해 입력합니다.</HelperText>
          </Field>

          <Field>
            <Label htmlFor="reset-password-confirm">새 비밀번호 확인</Label>
            <Input
              id="reset-password-confirm"
              name="passwordConfirm"
              type="password"
              placeholder="새 비밀번호를 다시 입력하세요"
            />
          </Field>

          <ActionBar>
            <Button type="submit" disabled={resetMutation.isPending}>
              {resetMutation.isPending ? '변경 중...' : '비밀번호 변경'}
              <FiRefreshCw aria-hidden="true" />
            </Button>
          </ActionBar>
          {errorMessage && <HelperText role="alert">{errorMessage}</HelperText>}
        </Form>
      </Card>

      <AccountModal
        isOpen={isModalOpen}
        title="비밀번호 변경 완료"
        message="새 비밀번호로 다시 로그인할 수 있습니다."
        confirmLabel="로그인으로 이동"
        onConfirm={handleComplete}
        onClose={handleComplete}
      />
    </PageShell>
  );
}

export default PasswordReset;
