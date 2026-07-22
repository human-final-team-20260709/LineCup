import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  FiArrowLeft, FiUsers, FiClock, FiEdit2, FiPackage, FiX, FiSearch,
} from 'react-icons/fi';
import {
  Page, BackLink, HeaderRow, TitleRow, Code, Title, LiveDot, SparkWrap, ActionRow,
  SummaryGrid, SummaryCard, SummaryProgressCard, SummaryLabel, SummaryValue, SummaryUnit,
  ProcessGrid, ProcessCard, ProcessCardHeader, ProcessIdentity, ProcessMode, ProcessName,
  ProcessQtyRow, ProcessQtyBlock, ProcessQtyLabel, ProcessQtyValue, ProcessEquipRow,
  ProcessEquipLabel, ContentGrid, Card, CardHeaderRow, CardTitle, CardDescription, LinkButton,
  InfoList, InfoRow, InfoLabel, InfoValue, RemarkBox,
  TargetEditRow, TargetInput, Badge, BadgeDot, ProgressRow, ProgressTrack, ProgressFill,
  ProgressRate, StyledButton, EmptyWrap, EmptyIconCircle, EmptyTitle, EmptyDesc,
  EmptyActionBtn, ToggleWrap, ToggleLabel, ToggleSwitch, ToggleKnob, ModalOverlay,
  ModalPanel, ModalHeader, ModalTitle, ModalCloseBtn, ModalBody, ModalFooter, HistoryToolRow,
  HistoryList, HistoryItem, HistoryDot, HistoryContent, HistoryTop, HistoryEventLabel,
  HistoryNote, PickerSearchBox, PickerSearchInput, PickerList, PickerRow, PickerRadioDot,
  PickerInfo, PickerName, PickerMeta, PickerTaskLoad, ConfirmText, ConfirmSub,
} from './WorkOrderDetailCss';

import {
  DUMMY_SUPERVISORS as dummySupervisors,
  EQUIPMENT_STATUS_META,
  HISTORY_EVENT_META,
  nowString,
  PROCESS_STATUS,
  PROCESS_STATUS_META,
  WORK_ORDER_STATUS,
  WORK_ORDER_STATUS_META,
} from './workOrderData';

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

/* 3.7 지시자 배정 / 지시자 변경 */
const SupervisorAssignModal = ({ open, onClose, currentSupervisorId, onAssign, workOrders = [] }) => {
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState(currentSupervisorId);

  const filtered = useMemo(
    () => dummySupervisors.filter((supervisor) => supervisor.name.includes(keyword.trim()) || supervisor.dept.includes(keyword.trim())),
    [keyword]
  );

  // 3.7 지시자별 담당 작업 확인 — 진행 중(미완료) 작업지시 개수를 집계
  const taskCountBySupervisor = useMemo(() => {
    const map = {};
    workOrders.forEach((wo) => {
      if (wo.status !== WORK_ORDER_STATUS.DONE) {
        map[wo.supervisorId] = (map[wo.supervisorId] || 0) + 1;
      }
    });
    return map;
  }, [workOrders]);

  const handleConfirm = () => {
    const supervisor = dummySupervisors.find((item) => item.id === selected);
    if (supervisor) onAssign?.(supervisor);
    onClose?.();
  };

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title="지시자 배정"
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
        <EmptyState icon={<FiUsers size={22} />} title="검색된 지시자가 없습니다" description="다른 검색어로 다시 시도해 보세요." />
      ) : (
        <PickerList>
          {filtered.map((supervisor) => {
            const taskCount = taskCountBySupervisor[supervisor.id] || 0;
            return (
              <PickerRow key={supervisor.id} $active={selected === supervisor.id} onClick={() => setSelected(supervisor.id)}>
                <PickerRadioDot $active={selected === supervisor.id} />
                <PickerInfo>
                  <PickerName>{supervisor.name}</PickerName>
                  <PickerMeta>
                    {supervisor.dept} · {supervisor.position}
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

/* 3.5~3.6 독립 설비별 공정 진행 현황 */
const ProcessProgressGrid = ({ processes = [] }) => (
  <ProcessGrid>
    {processes.map((p, idx) => {
      const statusMeta = PROCESS_STATUS_META[p.status];
      const equipMeta = EQUIPMENT_STATUS_META[p.equipmentStatus] || EQUIPMENT_STATUS_META.STOPPED;
      const equipAlert = p.equipmentStatus === 'ERROR';
      return (
        <ProcessCard key={p.id} $delay={idx * 60}>
          <ProcessCardHeader>
            <ProcessIdentity>
              <ProcessMode>UNIT {String(idx + 1).padStart(2, '0')} · INDEPENDENT</ProcessMode>
              <ProcessName>{p.name}</ProcessName>
            </ProcessIdentity>
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
            <div>
              <ProcessEquipLabel>매핑 설비</ProcessEquipLabel>
              <strong>{p.equipmentName}</strong>
            </div>
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
const WorkOrderDetail = ({ workOrders, setWorkOrders }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const workOrder = workOrders.find((wo) => wo.id === id);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [supervisorModalOpen, setSupervisorModalOpen] = useState(false);
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
          onAction={() => navigate('/work-orders/list')}
        />
      </Page>
    );
  }

  const statusMeta = WORK_ORDER_STATUS_META[workOrder.status];
  const canStart = [WORK_ORDER_STATUS.PENDING, WORK_ORDER_STATUS.HOLD].includes(workOrder.status);
  const canHold = workOrder.status === WORK_ORDER_STATUS.IN_PROGRESS;
  const canComplete = workOrder.status === WORK_ORDER_STATUS.IN_PROGRESS;

  const handleConfirm = () => {
    const changedAt = nowString();
    updateWorkOrder((prev) => {
      let nextStatus = prev.status;
      let historyStatus = prev.status;
      let note = '';
      const changes = {};

      if (confirmAction === 'START') {
        const isResume = prev.status === WORK_ORDER_STATUS.HOLD;
        nextStatus = WORK_ORDER_STATUS.IN_PROGRESS;
        historyStatus = isResume ? 'RESUMED' : 'IN_PROGRESS';
        note = isResume ? '작업 재개' : '작업 시작';
        changes.startedAt = prev.startedAt || changedAt;
      } else if (confirmAction === 'HOLD') {
        nextStatus = WORK_ORDER_STATUS.HOLD;
        historyStatus = 'HOLD';
        note = '작업 보류 처리';
      } else if (confirmAction === 'DONE') {
        nextStatus = WORK_ORDER_STATUS.DONE;
        historyStatus = 'DONE';
        note = '작업 완료 처리';
        changes.completedAt = changedAt;
      } else {
        return prev;
      }

      return {
        ...prev,
        ...changes,
        status: nextStatus,
        statusHistory: [
          {
            id: `H${prev.statusHistory.length + 1}`,
            status: historyStatus,
            changedAt,
            changedBy: prev.supervisor,
            note,
          },
          ...prev.statusHistory,
        ],
      };
    });
    setConfirmAction(null);
  };

  const handleAssignSupervisor = (supervisor) => {
    updateWorkOrder((prev) => ({ ...prev, supervisor: supervisor.name, supervisorId: supervisor.id }));
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
    START: workOrder.status === WORK_ORDER_STATUS.HOLD
      ? { title: '작업을 재개하시겠습니까?', description: `${workOrder.code} 작업지시를 진행중 상태로 변경합니다.` }
      : { title: '작업을 시작하시겠습니까?', description: `${workOrder.code} 작업지시를 진행중 상태로 변경합니다.` },
    HOLD: { title: '작업을 보류하시겠습니까?', description: `${workOrder.code} 작업지시를 보류 상태로 변경합니다.` },
    DONE: { title: '작업을 완료 처리하시겠습니까?', description: `${workOrder.code} 작업지시를 완료 상태로 변경합니다.` },
  };

  return (
    <Page>
      <BackLink as={Link} to="/work-orders/list">
        <FiArrowLeft size={14} />
        작업지시 목록으로
      </BackLink>

      <HeaderRow>
        <TitleRow>
          <Code>{workOrder.code}</Code>
          <Title>{workOrder.productName}</Title>
          <StatusBadge label={statusMeta.label} color={statusMeta.color} />
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

      <Card $delay={100}>
        <CardHeaderRow>
          <div>
            <CardTitle>독립 설비 공정 진행 현황</CardTitle>
            <CardDescription>
              {workOrder.processes.length}개 설비가 선후 관계 없이 독립적으로 운영되며, 설비별 작업 상태와 생산 실적을 개별 표시합니다.
            </CardDescription>
          </div>
          <StatusBadge label={`UNIT × ${workOrder.processes.length}`} color="#4be277" />
        </CardHeaderRow>
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
            <CardTitle>배정 지시자</CardTitle>
            <LinkButton type="button" onClick={() => setSupervisorModalOpen(true)}>
              <FiUsers size={12} />
              지시자 변경
            </LinkButton>
          </CardHeaderRow>
          <InfoList>
            <InfoRow>
              <InfoLabel>담당 지시자</InfoLabel>
              <InfoValue>{workOrder.supervisor}</InfoValue>
            </InfoRow>
          </InfoList>
        </Card>
      </ContentGrid>

      <StatusHistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} history={workOrder.statusHistory} />
      <SupervisorAssignModal
        open={supervisorModalOpen}
        onClose={() => setSupervisorModalOpen(false)}
        currentSupervisorId={workOrder.supervisorId}
        onAssign={handleAssignSupervisor}
        workOrders={workOrders}
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
