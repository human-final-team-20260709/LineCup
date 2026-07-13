import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import AccountModal from './AccountModal';
import {
  ActionBar,
  Button,
  Field,
  FieldGrid,
  FindCard,
  FindLayout,
  Form,
  Input,
  Label,
  PageHeader,
  PageShell,
  ResultArea,
  ResultValue,
  ResultText,
  SectionLabel,
  TopLink,
} from './FindAccountCss';

const accountRecords = [
  { maskedUserId: 'li***.admin', name: '가입자 이름', email: 'name@factory.local' },
  { maskedUserId: 'op******.01', name: '작업자', email: 'operator@factory.local' },
];

const initialFormValues = {
  userId: '',
  name: '',
  email: '',
};

function FindAccount({ mode = 'id' }) {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [foundAccounts, setFoundAccounts] = useState([]);
  const [modal, setModal] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    // TODO: 임시 계정 찾기 성공/실패 50% 처리 시작 - 백엔드 계정 조회 연동 시 삭제
    const isSuccess = Math.random() >= 0.5;

    if (!isSuccess) {
      setFoundAccounts([]);
      setModal({
        title: '계정 정보 확인 실패',
        message: '입력한 정보와 일치하는 계정 정보를 찾을 수 없습니다.',
        tone: 'error',
      });
      return;
    }

    if (isPasswordMode) {
      const resetUserId = formValues.userId || 'line.admin';
      navigate(
        `/account/reset-password?userId=${encodeURIComponent(
          resetUserId
        )}`
      );
      return;
    }

    setFoundAccounts(accountRecords);
    // TODO: 임시 계정 찾기 성공/실패 50% 처리 끝
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFoundAccounts([]);
    setModal(null);
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const isPasswordMode = mode === 'password';

  return (
    <PageShell>
      <PageHeader>
        <div>
          <SectionLabel>ACCOUNT RECOVERY</SectionLabel>
          <h1>사원 번호 / 비밀번호 찾기</h1>
          <p>
            가입 정보와 인증 요청 상태를 확인하는 계정 복구 화면입니다.
          </p>
        </div>
        <TopLink to="/account/login">
          <FiArrowLeft aria-hidden="true" />
          로그인으로 이동
        </TopLink>
      </PageHeader>

      <FindLayout>
        <FindCard>
          <Form onSubmit={handleSubmit}>
            <SectionLabel>{isPasswordMode ? 'PASSWORD RESET' : 'EMPLOYEE NUMBER LOOKUP'}</SectionLabel>
            <FieldGrid>
              {isPasswordMode && (
                <Field>
                  <Label htmlFor="find-user-id">사원 번호</Label>
                  <Input
                    id="find-user-id"
                    name="userId"
                    value={formValues.userId}
                    onChange={handleChange}
                    placeholder="사원 번호를 입력하세요"
                  />
                </Field>
              )}
              <Field>
                <Label htmlFor="find-name">이름</Label>
                <Input
                  id="find-name"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  placeholder="가입자 이름"
                />
              </Field>
              <Field>
                <Label htmlFor="find-email">이메일</Label>
                <Input
                  id="find-email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="name@factory.local"
                />
              </Field>
            </FieldGrid>

            <ActionBar>
              <Button type="submit">
                {isPasswordMode ? '비밀번호 재설정' : '사원 번호 찾기'}
                <FiSend aria-hidden="true" />
              </Button>
            </ActionBar>

            {!isPasswordMode && foundAccounts.length > 0 && (
              <ResultArea>
                <Label htmlFor="found-user-id">조회된 사원 번호</Label>
                <ResultValue id="found-user-id">
                  {foundAccounts[0].maskedUserId}
                </ResultValue>
                <ResultText>가입 정보와 일치하는 사원 번호입니다.</ResultText>
              </ResultArea>
            )}
          </Form>
        </FindCard>
      </FindLayout>

      <AccountModal
        isOpen={Boolean(modal)}
        title={modal?.title}
        message={modal?.message}
        tone={modal?.tone}
        onConfirm={() => setModal(null)}
        onClose={() => setModal(null)}
      />
    </PageShell>
  );
}

export default FindAccount;
