import { useMemo, useState } from 'react';
import {
  FiAlertTriangle,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUserCheck,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import WorkerManagement from './WorkerManagement';
import {
  ActionButton,
  ActionGroup,
  ActionNotice,
  ApprovalMeta,
  ApprovalUser,
  Badge,
  ControlBar,
  EmptyState,
  EmptyStateIcon,
  FilterGroup,
  IconButton,
  ModalBackdrop,
  ModalBody,
  ModalCard,
  ModalFooter,
  ModalHeader,
  PageDescription,
  PageHeader,
  PageShell,
  PageTitle,
  RoleSelect,
  SearchField,
  SectionCard,
  SectionHeading,
  SectionLabel,
  SegmentedControl,
  SelectField,
  StateButton,
  StatusButton,
  StatusDot,
  SummaryCard,
  SummaryGrid,
  SummaryIcon,
  SummaryLabel,
  SummaryValue,
  SystemBadge,
  Table,
  TableScroll,
  UserIdentity,
  UserMeta,
  UserName,
} from './SettingCss';

const ROLE_LABELS = {
  admin: '관리자',
  operator: '작업자',
  supervisor: '지시자',
};

const INITIAL_USERS = [
  {
    id: 'USR-001',
    name: '김민준',
    userId: 'admin.kim',
    email: 'minjun.kim@mes.local',
    role: 'admin',
    active: true,
    lastAccess: '2026-07-10 09:42',
  },
  {
    id: 'USR-014',
    name: '박서연',
    userId: 'operator.park',
    email: 'seoyeon.park@mes.local',
    role: 'operator',
    active: true,
    lastAccess: '2026-07-10 08:18',
  },
  {
    id: 'USR-027',
    name: '이도윤',
    userId: 'supervisor.lee',
    email: 'doyun.lee@mes.local',
    role: 'supervisor',
    active: false,
    lastAccess: '2026-07-08 16:03',
  },
  {
    id: 'USR-031',
    name: '최지우',
    userId: 'operator.choi',
    email: 'jiwoo.choi@mes.local',
    role: 'operator',
    active: true,
    lastAccess: '2026-07-09 14:26',
  },
];

const INITIAL_APPROVALS = [
  {
    id: 'REQ-1042',
    name: '정하준',
    userId: 'operator.jeong',
    email: 'hajun.jeong@mes.local',
    role: 'operator',
    requestedAt: '2026-07-10 09:16',
  },
  {
    id: 'REQ-1039',
    name: '한수빈',
    userId: 'supervisor.han',
    email: 'subin.han@mes.local',
    role: 'supervisor',
    requestedAt: '2026-07-09 17:34',
  },
];

function Setting({ activeTab = 'users' }) {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [viewState, setViewState] = useState('filled');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState('');

  const visibleUsers = useMemo(() => {
    if (viewState === 'empty') {
      return [];
    }

    const keyword = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesKeyword =
        !keyword ||
        [user.name, user.userId, user.email].some((value) =>
          value.toLowerCase().includes(keyword),
        );

      return matchesRole && matchesKeyword;
    });
  }, [roleFilter, searchTerm, users, viewState]);

  const visibleApprovals = viewState === 'empty' ? [] : approvals;
  const summaryUsers = viewState === 'empty' ? [] : users;
  const activeUserCount = summaryUsers.filter(({ active }) => active).length;
  const adminCount = summaryUsers.filter(({ role }) => role === 'admin').length;

  const showNotice = (message) => {
    setNotice(message);
  };

  const handleRoleChange = (userId, nextRole) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, role: nextRole } : user,
      ),
    );
    showNotice(`사용자 역할을 ${ROLE_LABELS[nextRole]}(으)로 변경했습니다.`);
  };

  const handleStatusChange = (userId) => {
    const targetUser = users.find((user) => user.id === userId);

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, active: !user.active } : user,
      ),
    );
    showNotice(
      `${targetUser.name} 계정을 ${targetUser.active ? '비활성화' : '활성화'}했습니다.`,
    );
  };

  const handleDeleteUser = () => {
    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== deleteTarget.id),
    );
    showNotice(`${deleteTarget.name} 사용자 계정을 삭제했습니다.`);
    setDeleteTarget(null);
  };

  const handleApproval = (request, action) => {
    setApprovals((currentApprovals) =>
      currentApprovals.filter(({ id }) => id !== request.id),
    );
    showNotice(
      `${request.name} 사용자의 가입 요청을 ${action === 'approve' ? '승인' : '거부'}했습니다.`,
    );
  };

  return (
    activeTab === 'workers' ? (
      <WorkerManagement />
    ) : (
      <PageShell>
      <PageHeader>
        <div>
          <SectionLabel>SYSTEM CONFIGURATION</SectionLabel>
          <PageTitle>설정</PageTitle>
          <PageDescription>
            MES 사용자 역할과 계정 상태 및 가입 요청을 관리합니다.
          </PageDescription>
        </div>
        <SystemBadge>
          <FiShield aria-hidden="true" />
          ADMIN CONTROL
        </SystemBadge>
      </PageHeader>

      <SummaryGrid aria-label="사용자 권한 요약">
        <SummaryCard>
          <SummaryIcon $tone="primary"><FiUsers aria-hidden="true" /></SummaryIcon>
          <div><SummaryLabel>전체 사용자</SummaryLabel><SummaryValue>{summaryUsers.length}</SummaryValue></div>
        </SummaryCard>
        <SummaryCard>
          <SummaryIcon $tone="primary"><FiUserCheck aria-hidden="true" /></SummaryIcon>
          <div><SummaryLabel>활성 계정</SummaryLabel><SummaryValue>{activeUserCount}</SummaryValue></div>
        </SummaryCard>
        <SummaryCard>
          <SummaryIcon $tone="neutral"><FiLock aria-hidden="true" /></SummaryIcon>
          <div><SummaryLabel>관리자</SummaryLabel><SummaryValue>{adminCount}</SummaryValue></div>
        </SummaryCard>
        <SummaryCard>
          <SummaryIcon $tone="warning"><FiClock aria-hidden="true" /></SummaryIcon>
          <div><SummaryLabel>승인 대기</SummaryLabel><SummaryValue>{visibleApprovals.length}</SummaryValue></div>
        </SummaryCard>
      </SummaryGrid>

      {notice && (
        <ActionNotice role="status">
          <FiCheckCircle aria-hidden="true" />
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="알림 닫기">
            <FiX aria-hidden="true" />
          </button>
        </ActionNotice>
      )}

      <SectionCard>
        <SectionHeading>
          <div>
            <SectionLabel>ACCESS MANAGEMENT</SectionLabel>
            <h2>사용자 권한 설정</h2>
          </div>
          <SegmentedControl aria-label="화면 데이터 상태">
            <StateButton type="button" $active={viewState === 'filled'} onClick={() => setViewState('filled')}>
              데이터 있음
            </StateButton>
            <StateButton type="button" $active={viewState === 'empty'} onClick={() => setViewState('empty')}>
              빈 상태
            </StateButton>
          </SegmentedControl>
        </SectionHeading>

        {activeTab === 'users' ? (
          <>
            <ControlBar>
              <SearchField>
                <FiSearch aria-hidden="true" />
                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="이름, 사원 번호 또는 이메일 검색" aria-label="사용자 검색" />
              </SearchField>
              <FilterGroup>
                <SelectField value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} aria-label="역할 필터">
                  <option value="all">전체 역할</option>
                  <option value="admin">관리자</option>
                  <option value="operator">작업자</option>
                  <option value="supervisor">지시자</option>
                </SelectField>
              </FilterGroup>
            </ControlBar>

            {visibleUsers.length > 0 ? (
              <TableScroll>
                <Table>
                  <thead><tr><th>사용자</th><th>역할</th><th>계정 상태</th><th>최근 접속</th><th><span className="visually-hidden">관리</span></th></tr></thead>
                  <tbody>
                    {visibleUsers.map((user) => (
                      <tr key={user.id}>
                        <td><UserIdentity><UserName>{user.name}</UserName><UserMeta>{user.userId} · {user.email}</UserMeta></UserIdentity></td>
                        <td><RoleSelect value={user.role} onChange={(event) => handleRoleChange(user.id, event.target.value)} aria-label={`${user.name} 역할 변경`}><option value="admin">관리자</option><option value="operator">작업자</option><option value="supervisor">지시자</option></RoleSelect></td>
                        <td><StatusButton type="button" $active={user.active} onClick={() => handleStatusChange(user.id)}><StatusDot $active={user.active} />{user.active ? '활성' : '비활성'}</StatusButton></td>
                        <td><UserMeta $mono>{user.lastAccess}</UserMeta></td>
                        <td><IconButton type="button" $danger onClick={() => setDeleteTarget(user)} aria-label={`${user.name} 사용자 삭제`}><FiTrash2 aria-hidden="true" /></IconButton></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableScroll>
            ) : (
              <EmptyState>
                <EmptyStateIcon><FiUsers aria-hidden="true" /></EmptyStateIcon>
                <h3>{viewState === 'empty' ? '등록된 사용자가 없습니다' : '검색 결과가 없습니다'}</h3>
                <p>{viewState === 'empty' ? '사용자가 등록되면 역할과 계정 상태를 이곳에서 관리할 수 있습니다.' : '검색어나 역할 필터를 변경해 다시 확인해주세요.'}</p>
              </EmptyState>
            )}
          </>
        ) : visibleApprovals.length > 0 ? (
          <TableScroll>
            <Table>
              <thead><tr><th>신청 사용자</th><th>요청 역할</th><th>신청 일시</th><th>처리</th></tr></thead>
              <tbody>
                {visibleApprovals.map((request) => (
                  <tr key={request.id}>
                    <td><ApprovalUser><UserName>{request.name}</UserName><ApprovalMeta>{request.userId} · {request.email}</ApprovalMeta></ApprovalUser></td>
                    <td><Badge $role>{ROLE_LABELS[request.role]}</Badge></td>
                    <td><UserMeta $mono>{request.requestedAt}</UserMeta></td>
                    <td><ActionGroup><ActionButton type="button" $approve onClick={() => handleApproval(request, 'approve')}><FiCheck aria-hidden="true" />승인</ActionButton><ActionButton type="button" onClick={() => handleApproval(request, 'reject')}><FiX aria-hidden="true" />거부</ActionButton></ActionGroup></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableScroll>
        ) : (
          <EmptyState>
            <EmptyStateIcon><FiUserCheck aria-hidden="true" /></EmptyStateIcon>
            <h3>대기 중인 가입 요청이 없습니다</h3>
            <p>새로운 회원가입 요청이 접수되면 이곳에서 승인하거나 거부할 수 있습니다.</p>
          </EmptyState>
        )}
      </SectionCard>

      {deleteTarget && (
        <ModalBackdrop onMouseDown={() => setDeleteTarget(null)}>
          <ModalCard role="dialog" aria-modal="true" aria-labelledby="delete-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <ModalHeader>
              <div><SectionLabel>USER REMOVAL</SectionLabel><h2 id="delete-modal-title">사용자 삭제</h2><p>{deleteTarget.name} · {ROLE_LABELS[deleteTarget.role]}</p></div>
              <IconButton type="button" onClick={() => setDeleteTarget(null)} aria-label="사용자 삭제 닫기"><FiX aria-hidden="true" /></IconButton>
            </ModalHeader>
            <ModalBody>
              <FiAlertTriangle aria-hidden="true" />
              <div>
                <strong>{deleteTarget.name} 사용자를 삭제하시겠습니까?</strong>
                <p>삭제한 사용자 계정은 현재 목록에서 제거되며 이 작업은 되돌릴 수 없습니다.</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <ActionButton type="button" onClick={() => setDeleteTarget(null)}>취소</ActionButton>
              <ActionButton type="button" $danger onClick={handleDeleteUser}><FiTrash2 aria-hidden="true" />삭제</ActionButton>
            </ModalFooter>
          </ModalCard>
        </ModalBackdrop>
      )}
      </PageShell>
    )
  );
}

export default Setting;
