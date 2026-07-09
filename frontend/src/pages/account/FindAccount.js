import { useState } from 'react';
import { FiArrowLeft, FiKey, FiSearch, FiSend } from 'react-icons/fi';
import {
  ActionBar,
  Badge,
  Button,
  EmptyState,
  Field,
  FieldGrid,
  FindCard,
  FindLayout,
  Form,
  Input,
  Label,
  ModeButton,
  ModeSwitch,
  PageHeader,
  PageShell,
  Panel,
  ResultCard,
  SectionLabel,
  StatusTable,
  StepItem,
  StepList,
  TopLink,
} from './FindAccountCss';

const requestHistory = [
  { id: 'FND-4101', type: '아이디 찾기', channel: '이메일', state: '완료' },
  { id: 'FND-4102', type: '비밀번호 재설정', channel: '이메일', state: '대기' },
  { id: 'FND-4103', type: '아이디 찾기', channel: '연락처', state: '완료' },
];

function FindAccount() {
  const [mode, setMode] = useState('id');
  const [resultMode, setResultMode] = useState('filled');

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const isPasswordMode = mode === 'password';

  return (
    <PageShell>
      <PageHeader>
        <div>
          <SectionLabel>ACCOUNT RECOVERY</SectionLabel>
          <h1>아이디 / 비밀번호 찾기</h1>
          <p>
            가입 정보와 인증 요청 상태를 확인하는 계정 복구 UI입니다.
          </p>
        </div>
        <TopLink to="/account/login">
          <FiArrowLeft aria-hidden="true" />
          로그인으로 이동
        </TopLink>
      </PageHeader>

      <FindLayout>
        <FindCard>
          <ModeSwitch aria-label="계정 찾기 유형">
            <ModeButton
              type="button"
              $active={mode === 'id'}
              onClick={() => setMode('id')}
            >
              <FiSearch aria-hidden="true" />
              아이디 찾기
            </ModeButton>
            <ModeButton
              type="button"
              $active={mode === 'password'}
              onClick={() => setMode('password')}
            >
              <FiKey aria-hidden="true" />
              비밀번호 찾기
            </ModeButton>
          </ModeSwitch>

          <Form onSubmit={handleSubmit}>
            <SectionLabel>{isPasswordMode ? 'PASSWORD RESET' : 'USER ID LOOKUP'}</SectionLabel>
            <FieldGrid>
              {isPasswordMode && (
                <Field>
                  <Label htmlFor="find-user-id">아이디</Label>
                  <Input id="find-user-id" name="userId" placeholder="아이디를 입력하세요" />
                </Field>
              )}
              <Field>
                <Label htmlFor="find-name">이름</Label>
                <Input id="find-name" name="name" placeholder="가입자 이름" />
              </Field>
              <Field>
                <Label htmlFor="find-email">이메일</Label>
                <Input id="find-email" name="email" type="email" placeholder="name@factory.local" />
              </Field>
            </FieldGrid>

            <ActionBar>
              <Button type="submit">
                {isPasswordMode ? '인증 요청' : '아이디 찾기'}
                <FiSend aria-hidden="true" />
              </Button>
            </ActionBar>
          </Form>

          <StepList>
            <StepItem>
              <span>01</span>
              <strong>정보 입력</strong>
              <p>가입 시 등록한 이름과 이메일을 기준으로 계정을 확인합니다.</p>
            </StepItem>
            <StepItem>
              <span>02</span>
              <strong>{isPasswordMode ? '인증 요청' : '결과 확인'}</strong>
              <p>
                {isPasswordMode
                  ? '인증 완료 후 임시 비밀번호 또는 재설정 화면을 안내합니다.'
                  : '일치하는 계정 아이디를 결과 영역에 표시합니다.'}
              </p>
            </StepItem>
          </StepList>
        </FindCard>

        <Panel>
          <SectionLabel>RESULT STATE</SectionLabel>
          <h2>조회 결과</h2>
          <ModeSwitch aria-label="조회 결과 상태">
            <ModeButton
              type="button"
              $active={resultMode === 'filled'}
              onClick={() => setResultMode('filled')}
            >
              데이터 있음
            </ModeButton>
            <ModeButton
              type="button"
              $active={resultMode === 'empty'}
              onClick={() => setResultMode('empty')}
            >
              데이터 없음
            </ModeButton>
          </ModeSwitch>

          {resultMode === 'filled' ? (
            <ResultCard>
              <Badge $tone="primary">MATCHED</Badge>
              <strong>{isPasswordMode ? 'operator.01' : 'line.admin'}</strong>
              <span>
                {isPasswordMode
                  ? '등록된 이메일로 비밀번호 재설정 안내가 발송될 예정입니다.'
                  : '마스킹된 아이디 조회 결과 예시입니다.'}
              </span>
            </ResultCard>
          ) : (
            <EmptyState>
              <strong>일치하는 계정 정보가 없습니다</strong>
              <span>입력한 이름과 이메일로 조회되는 계정이 없는 상태입니다.</span>
            </EmptyState>
          )}
        </Panel>
      </FindLayout>

      <Panel>
        <SectionLabel>REQUEST HISTORY</SectionLabel>
        <h2>최근 계정 찾기 요청</h2>
        <StatusTable>
          <thead>
            <tr>
              <th>요청 ID</th>
              <th>유형</th>
              <th>채널</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {requestHistory.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.type}</td>
                <td>{row.channel}</td>
                <td>
                  <Badge $tone={row.state === '완료' ? 'primary' : 'secondary'}>
                    {row.state}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </StatusTable>
      </Panel>
    </PageShell>
  );
}

export default FindAccount;
