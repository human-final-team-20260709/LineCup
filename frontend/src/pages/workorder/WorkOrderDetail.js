import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  FiArrowLeft, FiUsers, FiSettings, FiClock, FiEdit2, FiPackage, FiCheck, FiX, FiSearch,
} from 'react-icons/fi';
import {
  Page, BackLink, HeaderRow, TitleRow, Code, Title, LiveDot, SparkWrap, ActionRow,
  SummaryGrid, SummaryCard, SummaryProgressCard, SummaryLabel, SummaryValue, SummaryUnit,
  StepperWrap, Step, StepCircle, StepLabel, StepSub, StepConnector, ProcessGrid, ProcessCard,
  ProcessCardHeader, ProcessName, ProcessQtyRow, ProcessQtyBlock, ProcessQtyLabel,
  ProcessQtyValue, ProcessEquipRow, ContentGrid, Card, CardHeaderRow, CardTitle, LinkButton,
  InfoList, InfoRow, InfoLabel, InfoValue, RemarkBox, EquipList, EquipRow, EquipName,
  TargetEditRow, TargetInput, Badge, BadgeDot, ProgressRow, ProgressTrack, ProgressFill,
  ProgressRate, StyledButton, EmptyWrap, EmptyIconCircle, EmptyTitle, EmptyDesc,
  EmptyActionBtn, ToggleWrap, ToggleLabel, ToggleSwitch, ToggleKnob, ModalOverlay,
  ModalPanel, ModalHeader, ModalTitle, ModalCloseBtn, ModalBody, ModalFooter, HistoryToolRow,
  HistoryList, HistoryItem, HistoryDot, HistoryContent, HistoryTop, HistoryEventLabel,
  HistoryNote, PickerSearchBox, PickerSearchInput, PickerList, PickerRow, PickerRadioDot,
  PickerInfo, PickerName, PickerMeta, PickerTaskLoad, EquipModalGroup, EquipModalTitle,
  EquipModalRow, EquipModalCheckbox, EquipModalInfo, EquipModalName, ConfirmText, ConfirmSub,
} from './WorkOrderDetailCss';

/* =========================================================
 * README 3.2~3.10 전용 더미 데이터 / 상태 상수
 * (WorkOrderList.js 와 id/code가 동일하게 맞춰져 있어,
 *  목록에서 행을 클릭해 들어와도 같은 작업지시를 보여줍니다.)
 * ========================================================= */
const WORK_ORDER_STATUS = { IN_PROGRESS: 'IN_PROGRESS', HOLD: 'HOLD', DONE: 'DONE', URGENT: 'URGENT' };

const WORK_ORDER_STATUS_META = {
  [WORK_ORDER_STATUS.IN_PROGRESS]: { label: '진행중', color: '#4be277' },
  [WORK_ORDER_STATUS.HOLD]: { label: '보류', color: '#ffb95f' },
  [WORK_ORDER_STATUS.DONE]: { label: '완료', color: '#bccbb9' },
  [WORK_ORDER_STATUS.URGENT]: { label: '긴급', color: '#ffb4ab' },
};

const PROCESS_STATUS = { WAITING: 'WAITING', IN_PROGRESS: 'IN_PROGRESS', DONE: 'DONE' };

const PROCESS_STATUS_META = {
  [PROCESS_STATUS.WAITING]: { label: '대기', color: '#bccbb9' },
  [PROCESS_STATUS.IN_PROGRESS]: { label: '진행중', color: '#4be277' },
  [PROCESS_STATUS.DONE]: { label: '완료', color: '#bccbb9' },
};

const EQUIPMENT_STATUS_META = {
  RUNNING: { label: '가동중', color: '#4be277' },
  STOPPED: { label: '정지', color: '#bccbb9' },
  ERROR: { label: '이상', color: '#ffb4ab' },
};

const HISTORY_EVENT_META = {
  REGISTERED: { label: '등록', color: '#bccbb9' },
  IN_PROGRESS: { label: '작업 시작', color: '#4be277' },
  HOLD: { label: '보류 처리', color: '#ffb95f' },
  DONE: { label: '작업 완료', color: '#bccbb9' },
  URGENT: { label: '긴급 지정', color: '#ffb4ab' },
};

const dummyWorkers = [
  { id: 'WK-001', name: '김민준', dept: '생산1팀', position: '반장' },
  { id: 'WK-002', name: '이서연', dept: '생산1팀', position: '사원' },
  { id: 'WK-003', name: '박도윤', dept: '생산2팀', position: '주임' },
  { id: 'WK-004', name: '최지우', dept: '생산2팀', position: '사원' },
  { id: 'WK-005', name: '정하늘', dept: '품질관리팀', position: '사원' },
  { id: 'WK-006', name: '한소율', dept: '생산2팀', position: '사원' },
];

const dummyEquipments = [
  { id: 'EQ-001', name: '혼합기 1호', process: '원료 혼합', status: 'RUNNING' },
  { id: 'EQ-002', name: '혼합기 2호', process: '원료 혼합', status: 'STOPPED' },
  { id: 'EQ-003', name: '증숙기 1호', process: '증숙', status: 'RUNNING' },
  { id: 'EQ-004', name: '증숙기 2호', process: '증숙', status: 'STOPPED' },
  { id: 'EQ-005', name: '건조기 1호', process: '건조', status: 'RUNNING' },
  { id: 'EQ-006', name: '건조기 2호', process: '건조', status: 'ERROR' },
  { id: 'EQ-007', name: '포장기 1호', process: '포장', status: 'RUNNING' },
  { id: 'EQ-008', name: '포장기 2호', process: '포장', status: 'STOPPED' },
];

const PROCESS_TEMPLATE = ['원료 혼합', '증숙', '건조', '포장'];

const findEquipment = (processName) => dummyEquipments.find((eq) => eq.process === processName);

const buildProcesses = (statusPattern, qtyPattern) =>
  PROCESS_TEMPLATE.map((name, idx) => {
    const eq = findEquipment(name);
    return {
      id: `P${idx + 1}`,
      name,
      status: statusPattern[idx],
      goodQty: qtyPattern[idx]?.good ?? 0,
      defectQty: qtyPattern[idx]?.defect ?? 0,
      equipmentName: eq?.name ?? '-',
      equipmentStatus: eq?.status ?? 'STOPPED',
    };
  });

const buildEquipmentList = (processNames) =>
  processNames.map((name) => findEquipment(name)).filter(Boolean).map((eq) => ({ ...eq }));

const initialWorkOrders = [
  {
    id: 'WO-001',
    code: 'WO-20260709-001',
    productName: '얼큰 컵누들',
    status: WORK_ORDER_STATUS.IN_PROGRESS,
    targetQty: 5000,
    currentQty: 3120,
    goodQty: 3040,
    defectQty: 80,
    startDate: '2026-07-09',
    regDate: '2026-07-05',
    worker: '김민준',
    workerId: 'WK-001',
    startedAt: '2026-07-09 08:02',
    completedAt: null,
    remark: '주간조 정규 생산',
    processes: buildProcesses(
      [PROCESS_STATUS.DONE, PROCESS_STATUS.IN_PROGRESS, PROCESS_STATUS.WAITING, PROCESS_STATUS.WAITING],
      [{ good: 3120, defect: 40 }, { good: 3040, defect: 60 }, { good: 0, defect: 0 }, { good: 0, defect: 0 }]
    ),
    equipmentList: buildEquipmentList(PROCESS_TEMPLATE),
    statusHistory: [
      { id: 'H2', status: 'IN_PROGRESS', changedAt: '2026-07-09 08:02', changedBy: '김민준', note: '작업 시작' },
      { id: 'H1', status: 'REGISTERED', changedAt: '2026-07-05 14:20', changedBy: '정하늘', note: '작업지시 등록' },
    ],
  },
  {
    id: 'WO-002',
    code: 'WO-20260709-002',
    productName: '고소 크림누들',
    status: WORK_ORDER_STATUS.HOLD,
    targetQty: 3000,
    currentQty: 900,
    goodQty: 860,
    defectQty: 40,
    startDate: '2026-07-09',
    regDate: '2026-07-06',
    worker: '박도윤',
    workerId: 'WK-003',
    startedAt: '2026-07-09 09:10',
    completedAt: null,
    remark: '건조기 2호 이상으로 보류',
    processes: buildProcesses(
      [PROCESS_STATUS.DONE, PROCESS_STATUS.DONE, PROCESS_STATUS.IN_PROGRESS, PROCESS_STATUS.WAITING],
      [{ good: 900, defect: 20 }, { good: 880, defect: 10 }, { good: 860, defect: 10 }, { good: 0, defect: 0 }]
    ),
    equipmentList: buildEquipmentList(PROCESS_TEMPLATE),
    statusHistory: [
      { id: 'H3', status: 'HOLD', changedAt: '2026-07-09 11:45', changedBy: '박도윤', note: '건조기 2호 이상 알람으로 보류' },
      { id: 'H2', status: 'IN_PROGRESS', changedAt: '2026-07-09 09:10', changedBy: '박도윤', note: '작업 시작' },
      { id: 'H1', status: 'REGISTERED', changedAt: '2026-07-06 10:05', changedBy: '정하늘', note: '작업지시 등록' },
    ],
  },
  {
    id: 'WO-003',
    code: 'WO-20260708-005',
    productName: '매콤 볶음누들',
    status: WORK_ORDER_STATUS.DONE,
    targetQty: 4000,
    currentQty: 4000,
    goodQty: 3950,
    defectQty: 50,
    startDate: '2026-07-08',
    regDate: '2026-07-04',
    worker: '이서연',
    workerId: 'WK-002',
    startedAt: '2026-07-08 08:00',
    completedAt: '2026-07-08 17:32',
    remark: '',
    processes: buildProcesses(
      [PROCESS_STATUS.DONE, PROCESS_STATUS.DONE, PROCESS_STATUS.DONE, PROCESS_STATUS.DONE],
      [{ good: 4000, defect: 10 }, { good: 3990, defect: 15 }, { good: 3970, defect: 15 }, { good: 3950, defect: 10 }]
    ),
    equipmentList: buildEquipmentList(PROCESS_TEMPLATE),
    statusHistory: [
      { id: 'H3', status: 'DONE', changedAt: '2026-07-08 17:32', changedBy: '이서연', note: '전 공정 완료' },
      { id: 'H2', status: 'IN_PROGRESS', changedAt: '2026-07-08 08:00', changedBy: '이서연', note: '작업 시작' },
      { id: 'H1', status: 'REGISTERED', changedAt: '2026-07-04 09:15', changedBy: '정하늘', note: '작업지시 등록' },
    ],
  },
  {
    id: 'WO-004',
    code: 'WO-20260709-003',
    productName: '해물육수 컵면',
    status: WORK_ORDER_STATUS.URGENT,
    targetQty: 2000,
    currentQty: 120,
    goodQty: 110,
    defectQty: 10,
    startDate: '2026-07-09',
    regDate: '2026-07-09',
    worker: '최지우',
    workerId: 'WK-004',
    startedAt: '2026-07-09 13:20',
    completedAt: null,
    remark: '긴급 거래처 요청 건, 우선 진행',
    processes: buildProcesses(
      [PROCESS_STATUS.IN_PROGRESS, PROCESS_STATUS.WAITING, PROCESS_STATUS.WAITING, PROCESS_STATUS.WAITING],
      [{ good: 110, defect: 10 }, { good: 0, defect: 0 }, { good: 0, defect: 0 }, { good: 0, defect: 0 }]
    ),
    equipmentList: buildEquipmentList(PROCESS_TEMPLATE),
    statusHistory: [
      { id: 'H2', status: 'URGENT', changedAt: '2026-07-09 13:15', changedBy: '최지우', note: '긴급 등급으로 변경' },
      { id: 'H1', status: 'REGISTERED', changedAt: '2026-07-09 13:00', changedBy: '정하늘', note: '작업지시 등록' },
    ],
  },
  {
    id: 'WO-005',
    code: 'WO-20260709-004',
    productName: '치즈불닭 컵면',
    status: WORK_ORDER_STATUS.IN_PROGRESS,
    targetQty: 6000,
    currentQty: 1180,
    goodQty: 1150,
    defectQty: 30,
    startDate: '2026-07-09',
    regDate: '2026-07-07',
    worker: '한소율',
    workerId: 'WK-006',
    startedAt: '2026-07-09 08:30',
    completedAt: null,
    remark: '',
    processes: buildProcesses(
      [PROCESS_STATUS.IN_PROGRESS, PROCESS_STATUS.WAITING, PROCESS_STATUS.WAITING, PROCESS_STATUS.WAITING],
      [{ good: 1150, defect: 30 }, { good: 0, defect: 0 }, { good: 0, defect: 0 }, { good: 0, defect: 0 }]
    ),
    equipmentList: buildEquipmentList(PROCESS_TEMPLATE),
    statusHistory: [
      { id: 'H2', status: 'IN_PROGRESS', changedAt: '2026-07-09 08:30', changedBy: '한소율', note: '작업 시작' },
      { id: 'H1', status: 'REGISTERED', changedAt: '2026-07-07 16:40', changedBy: '정하늘', note: '작업지시 등록' },
    ],
  },
  {
    // 데이터 없음 상태를 확인하기 위한 예시: 설비 매핑 전 / 상태 변경 이력 1건뿐
    id: 'WO-006',
    code: 'WO-20260710-001',
    productName: '얼큰 컵누들',
    status: WORK_ORDER_STATUS.HOLD,
    targetQty: 2500,
    currentQty: 0,
    goodQty: 0,
    defectQty: 0,
    startDate: '2026-07-10',
    regDate: '2026-07-08',
    worker: '최지우',
    workerId: 'WK-004',
    startedAt: null,
    completedAt: null,
    remark: '원자재(스프) 입고 지연으로 보류',
    processes: buildProcesses(
      [PROCESS_STATUS.WAITING, PROCESS_STATUS.WAITING, PROCESS_STATUS.WAITING, PROCESS_STATUS.WAITING],
      [{ good: 0, defect: 0 }, { good: 0, defect: 0 }, { good: 0, defect: 0 }, { good: 0, defect: 0 }]
    ),
    equipmentList: [],
    statusHistory: [
      { id: 'H1', status: 'REGISTERED', changedAt: '2026-07-08 10:00', changedBy: '정하늘', note: '작업지시 등록' },
    ],
  },
];

const nowString = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/* =========================================================
 * 로컬 UI 부품 (이 파일 안에서만 사용, 다른 파일 import 없음)
 * ========================================================= */
const Button = ({ variant = 'primary', size = 'md', children, ...rest }) => (
  <StyledButton $variant={variant} $size={size} {...rest}>
    {children}
  </StyledButton>
);

const StatusBadge = ({ label, color, pulse }) => (
  <Badge $color={color}>
    <BadgeDot $color={color} $pulse={pulse} />
    {label}
  </Badge>
);

const ProgressBar = ({ value = 0, max = 0, color }) => {
  const rate = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <ProgressRow>
      <ProgressTrack>
        <ProgressFill $rate={rate} $color={color} />
      </ProgressTrack>
      <ProgressRate>{rate}%</ProgressRate>
    </ProgressRow>
  );
};

/* DESIGN.md "Sparklines" — 축 없는 소형 모노크롬 트렌드 라인 */
const Sparkline = ({ data = [], color = '#4be277', width = 100, height = 30 }) => {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <SparkWrap>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" aria-hidden="true">
        <polyline points={points} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </SparkWrap>
  );
};

const EmptyState = ({ icon, title, description, actionLabel, onAction }) => (
  <EmptyWrap>
    <EmptyIconCircle>{icon}</EmptyIconCircle>
    <EmptyTitle>{title}</EmptyTitle>
    <EmptyDesc>{description}</EmptyDesc>
    {actionLabel && onAction && (
      <EmptyActionBtn type="button" onClick={onAction}>
        {actionLabel}
      </EmptyActionBtn>
    )}
  </EmptyWrap>
);

const DummyDataToggle = ({ checked, onChange, label = '더미 데이터' }) => (
  <ToggleWrap>
    <ToggleLabel>{label}</ToggleLabel>
    <ToggleSwitch $on={checked} onClick={() => onChange(!checked)} type="button">
      <ToggleKnob $on={checked} />
    </ToggleSwitch>
    <ToggleLabel $muted>{checked ? '있음' : '없음'}</ToggleLabel>
  </ToggleWrap>
);

const ModalBase = ({ open, onClose, title, width, footer, children }) => {
  if (!open) return null;
  return createPortal(
    <ModalOverlay onMouseDown={onClose}>
      <ModalPanel $width={width} onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalCloseBtn type="button" onClick={onClose} aria-label="닫기">
            <FiX size={18} />
          </ModalCloseBtn>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalPanel>
    </ModalOverlay>,
    document.body
  );
};

/* 3.4 작업 상태 변경 이력 확인 */
const StatusHistoryModal = ({ open, onClose, history = [] }) => {
  const [hasData, setHasData] = useState(true);
  const list = hasData ? history : [];

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title="작업 상태 변경 이력"
      footer={
        <Button variant="outline" onClick={onClose}>
          닫기
        </Button>
      }
    >
      <HistoryToolRow>
        <DummyDataToggle checked={hasData} onChange={setHasData} label="이력 데이터" />
      </HistoryToolRow>

      {list.length === 0 ? (
        <EmptyState icon={<FiClock size={22} />} title="변경 이력이 없습니다" description="작업지시의 상태가 변경되면 이곳에 이력이 쌓입니다." />
      ) : (
        <HistoryList>
          {list.map((h) => {
            const meta = HISTORY_EVENT_META[h.status] || HISTORY_EVENT_META.REGISTERED;
            return (
              <HistoryItem key={h.id}>
                <HistoryDot $color={meta.color} />
                <HistoryContent>
                  <HistoryTop>
                    <HistoryEventLabel $color={meta.color}>{meta.label}</HistoryEventLabel>
                    <span>{h.changedAt}</span>
                  </HistoryTop>
                  <HistoryNote>
                    {h.changedBy} · {h.note}
                  </HistoryNote>
                </HistoryContent>
              </HistoryItem>
            );
          })}
        </HistoryList>
      )}
    </ModalBase>
  );
};

/* 3.7 작업자 배정 / 작업자 변경 */
const WorkerAssignModal = ({ open, onClose, currentWorkerId, onAssign, workOrders = [] }) => {
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState(currentWorkerId);

  const filtered = useMemo(
    () => dummyWorkers.filter((w) => w.name.includes(keyword.trim()) || w.dept.includes(keyword.trim())),
    [keyword]
  );

  // 3.7 작업자별 담당 작업 확인 — 워커별로 진행 중(미완료) 작업지시 개수를 집계
  const taskCountByWorker = useMemo(() => {
    const map = {};
    workOrders.forEach((wo) => {
      if (wo.status !== WORK_ORDER_STATUS.DONE) {
        map[wo.workerId] = (map[wo.workerId] || 0) + 1;
      }
    });
    return map;
  }, [workOrders]);

  const handleConfirm = () => {
    const worker = dummyWorkers.find((w) => w.id === selected);
    if (worker) onAssign?.(worker);
    onClose?.();
  };

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title="작업자 배정"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" disabled={!selected} onClick={handleConfirm}>
            배정 완료
          </Button>
        </>
      }
    >
      <PickerSearchBox>
        <FiSearch size={16} />
        <PickerSearchInput placeholder="이름 또는 소속으로 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      </PickerSearchBox>

      {filtered.length === 0 ? (
        <EmptyState icon={<FiUsers size={22} />} title="검색된 작업자가 없습니다" description="다른 검색어로 다시 시도해 보세요." />
      ) : (
        <PickerList>
          {filtered.map((w) => {
            const taskCount = taskCountByWorker[w.id] || 0;
            return (
              <PickerRow key={w.id} $active={selected === w.id} onClick={() => setSelected(w.id)}>
                <PickerRadioDot $active={selected === w.id} />
                <PickerInfo>
                  <PickerName>{w.name}</PickerName>
                  <PickerMeta>
                    {w.dept} · {w.position}
                  </PickerMeta>
                </PickerInfo>
                <PickerTaskLoad $busy={taskCount > 0}>
                  {taskCount > 0 ? `담당 작업지시 ${taskCount}건` : '담당 작업 없음'}
                </PickerTaskLoad>
              </PickerRow>
            );
          })}
        </PickerList>
      )}
    </ModalBase>
  );
};

/* 3.10 작업지시별 설비 매핑 */
const EquipmentMapModal = ({ open, onClose, selectedIds = [], onSave }) => {
  const [checked, setChecked] = useState(selectedIds);

  const toggle = (id) => {
    setChecked((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const handleSave = () => {
    onSave?.(checked);
    onClose?.();
  };

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title="설비 매핑"
      width="520px"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSave}>
            매핑 저장
          </Button>
        </>
      }
    >
      {dummyEquipments.length === 0 ? (
        <EmptyState icon={<FiSettings size={22} />} title="등록된 설비가 없습니다" description="설비 마스터를 먼저 등록해 주세요." />
      ) : (
        PROCESS_TEMPLATE.map((processName) => {
          const equips = dummyEquipments.filter((eq) => eq.process === processName);
          return (
            <EquipModalGroup key={processName}>
              <EquipModalTitle>{processName}</EquipModalTitle>
              {equips.map((eq) => {
                const meta = EQUIPMENT_STATUS_META[eq.status];
                const isChecked = checked.includes(eq.id);
                return (
                  <EquipModalRow key={eq.id} $active={isChecked} onClick={() => toggle(eq.id)}>
                    <EquipModalCheckbox $active={isChecked} />
                    <EquipModalInfo>
                      <EquipModalName>{eq.name}</EquipModalName>
                      <StatusBadge label={meta.label} color={meta.color} />
                    </EquipModalInfo>
                  </EquipModalRow>
                );
              })}
            </EquipModalGroup>
          );
        })
      )}
    </ModalBase>
  );
};

/* 3.4 작업 시작 / 보류 / 완료 처리 확인 */
const VARIANT_BY_ACTION = { START: 'primary', HOLD: 'warning', DONE: 'primary' };

const ConfirmActionModal = ({ open, onClose, action, title, description, onConfirm }) => (
  <ModalBase
    open={open}
    onClose={onClose}
    title={title}
    width="400px"
    footer={
      <>
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button variant={VARIANT_BY_ACTION[action] || 'primary'} onClick={onConfirm}>
          확인
        </Button>
      </>
    }
  >
    <ConfirmText>{title}</ConfirmText>
    <ConfirmSub>{description}</ConfirmSub>
  </ModalBase>
);

/* 3.5 작업지시별 공정 순서 확인 */
const ProcessStepper = ({ processes = [] }) => {
  const currentIndex = processes.findIndex((p) => p.status === PROCESS_STATUS.IN_PROGRESS);
  const nextIndex = currentIndex === -1 ? -1 : currentIndex + 1;

  return (
    <StepperWrap>
      {processes.map((p, idx) => {
        const meta = PROCESS_STATUS_META[p.status];
        const isCurrent = idx === currentIndex;
        const isNext = idx === nextIndex;
        const isWaiting = p.status === PROCESS_STATUS.WAITING;
        return (
          <Step key={p.id}>
            <StepCircle $waiting={isWaiting} $color={meta.color} $emphasis={isCurrent}>
              {p.status === PROCESS_STATUS.DONE ? <FiCheck size={14} /> : idx + 1}
            </StepCircle>
            <StepLabel $emphasis={isCurrent}>{p.name}</StepLabel>
            <StepSub $color={meta.color}>{isCurrent ? '현재 진행 공정' : isNext ? '다음 공정' : meta.label}</StepSub>
            {idx < processes.length - 1 && <StepConnector $done={p.status === PROCESS_STATUS.DONE} />}
          </Step>
        );
      })}
    </StepperWrap>
  );
};

/* 3.6 공정 진행 현황 */
const ProcessProgressGrid = ({ processes = [] }) => (
  <ProcessGrid>
    {processes.map((p, idx) => {
      const statusMeta = PROCESS_STATUS_META[p.status];
      const equipMeta = EQUIPMENT_STATUS_META[p.equipmentStatus] || EQUIPMENT_STATUS_META.STOPPED;
      const equipAlert = p.equipmentStatus === 'ERROR';
      return (
        <ProcessCard key={p.id} $delay={idx * 60}>
          <ProcessCardHeader>
            <ProcessName>{p.name}</ProcessName>
            <StatusBadge label={statusMeta.label} color={statusMeta.color} pulse={p.status === PROCESS_STATUS.IN_PROGRESS} />
          </ProcessCardHeader>
          <ProcessQtyRow>
            <ProcessQtyBlock>
              <ProcessQtyLabel>생산 수량</ProcessQtyLabel>
              <ProcessQtyValue>{(p.goodQty + p.defectQty).toLocaleString()}</ProcessQtyValue>
            </ProcessQtyBlock>
            <ProcessQtyBlock>
              <ProcessQtyLabel>정상</ProcessQtyLabel>
              <ProcessQtyValue>{p.goodQty.toLocaleString()}</ProcessQtyValue>
            </ProcessQtyBlock>
            <ProcessQtyBlock>
              <ProcessQtyLabel>불량</ProcessQtyLabel>
              <ProcessQtyValue $alert={p.defectQty > 0}>{p.defectQty.toLocaleString()}</ProcessQtyValue>
            </ProcessQtyBlock>
          </ProcessQtyRow>
          <ProcessEquipRow>
            <span>{p.equipmentName}</span>
            <StatusBadge label={equipMeta.label} color={equipMeta.color} pulse={equipAlert} />
          </ProcessEquipRow>
        </ProcessCard>
      );
    })}
  </ProcessGrid>
);

/* 3.8 생산 목표 수량 / 3.9 현재 생산 수량 요약 */
const ProductionSummaryCards = ({ workOrder }) => {
  const { targetQty, currentQty, goodQty, defectQty, processes } = workOrder;
  const rate = targetQty > 0 ? Math.min(100, Math.round((currentQty / targetQty) * 100)) : 0;
  // 공정 단계별 정상 수량 누적치를 소형 트렌드 라인으로 표시 (DESIGN.md Sparklines)
  const goodTrend = processes.map((p) => p.goodQty);

  return (
    <SummaryGrid>
      <SummaryCard $delay={0} $accent="#4be277">
        <SummaryLabel>현재 생산 수량</SummaryLabel>
        <SummaryValue>
          {currentQty.toLocaleString()}
          <SummaryUnit>EA</SummaryUnit>
        </SummaryValue>
        <Sparkline data={goodTrend} color="#4be277" />
      </SummaryCard>
      <SummaryCard $delay={60} $accent="#4be277">
        <SummaryLabel>정상 수량</SummaryLabel>
        <SummaryValue $color="#4be277">
          {goodQty.toLocaleString()}
          <SummaryUnit>EA</SummaryUnit>
        </SummaryValue>
      </SummaryCard>
      <SummaryCard $delay={120} $accent="#ffb4ae">
        <SummaryLabel>불량 수량</SummaryLabel>
        <SummaryValue $color="#ffb4ae">
          {defectQty.toLocaleString()}
          <SummaryUnit>EA</SummaryUnit>
        </SummaryValue>
      </SummaryCard>
      <SummaryProgressCard $delay={180} $accent="#4be277">
        <SummaryLabel>목표 대비 진행률</SummaryLabel>
        <ProgressBar value={currentQty} max={targetQty} color="#4be277" />
        <SummaryUnit>
          목표 {targetQty.toLocaleString()} EA 중 {currentQty.toLocaleString()} EA 생산 ({rate}%)
        </SummaryUnit>
      </SummaryProgressCard>
    </SummaryGrid>
  );
};

/* =========================================================
 * WorkOrderDetail (README 3.2, 3.4~3.10)
 * ========================================================= */
const WorkOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workOrders, setWorkOrders] = useState(initialWorkOrders);
  const workOrder = workOrders.find((wo) => wo.id === id);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [workerModalOpen, setWorkerModalOpen] = useState(false);
  const [equipModalOpen, setEquipModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'START' | 'HOLD' | 'DONE'
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetDraft, setTargetDraft] = useState('');

  const updateWorkOrder = (updater) => {
    setWorkOrders((prev) => prev.map((wo) => (wo.id === id ? updater(wo) : wo)));
  };

  if (!workOrder) {
    return (
      <Page>
        <EmptyState
          icon={<FiPackage size={22} />}
          title="작업지시를 찾을 수 없습니다"
          description="삭제되었거나 잘못된 경로입니다. 목록에서 다시 선택해 주세요."
          actionLabel="목록으로 이동"
          onAction={() => navigate('/work-orders')}
        />
      </Page>
    );
  }

  const statusMeta = WORK_ORDER_STATUS_META[workOrder.status];
  const canStart = !workOrder.startedAt || workOrder.status === WORK_ORDER_STATUS.HOLD;
  const canHold = workOrder.startedAt && workOrder.status !== WORK_ORDER_STATUS.HOLD && workOrder.status !== WORK_ORDER_STATUS.DONE;
  const canComplete = workOrder.startedAt && workOrder.status !== WORK_ORDER_STATUS.DONE;

  const pushHistory = (status, note) => {
    updateWorkOrder((prev) => ({
      ...prev,
      statusHistory: [
        { id: `H${prev.statusHistory.length + 1}`, status, changedAt: nowString(), changedBy: prev.worker, note },
        ...prev.statusHistory,
      ],
    }));
  };

  const handleConfirm = () => {
    if (confirmAction === 'START') {
      updateWorkOrder((prev) => ({ ...prev, status: WORK_ORDER_STATUS.IN_PROGRESS, startedAt: prev.startedAt || nowString() }));
      pushHistory('IN_PROGRESS', '작업 시작 처리');
    } else if (confirmAction === 'HOLD') {
      updateWorkOrder((prev) => ({ ...prev, status: WORK_ORDER_STATUS.HOLD }));
      pushHistory('HOLD', '작업 보류 처리');
    } else if (confirmAction === 'DONE') {
      updateWorkOrder((prev) => ({ ...prev, status: WORK_ORDER_STATUS.DONE, completedAt: nowString() }));
      pushHistory('DONE', '작업 완료 처리');
    }
    setConfirmAction(null);
  };

  const handleAssignWorker = (worker) => {
    updateWorkOrder((prev) => ({ ...prev, worker: worker.name, workerId: worker.id }));
  };

  const handleSaveEquipment = (ids) => {
    const list = dummyEquipments.filter((eq) => ids.includes(eq.id));
    updateWorkOrder((prev) => ({ ...prev, equipmentList: list }));
  };

  const openTargetEdit = () => {
    setTargetDraft(String(workOrder.targetQty));
    setEditingTarget(true);
  };

  const saveTargetEdit = () => {
    const value = Number(targetDraft);
    if (!Number.isNaN(value) && value > 0) {
      updateWorkOrder((prev) => ({ ...prev, targetQty: value }));
    }
    setEditingTarget(false);
  };

  const CONFIRM_COPY = {
    START: { title: '작업을 시작하시겠습니까?', description: `${workOrder.code} 작업지시를 진행중 상태로 변경합니다.` },
    HOLD: { title: '작업을 보류하시겠습니까?', description: `${workOrder.code} 작업지시를 보류 상태로 변경합니다.` },
    DONE: { title: '작업을 완료 처리하시겠습니까?', description: `${workOrder.code} 작업지시를 완료 상태로 변경합니다.` },
  };

  return (
    <Page>
      <BackLink as={Link} to="/work-orders">
        <FiArrowLeft size={14} />
        작업지시 목록으로
      </BackLink>

      <HeaderRow>
        <TitleRow>
          <Code>{workOrder.code}</Code>
          <Title>{workOrder.productName}</Title>
          <StatusBadge label={statusMeta.label} color={statusMeta.color} pulse={workOrder.status === WORK_ORDER_STATUS.URGENT} />
          <LiveDot title="실시간 반영" />
        </TitleRow>
      </HeaderRow>

      <ActionRow>
        <Button variant="ghost" onClick={() => setHistoryOpen(true)}>
          <FiClock size={16} />
          상태 변경 이력
        </Button>
        {canHold && (
          <Button variant="warning" onClick={() => setConfirmAction('HOLD')}>
            보류 처리
          </Button>
        )}
        {canStart && (
          <Button variant="primary" onClick={() => setConfirmAction('START')}>
            {workOrder.status === WORK_ORDER_STATUS.HOLD ? '작업 재개' : '작업 시작'}
          </Button>
        )}
        {canComplete && (
          <Button variant="primary" onClick={() => setConfirmAction('DONE')}>
            완료 처리
          </Button>
        )}
      </ActionRow>

      <ProductionSummaryCards workOrder={workOrder} />

      <Card $delay={80}>
        <CardTitle>작업 순서 확인</CardTitle>
        <ProcessStepper processes={workOrder.processes} />
      </Card>

      <Card $delay={140}>
        <CardTitle>공정 진행 현황</CardTitle>
        <ProcessProgressGrid processes={workOrder.processes} />
      </Card>

      <ContentGrid>
        <Card $delay={200}>
          <CardTitle>작업지시 기본 정보</CardTitle>
          <InfoList>
            <InfoRow>
              <InfoLabel>제품명</InfoLabel>
              <InfoValue>{workOrder.productName}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>생산 목표 수량</InfoLabel>
              {editingTarget ? (
                <TargetEditRow>
                  <TargetInput type="number" min={1} value={targetDraft} onChange={(e) => setTargetDraft(e.target.value)} autoFocus />
                  <Button size="sm" variant="primary" onClick={saveTargetEdit}>
                    저장
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingTarget(false)}>
                    취소
                  </Button>
                </TargetEditRow>
              ) : (
                <InfoValue>
                  {workOrder.targetQty.toLocaleString()} EA
                  <LinkButton type="button" onClick={openTargetEdit}>
                    <FiEdit2 size={12} />
                    수정
                  </LinkButton>
                </InfoValue>
              )}
            </InfoRow>
            <InfoRow>
              <InfoLabel>시작 예정일</InfoLabel>
              <InfoValue $mono>{workOrder.startDate}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>등록일</InfoLabel>
              <InfoValue $mono>{workOrder.regDate}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>작업 시작 시간</InfoLabel>
              <InfoValue $mono>{workOrder.startedAt || '-'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>작업 완료 시간</InfoLabel>
              <InfoValue $mono>{workOrder.completedAt || '-'}</InfoValue>
            </InfoRow>
          </InfoList>
          {workOrder.remark && <RemarkBox>비고 · {workOrder.remark}</RemarkBox>}
        </Card>

        <Card $delay={240}>
          <CardHeaderRow>
            <CardTitle>배정 작업자</CardTitle>
            <LinkButton type="button" onClick={() => setWorkerModalOpen(true)}>
              <FiUsers size={12} />
              작업자 변경
            </LinkButton>
          </CardHeaderRow>
          <InfoList>
            <InfoRow>
              <InfoLabel>담당 작업자</InfoLabel>
              <InfoValue>{workOrder.worker}</InfoValue>
            </InfoRow>
          </InfoList>

          <CardHeaderRow $spaced>
            <CardTitle>매핑된 설비 목록</CardTitle>
            <LinkButton type="button" onClick={() => setEquipModalOpen(true)}>
              <FiSettings size={12} />
              매핑 수정
            </LinkButton>
          </CardHeaderRow>
          {workOrder.equipmentList.length === 0 ? (
            <EmptyState
              icon={<FiSettings size={20} />}
              title="매핑된 설비가 없습니다"
              description="매핑 수정 버튼으로 설비를 연결해 주세요."
              actionLabel="설비 매핑하기"
              onAction={() => setEquipModalOpen(true)}
            />
          ) : (
            <EquipList>
              {workOrder.equipmentList.map((eq) => {
                const meta = EQUIPMENT_STATUS_META[eq.status];
                return (
                  <EquipRow key={eq.id}>
                    <EquipName>
                      {eq.name}
                      <span>{eq.process}</span>
                    </EquipName>
                    <StatusBadge label={meta.label} color={meta.color} />
                  </EquipRow>
                );
              })}
            </EquipList>
          )}
        </Card>
      </ContentGrid>

      <StatusHistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} history={workOrder.statusHistory} />
      <WorkerAssignModal
        open={workerModalOpen}
        onClose={() => setWorkerModalOpen(false)}
        currentWorkerId={workOrder.workerId}
        onAssign={handleAssignWorker}
        workOrders={workOrders}
      />
      <EquipmentMapModal
        open={equipModalOpen}
        onClose={() => setEquipModalOpen(false)}
        selectedIds={workOrder.equipmentList.map((eq) => eq.id)}
        onSave={handleSaveEquipment}
      />
      {confirmAction && (
        <ConfirmActionModal
          open={!!confirmAction}
          action={confirmAction}
          title={CONFIRM_COPY[confirmAction].title}
          description={CONFIRM_COPY[confirmAction].description}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirm}
        />
      )}
    </Page>
  );
};

export default WorkOrderDetail;
