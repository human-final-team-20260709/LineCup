import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  FiPlus, FiSearch, FiClipboard, FiInbox, FiActivity, FiTarget, FiUsers,
  FiX, FiCheckCircle, FiBarChart2,
} from 'react-icons/fi';
import {
  Page, HeaderRow, TitleGroup, TitleLine, Title, LiveDot, Subtitle, HeaderActions, KpiGrid,
  KpiCard, KpiHeaderRow, KpiLabel, KpiIcon, KpiValueRow, KpiValue, KpiUnit,
  KpiFootRow, KpiTrendText, SparkWrap, ToolBar, FilterGroup, FilterChip, SearchBox,
  SearchInput, TableCard, TableHeaderRow, CountChip,
  ChartCard, ChartHeaderRow, ChartTitle, ChartLegendRow, ChartLegendItem, ChartLegendSwatch,
  ChartFrame, ChartTooltipBox, ChartTooltipTitle, ChartTooltipRow, ChartTooltipDot,
  ChartTooltipLabel, ChartTooltipValue, Table, Th, Tr, Td, QtyCell, QtySub, Badge, BadgeDot, ProgressRow,
  ProgressTrack, ProgressFill, ProgressRate, StyledButton, EmptyWrap, EmptyIconCircle,
  EmptyTitle, EmptyDesc, EmptyActionBtn, ToggleWrap, ToggleLabel, ToggleSwitch, ToggleKnob,
  Toast, ToastText, ModalOverlay, ModalPanel, ModalHeader, ModalTitle, ModalCloseBtn,
  ModalBody, ModalFooter, FieldGrid, Field, Label, Select, Input, Textarea, ErrorText,
  PickerRow, PickerButton, Chip, PickerSearchBox, PickerSearchInput, PickerList,
  PickerListRow, PickerRadioDot, PickerInfo, PickerName, PickerMeta, PickerTaskLoad,
  tokens,
} from './WorkOrderListCss';
import {
  createWaitingWorkOrder,
  DUMMY_PRODUCTS as dummyProducts,
  DUMMY_SUPERVISORS as dummySupervisors,
  WORK_ORDER_STATUS,
  WORK_ORDER_STATUS_META,
} from './workOrderData';

const WORK_ORDER_FILTERS = [
  { key: 'ALL', label: '전체', accent: '#4be277' },
  { key: WORK_ORDER_STATUS.WAITING, label: '대기', accent: '#bccbb9' },
  { key: WORK_ORDER_STATUS.IN_PROGRESS, label: '진행중', accent: '#4be277' },
  { key: WORK_ORDER_STATUS.HOLD, label: '보류', accent: '#ffb95f' },
  { key: WORK_ORDER_STATUS.DONE, label: '완료', accent: '#bccbb9' },
];

// 상단 KPI 카드용 참고 트렌드(최근 7일, 장식용 더미 수치)
const totalTrend = [4, 5, 5, 6, 5, 7, 6];
const inProgressTrend = [1, 2, 2, 3, 2, 3, 2];

const schema = yup.object({
  productId: yup.string().required('제품을 선택해 주세요.'),
  targetQty: yup.number().typeError('목표 수량을 입력해 주세요.').positive('0보다 큰 값을 입력해 주세요.').required('목표 수량을 입력해 주세요.'),
  startDate: yup.string().required('작업 시작 예정일을 선택해 주세요.'),
  supervisorId: yup.string().required('지시자를 배정해 주세요.'),
  remark: yup.string(),
});

/* =========================================================
 * 로컬 UI 부품 (다른 파일에서 import 하지 않고 이 파일 안에서만 사용)
 * ========================================================= */
const Button = ({ variant = 'primary', children, ...rest }) => (
  <StyledButton $variant={variant} {...rest}>
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

const EmptyState = ({ icon, title, description, actionLabel, onAction }) => (
  <EmptyWrap>
    <EmptyIconCircle>{icon ?? <FiInbox size={22} />}</EmptyIconCircle>
    <EmptyTitle>{title}</EmptyTitle>
    <EmptyDesc>{description}</EmptyDesc>
    {actionLabel && onAction && (
      <EmptyActionBtn type="button" onClick={onAction}>
        {actionLabel}
      </EmptyActionBtn>
    )}
  </EmptyWrap>
);

const DummyDataToggle = ({ checked, onChange }) => (
  <ToggleWrap>
    <ToggleLabel>더미 데이터</ToggleLabel>
    <ToggleSwitch $on={checked} onClick={() => onChange(!checked)} type="button">
      <ToggleKnob $on={checked} />
    </ToggleSwitch>
    <ToggleLabel $muted>{checked ? '있음' : '없음'}</ToggleLabel>
  </ToggleWrap>
);

/* DESIGN.md "Sparklines" — 축 없는 소형 모노크롬 트렌드 라인 */
const Sparkline = ({ data = [], color = '#4be277', width = 92, height = 28 }) => {
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

/* 차트 커스텀 툴팁 — 막대 색과 무관하게 항상 잘 보이는 고정 텍스트 색을 사용 */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <ChartTooltipBox>
      <ChartTooltipTitle>{label}</ChartTooltipTitle>
      {payload.map((entry) => (
        <ChartTooltipRow key={entry.dataKey}>
          <ChartTooltipDot $color={entry.dataKey === '실적' ? tokens.colors.primary : tokens.colors.outline} />
          <ChartTooltipLabel>{entry.dataKey}</ChartTooltipLabel>
          <ChartTooltipValue>{Number(entry.value).toLocaleString()} EA</ChartTooltipValue>
        </ChartTooltipRow>
      ))}
    </ChartTooltipBox>
  );
};

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

/* 지시자 배정 선택 모달 (등록 폼 내부에서 사용) */
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
        map[wo.supervisor] = (map[wo.supervisor] || 0) + 1;
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
            const taskCount = taskCountBySupervisor[supervisor.name] || 0;
            return (
              <PickerListRow key={supervisor.id} $active={selected === supervisor.id} onClick={() => setSelected(supervisor.id)}>
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
              </PickerListRow>
            );
          })}
        </PickerList>
      )}
    </ModalBase>
  );
};

/* README 3.3 작업지시 등록 — 목록 페이지 위에 모달로 표시 */
const CreateWorkOrderModal = ({ open, onClose, onCreated, workOrders }) => {
  const [supervisorModalOpen, setSupervisorModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { productId: '', targetQty: '', startDate: '', supervisorId: '', supervisorName: '', remark: '' },
  });

  const supervisorName = watch('supervisorName');

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const onSubmit = (values) => {
    onCreated?.(createWaitingWorkOrder(values, workOrders));
    handleClose();
  };

  return (
    <ModalBase
      open={open}
      onClose={handleClose}
      title="작업지시 등록"
      width="640px"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)}>
            작업지시 등록
          </Button>
        </>
      }
    >
      <FieldGrid as="form" onSubmit={handleSubmit(onSubmit)}>
        <Field>
          <Label>제품 선택</Label>
          <Select {...register('productId')} defaultValue="">
            <option value="" disabled>
              제품을 선택하세요
            </option>
            {dummyProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
          {errors.productId && <ErrorText>{errors.productId.message}</ErrorText>}
        </Field>

        <Field>
          <Label>생산 목표 수량 (EA)</Label>
          <Input type="number" min={1} placeholder="예: 5000" {...register('targetQty')} />
          {errors.targetQty && <ErrorText>{errors.targetQty.message}</ErrorText>}
        </Field>

        <Field>
          <Label>작업 시작 예정일</Label>
          <Input type="date" {...register('startDate')} />
          {errors.startDate && <ErrorText>{errors.startDate.message}</ErrorText>}
        </Field>

        <Field>
          <Label>지시자 배정</Label>
          <PickerRow>
            <PickerButton type="button" onClick={() => setSupervisorModalOpen(true)}>
              <FiUsers size={14} />
              {supervisorName ? '지시자 변경' : '지시자 선택'}
            </PickerButton>
            {supervisorName && <Chip>{supervisorName}</Chip>}
          </PickerRow>
          <input type="hidden" {...register('supervisorId')} />
          {errors.supervisorId && <ErrorText>{errors.supervisorId.message}</ErrorText>}
        </Field>

        <Field $span2>
          <Label>비고</Label>
          <Textarea rows={3} placeholder="작업지시에 대한 참고 사항을 입력하세요." {...register('remark')} />
        </Field>
      </FieldGrid>

      <SupervisorAssignModal
        open={supervisorModalOpen}
        onClose={() => setSupervisorModalOpen(false)}
        onAssign={(supervisor) => {
          setValue('supervisorId', supervisor.id, { shouldValidate: true });
          setValue('supervisorName', supervisor.name);
        }}
        workOrders={workOrders}
      />
    </ModalBase>
  );
};

/* =========================================================
 * WorkOrderList (README 3.1 목록 + 3.3 등록 모달)
 * ========================================================= */
const WorkOrderList = ({ view = 'table', workOrders, setWorkOrders }) => {
  const navigate = useNavigate();
  const [hasData, setHasData] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [keyword, setKeyword] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [justAddedId, setJustAddedId] = useState(null);
  const [toast, setToast] = useState(null);

  const sourceData = useMemo(() => (hasData ? workOrders : []), [hasData, workOrders]);

  const filtered = useMemo(() => {
    return sourceData.filter((wo) => {
      const matchStatus = statusFilter === 'ALL' || wo.status === statusFilter;
      const trimmed = keyword.trim().toLowerCase();
      const matchKeyword =
        trimmed === '' ||
        wo.productName.toLowerCase().includes(trimmed) ||
        wo.code.toLowerCase().includes(trimmed);
      return matchStatus && matchKeyword;
    });
  }, [sourceData, statusFilter, keyword]);

  // 작업지시별 생산 목표 vs 실적 차트용 데이터
  const chartData = useMemo(
    () =>
      filtered.map((wo) => ({
        // 같은 제품명의 작업지시가 여러 건 있을 수 있어(예: "얼큰 컵누들" 재생산),
        // 막대를 서로 구분할 수 있도록 작업지시 번호를 라벨에 함께 표기합니다.
        name: `${wo.productName} (${wo.id})`,
        code: wo.code,
        목표: wo.targetQty,
        실적: wo.currentQty,
      })),
    [filtered]
  );

  // KPI는 현재 필터/검색 결과(filtered) 기준으로 집계 — 대시보드의 "전체 요약"과
  // 구분되도록, 이 화면에서 지금 보고 있는 목록에 대한 요약으로 동작합니다.
  // KPI는 전체 작업지시 기준으로 고정 집계 (필터에 반응하지 않음).
  // 카드 클릭 시 필터를 적용하는 기능은 유지하되, 숫자 자체는 필터와 무관하게 항상 전체 기준입니다.
  const kpi = useMemo(() => {
    const total = workOrders.length;
    const inProgress = workOrders.filter((wo) => wo.status === WORK_ORDER_STATUS.IN_PROGRESS).length;
    const active = workOrders.filter((wo) =>
      [WORK_ORDER_STATUS.IN_PROGRESS, WORK_ORDER_STATUS.HOLD].includes(wo.status)
    );
    const avgRate =
      active.length > 0
        ? Math.round(active.reduce((sum, wo) => sum + Math.min(100, (wo.currentQty / wo.targetQty) * 100), 0) / active.length)
        : 0;
    return { total, inProgress, avgRate };
  }, [workOrders]);

  const handleCreated = (newWorkOrder) => {
    setWorkOrders((prev) => [newWorkOrder, ...prev]);
    setJustAddedId(newWorkOrder.id);
    setToast(`${newWorkOrder.code} 작업지시가 등록되었습니다.`);
    window.setTimeout(() => setJustAddedId(null), 1600);
    window.setTimeout(() => setToast(null), 3200);
  };

  return (
    <Page>
      <HeaderRow>
        <TitleGroup>
          <TitleLine>
            <Title>작업지시 목록</Title>
            <LiveDot title="실시간 반영" />
          </TitleLine>
          <Subtitle>등록된 작업지시를 조회하고, 새 작업지시를 등록할 수 있습니다.</Subtitle>
        </TitleGroup>
        <HeaderActions>
          <DummyDataToggle checked={hasData} onChange={setHasData} />
          <Button variant="primary" onClick={() => setCreateOpen(true)}>
            <FiPlus size={16} />
            작업지시 등록
          </Button>
        </HeaderActions>
      </HeaderRow>

      <KpiGrid>
        <KpiCard
          $delay={0}
          $accent="#4be277"
          $clickable
          $selected={statusFilter === 'ALL'}
          role="button"
          tabIndex={0}
          aria-pressed={statusFilter === 'ALL'}
          onClick={() => setStatusFilter('ALL')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setStatusFilter('ALL')}
        >
          <KpiHeaderRow>
            <KpiLabel>전체 작업지시</KpiLabel>
            <KpiIcon $color="#4be277">
              <FiClipboard size={16} />
            </KpiIcon>
          </KpiHeaderRow>
          <KpiValueRow>
            <KpiValue>{kpi.total}</KpiValue>
            <KpiUnit>건</KpiUnit>
          </KpiValueRow>
          <KpiFootRow>
            <KpiTrendText $color="#4be277">최근 7일 추이</KpiTrendText>
            <Sparkline data={totalTrend} color="#4be277" />
          </KpiFootRow>
        </KpiCard>

        <KpiCard
          $delay={80}
          $accent="#4be277"
          $clickable
          $selected={statusFilter === WORK_ORDER_STATUS.IN_PROGRESS}
          role="button"
          tabIndex={0}
          aria-pressed={statusFilter === WORK_ORDER_STATUS.IN_PROGRESS}
          onClick={() => setStatusFilter(WORK_ORDER_STATUS.IN_PROGRESS)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setStatusFilter(WORK_ORDER_STATUS.IN_PROGRESS)}
        >
          <KpiHeaderRow>
            <KpiLabel>진행중</KpiLabel>
            <KpiIcon $color="#4be277">
              <FiActivity size={16} />
            </KpiIcon>
          </KpiHeaderRow>
          <KpiValueRow>
            <KpiValue $color="#4be277">{kpi.inProgress}</KpiValue>
            <KpiUnit>건</KpiUnit>
          </KpiValueRow>
          <KpiFootRow>
            <KpiTrendText $color="#4be277">최근 7일 추이</KpiTrendText>
            <Sparkline data={inProgressTrend} color="#4be277" />
          </KpiFootRow>
        </KpiCard>

        <KpiCard $delay={160} $accent="#ffb95f">
          <KpiHeaderRow>
            <KpiLabel>목표 대비 평균 진행률</KpiLabel>
            <KpiIcon $color="#ffb95f">
              <FiTarget size={16} />
            </KpiIcon>
          </KpiHeaderRow>
          <KpiValueRow>
            <KpiValue $color="#ffb95f">{kpi.avgRate}</KpiValue>
            <KpiUnit>%</KpiUnit>
          </KpiValueRow>
          <KpiFootRow>
            <ProgressBar value={kpi.avgRate} max={100} color="#ffb95f" />
          </KpiFootRow>
        </KpiCard>

      </KpiGrid>

      <ToolBar>
        <FilterGroup>
          {WORK_ORDER_FILTERS.map((f) => (
            <FilterChip
              key={f.key}
              type="button"
              $active={statusFilter === f.key}
              $accent={f.accent}
              onClick={() => setStatusFilter(f.key)}
            >
              {f.label}
            </FilterChip>
          ))}
        </FilterGroup>
        <SearchBox>
          <FiSearch size={16} />
          <SearchInput
            placeholder="작업지시 번호 또는 제품명 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </SearchBox>
      </ToolBar>

      {view === 'table' ? (
        <TableCard>
          <TableHeaderRow>
            <KpiLabel as="span">작업지시 목록</KpiLabel>
            <CountChip>{filtered.length}건 표시 중</CountChip>
          </TableHeaderRow>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<FiClipboard size={22} />}
              title={hasData ? '검색 조건에 맞는 작업지시가 없습니다' : '등록된 작업지시가 없습니다'}
              description={
                hasData
                  ? '필터나 검색어를 변경해 다시 시도해 보세요.'
                  : '작업지시를 등록하면 이 목록에 표시됩니다.'
              }
              actionLabel={hasData ? undefined : '작업지시 등록하기'}
              onAction={hasData ? undefined : () => setCreateOpen(true)}
            />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>작업지시 번호</Th>
                  <Th>제품명</Th>
                  <Th>작업 상태</Th>
                  <Th $wide>생산 수량(현재/목표)</Th>
                  <Th>담당 지시자</Th>
                  <Th>시작 예정일</Th>
                  <Th>등록일</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((wo, idx) => {
                  const meta = WORK_ORDER_STATUS_META[wo.status];
                  return (
                    <Tr
                      key={wo.id}
                      $delay={idx * 35}
                      $justAdded={wo.id === justAddedId}
                      onClick={() => navigate(`/work-orders/${wo.id}`)}
                    >
                      <Td $mono>{wo.code}</Td>
                      <Td>{wo.productName}</Td>
                      <Td>
                        <StatusBadge label={meta.label} color={meta.color} />
                      </Td>
                      <Td>
                        <QtyCell>
                          <ProgressBar value={wo.currentQty} max={wo.targetQty} color={meta.color} />
                          <QtySub>
                            {wo.currentQty.toLocaleString()} / {wo.targetQty.toLocaleString()} EA
                          </QtySub>
                        </QtyCell>
                      </Td>
                      <Td>{wo.supervisor}</Td>
                      <Td $mono>{wo.startDate}</Td>
                      <Td $mono>{wo.regDate}</Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </TableCard>
      ) : (
        <ChartCard>
          <ChartHeaderRow>
            <ChartTitle>작업지시별 생산 목표 vs 실적</ChartTitle>
            <ChartLegendRow>
              <ChartLegendItem>
                <ChartLegendSwatch $color={tokens.colors.surfaceContainerHigh} />
                목표
              </ChartLegendItem>
              <ChartLegendItem>
                <ChartLegendSwatch $color={tokens.colors.primary} />
                실적
              </ChartLegendItem>
            </ChartLegendRow>
          </ChartHeaderRow>

          {chartData.length === 0 ? (
            <EmptyState
              icon={<FiBarChart2 size={22} />}
              title={hasData ? '검색 조건에 맞는 작업지시가 없습니다' : '등록된 작업지시가 없습니다'}
              description={
                hasData
                  ? '필터나 검색어를 변경해 다시 시도해 보세요.'
                  : '작업지시를 등록하면 차트에 표시됩니다.'
              }
              actionLabel={hasData ? undefined : '작업지시 등록하기'}
              onAction={hasData ? undefined : () => setCreateOpen(true)}
            />
          ) : (
            <ChartFrame>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }} barGap={4}>
                  <CartesianGrid vertical={false} stroke={tokens.colors.outlineVariant} strokeDasharray="3 4" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: tokens.colors.onSurfaceVariant, fontSize: 12, fontFamily: 'Inter' }}
                    axisLine={{ stroke: tokens.colors.outlineVariant }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: tokens.colors.onSurfaceVariant, fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    axisLine={false}
                    tickLine={false}
                    width={56}
                  />
                  <Tooltip cursor={{ fill: tokens.colors.surfaceContainerHigh }} content={<ChartTooltip />} />
                  <Bar dataKey="목표" fill={tokens.colors.surfaceContainerHigh} stroke={tokens.colors.outline} radius={[3, 3, 0, 0]} minPointSize={2} />
                  <Bar dataKey="실적" fill={tokens.colors.primary} radius={[3, 3, 0, 0]} minPointSize={2} />
                </BarChart>
              </ResponsiveContainer>
            </ChartFrame>
          )}
        </ChartCard>
      )}

      <CreateWorkOrderModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={handleCreated} workOrders={workOrders} />

      {toast && (
        <Toast>
          <FiCheckCircle size={18} color="#4be277" />
          <ToastText>{toast}</ToastText>
        </Toast>
      )}
    </Page>
  );
};

export default WorkOrderList;
