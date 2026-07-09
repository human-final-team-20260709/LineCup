import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiLock, FiSearch, FiUserPlus } from 'react-icons/fi';
import {
  ActionLink,
  ActivityHeader,
  AuthCard,
  AuthShell,
  Badge,
  Button,
  CardHeader,
  EmptyState,
  Field,
  FieldGrid,
  Form,
  HelperLinkGroup,
  Input,
  Label,
  LoginLayout,
  MetricGrid,
  MetricItem,
  MutedText,
  PageIntro,
  PageTitle,
  Panel,
  PanelGrid,
  SectionLabel,
  StatusDot,
  StatusTable,
  SwitchButton,
  SwitchGroup,
  TextButton,
} from './LoginCss';

const accessLogs = [
  {
    id: 'LG-2401',
    user: 'line.admin',
    role: '관리자',
    status: '승인',
    time: '08:10:42',
  },
  {
    id: 'LG-2402',
    user: 'operator.03',
    role: '작업자',
    status: '검증중',
    time: '08:16:05',
  },
  {
    id: 'LG-2403',
    user: 'viewer.qc',
    role: '조회자',
    status: '대기',
    time: '08:20:18',
  },
];

const statusMetrics = [
  { label: 'AUTH MODE', value: 'ROLE', tone: 'primary' },
  { label: 'SESSION TTL', value: '08H', tone: 'secondary' },
  { label: 'FAILED TRY', value: '00', tone: 'neutral' },
];

function Login() {
  const [activityMode, setActivityMode] = useState('filled');

  const visibleLogs = useMemo(
    () => (activityMode === 'filled' ? accessLogs : []),
    [activityMode]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <AuthShell>
      <LoginLayout>
        <PageIntro>
          <SectionLabel>ACCOUNT ACCESS</SectionLabel>
          <PageTitle>MES 계정 로그인</PageTitle>
          <MutedText>
            생산 라인 운영자는 승인된 계정으로 접속해 작업 지시, 품질 기록,
            설비 상태를 확인합니다.
          </MutedText>
          <MetricGrid>
            {statusMetrics.map((metric) => (
              <MetricItem key={metric.label} $tone={metric.tone}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </MetricItem>
            ))}
          </MetricGrid>
        </PageIntro>

        <AuthCard>
          <CardHeader>
            <div>
              <SectionLabel>LOGIN FORM</SectionLabel>
              <h2>사용자 인증</h2>
            </div>
            <Badge $tone="primary">
              <StatusDot />
              SECURE
            </Badge>
          </CardHeader>

          <Form onSubmit={handleSubmit}>
            <FieldGrid>
              <Field>
                <Label htmlFor="login-user-id">아이디</Label>
                <Input
                  id="login-user-id"
                  name="userId"
                  placeholder="아이디를 입력하세요"
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
                />
              </Field>
            </FieldGrid>

            <Button type="submit">
              로그인
              <FiArrowRight aria-hidden="true" />
            </Button>

            <HelperLinkGroup aria-label="계정 도움말">
              <ActionLink to="/account/find?type=id">
                <FiSearch aria-hidden="true" />
                아이디 찾기
              </ActionLink>
              <ActionLink to="/account/find?type=password">
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

      <PanelGrid>
        <Panel>
          <ActivityHeader>
            <div>
              <SectionLabel>ACCESS LOG</SectionLabel>
              <h3>최근 접속 요청</h3>
            </div>
            <SwitchGroup aria-label="접속 요청 상태 보기">
              <SwitchButton
                type="button"
                $active={activityMode === 'filled'}
                onClick={() => setActivityMode('filled')}
              >
                데이터 있음
              </SwitchButton>
              <SwitchButton
                type="button"
                $active={activityMode === 'empty'}
                onClick={() => setActivityMode('empty')}
              >
                데이터 없음
              </SwitchButton>
            </SwitchGroup>
          </ActivityHeader>

          {visibleLogs.length > 0 ? (
            <StatusTable>
              <thead>
                <tr>
                  <th>요청 ID</th>
                  <th>계정</th>
                  <th>권한</th>
                  <th>상태</th>
                  <th>시간</th>
                </tr>
              </thead>
              <tbody>
                {visibleLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.user}</td>
                    <td>{log.role}</td>
                    <td>
                      <Badge $tone={log.status === '승인' ? 'primary' : 'secondary'}>
                        {log.status}
                      </Badge>
                    </td>
                    <td>{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </StatusTable>
          ) : (
            <EmptyState>
              <strong>표시할 접속 요청이 없습니다</strong>
              <span>필터 조건에 해당하는 사용자 인증 기록이 없는 상태입니다.</span>
            </EmptyState>
          )}
        </Panel>

        <Panel>
          <SectionLabel>ACCOUNT FLOW</SectionLabel>
          <h3>계정 화면 이동</h3>
          <MutedText>
            라우팅 구조 변경 없이 현재 페이지에서 사용할 계정 화면 이동 UI만
            제공합니다.
          </MutedText>
          <TextButton as={Link} to="/account/signup">
            신규 계정 등록 화면
            <FiArrowRight aria-hidden="true" />
          </TextButton>
          <TextButton as={Link} to="/account/find">
            계정 정보 찾기 화면
            <FiArrowRight aria-hidden="true" />
          </TextButton>
        </Panel>
      </PanelGrid>
    </AuthShell>
  );
}

export default Login;
