import { useMemo, useState } from 'react';
import {
  FiBriefcase,
  FiClock,
  FiCoffee,
  FiEdit2,
  FiInbox,
  FiPlus,
  FiSearch,
  FiTool,
  FiTrash2,
  FiUserCheck,
  FiUserMinus,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import {
  ActionButton,
  CardActions,
  CardBody,
  CardFooter,
  CardHeader,
  ControlBar,
  DataStateControl,
  EditorBackdrop,
  EditorBody,
  EditorClose,
  EditorDialog,
  EditorFooter,
  EditorHeader,
  EmptyAction,
  EmptyState,
  Eyebrow,
  FieldHint,
  FormButton,
  FormError,
  FormField,
  FormGrid,
  FormInput,
  FormLabel,
  FormSelect,
  HeaderAction,
  Identity,
  InfoItem,
  InfoLabel,
  InfoValue,
  MetricCard,
  MetricGrid,
  MetricIcon,
  MetricLabel,
  MetricValue,
  Notice,
  Page,
  PageHeader,
  SearchField,
  SelectField,
  Skill,
  SkillList,
  StateButton,
  StatusChip,
  StatusSelect,
  TitleGroup,
  WorkerAvatar,
  WorkerCard,
  WorkerGrid,
} from './WorkerManagementCss';

const STATUS_META = {
  working: { label: '근무 중', tone: 'success' },
  break: { label: '휴식 중', tone: 'warning' },
  off: { label: '비근무', tone: 'neutral' },
};

const INITIAL_WORKERS = [
  {
    id: 'WK-001',
    name: '김민준',
    process: '배합',
    team: '생산 1팀',
    shift: '주간조',
    status: 'working',
    skills: ['배합 설비', '기초 안전'],
    joinedAt: '2024-03-11',
  },
  {
    id: 'WK-002',
    name: '박서연',
    process: '제면',
    team: '생산 1팀',
    shift: '주간조',
    status: 'working',
    skills: ['제면 설비', '품질 검사'],
    joinedAt: '2023-08-21',
  },
  {
    id: 'WK-003',
    name: '이도윤',
    process: '유탕',
    team: '생산 2팀',
    shift: '야간조',
    status: 'break',
    skills: ['유탕 설비', '온도 관리'],
    joinedAt: '2025-01-06',
  },
  {
    id: 'WK-004',
    name: '최지우',
    process: '포장',
    team: '포장팀',
    shift: '주간조',
    status: 'working',
    skills: ['포장 설비', '실링 검사'],
    joinedAt: '2024-06-17',
  },
  {
    id: 'WK-005',
    name: '정하준',
    process: '검사',
    team: '품질팀',
    shift: '교대조',
    status: 'off',
    skills: ['공정 검사', 'LOT 추적'],
    joinedAt: '2022-11-14',
  },
  {
    id: 'WK-006',
    name: '한수빈',
    process: '증숙',
    team: '생산 2팀',
    shift: '야간조',
    status: 'break',
    skills: ['증숙 설비', '기초 안전'],
    joinedAt: '2025-04-02',
  },
];

const createEmptyWorker = (id) => ({
  id,
  name: '',
  process: '배합',
  team: '생산 1팀',
  shift: '주간조',
  status: 'working',
  skills: '기초 안전',
  joinedAt: '2026-07-13',
});

function WorkerManagement() {
  const [workers, setWorkers] = useState(INITIAL_WORKERS);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEmpty, setShowEmpty] = useState(false);
  const [notice, setNotice] = useState('');
  const [editor, setEditor] = useState(null);
  const [formError, setFormError] = useState('');

  const sourceWorkers = useMemo(() => (showEmpty ? [] : workers), [showEmpty, workers]);
  const filteredWorkers = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return sourceWorkers.filter((worker) => {
      const matchesStatus = statusFilter === 'all' || worker.status === statusFilter;
      const matchesQuery =
        !keyword ||
        [worker.name, worker.id, worker.process, worker.team].some((value) =>
          value.toLowerCase().includes(keyword),
        );

      return matchesStatus && matchesQuery;
    });
  }, [query, sourceWorkers, statusFilter]);

  const summary = {
    total: sourceWorkers.length,
    working: sourceWorkers.filter(({ status }) => status === 'working').length,
    break: sourceWorkers.filter(({ status }) => status === 'break').length,
    off: sourceWorkers.filter(({ status }) => status === 'off').length,
  };

  const updateStatus = (workerId, nextStatus) => {
    setWorkers((currentWorkers) =>
      currentWorkers.map((worker) =>
        worker.id === workerId ? { ...worker, status: nextStatus } : worker,
      ),
    );
    setNotice(`작업자 상태를 ${STATUS_META[nextStatus].label}(으)로 변경했습니다.`);
  };

  const removeWorker = (workerId) => {
    const target = workers.find((worker) => worker.id === workerId);
    setWorkers((currentWorkers) => currentWorkers.filter((worker) => worker.id !== workerId));
    setNotice(`${target.name} 작업자를 목록에서 삭제했습니다.`);
  };

  const getNextWorkerId = () => {
    const maxId = workers.reduce((highest, worker) => {
      const numericId = Number(worker.id.replace(/\D/g, ''));
      return Number.isNaN(numericId) ? highest : Math.max(highest, numericId);
    }, 0);

    return `WK-${String(maxId + 1).padStart(3, '0')}`;
  };

  const openCreateEditor = () => {
    setEditor({ mode: 'create', originalId: null, values: createEmptyWorker(getNextWorkerId()) });
    setFormError('');
  };

  const openEditEditor = (worker) => {
    setEditor({
      mode: 'edit',
      originalId: worker.id,
      values: { ...worker, skills: worker.skills.join(', ') },
    });
    setFormError('');
  };

  const closeEditor = () => {
    setEditor(null);
    setFormError('');
  };

  const handleEditorChange = (field, value) => {
    setEditor((currentEditor) => ({
      ...currentEditor,
      values: { ...currentEditor.values, [field]: value },
    }));
    setFormError('');
  };

  const saveWorker = (event) => {
    event.preventDefault();

    const values = editor.values;
    const normalizedWorker = {
      ...values,
      id: values.id.trim().toUpperCase(),
      name: values.name.trim(),
      process: values.process.trim(),
      team: values.team.trim(),
      skills: values.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
    };

    if (!normalizedWorker.id || !normalizedWorker.name || !normalizedWorker.process || !normalizedWorker.team) {
      setFormError('작업자 번호, 이름, 담당 공정, 소속은 필수 입력 항목입니다.');
      return;
    }

    const hasDuplicateId = workers.some(
      (worker) => worker.id === normalizedWorker.id && worker.id !== editor.originalId,
    );

    if (hasDuplicateId) {
      setFormError('이미 사용 중인 작업자 번호입니다.');
      return;
    }

    if (editor.mode === 'create') {
      setWorkers((currentWorkers) => [...currentWorkers, normalizedWorker]);
      setNotice(`${normalizedWorker.name} 작업자를 등록했습니다.`);
      setShowEmpty(false);
    } else {
      setWorkers((currentWorkers) =>
        currentWorkers.map((worker) =>
          worker.id === editor.originalId ? normalizedWorker : worker,
        ),
      );
      setNotice(`${normalizedWorker.name} 작업자 정보를 수정했습니다.`);
    }

    closeEditor();
  };

  const resetFilters = () => {
    setQuery('');
    setStatusFilter('all');
    setShowEmpty(false);
  };

  return (
    <Page>
      <PageHeader>
        <TitleGroup>
          <Eyebrow>WORKFORCE CONTROL</Eyebrow>
          <h1>작업자 관리</h1>
          <p>생산 공정별 작업자 배치와 현재 근무 상태, 보유 역량을 카드 단위로 관리합니다.</p>
        </TitleGroup>
        <HeaderAction type="button" onClick={openCreateEditor}>
          <FiPlus aria-hidden="true" />
          작업자 등록
        </HeaderAction>
      </PageHeader>

      {notice && (
        <Notice role="status">
          <FiUserCheck aria-hidden="true" />
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="알림 닫기">
            <FiX aria-hidden="true" />
          </button>
        </Notice>
      )}

      <ControlBar>
        <SearchField>
          <FiSearch aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="이름, 작업자 번호, 공정 또는 소속 검색"
            aria-label="작업자 검색"
          />
        </SearchField>
        <SelectField
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="근무 상태 필터"
        >
          <option value="all">전체 근무 상태</option>
          <option value="working">근무 중</option>
          <option value="break">휴식 중</option>
          <option value="off">비근무</option>
        </SelectField>
        <DataStateControl aria-label="작업자 데이터 상태">
          <StateButton type="button" $active={!showEmpty} onClick={() => setShowEmpty(false)}>
            데이터 있음
          </StateButton>
          <StateButton type="button" $active={showEmpty} onClick={() => setShowEmpty(true)}>
            데이터 없음
          </StateButton>
        </DataStateControl>
      </ControlBar>

      <MetricGrid aria-label="작업자 현황 요약">
        <MetricCard>
          <MetricIcon $tone="primary"><FiUsers aria-hidden="true" /></MetricIcon>
          <div><MetricLabel>전체 작업자</MetricLabel><MetricValue>{summary.total}</MetricValue></div>
        </MetricCard>
        <MetricCard>
          <MetricIcon $tone="success"><FiBriefcase aria-hidden="true" /></MetricIcon>
          <div><MetricLabel>근무 중</MetricLabel><MetricValue>{summary.working}</MetricValue></div>
        </MetricCard>
        <MetricCard>
          <MetricIcon $tone="warning"><FiCoffee aria-hidden="true" /></MetricIcon>
          <div><MetricLabel>휴식 중</MetricLabel><MetricValue>{summary.break}</MetricValue></div>
        </MetricCard>
        <MetricCard>
          <MetricIcon $tone="neutral"><FiUserMinus aria-hidden="true" /></MetricIcon>
          <div><MetricLabel>비근무</MetricLabel><MetricValue>{summary.off}</MetricValue></div>
        </MetricCard>
      </MetricGrid>

      {filteredWorkers.length > 0 ? (
        <WorkerGrid>
          {filteredWorkers.map((worker) => {
            const status = STATUS_META[worker.status];

            return (
              <WorkerCard key={worker.id} $tone={status.tone}>
                <CardHeader>
                  <WorkerAvatar>{worker.name.slice(0, 1)}</WorkerAvatar>
                  <Identity>
                    <strong>{worker.name}</strong>
                    <span>{worker.id} · {worker.team}</span>
                  </Identity>
                  <StatusChip $tone={status.tone}>{status.label}</StatusChip>
                </CardHeader>

                <CardBody>
                  <InfoItem>
                    <FiTool aria-hidden="true" />
                    <div><InfoLabel>담당 공정</InfoLabel><InfoValue>{worker.process}</InfoValue></div>
                  </InfoItem>
                  <InfoItem>
                    <FiClock aria-hidden="true" />
                    <div><InfoLabel>근무조</InfoLabel><InfoValue>{worker.shift}</InfoValue></div>
                  </InfoItem>
                  <div>
                    <InfoLabel>보유 역량</InfoLabel>
                    <SkillList>{worker.skills.map((skill) => <Skill key={skill}>{skill}</Skill>)}</SkillList>
                  </div>
                </CardBody>

                <CardFooter>
                  <div>
                    <InfoLabel>입사일</InfoLabel>
                    <InfoValue $mono>{worker.joinedAt}</InfoValue>
                  </div>
                  <StatusSelect
                    value={worker.status}
                    onChange={(event) => updateStatus(worker.id, event.target.value)}
                    aria-label={`${worker.name} 근무 상태 변경`}
                  >
                    <option value="working">근무 중</option>
                    <option value="break">휴식 중</option>
                    <option value="off">비근무</option>
                  </StatusSelect>
                  <CardActions>
                    <ActionButton
                      type="button"
                      onClick={() => openEditEditor(worker)}
                      aria-label={`${worker.name} 작업자 수정`}
                    >
                      <FiEdit2 aria-hidden="true" />
                    </ActionButton>
                    <ActionButton
                      type="button"
                      $danger
                      onClick={() => removeWorker(worker.id)}
                      aria-label={`${worker.name} 작업자 삭제`}
                    >
                      <FiTrash2 aria-hidden="true" />
                    </ActionButton>
                  </CardActions>
                </CardFooter>
              </WorkerCard>
            );
          })}
        </WorkerGrid>
      ) : (
        <EmptyState>
          <FiInbox aria-hidden="true" />
          <h2>{showEmpty ? '등록된 작업자가 없습니다' : '조건에 맞는 작업자가 없습니다'}</h2>
          <p>{showEmpty ? '작업자가 등록되면 공정 배치와 근무 상태가 카드로 표시됩니다.' : '검색어 또는 근무 상태 필터를 변경해주세요.'}</p>
          <EmptyAction type="button" onClick={resetFilters}>필터 초기화</EmptyAction>
        </EmptyState>
      )}

      {editor && (
        <EditorBackdrop onMouseDown={closeEditor}>
          <EditorDialog
            as="form"
            onSubmit={saveWorker}
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="worker-editor-title"
          >
            <EditorHeader>
              <div>
                <Eyebrow>{editor.mode === 'create' ? 'WORKER REGISTRATION' : 'WORKER UPDATE'}</Eyebrow>
                <h2 id="worker-editor-title">
                  {editor.mode === 'create' ? '작업자 등록' : '작업자 정보 수정'}
                </h2>
                <p>생산 배치에 필요한 작업자 기본 정보와 근무 상태를 입력합니다.</p>
              </div>
              <EditorClose type="button" onClick={closeEditor} aria-label="작업자 입력 창 닫기">
                <FiX aria-hidden="true" />
              </EditorClose>
            </EditorHeader>

            <EditorBody>
              <FormGrid>
                <FormField>
                  <FormLabel htmlFor="worker-id">작업자 번호 *</FormLabel>
                  <FormInput
                    id="worker-id"
                    value={editor.values.id}
                    onChange={(event) => handleEditorChange('id', event.target.value)}
                    placeholder="WK-007"
                  />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="worker-name">이름 *</FormLabel>
                  <FormInput
                    id="worker-name"
                    value={editor.values.name}
                    onChange={(event) => handleEditorChange('name', event.target.value)}
                    placeholder="작업자 이름"
                    autoFocus
                  />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="worker-process">담당 공정 *</FormLabel>
                  <FormSelect
                    id="worker-process"
                    value={editor.values.process}
                    onChange={(event) => handleEditorChange('process', event.target.value)}
                  >
                    <option>배합</option>
                    <option>제면</option>
                    <option>증숙</option>
                    <option>유탕</option>
                    <option>포장</option>
                    <option>검사</option>
                  </FormSelect>
                </FormField>
                <FormField>
                  <FormLabel htmlFor="worker-team">소속 *</FormLabel>
                  <FormInput
                    id="worker-team"
                    value={editor.values.team}
                    onChange={(event) => handleEditorChange('team', event.target.value)}
                    placeholder="생산 1팀"
                  />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="worker-shift">근무조</FormLabel>
                  <FormSelect
                    id="worker-shift"
                    value={editor.values.shift}
                    onChange={(event) => handleEditorChange('shift', event.target.value)}
                  >
                    <option>주간조</option>
                    <option>야간조</option>
                    <option>교대조</option>
                  </FormSelect>
                </FormField>
                <FormField>
                  <FormLabel htmlFor="worker-status">근무 상태</FormLabel>
                  <FormSelect
                    id="worker-status"
                    value={editor.values.status}
                    onChange={(event) => handleEditorChange('status', event.target.value)}
                  >
                    <option value="working">근무 중</option>
                    <option value="break">휴식 중</option>
                    <option value="off">비근무</option>
                  </FormSelect>
                </FormField>
                <FormField $wide>
                  <FormLabel htmlFor="worker-skills">보유 역량</FormLabel>
                  <FormInput
                    id="worker-skills"
                    value={editor.values.skills}
                    onChange={(event) => handleEditorChange('skills', event.target.value)}
                    placeholder="배합 설비, 기초 안전"
                  />
                  <FieldHint>여러 역량은 쉼표로 구분합니다.</FieldHint>
                </FormField>
                <FormField $wide>
                  <FormLabel htmlFor="worker-joined-at">입사일</FormLabel>
                  <FormInput
                    id="worker-joined-at"
                    type="date"
                    value={editor.values.joinedAt}
                    onChange={(event) => handleEditorChange('joinedAt', event.target.value)}
                  />
                </FormField>
              </FormGrid>
              {formError && <FormError role="alert">{formError}</FormError>}
            </EditorBody>

            <EditorFooter>
              <FormButton type="button" onClick={closeEditor}>취소</FormButton>
              <FormButton type="submit" $primary>
                {editor.mode === 'create' ? '작업자 등록' : '변경사항 저장'}
              </FormButton>
            </EditorFooter>
          </EditorDialog>
        </EditorBackdrop>
      )}
    </Page>
  );
}

export default WorkerManagement;
