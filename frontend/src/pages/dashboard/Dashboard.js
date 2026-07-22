import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiInbox,
  FiRadio,
  FiTarget,
  FiTrendingUp,
  FiWifi,
  FiWifiOff,
} from 'react-icons/fi';
import {
  AlarmCount,
  AlarmRow,
  AlarmSummary,
  ChartBody,
  CompactList,
  CommunicationSummary,
  ConnectionCard,
  ConnectionList,
  ConnectionRow,
  DashboardGrid,
  DividerLabel,
  EmptyState,
  Eyebrow,
  KpiCard,
  KpiGrid,
  KpiHead,
  KpiMeta,
  KpiValue,
  LiveDot,
  LiveStatus,
  Page,
  PageHeader,
  Panel,
  PanelHeader,
  PanelLabel,
  PanelMeta,
  PerformanceSummary,
  ProcessHead,
  ProcessItem,
  ProcessList,
  ProgressFill,
  ProgressTrack,
  StatusChip,
  StatusRow,
  SummaryCell,
  TitleGroup,
  TooltipBox,
  TooltipKey,
  TooltipRow,
  TooltipTitle,
  VisuallyHidden,
  WorkerMetric,
  WorkerSummary,
  chartColors,
} from './DashboardCss';

const WORKERS = [
  { id: 'WK-001', name: '김민준', process: '배합', team: '생산 1팀', status: 'working' },
  { id: 'WK-002', name: '박서연', process: '제면', team: '생산 1팀', status: 'working' },
  { id: 'WK-003', name: '이도윤', process: '유탕', team: '생산 2팀', status: 'break' },
  { id: 'WK-004', name: '최지우', process: '포장', team: '포장팀', status: 'working' },
  { id: 'WK-005', name: '정하준', process: '검사', team: '품질팀', status: 'off' },
  { id: 'WK-006', name: '한수빈', process: '증숙', team: '생산 2팀', status: 'break' },
];

const WORKER_STATUS = {
  working: { label: '근무 중', tone: 'success' },
  break: { label: '휴식 중', tone: 'warning' },
  off: { label: '비근무', tone: 'neutral' },
};

const HOURLY_PRODUCTION = [
  { time: '08:00', target: 540, production: 510 },
  { time: '09:00', target: 620, production: 598 },
  { time: '10:00', target: 680, production: 655 },
  { time: '11:00', target: 720, production: 704 },
  { time: '12:00', target: 420, production: 386 },
  { time: '13:00', target: 690, production: 642 },
  { time: '14:00', target: 740, production: 701 },
  { time: '15:00', target: 760, production: 718 },
];

const CURRENT_ALARMS = [
  {
    id: 'ALM-260713-018',
    occurredAt: '14:28:15',
    equipment: 'STEAMER-01 증숙기 1호',
    message: '스팀 압력 상한 초과',
    severity: 'critical',
  },
  {
    id: 'ALM-260713-017',
    occurredAt: '14:22:41',
    equipment: 'FRYER-01 유탕기 1호',
    message: '수집기 응답 타임아웃',
    severity: 'warning',
  },
  {
    id: 'ALM-260713-016',
    occurredAt: '14:10:08',
    equipment: 'PACKER-01 포장기 1호',
    message: '필름 텐션 제어부 온도 경고',
    severity: 'warning',
  },
  {
    id: 'ALM-260713-015',
    occurredAt: '13:54:32',
    equipment: 'INSPECTOR-01 검사기 1호',
    message: '제품 중량 검사값 변동 감지',
    severity: 'info',
  },
];

const ALARM_SEVERITY = {
  critical: { label: '심각', tone: 'alarm' },
  warning: { label: '경고', tone: 'warning' },
  info: { label: '정보', tone: 'info' },
};

const COMMUNICATION_STATUS = {
  l2: { name: 'L2 수집기', status: 'connected', lastReceivedAt: '14:32:07' },
  devices: [
    { id: 'MIXER-01', name: '혼합기 1호', status: 'connected', lastReceivedAt: '14:32:07' },
    { id: 'ROLLER-01', name: '압연기 1호', status: 'connected', lastReceivedAt: '14:32:05' },
    { id: 'NOODLE-01', name: '제면기 1호', status: 'connected', lastReceivedAt: '14:32:06' },
    { id: 'STEAMER-01', name: '증숙기 1호', status: 'connected', lastReceivedAt: '14:31:58' },
    { id: 'CUTTER-01', name: '절단기 1호', status: 'connected', lastReceivedAt: '14:32:04' },
    { id: 'FRYER-01', name: '유탕기 1호', status: 'disconnected', lastReceivedAt: '14:22:41' },
    { id: 'COOLER-01', name: '냉각기 1호', status: 'connected', lastReceivedAt: '14:32:02' },
    { id: 'PACKER-01', name: '포장기 1호', status: 'connected', lastReceivedAt: '14:32:03' },
    { id: 'INSPECTOR-01', name: '검사기 1호', status: 'connected', lastReceivedAt: '14:32:01' },
  ],
};

const ACTIVE_ORDER_STATUSES = new Set(['IN_PROGRESS', 'HOLD']);

const numberOrZero = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const percentage = (value, total) => (
  total > 0 ? Math.round((value / total) * 1000) / 10 : 0
);

const formatNumber = (value) => numberOrZero(value).toLocaleString('ko-KR');

const getEfficiencyTone = (efficiency, total) => {
  if (total === 0) return 'neutral';
  if (efficiency >= 98) return 'success';
  if (efficiency >= 95) return 'warning';
  return 'alarm';
};

function DashboardTooltip({ active, label, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const tooltipLabel = payload[0]?.payload?.productName || label;

  return (
    <TooltipBox>
      <TooltipTitle>{tooltipLabel}</TooltipTitle>
      {payload.map((entry) => (
        <TooltipRow key={entry.dataKey}>
          <TooltipKey $color={entry.color}>{entry.name}</TooltipKey>
          <strong>{formatNumber(entry.value)} EA</strong>
        </TooltipRow>
      ))}
    </TooltipBox>
  );
}

function Dashboard({ workOrders = [] }) {
  const navigate = useNavigate();

  const openAlarmDetail = (alarmId) => {
    navigate(`/alarm/detail/${alarmId}`);
  };

  const summary = useMemo(
    () => workOrders.reduce(
      (result, order) => ({
        target: result.target + numberOrZero(order.targetQty),
        production: result.production + numberOrZero(order.currentQty),
        good: result.good + numberOrZero(order.goodQty),
        defect: result.defect + numberOrZero(order.defectQty),
      }),
      { target: 0, production: 0, good: 0, defect: 0 },
    ),
    [workOrders],
  );

  const achievementRate = percentage(summary.production, summary.target);
  const qualityRate = percentage(summary.good, summary.good + summary.defect);

  const processEfficiency = useMemo(() => {
    const processMap = new Map();

    workOrders
      .filter((order) => ACTIVE_ORDER_STATUSES.has(order.status))
      .forEach((order) => {
        (order.processes || []).forEach((process) => {
          const current = processMap.get(process.name) || {
            name: process.name,
            good: 0,
            defect: 0,
          };

          current.good += numberOrZero(process.goodQty);
          current.defect += numberOrZero(process.defectQty);
          processMap.set(process.name, current);
        });
      });

    return Array.from(processMap.values()).map((process) => {
      const total = process.good + process.defect;
      const efficiency = percentage(process.good, total);

      return {
        ...process,
        total,
        efficiency,
        tone: getEfficiencyTone(efficiency, total),
      };
    });
  }, [workOrders]);

  const performanceChartData = useMemo(
    () => workOrders.map((order) => ({
      name: order.id,
      productName: order.productName,
      target: numberOrZero(order.targetQty),
      production: numberOrZero(order.currentQty),
    })),
    [workOrders],
  );

  const workerCounts = useMemo(
    () => WORKERS.reduce(
      (counts, worker) => ({
        ...counts,
        [worker.status]: counts[worker.status] + 1,
      }),
      { working: 0, break: 0, off: 0 },
    ),
    [],
  );

  const alarmCounts = useMemo(
    () => CURRENT_ALARMS.reduce(
      (counts, alarm) => ({
        ...counts,
        [alarm.severity]: counts[alarm.severity] + 1,
      }),
      { critical: 0, warning: 0, info: 0 },
    ),
    [],
  );

  const connectedDevices = COMMUNICATION_STATUS.devices.filter(
    (device) => device.status === 'connected',
  ).length;

  const loadedAt = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());

  const kpis = [
    {
      label: '생산 목표',
      value: formatNumber(summary.target),
      unit: 'EA',
      meta: `${workOrders.length}개 작업지시 합계`,
      icon: FiTarget,
      tone: 'neutral',
    },
    {
      label: '현재 생산량',
      value: formatNumber(summary.production),
      unit: 'EA',
      meta: `목표 대비 ${achievementRate}%`,
      icon: FiActivity,
      tone: 'success',
    },
    {
      label: '달성률',
      value: achievementRate,
      unit: '%',
      meta: summary.target > 0 ? '전체 작업지시 기준' : '집계할 작업지시 없음',
      icon: FiTrendingUp,
      tone: achievementRate >= 90 ? 'success' : 'warning',
    },
    {
      label: '정상 수량',
      value: formatNumber(summary.good),
      unit: 'EA',
      meta: `양품률 ${qualityRate}%`,
      icon: FiCheckCircle,
      tone: 'success',
    },
    {
      label: '불량 수량',
      value: formatNumber(summary.defect),
      unit: 'EA',
      meta: `전체 생산 중 ${percentage(summary.defect, summary.good + summary.defect)}%`,
      icon: FiAlertTriangle,
      tone: summary.defect > 0 ? 'alarm' : 'neutral',
    },
  ];

  return (
    <Page>
      <PageHeader>
        <TitleGroup>
          <Eyebrow>Production Control Center</Eyebrow>
          <h1>메인 대시보드</h1>
          <p>생산라인 핵심 지표와 현장 상태를 통합 모니터링합니다.</p>
        </TitleGroup>
        <LiveStatus aria-label={`모니터링 정상, ${loadedAt} 기준`}>
          <LiveDot aria-hidden="true" />
          <div>
            <strong>Live Monitoring</strong>
            <span>{loadedAt} KST</span>
          </div>
        </LiveStatus>
      </PageHeader>

      <KpiGrid aria-label="생산 실적 요약">
        {kpis.map(({ label, value, unit, meta, icon: Icon, tone }, index) => (
          <KpiCard key={label} $tone={tone} $delay={index * 45}>
            <KpiHead $tone={tone}>
              <span>{label}</span>
              <Icon aria-hidden="true" />
            </KpiHead>
            <KpiValue>{value}<small>{unit}</small></KpiValue>
            <KpiMeta>{meta}</KpiMeta>
          </KpiCard>
        ))}
      </KpiGrid>

      <DashboardGrid>
        <Panel $span={8} $tabletSpan={12} aria-labelledby="hourly-production-title">
          <PanelHeader>
            <div>
              <PanelLabel>Hourly Production</PanelLabel>
              <h2 id="hourly-production-title">시간별 생산현황</h2>
            </div>
            <PanelMeta>08:00—15:00 · EA</PanelMeta>
          </PanelHeader>
          <ChartBody
            role="img"
            aria-label="시간별 목표 수량과 생산 실적 비교 차트"
            $height={302}
          >
            <VisuallyHidden>
              시간별 생산 실적은 08시 510개에서 15시 718개까지 집계되었습니다.
            </VisuallyHidden>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={HOURLY_PRODUCTION} margin={{ top: 8, right: 16, left: 4, bottom: 4 }}>
                <CartesianGrid stroke={chartColors.surfaceHigh} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" stroke={chartColors.dim} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis stroke={chartColors.dim} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={48} />
                <Tooltip cursor={{ fill: 'rgba(75, 226, 119, 0.05)' }} content={<DashboardTooltip />} />
                <Legend iconType="square" iconSize={8} />
                <Bar dataKey="target" name="시간 목표" fill={chartColors.surfaceHigh} stroke={chartColors.dim} radius={[3, 3, 0, 0]} />
                <Line dataKey="production" name="생산 실적" type="monotone" stroke={chartColors.primary} strokeWidth={2.5} dot={{ r: 3, fill: chartColors.primary }} activeDot={{ r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartBody>
        </Panel>

        <Panel $span={4} $tabletSpan={12} aria-labelledby="performance-title">
          <PanelHeader>
            <div>
              <PanelLabel>Performance</PanelLabel>
              <h2 id="performance-title">작업지시 실적</h2>
            </div>
            <PanelMeta>{workOrders.length} ORDERS</PanelMeta>
          </PanelHeader>
          <PerformanceSummary>
            <SummaryCell>
              <span>총 생산량</span>
              <strong>{formatNumber(summary.production)} EA</strong>
            </SummaryCell>
            <SummaryCell $tone={summary.defect > 0 ? 'alarm' : 'success'}>
              <span>양품률</span>
              <strong>{qualityRate}%</strong>
            </SummaryCell>
          </PerformanceSummary>
          {performanceChartData.length ? (
            <ChartBody role="img" aria-label="작업지시별 목표 대비 생산 실적 차트" $height={250}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceChartData} layout="vertical" margin={{ top: 4, right: 12, left: 2, bottom: 4 }}>
                  <CartesianGrid stroke={chartColors.surfaceHigh} strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke={chartColors.dim} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke={chartColors.dim} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={58} />
                  <Tooltip cursor={{ fill: 'rgba(75, 226, 119, 0.05)' }} content={<DashboardTooltip />} />
                  <Bar dataKey="target" name="목표" fill={chartColors.surfaceHigh} radius={[0, 3, 3, 0]} />
                  <Bar dataKey="production" name="실적" fill={chartColors.primary} radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartBody>
          ) : (
            <EmptyState $compact>
              <FiInbox aria-hidden="true" />
              <strong>집계할 작업지시가 없습니다</strong>
              <span>작업지시가 등록되면 목표 대비 실적이 표시됩니다.</span>
            </EmptyState>
          )}
        </Panel>

        <Panel $span={4} $tabletSpan={6} aria-labelledby="worker-title">
          <PanelHeader>
            <div>
              <PanelLabel>Workforce</PanelLabel>
              <h2 id="worker-title">작업자 현황</h2>
            </div>
            <PanelMeta>{WORKERS.length} PERSONNEL</PanelMeta>
          </PanelHeader>
          <WorkerSummary>
            <WorkerMetric $tone="success"><strong>{workerCounts.working}</strong><span>근무 중</span></WorkerMetric>
            <WorkerMetric $tone="warning"><strong>{workerCounts.break}</strong><span>휴식 중</span></WorkerMetric>
            <WorkerMetric $tone="neutral"><strong>{workerCounts.off}</strong><span>비근무</span></WorkerMetric>
          </WorkerSummary>
          <CompactList>
            {WORKERS.map((worker) => {
              const status = WORKER_STATUS[worker.status];
              return (
                <StatusRow key={worker.id}>
                  <div><strong>{worker.name}</strong><small>{worker.id} · {worker.team}</small></div>
                  <span>{worker.process} 공정</span>
                  <StatusChip $tone={status.tone}>{status.label}</StatusChip>
                </StatusRow>
              );
            })}
          </CompactList>
        </Panel>

        <Panel $span={8} $tabletSpan={6} aria-labelledby="process-title">
          <PanelHeader>
            <div>
              <PanelLabel>Process Efficiency</PanelLabel>
              <h2 id="process-title">공정효율</h2>
            </div>
            <PanelMeta>GOOD ÷ TOTAL</PanelMeta>
          </PanelHeader>
          {processEfficiency.length ? (
            <ProcessList>
              {processEfficiency.map((process) => (
                <ProcessItem key={process.name}>
                  <ProcessHead $tone={process.tone}>
                    <div>
                      <strong>{process.name}</strong>
                      <small>정상 {formatNumber(process.good)} · 불량 {formatNumber(process.defect)} EA</small>
                    </div>
                    <span>{process.efficiency}%</span>
                  </ProcessHead>
                  <ProgressTrack aria-label={`${process.name} 공정효율 ${process.efficiency}%`}>
                    <ProgressFill $value={process.efficiency} $tone={process.tone} />
                  </ProgressTrack>
                </ProcessItem>
              ))}
            </ProcessList>
          ) : (
            <EmptyState $compact>
              <FiActivity aria-hidden="true" />
              <strong>진행 중인 공정이 없습니다</strong>
              <span>진행 또는 보류 작업지시의 공정 데이터가 표시됩니다.</span>
            </EmptyState>
          )}
        </Panel>

        <Panel $span={8} $tabletSpan={12} aria-labelledby="alarm-title">
          <PanelHeader>
            <div>
              <PanelLabel>Active Alarms</PanelLabel>
              <h2 id="alarm-title">현재 알람</h2>
            </div>
            <PanelMeta>{CURRENT_ALARMS.length} ACTIVE</PanelMeta>
          </PanelHeader>
          <AlarmSummary aria-label="심각도별 알람 수">
            <AlarmCount $tone="alarm"><span>심각</span><strong>{alarmCounts.critical}</strong></AlarmCount>
            <AlarmCount $tone="warning"><span>경고</span><strong>{alarmCounts.warning}</strong></AlarmCount>
            <AlarmCount $tone="info"><span>정보</span><strong>{alarmCounts.info}</strong></AlarmCount>
          </AlarmSummary>
          <CompactList>
            {CURRENT_ALARMS.map((alarm) => {
              const severity = ALARM_SEVERITY[alarm.severity];
              return (
                <AlarmRow
                  key={alarm.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${alarm.equipment} ${severity.label} 알람 상세 보기`}
                  onClick={() => openAlarmDetail(alarm.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openAlarmDetail(alarm.id);
                    }
                  }}
                >
                  <time dateTime={`2026-07-13T${alarm.occurredAt}`}>{alarm.occurredAt}</time>
                  <strong>{alarm.equipment}</strong>
                  <p title={alarm.message}>{alarm.message}</p>
                  <StatusChip $tone={severity.tone}>{severity.label}</StatusChip>
                </AlarmRow>
              );
            })}
          </CompactList>
        </Panel>

        <Panel $span={4} $tabletSpan={12} aria-labelledby="communication-title">
          <PanelHeader>
            <div>
              <PanelLabel>Communication</PanelLabel>
              <h2 id="communication-title">통신현황</h2>
            </div>
            <PanelMeta>{connectedDevices}/{COMMUNICATION_STATUS.devices.length} ONLINE</PanelMeta>
          </PanelHeader>
          <CommunicationSummary>
            <ConnectionCard $tone={connectedDevices === COMMUNICATION_STATUS.devices.length ? 'success' : 'warning'}>
              {connectedDevices === COMMUNICATION_STATUS.devices.length
                ? <FiWifi aria-hidden="true" />
                : <FiWifiOff aria-hidden="true" />}
              <strong>{connectedDevices}/{COMMUNICATION_STATUS.devices.length}</strong>
              <span>L1 장비 연결</span>
            </ConnectionCard>
            <ConnectionCard $tone="success">
              <FiRadio aria-hidden="true" />
              <strong>RUNNING</strong>
              <span>{COMMUNICATION_STATUS.l2.name}</span>
            </ConnectionCard>
          </CommunicationSummary>
          <DividerLabel>Device Status</DividerLabel>
          <ConnectionList>
            {COMMUNICATION_STATUS.devices.map((device) => {
              const connected = device.status === 'connected';
              return (
                <ConnectionRow key={device.id}>
                  <div><strong>{device.id} · {device.name}</strong><small>LAST {device.lastReceivedAt}</small></div>
                  <StatusChip $tone={connected ? 'success' : 'alarm'}>
                    {connected ? '연결됨' : '연결 끊김'}
                  </StatusChip>
                </ConnectionRow>
              );
            })}
          </ConnectionList>
        </Panel>
      </DashboardGrid>
    </Page>
  );
}

export default Dashboard;
