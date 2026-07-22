import { useMemo } from 'react';
import {
  Bar,
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
  FiClock,
  FiClipboard,
  FiTarget,
  FiTrendingUp,
} from 'react-icons/fi';
import {
  ChartBody,
  EmptyState,
  Eyebrow,
  KpiCard,
  KpiGrid,
  KpiHead,
  KpiMeta,
  KpiValue,
  LiveDot,
  LiveStatus,
  MetricPair,
  Mono,
  OverviewGrid,
  Page,
  PageHeader,
  Panel,
  PanelHeader,
  PanelLabel,
  PanelMeta,
  ProcessHead,
  ProcessItem,
  ProcessList,
  ProgressFill,
  ProgressTrack,
  StatusChip,
  Table,
  TableWrap,
  TitleGroup,
  TooltipBox,
  TooltipKey,
  TooltipRow,
  TooltipTitle,
  VisuallyHidden,
  chartColors,
} from './ProductionOverviewPageCss';
import {
  PRODUCTION_BASE_DATE,
  PRODUCTION_STATUS,
  PRODUCTION_STATUS_LABEL,
  formatNumber,
  hourlyProduction,
  productionRecords,
  statusTone,
} from './productionData';

const IN_PROGRESS = PRODUCTION_STATUS.COLLECTING;
const CANCELED = PRODUCTION_STATUS.CANCELED;

const numberOrZero = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const percentage = (value, total) => (
  total > 0 ? Math.round((numberOrZero(value) / numberOrZero(total)) * 1000) / 10 : 0
);

const getKstDateKey = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());

const formatDateKey = (dateKey) => {
  const [year, month, day] = String(dateKey).split('-');
  return year && month && day ? `${year}. ${month}. ${day}.` : dateKey;
};

const isToday = (record, todayKey) => String(record.occurredAt || '').slice(0, 10) === todayKey;

function ProductionTooltip({ active, label, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <TooltipBox role="status" aria-live="polite">
      <TooltipTitle>{label}</TooltipTitle>
      {payload.map((entry) => (
        <TooltipRow key={entry.dataKey}>
          <TooltipKey $color={entry.color}>{entry.name}</TooltipKey>
          <strong>{formatNumber(entry.value)} EA</strong>
        </TooltipRow>
      ))}
    </TooltipBox>
  );
}

function ProductionOverviewPage() {
  const currentKstDateKey = getKstDateKey();
  const todayKey = productionRecords.some((record) => isToday(record, currentKstDateKey))
    ? currentKstDateKey
    : PRODUCTION_BASE_DATE;

  const todayRecords = useMemo(
    () => productionRecords.filter((record) => isToday(record, todayKey)),
    [todayKey],
  );

  const summary = useMemo(() => {
    const activeRecords = todayRecords.filter((record) => record.status !== CANCELED);
    const inProgressOrders = new Set(
      todayRecords
        .filter((record) => record.status === IN_PROGRESS)
        .map((record) => record.workOrder),
    );

    const target = activeRecords.reduce(
      (total, record) => total + numberOrZero(record.targetQty),
      0,
    );
    const production = activeRecords.reduce(
      (total, record) => total + numberOrZero(record.productionQty),
      0,
    );
    const good = activeRecords.reduce(
      (total, record) => total + numberOrZero(record.goodQty),
      0,
    );
    const defect = activeRecords.reduce(
      (total, record) => total + numberOrZero(record.defectQty),
      0,
    );

    return {
      target,
      production,
      good,
      defect,
      achievementRate: percentage(production, target),
      inProgressCount: inProgressOrders.size,
      recordCount: activeRecords.length,
    };
  }, [todayRecords]);

  const processPerformance = useMemo(() => {
    const processMap = new Map();

    todayRecords
      .filter((record) => record.status !== CANCELED)
      .forEach((record) => {
        const processName = record.process || '미지정 공정';
        const current = processMap.get(processName) || {
          process: processName,
          target: 0,
          production: 0,
          good: 0,
          defect: 0,
        };

        current.target += numberOrZero(record.targetQty);
        current.production += numberOrZero(record.productionQty);
        current.good += numberOrZero(record.goodQty);
        current.defect += numberOrZero(record.defectQty);
        processMap.set(processName, current);
      });

    return Array.from(processMap.values())
      .map((process) => ({
        ...process,
        achievementRate: percentage(process.production, process.target),
      }))
      .sort((a, b) => b.production - a.production);
  }, [todayRecords]);

  const recentProduction = useMemo(
    () => productionRecords
      .filter((record) => record.status !== CANCELED)
      .sort((a, b) => String(b.occurredAt).localeCompare(String(a.occurredAt)))
      .slice(0, 5),
    [],
  );

  const defectRate = percentage(summary.defect, summary.good + summary.defect);
  const kpis = [
    {
      label: '오늘 목표 수량',
      value: formatNumber(summary.target),
      unit: 'EA',
      meta: `취소 제외 ${todayRecords.filter((record) => record.status !== CANCELED).length}건 기준`,
      icon: FiTarget,
      tone: 'neutral',
    },
    {
      label: '오늘 생산 수량',
      value: formatNumber(summary.production),
      unit: 'EA',
      meta: `수집된 실적 ${summary.recordCount}건 반영`,
      icon: FiClipboard,
      tone: 'success',
    },
    {
      label: '오늘 정상 수량',
      value: formatNumber(summary.good),
      unit: 'EA',
      meta: `양품률 ${100 - defectRate}%`,
      icon: FiCheckCircle,
      tone: 'success',
    },
    {
      label: '오늘 불량 반영 수량',
      value: formatNumber(summary.defect),
      unit: 'EA',
      meta: `오늘 생산 대비 ${defectRate}%`,
      icon: FiAlertTriangle,
      tone: summary.defect > 0 ? 'warning' : 'neutral',
    },
    {
      label: '목표 달성률',
      value: summary.achievementRate,
      unit: '%',
      meta: summary.target > 0 ? '현재 생산 ÷ 오늘 목표' : '등록된 목표 수량 없음',
      icon: FiTrendingUp,
      tone: summary.achievementRate >= 100 ? 'success' : 'warning',
    },
    {
      label: '집계 중 작업지시 수',
      value: summary.inProgressCount,
      unit: '건',
      meta: '중복 작업지시 제외',
      icon: FiClock,
      tone: summary.inProgressCount > 0 ? 'info' : 'neutral',
    },
  ];

  const chartSummary = hourlyProduction.length
    ? `시간대별 생산량은 ${hourlyProduction[0].time}부터 ${hourlyProduction[hourlyProduction.length - 1].time}까지 표시됩니다.`
    : '표시할 시간대별 생산 데이터가 없습니다.';

  return (
    <Page>
      <PageHeader>
        <TitleGroup>
          <Eyebrow>Production Performance / Today</Eyebrow>
          <h1>생산 실적 현황</h1>
          <p>설비에서 수집되는 오늘의 생산량과 공정별 달성 현황을 실시간으로 확인합니다.</p>
        </TitleGroup>
        <LiveStatus aria-label={`${formatDateKey(todayKey)} 생산 실적 집계 기준`}>
          <LiveDot aria-hidden="true" />
          <div>
            <strong>오늘 실적 집계</strong>
            <span>{formatDateKey(todayKey)} · KST</span>
          </div>
        </LiveStatus>
      </PageHeader>

      <KpiGrid aria-label="오늘 생산 실적 요약">
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

      <OverviewGrid>
        <Panel $span={8} $tabletSpan={12} aria-labelledby="hourly-production-title">
          <PanelHeader>
            <div>
              <PanelLabel>Hourly Output</PanelLabel>
              <h2 id="hourly-production-title">시간대별 생산량</h2>
            </div>
            <PanelMeta>Today · EA</PanelMeta>
          </PanelHeader>
          {hourlyProduction.length ? (
            <ChartBody
              role="img"
              aria-label="시간대별 목표 수량과 생산량 비교 차트"
              $height={318}
            >
              <VisuallyHidden>{chartSummary}</VisuallyHidden>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={hourlyProduction}
                  margin={{ top: 10, right: 18, left: 4, bottom: 2 }}
                >
                  <CartesianGrid
                    stroke={chartColors.surfaceHigh}
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    stroke={chartColors.dim}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={chartColors.dim}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={52}
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip
                    cursor={false}
                    content={<ProductionTooltip />}
                  />
                  <Legend iconType="square" iconSize={8} />
                  <Bar
                    dataKey="production"
                    name="생산량"
                    fill={chartColors.primary}
                    radius={[3, 3, 0, 0]}
                    maxBarSize={34}
                  />
                  <Line
                    dataKey="target"
                    name="목표 수량"
                    type="monotone"
                    stroke={chartColors.warning}
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    dot={{ r: 3, fill: chartColors.warning, strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartBody>
          ) : (
            <EmptyState>
              <FiActivity aria-hidden="true" />
              <strong>시간대별 생산 데이터가 없습니다.</strong>
              <span>생산 실적이 수집되면 시간대별 추이가 표시됩니다.</span>
            </EmptyState>
          )}
        </Panel>

        <Panel $span={4} $tabletSpan={12} aria-labelledby="process-performance-title">
          <PanelHeader>
            <div>
              <PanelLabel>Process Performance</PanelLabel>
              <h2 id="process-performance-title">공정별 생산 실적</h2>
            </div>
            <PanelMeta>{processPerformance.length} PROCESSES</PanelMeta>
          </PanelHeader>
          {processPerformance.length ? (
            <ProcessList>
              {processPerformance.map((process) => (
                <ProcessItem key={process.process}>
                  <ProcessHead>
                    <div>
                      <strong>{process.process}</strong>
                      <small>
                        정상 {formatNumber(process.good)} · 불량 {formatNumber(process.defect)} EA
                      </small>
                    </div>
                    <MetricPair $tone={process.achievementRate >= 100 ? 'success' : 'warning'}>
                      <strong>{formatNumber(process.production)}</strong>
                      <span>{process.achievementRate}%</span>
                    </MetricPair>
                  </ProcessHead>
                  <ProgressTrack
                    role="progressbar"
                    aria-label={`${process.process} 목표 달성률`}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={Math.min(process.achievementRate, 100)}
                  >
                    <ProgressFill
                      $value={process.achievementRate}
                      $tone={process.achievementRate >= 100 ? 'success' : 'warning'}
                    />
                  </ProgressTrack>
                  <small>목표 {formatNumber(process.target)} EA</small>
                </ProcessItem>
              ))}
            </ProcessList>
          ) : (
            <EmptyState>
              <FiActivity aria-hidden="true" />
              <strong>공정별 생산 실적이 없습니다.</strong>
              <span>오늘 수집된 유효 생산 실적이 없습니다.</span>
            </EmptyState>
          )}
        </Panel>

        <Panel $span={12} aria-labelledby="recent-production-title">
          <PanelHeader>
            <div>
              <PanelLabel>Recent Production Records</PanelLabel>
              <h2 id="recent-production-title">최근 생산 실적</h2>
            </div>
            <PanelMeta>{recentProduction.length} RECORDS</PanelMeta>
          </PanelHeader>
          {recentProduction.length ? (
            <TableWrap tabIndex="0" aria-label="최근 생산 실적 표, 가로 스크롤 가능">
              <Table>
                <caption>최근 수집된 생산 실적 5건</caption>
                <thead>
                  <tr>
                    <th scope="col">발생 일시</th>
                    <th scope="col">실적 번호 / 작업지시</th>
                    <th scope="col">제품 / LOT</th>
                    <th scope="col">공정</th>
                    <th scope="col">생산 수량</th>
                    <th scope="col">정상 / 불량</th>
                    <th scope="col">집계 상태</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProduction.map((record) => (
                    <tr key={record.id}>
                      <td><Mono as="time">{record.occurredAt}</Mono></td>
                      <td>
                        <strong>{record.id}</strong>
                        <small>{record.workOrder}</small>
                      </td>
                      <td>
                        <strong>{record.product}</strong>
                        <small>{record.lot}</small>
                      </td>
                      <td>{record.process}</td>
                      <td><Mono>{formatNumber(record.productionQty)} EA</Mono></td>
                      <td>
                        <Mono>{formatNumber(record.goodQty)} / {formatNumber(record.defectQty)} EA</Mono>
                      </td>
                      <td>
                        <StatusChip $tone={statusTone[record.status]}>
                          {PRODUCTION_STATUS_LABEL[record.status]}
                        </StatusChip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          ) : (
            <EmptyState>
              <FiCheckCircle aria-hidden="true" />
              <strong>수집된 생산 실적이 없습니다.</strong>
              <span>생산이 시작되면 최근 실적이 이 영역에 표시됩니다.</span>
            </EmptyState>
          )}
        </Panel>
      </OverviewGrid>
    </Page>
  );
}

export default ProductionOverviewPage;
