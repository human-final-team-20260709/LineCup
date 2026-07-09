import { useMemo, useState } from 'react';
import { FiArrowLeft, FiCheckCircle, FiSend, FiX } from 'react-icons/fi';
import {
  Badge,
  Button,
  CheckboxGrid,
  EmptyState,
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
  Panel,
  PreviewGrid,
  RadioCard,
  RadioGrid,
  SectionLabel,
  Select,
  SideStack,
  StatusTable,
  SummaryItem,
  TextArea,
  TopLink,
} from './SignupCss';

const roleOptions = [
  {
    value: 'admin',
    label: '관리자',
    description: '사용자 승인, 기준 정보, 설비 운영 권한을 관리합니다.',
  },
  {
    value: 'operator',
    label: '작업자',
    description: '작업 지시 확인과 생산 실적 입력을 수행합니다.',
  },
  {
    value: 'viewer',
    label: '조회자',
    description: '생산 현황과 품질 이력을 조회합니다.',
  },
];

const approvalRows = [
  { id: 'REQ-1024', name: '김민준', role: '작업자', line: 'LINE-02', state: '대기' },
  { id: 'REQ-1025', name: '이지은', role: '조회자', line: 'QC', state: '검토' },
];

function Signup() {
  const [selectedRole, setSelectedRole] = useState('operator');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedRoleLabel = useMemo(() => {
    return roleOptions.find((role) => role.value === selectedRole)?.label;
  }, [selectedRole]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <PageShell>
      <PageHeader>
        <div>
          <SectionLabel>ACCOUNT REGISTRATION</SectionLabel>
          <h1>회원가입</h1>
          <p>
            MES 접근 권한 신청에 필요한 사용자 정보와 역할을 입력하는 화면입니다.
          </p>
        </div>
        <TopLink to="/account/login">
          <FiArrowLeft aria-hidden="true" />
          로그인으로 이동
        </TopLink>
      </PageHeader>

      <FormLayout>
        <FormCard>
          <Form onSubmit={handleSubmit}>
            <SectionLabel>USER PROFILE</SectionLabel>
            <FieldGrid>
              <Field>
                <Label htmlFor="signup-user-id">아이디</Label>
                <Input id="signup-user-id" name="userId" placeholder="예: operator.01" />
              </Field>
              <Field>
                <Label htmlFor="signup-name">이름</Label>
                <Input id="signup-name" name="name" placeholder="이름을 입력하세요" />
              </Field>
              <Field>
                <Label htmlFor="signup-password">비밀번호</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                />
              </Field>
              <Field>
                <Label htmlFor="signup-password-confirm">비밀번호 확인</Label>
                <Input
                  id="signup-password-confirm"
                  name="passwordConfirm"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </Field>
              <Field>
                <Label htmlFor="signup-email">이메일</Label>
                <Input id="signup-email" name="email" type="email" placeholder="name@factory.local" />
              </Field>
              <Field>
                <Label htmlFor="signup-phone">연락처</Label>
                <Input id="signup-phone" name="phone" placeholder="010-0000-0000" />
              </Field>
              <Field>
                <Label htmlFor="signup-line">소속 라인</Label>
                <Select id="signup-line" name="line" defaultValue="LINE-01">
                  <option value="LINE-01">LINE-01 컵라면 성형</option>
                  <option value="LINE-02">LINE-02 충진/포장</option>
                  <option value="QC">QC 품질 관리</option>
                  <option value="OPS">OPS 운영 관리</option>
                </Select>
              </Field>
              <Field>
                <Label htmlFor="signup-note">요청 사유</Label>
                <TextArea
                  id="signup-note"
                  name="note"
                  rows="3"
                  placeholder="권한 승인 담당자에게 전달할 내용을 입력하세요"
                />
              </Field>
            </FieldGrid>

            <SectionLabel>ROLE SELECTION</SectionLabel>
            <RadioGrid>
              {roleOptions.map((role) => (
                <RadioCard key={role.value} $active={selectedRole === role.value}>
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={selectedRole === role.value}
                    onChange={() => setSelectedRole(role.value)}
                  />
                  <strong>{role.label}</strong>
                  <span>{role.description}</span>
                </RadioCard>
              ))}
            </RadioGrid>

            <CheckboxGrid>
              <label>
                <input type="checkbox" defaultChecked />
                개인정보 수집 및 계정 승인 절차에 동의합니다.
              </label>
              <label>
                <input type="checkbox" />
                교대 근무 알림 수신을 허용합니다.
              </label>
            </CheckboxGrid>

            <Button type="submit">
              회원가입 신청
              <FiSend aria-hidden="true" />
            </Button>
          </Form>
        </FormCard>

        <SideStack>
          <Panel>
            <SectionLabel>REQUEST PREVIEW</SectionLabel>
            <h2>신청 요약</h2>
            <PreviewGrid>
              <SummaryItem>
                <span>신청 권한</span>
                <strong>{selectedRoleLabel}</strong>
              </SummaryItem>
              <SummaryItem>
                <span>승인 단계</span>
                <strong>2 STEP</strong>
              </SummaryItem>
              <SummaryItem>
                <span>처리 기준</span>
                <strong>24H</strong>
              </SummaryItem>
            </PreviewGrid>
          </Panel>

          <Panel>
            <SectionLabel>DATA STATE</SectionLabel>
            <h2>승인 대기 목록</h2>
            <StatusTable>
              <thead>
                <tr>
                  <th>요청</th>
                  <th>이름</th>
                  <th>권한</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {approvalRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.role}</td>
                    <td>
                      <Badge $tone={row.state === '검토' ? 'secondary' : 'primary'}>
                        {row.state}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StatusTable>
          </Panel>

          <EmptyState>
            <strong>초대 코드가 없습니다</strong>
            <span>초대 기반 가입 데이터가 비어 있을 때 표시되는 상태입니다.</span>
          </EmptyState>
        </SideStack>
      </FormLayout>

      {isModalOpen && (
        <ModalBackdrop role="presentation">
          <ModalCard role="dialog" aria-modal="true" aria-labelledby="signup-modal-title">
            <button type="button" onClick={() => setIsModalOpen(false)} aria-label="닫기">
              <FiX aria-hidden="true" />
            </button>
            <FiCheckCircle aria-hidden="true" />
            <h2 id="signup-modal-title">가입 신청 UI 확인</h2>
            <p>
              실제 API 호출 없이 승인 대기 상태를 보여주는 더미 모달입니다.
            </p>
            <ModalFooter>
              <OutlineButton type="button" onClick={() => setIsModalOpen(false)}>
                닫기
              </OutlineButton>
            </ModalFooter>
          </ModalCard>
        </ModalBackdrop>
      )}
    </PageShell>
  );
}

export default Signup;
