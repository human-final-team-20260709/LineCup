import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
} from "recharts";
import {
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiClipboard,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";
import { productionApi, workOrderApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { currentKstDate, kstPeriod, toKst } from "../../api/time";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
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
  ProcessPageButton,
  ProcessPager,
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
} from "./ProductionOverviewPageCss";

const formatNumber = (value) =>
  new Intl.NumberFormat("ko-KR").format(Number(value) || 0);

const statusTone = {
  CANCELED: "alarm",
  COLLECTING: "info",
  COMPLETED: "success",
};

const percentTone = (value) => (Number(value) >= 100 ? "success" : "warning");
const PROCESS_PAGE_SIZE = 3;

function ProductionTooltip({ active, label, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

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

export default function ProductionOverviewPage() {
  const [processPage, setProcessPage] = useState(0);
  const periodKey = { scope: "today", date: currentKstDate() };
  const period = kstPeriod(1);
  const summaryQuery = useQuery({
    queryKey: queryKeys.productionSummary(periodKey),
    queryFn: () => productionApi.summary(period),
    refetchInterval: POLLING.PRODUCTION,
  });
  const recentQuery = useQuery({
    queryKey: queryKeys.productionResults({ recent: 5 }),
    queryFn: () => productionApi.recent({ limit: 5 }),
    refetchInterval: POLLING.PRODUCTION,
  });
  const hourlyQuery = useQuery({
    queryKey: queryKeys.hourlyProduction(periodKey),
    queryFn: () => productionApi.hourly(period),
    refetchInterval: POLLING.PRODUCTION,
  });
  const activeQuery = useQuery({
    queryKey: queryKeys.activeWorkOrder(),
    queryFn: workOrderApi.active,
    refetchInterval: POLLING.WORK_ORDER,
  });

  const summary = summaryQuery.data || {};
  const hourlyChartData = useMemo(
    () =>
      (hourlyQuery.data || [])
        .slice()
        .sort((first, second) =>
          String(first.bucketStart).localeCompare(String(second.bucketStart)),
        )
        .slice(-12)
        .map((row) => ({
          id: row.hourlyProductionId,
          time: toKst(row.bucketStart, "HH:mm"),
          target: Number(row.targetQty) || 0,
          production: Number(row.productionQty) || 0,
        })),
    [hourlyQuery.data],
  );
  const processes = activeQuery.data?.processes || [];
  const processPageCount = Math.max(
    1,
    Math.ceil(processes.length / PROCESS_PAGE_SIZE),
  );
  const visibleProcesses = processes.slice(
    processPage * PROCESS_PAGE_SIZE,
    (processPage + 1) * PROCESS_PAGE_SIZE,
  );
  const recent = recentQuery.data || [];
  const defectRate = Number(summary.defectRate) || 0;
  const achievementRate = Number(summary.achievementRate) || 0;
  const kpis = [
    {
      label: "오늘 목표 수량",
      value: formatNumber(summary.targetQty),
      unit: "EA",
      meta: `집계 실적 ${formatNumber(summary.recordCount)}건 기준`,
      icon: FiTarget,
      tone: "neutral",
    },
    {
      label: "오늘 생산 수량",
      value: formatNumber(summary.productionQty),
      unit: "EA",
      meta: "L2 시간 집계 반영",
      icon: FiClipboard,
      tone: "success",
    },
    {
      label: "오늘 정상 수량",
      value: formatNumber(summary.goodQty),
      unit: "EA",
      meta: `양품률 ${Math.max(0, 100 - defectRate).toFixed(1)}%`,
      icon: FiCheckCircle,
      tone: "success",
    },
    {
      label: "오늘 불량 수량",
      value: formatNumber(summary.defectQty),
      unit: "EA",
      meta: `오늘 생산 대비 ${defectRate}%`,
      icon: FiAlertTriangle,
      tone: Number(summary.defectQty) > 0 ? "warning" : "neutral",
    },
    {
      label: "목표 달성률",
      value: achievementRate,
      unit: "%",
      meta: "현재 생산 ÷ 오늘 목표",
      icon: FiTrendingUp,
      tone: percentTone(achievementRate),
    },
    {
      label: "집계 중 작업지시",
      value: formatNumber(summary.collectingCount),
      unit: "건",
      meta: "COLLECTING 상태 기준",
      icon: FiClock,
      tone: Number(summary.collectingCount) > 0 ? "info" : "neutral",
    },
  ];

  useEffect(() => {
    setProcessPage(0);
  }, [activeQuery.data?.summary.workOrderId]);

  useEffect(() => {
    setProcessPage((current) => Math.min(current, processPageCount - 1));
  }, [processPageCount]);

  return (
    <Page>
      <PageHeader>
        <TitleGroup>
          <Eyebrow>Production Performance / Today</Eyebrow>
          <h1>생산 실적 현황</h1>
          <p>1시간·보류·완료 집계 데이터를 60초마다 갱신합니다.</p>
        </TitleGroup>
        <LiveStatus aria-label={`${currentKstDate()} 생산 실적 집계 기준`}>
          <LiveDot aria-hidden="true" />
          <div>
            <strong>오늘 실적 집계</strong>
            <span>{currentKstDate()} · KST</span>
          </div>
        </LiveStatus>
      </PageHeader>

      <QueryStatus query={summaryQuery} />
      <ApiErrors queries={[recentQuery, hourlyQuery, activeQuery]} />

      <KpiGrid aria-label="오늘 생산 실적 요약">
        {kpis.map(({ label, value, unit, meta, icon: Icon, tone }, index) => (
          <KpiCard key={label} $tone={tone} $delay={index * 45}>
            <KpiHead $tone={tone}>
              <span>{label}</span>
              <Icon aria-hidden="true" />
            </KpiHead>
            <KpiValue>
              {value}
              <small>{unit}</small>
            </KpiValue>
            <KpiMeta>{meta}</KpiMeta>
          </KpiCard>
        ))}
      </KpiGrid>

      <OverviewGrid>
        <Panel $span={8} $tabletSpan={12} aria-labelledby="hourly-production-title">
          <PanelHeader>
            <div>
              <PanelLabel>Hourly Output</PanelLabel>
              <h2 id="hourly-production-title">시간대별 목표 대비 생산량</h2>
            </div>
            <PanelMeta>최근 {hourlyChartData.length}개 집계 · EA</PanelMeta>
          </PanelHeader>
          {hourlyChartData.length ? (
            <ChartBody
              role="img"
              aria-label="시간대별 목표 수량과 생산량 비교 차트"
              $height={318}
            >
              <VisuallyHidden>
                시간대별 목표 수량과 실제 생산량을 비교합니다.
              </VisuallyHidden>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={hourlyChartData}
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
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={chartColors.dim}
                    tickLine={false}
                    axisLine={false}
                    width={52}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip cursor={false} content={<ProductionTooltip />} />
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
                    name="시간 목표"
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
              <span>첫 집계가 저장되면 목표와 생산량이 표시됩니다.</span>
            </EmptyState>
          )}
        </Panel>

        <Panel $span={4} $tabletSpan={12} aria-labelledby="process-performance-title">
          <PanelHeader>
            <div>
              <PanelLabel>Process Performance</PanelLabel>
              <h2 id="process-performance-title">활성 공정별 달성 현황</h2>
            </div>
            {processes.length ? (
              <ProcessPager aria-label="활성 공정 페이지 이동">
                <ProcessPageButton
                  type="button"
                  aria-label="이전 공정 3개 보기"
                  disabled={processPage === 0}
                  onClick={() =>
                    setProcessPage((current) => Math.max(0, current - 1))
                  }
                >
                  <FiChevronLeft aria-hidden="true" />
                </ProcessPageButton>
                <span aria-live="polite">
                  {processPage + 1} / {processPageCount}
                </span>
                <ProcessPageButton
                  type="button"
                  aria-label="다음 공정 3개 보기"
                  disabled={processPage + 1 >= processPageCount}
                  onClick={() =>
                    setProcessPage((current) =>
                      Math.min(processPageCount - 1, current + 1),
                    )
                  }
                >
                  <FiChevronRight aria-hidden="true" />
                </ProcessPageButton>
              </ProcessPager>
            ) : (
              <PanelMeta>0 PROCESSES</PanelMeta>
            )}
          </PanelHeader>
          {processes.length ? (
            <ProcessList>
              {visibleProcesses.map((process) => {
                const rate = process.targetQty
                  ? Math.round((process.productionQty / process.targetQty) * 1000) / 10
                  : 0;
                return (
                  <ProcessItem key={process.processProgressId}>
                    <ProcessHead>
                      <div>
                        <strong>{process.processName}</strong>
                        <small>
                          {process.equipmentCode} · 정상 {formatNumber(process.goodQty)}
                          {" · "}불량 {formatNumber(process.defectQty)} EA
                        </small>
                      </div>
                      <MetricPair $tone={percentTone(rate)}>
                        <strong>{formatNumber(process.productionQty)}</strong>
                        <span>{rate}%</span>
                      </MetricPair>
                    </ProcessHead>
                    <ProgressTrack
                      role="progressbar"
                      aria-label={`${process.processName} 목표 달성률`}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={Math.min(rate, 100)}
                    >
                      <ProgressFill $value={rate} $tone={percentTone(rate)} />
                    </ProgressTrack>
                    <small>
                      목표 {formatNumber(process.targetQty)} EA · {process.statusLabel}
                    </small>
                  </ProcessItem>
                );
              })}
            </ProcessList>
          ) : (
            <EmptyState>
              <FiActivity aria-hidden="true" />
              <strong>활성 공정이 없습니다.</strong>
              <span>작업지시를 시작하면 공정별 달성률이 표시됩니다.</span>
            </EmptyState>
          )}
        </Panel>

        <Panel $span={12} aria-labelledby="recent-production-title">
          <PanelHeader>
            <div>
              <PanelLabel>Recent Production Records</PanelLabel>
              <h2 id="recent-production-title">최근 생산 실적</h2>
            </div>
            <PanelMeta>{recent.length} RECORDS</PanelMeta>
          </PanelHeader>
          {recent.length ? (
            <TableWrap tabIndex="0" aria-label="최근 생산 실적 표, 가로 스크롤 가능">
              <Table>
                <caption>최근 수집된 생산 실적 5건</caption>
                <thead>
                  <tr>
                    <th scope="col">발생 일시</th>
                    <th scope="col">실적 / 작업지시</th>
                    <th scope="col">제품 / LOT</th>
                    <th scope="col">목표 수량</th>
                    <th scope="col">생산 수량</th>
                    <th scope="col">정상 / 불량</th>
                    <th scope="col">집계 상태</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((result) => (
                    <tr key={result.productionResultId}>
                      <td>
                        <Mono as="time">{toKst(result.occurredAt)}</Mono>
                      </td>
                      <td>
                        <strong>{result.resultNo}</strong>
                        <small>{result.workOrderNo}</small>
                      </td>
                      <td>
                        <strong>{result.productName}</strong>
                        <small>{result.lotNo}</small>
                      </td>
                      <td>
                        <Mono>{formatNumber(result.targetQty)} EA</Mono>
                      </td>
                      <td>
                        <Mono>{formatNumber(result.productionQty)} EA</Mono>
                      </td>
                      <td>
                        <Mono>
                          {formatNumber(result.goodQty)} / {formatNumber(result.defectQty)} EA
                        </Mono>
                      </td>
                      <td>
                        <StatusChip $tone={statusTone[result.status] || "neutral"}>
                          {result.statusLabel}
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
              <span>생산이 시작되면 최근 실적이 표시됩니다.</span>
            </EmptyState>
          )}
        </Panel>
      </OverviewGrid>
    </Page>
  );
}
