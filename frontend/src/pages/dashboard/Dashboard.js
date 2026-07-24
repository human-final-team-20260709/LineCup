import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiActivity,
  FiAlertTriangle,
  FiBox,
  FiClock,
  FiRadio,
  FiTarget,
  FiUsers,
  FiWifi,
} from "react-icons/fi";
import {
  alarmApi,
  communicationApi,
  productionApi,
  workOrderApi,
  workerApi,
} from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { currentKstDate, kstPeriod, toKst } from "../../api/time";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import { formatNumber, pageContent } from "../../components/OperationalUi";
import {
  AlarmIconBox,
  AlarmMessageBlock,
  AlarmRow,
  AlarmSideCol,
  AlarmTime,
  ChartCaption,
  ChartFrame,
  chartColors,
  ChartHeaderRow,
  ChartLegendItem,
  ChartLegendRow,
  ChartLegendSwatch,
  ChartTitleBlock,
  ChartTooltipBox,
  ChartTooltipDot,
  ChartTooltipLabel,
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipValue,
  CompactList,
  DonutCenter,
  DonutLegendRow,
  DonutWrap,
  EmptyState,
  Eyebrow,
  KpiBody,
  KpiCard,
  KpiGrid,
  KpiHead,
  KpiIconBadge,
  KpiMeta,
  KpiValue,
  LiveDot,
  LiveStatus,
  Page,
  PageHeader,
  Panel,
  PanelHeader,
  PanelLabel,
  PanelLinkMore,
  PanelMeta,
  PipelineActiveCard,
  PipelineActiveEyebrow,
  PipelineArrow,
  PipelineCard,
  PipelineLiveDot,
  PipelineMeta,
  PipelineProgressFill,
  PipelineProgressTrack,
  PipelineRow,
  ProductBarFill,
  ProductBarTrack,
  ProductRow,
  ProductRowHead,
  ProductRowList,
  RangeToggleButton,
  RangeToggleGroup,
  SplitRow,
  StatusChip,
  TitleGroup,
  WorkerAvatar,
  WorkerAvatarCard,
  WorkerCardBody,
  WorkerCardGrid,
} from "./DashboardCss";

const trendRangeLabel = {
  day: "오늘 · 시간별",
  week: "최근 7일",
  month: "최근 30일",
};

const alarmTone = (severity) => {
  if (severity === "CRITICAL") return "alarm";
  if (severity === "WARNING") return "warning";
  return "info";
};

function useCountUp(value, duration = 550) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);
  const frameRef = useRef();

  useEffect(() => {
    const from = fromRef.current;
    const to = Number(value) || 0;
    if (from === to) {
      return undefined;
    }
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return display;
}

function AnimatedNumber({ value }) {
  const display = useCountUp(value);
  return formatNumber(display);
}

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }
  return (
    <ChartTooltipBox>
      <ChartTooltipTitle>{label}</ChartTooltipTitle>
      <ChartTooltipRow>
        <ChartTooltipDot $color={chartColors.primary} />
        <ChartTooltipLabel>실 생산</ChartTooltipLabel>
        <ChartTooltipValue>{formatNumber(payload[0].value)} EA</ChartTooltipValue>
      </ChartTooltipRow>
    </ChartTooltipBox>
  );
}

function DonutTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }
  const entry = payload[0];
  return (
    <ChartTooltipBox>
      <ChartTooltipRow>
        <ChartTooltipDot $color={entry.payload.fill} />
        <ChartTooltipLabel>{entry.name}</ChartTooltipLabel>
        <ChartTooltipValue>{formatNumber(entry.value)} EA</ChartTooltipValue>
      </ChartTooltipRow>
    </ChartTooltipBox>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [trendRange, setTrendRange] = useState("week");
  const periodKey = { scope: "today", date: currentKstDate() };
  const todayPeriod = kstPeriod(1);
  const trendPeriod = useMemo(() => {
    if (trendRange === "day") return kstPeriod(1);
    if (trendRange === "month") return kstPeriod(30);
    return kstPeriod(7);
  }, [trendRange]);

  const productionQuery = useQuery({
    queryKey: queryKeys.productionSummary(periodKey),
    queryFn: () => productionApi.summary(todayPeriod),
    refetchInterval: POLLING.PRODUCTION,
  });
  const trendQuery = useQuery({
    queryKey: queryKeys.hourlyProduction({ ...trendPeriod, scope: `trend-${trendRange}` }),
    queryFn: () => productionApi.hourly(trendPeriod),
    refetchInterval: POLLING.PRODUCTION,
  });
  const byProductQuery = useQuery({
    queryKey: queryKeys.productionGroups("by-product", todayPeriod),
    queryFn: () => productionApi.byProduct(todayPeriod),
    refetchInterval: POLLING.PRODUCTION,
  });
  const activeQuery = useQuery({
    queryKey: queryKeys.activeWorkOrder(),
    queryFn: workOrderApi.active,
    refetchInterval: POLLING.WORK_ORDER,
  });
  const orderSummaryQuery = useQuery({
    queryKey: queryKeys.workOrderSummary(),
    queryFn: workOrderApi.summary,
    refetchInterval: POLLING.WORK_ORDER,
  });
  const alarmQuery = useQuery({
    queryKey: queryKeys.alarms("dashboard-current", { size: 6 }),
    queryFn: () => alarmApi.current({ page: 0, size: 6 }),
    refetchInterval: POLLING.CURRENT_ALARM,
  });
  const l1Query = useQuery({
    queryKey: queryKeys.l1Devices(),
    queryFn: communicationApi.l1,
    refetchInterval: POLLING.COMMUNICATION,
  });
  const l2Query = useQuery({
    queryKey: queryKeys.l2Collectors(),
    queryFn: communicationApi.l2,
    refetchInterval: POLLING.COMMUNICATION,
  });
  const workersQuery = useQuery({
    queryKey: queryKeys.workers({ page: 0, size: 100 }),
    queryFn: () => workerApi.list({ page: 0, size: 100 }),
  });
  const pendingQuery = useQuery({
    queryKey: queryKeys.workOrders({ status: "PENDING", sort: "plannedStartDate,asc", size: 2, scope: "pipeline" }),
    queryFn: () =>
      workOrderApi.list({ status: "PENDING", sort: "plannedStartDate,asc", page: 0, size: 2 }),
    refetchInterval: POLLING.WORK_ORDER,
  });
  const doneQuery = useQuery({
    queryKey: queryKeys.workOrders({ status: "DONE", sort: "completedAt,desc", size: 2, scope: "pipeline" }),
    queryFn: () => workOrderApi.list({ status: "DONE", sort: "completedAt,desc", page: 0, size: 2 }),
    refetchInterval: POLLING.WORK_ORDER,
  });

  const production = productionQuery.data || {};
  const orderSummary = orderSummaryQuery.data || {};
  const alarms = pageContent(alarmQuery.data);
  const workers = pageContent(workersQuery.data);
  const l1Devices = l1Query.data || [];
  const l2Collectors = l2Query.data || [];
  const connectedL1 = l1Devices.filter((entry) => entry.connectionStatus === "CONNECTED").length;
  const connectedL2 = l2Collectors.filter((entry) => entry.backendConnectionStatus === "CONNECTED").length;
  const totalAlarms = alarmQuery.data?.totalElements || 0;
  const criticalAlarms = alarms.filter((alarm) => alarm.severity === "CRITICAL").length;
  const warningAlarms = alarms.filter((alarm) => alarm.severity === "WARNING").length;

  const trendData = useMemo(() => {
    const buckets = trendQuery.data || [];

    if (trendRange === "day") {
      const hours = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, "0")}:00`);
      const byHour = new Map(hours.map((label) => [label, 0]));
      buckets.forEach((bucket) => {
        const label = toKst(bucket.bucketStart, "HH:00");
        if (byHour.has(label)) {
          byHour.set(label, byHour.get(label) + (bucket.productionQty || 0));
        }
      });
      return hours.map((label) => ({ day: label, actual: byHour.get(label) || 0 }));
    }

    const days = trendRange === "month" ? 30 : 7;
    const labels = Array.from({ length: days }, (_, index) =>
      toKst(new Date(Date.now() - (days - 1 - index) * 24 * 60 * 60 * 1000).toISOString(), "MM-DD"),
    );
    const byDay = new Map(labels.map((label) => [label, 0]));
    buckets.forEach((bucket) => {
      const label = toKst(bucket.bucketStart, "MM-DD");
      if (byDay.has(label)) {
        byDay.set(label, byDay.get(label) + (bucket.productionQty || 0));
      }
    });
    return labels.map((label) => ({ day: label, actual: byDay.get(label) || 0 }));
  }, [trendQuery.data, trendRange]);

  const goodQty = production.goodQty || 0;
  const defectQty = production.defectQty || 0;
  const qualityTotal = goodQty + defectQty;
  const qualityRate = qualityTotal > 0 ? Math.round((goodQty / qualityTotal) * 1000) / 10 : 0;
  const qualityData = [
    { name: "정상", value: goodQty, fill: chartColors.primary },
    { name: "불량", value: defectQty, fill: chartColors.alarm },
  ];

  const activeSummary = activeQuery.data?.summary;
  const pendingOrders = pageContent(pendingQuery.data);
  const doneOrders = pageContent(doneQuery.data);
  const byProductRows = pageContent(byProductQuery.data).slice(0, 6);

  const kpis = [
    {
      key: "production",
      label: "오늘 생산",
      icon: <FiBox />,
      tone: "success",
      value: <AnimatedNumber value={production.productionQty} />,
      unit: "EA",
      meta: `목표 ${formatNumber(production.targetQty)} EA`,
      to: "/production-results",
    },
    {
      key: "achievement",
      label: "목표 달성률",
      icon: <FiTarget />,
      tone: (production.achievementRate || 0) >= 100 ? "success" : "warning",
      value: <AnimatedNumber value={Math.round(production.achievementRate || 0)} />,
      unit: "%",
      meta: `정상 ${formatNumber(goodQty)} · 불량 ${formatNumber(defectQty)}`,
      to: "/production-results",
    },
    {
      key: "orders",
      label: "진행 / 보류",
      icon: <FiClock />,
      tone: (orderSummary.holdCount || 0) > 0 ? "warning" : "success",
      value: <AnimatedNumber value={(orderSummary.inProgressCount || 0) + (orderSummary.holdCount || 0)} />,
      unit: "건",
      meta: `진행 ${orderSummary.inProgressCount || 0} · 보류 ${orderSummary.holdCount || 0}`,
      to: "/work-orders/list",
    },
    {
      key: "alarms",
      label: "현재 알람",
      icon: <FiAlertTriangle />,
      tone: totalAlarms > 0 ? "alarm" : "success",
      value: <AnimatedNumber value={totalAlarms} />,
      unit: "건",
      meta: totalAlarms > 0 ? `심각 ${criticalAlarms} · 경고 ${warningAlarms}` : "정상 가동 중",
      to: "/alarms/current",
    },
    {
      key: "l1",
      label: "L1 연결",
      icon: <FiWifi />,
      tone: l1Devices.length && connectedL1 === l1Devices.length ? "success" : "alarm",
      value: `${connectedL1}/${l1Devices.length}`,
      meta: "전체 정상",
      to: "/communications/l1",
    },
    {
      key: "l2",
      label: "L2 수집기",
      icon: <FiRadio />,
      tone: l2Collectors.length && connectedL2 === l2Collectors.length ? "success" : "alarm",
      value: `${connectedL2}/${l2Collectors.length}`,
      meta: "백엔드 연결 정상",
      to: "/communications/l2",
    },
  ];

  return (
    <Page>
      <PageHeader>
        <TitleGroup>
          <Eyebrow>MES Dashboard</Eyebrow>
          <h1>생산 현황 대시보드</h1>
        </TitleGroup>
        <LiveStatus>
          <LiveDot />
          <div>
            <strong>LIVE</strong>
            <span>마지막 갱신 {toKst(new Date().toISOString(), "YYYY-MM-DD HH:mm:ss")}</span>
          </div>
        </LiveStatus>
      </PageHeader>

      <KpiGrid>
        {kpis.map((kpi, index) => (
          <KpiCard key={kpi.key} $tone={kpi.tone} $delay={index * 60} onClick={() => navigate(kpi.to)}>
            <KpiIconBadge $tone={kpi.tone}>{kpi.icon}</KpiIconBadge>
            <KpiBody>
              <KpiHead>
                <span>{kpi.label}</span>
              </KpiHead>
              <KpiValue>
                {kpi.value}
                {kpi.unit && <small>{kpi.unit}</small>}
              </KpiValue>
              <KpiMeta>{kpi.meta}</KpiMeta>
            </KpiBody>
          </KpiCard>
        ))}
      </KpiGrid>

      <ApiErrors
        queries={[
          orderSummaryQuery,
          alarmQuery,
          l1Query,
          l2Query,
          workersQuery,
          pendingQuery,
          doneQuery,
          trendQuery,
          byProductQuery,
        ]}
      />
      <QueryStatus query={productionQuery} />

      <SplitRow $ratio="1.6fr 1fr">
        <Panel $span={1} $tabletSpan={1}>
          <ChartHeaderRow>
            <ChartTitleBlock>
              <PanelLabel>{trendRangeLabel[trendRange]}</PanelLabel>
              <h3>생산 실적 추이</h3>
            </ChartTitleBlock>
            <ChartLegendRow>
              <ChartLegendItem>
                <ChartLegendSwatch $color={chartColors.primary} /> 실 생산
              </ChartLegendItem>
              <ChartLegendItem>
                <ChartLegendSwatch $color={chartColors.warning} $dashed /> 목표
              </ChartLegendItem>
              <RangeToggleGroup>
                {[
                  ["day", "일간"],
                  ["week", "주간"],
                  ["month", "월간"],
                ].map(([value, label]) => (
                  <RangeToggleButton
                    key={value}
                    type="button"
                    $active={trendRange === value}
                    onClick={() => setTrendRange(value)}
                  >
                    {label}
                  </RangeToggleButton>
                ))}
              </RangeToggleGroup>
            </ChartLegendRow>
          </ChartHeaderRow>
          <ChartFrame $height={190}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: chartColors.dim, fontSize: 10 }}
                  axisLine={{ stroke: chartColors.border }}
                  tickLine={false}
                  interval={trendRange === "month" ? 3 : trendRange === "day" ? 2 : 0}
                />
                <YAxis
                  tick={{ fill: chartColors.dim, fontSize: 10 }}
                  axisLine={{ stroke: chartColors.border }}
                  tickLine={false}
                  width={38}
                />
                <Tooltip content={<TrendTooltip />} cursor={{ stroke: chartColors.border }} />
                {production.targetQty > 0 && (
                  <ReferenceLine
                    y={production.targetQty}
                    stroke={chartColors.warning}
                    strokeDasharray="5 4"
                    strokeWidth={1.5}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke={chartColors.primary}
                  strokeWidth={2.5}
                  fill="url(#dashboardTrendFill)"
                  isAnimationActive
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartFrame>
          <ChartCaption>점선은 오늘 목표 수량 기준 참고선이며, 기간 조회 시에도 고정값으로 표시됩니다.</ChartCaption>
        </Panel>

        <Panel $span={1} $tabletSpan={1}>
          <ChartHeaderRow>
            <ChartTitleBlock>
              <PanelLabel>품질 현황</PanelLabel>
              <h3>누적 정상 / 불량 비율</h3>
            </ChartTitleBlock>
          </ChartHeaderRow>
          {qualityTotal > 0 ? (
            <>
              <DonutWrap>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={qualityData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="68%"
                      outerRadius="92%"
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      {qualityData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<DonutTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <DonutCenter>
                  <strong>{qualityRate}%</strong>
                  <span>양품률</span>
                </DonutCenter>
              </DonutWrap>
              <DonutLegendRow>
                <span style={{ color: chartColors.primary }}>
                  <strong>{formatNumber(goodQty)}</strong> 정상
                </span>
                <span style={{ color: chartColors.alarm }}>
                  <strong>{formatNumber(defectQty)}</strong> 불량
                </span>
              </DonutLegendRow>
            </>
          ) : (
            <EmptyState $compact>
              <FiActivity />
              <strong>생산 실적이 없습니다</strong>
              <span>오늘 생산이 시작되면 정상/불량 비율이 표시됩니다.</span>
            </EmptyState>
          )}
        </Panel>
      </SplitRow>

      <SplitRow $ratio="1fr 1.4fr">
        <Panel $span={1} $tabletSpan={1}>
          <PanelHeader>
            <div>
              <PanelLabel>알람</PanelLabel>
              <h2>현재 알람 · 실시간 이벤트</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <PanelMeta>{totalAlarms}건</PanelMeta>
              <PanelLinkMore onClick={() => navigate("/alarms/current")}>더보기 ›</PanelLinkMore>
            </div>
          </PanelHeader>
          {alarms.length ? (
            <CompactList>
              {alarms.map((alarm, index) => (
                <AlarmRow key={alarm.alarmId} $tone={alarmTone(alarm.severity)} $delay={index * 50}>
                  <AlarmIconBox $tone={alarmTone(alarm.severity)}>
                    <FiAlertTriangle />
                  </AlarmIconBox>
                  <AlarmMessageBlock>
                    <strong>{alarm.equipmentCode}</strong>
                    <p>{alarm.message}</p>
                  </AlarmMessageBlock>
                  <AlarmSideCol>
                    <StatusChip $tone={alarmTone(alarm.severity)}>{alarm.severityLabel}</StatusChip>
                    <AlarmTime>{toKst(alarm.occurredAt, "HH:mm:ss")}</AlarmTime>
                  </AlarmSideCol>
                </AlarmRow>
              ))}
            </CompactList>
          ) : (
            <EmptyState $compact>
              <FiAlertTriangle />
              <strong>발생한 알람이 없습니다</strong>
              <span>설비 이상이 감지되면 이 목록에 실시간으로 표시됩니다.</span>
            </EmptyState>
          )}
        </Panel>

        <Panel $span={1} $tabletSpan={1}>
          <PanelHeader>
            <div>
              <PanelLabel>파이프라인</PanelLabel>
              <h2>작업지시 흐름</h2>
            </div>
            <PanelLinkMore onClick={() => navigate("/work-orders/list")}>더보기 ›</PanelLinkMore>
          </PanelHeader>
          {doneOrders.length || activeSummary || pendingOrders.length ? (
            <PipelineRow>
              {doneOrders.map((order, index) => (
                <PipelineCard
                  key={order.workOrderId}
                  $delay={index * 40}
                  onClick={() => navigate(`/work-orders/${order.workOrderId}`)}
                >
                  <small>{order.workOrderNo}</small>
                  <strong>{order.productName}</strong>
                  <StatusChip $tone="neutral">완료</StatusChip>
                </PipelineCard>
              ))}
              {doneOrders.length > 0 && <PipelineArrow>→</PipelineArrow>}

              {activeSummary ? (
                <PipelineActiveCard onClick={() => navigate(`/work-orders/${activeSummary.workOrderId}`)}>
                  <PipelineLiveDot />
                  <PipelineActiveEyebrow>진행중</PipelineActiveEyebrow>
                  <small>{activeSummary.workOrderNo}</small>
                  <strong>{activeSummary.productName}</strong>
                  <PipelineProgressTrack>
                    <PipelineProgressFill $value={activeSummary.progressRate} />
                  </PipelineProgressTrack>
                  <PipelineMeta>
                    {formatNumber(activeSummary.currentQty)} / {formatNumber(activeSummary.targetQty)} EA ·{" "}
                    {activeSummary.progressRate}%
                  </PipelineMeta>
                </PipelineActiveCard>
              ) : (
                <PipelineCard $dashed>
                  <strong>진행중 없음</strong>
                  <small>작업 시작 대기</small>
                </PipelineCard>
              )}

              {pendingOrders.length > 0 && <PipelineArrow>→</PipelineArrow>}
              {pendingOrders.map((order, index) => (
                <PipelineCard
                  key={order.workOrderId}
                  $dashed
                  $delay={index * 40}
                  onClick={() => navigate(`/work-orders/${order.workOrderId}`)}
                >
                  <small>{order.workOrderNo}</small>
                  <strong>{order.productName}</strong>
                  <StatusChip $tone="warning">대기 · {order.plannedStartDate}</StatusChip>
                </PipelineCard>
              ))}
            </PipelineRow>
          ) : (
            <EmptyState $compact>
              <FiActivity />
              <strong>표시할 작업지시가 없습니다</strong>
              <span>작업지시가 등록되면 진행 흐름이 여기에 표시됩니다.</span>
            </EmptyState>
          )}
          <QueryStatus query={activeQuery} />
        </Panel>
      </SplitRow>

      <SplitRow $ratio="1.6fr 1fr">
        <Panel $span={1} $tabletSpan={1}>
          <PanelHeader>
            <div>
              <PanelLabel>작업자</PanelLabel>
              <h2>작업자 팀</h2>
            </div>
            <PanelMeta>총 {workers.length}명</PanelMeta>
          </PanelHeader>

          {workers.length ? (
            <WorkerCardGrid>
              {workers.map((worker, index) => (
                <WorkerAvatarCard
                  key={worker.workerProfileId}
                  $delay={Math.min(index, 14) * 40}
                  onClick={() => navigate("/settings/workers")}
                >
                  <WorkerAvatar $tone={["success", "warning", "neutral"][index % 3]}>
                    {worker.name?.slice(0, 1)}
                  </WorkerAvatar>
                  <WorkerCardBody>
                    <strong>{worker.name}</strong>
                    <small>
                      {worker.teamName} · {worker.shiftTypeLabel}
                    </small>
                  </WorkerCardBody>
                </WorkerAvatarCard>
              ))}
            </WorkerCardGrid>
          ) : (
            <EmptyState>
              <FiUsers />
              <strong>등록된 작업자가 없습니다</strong>
              <span>작업자 프로필이 등록되면 팀 현황이 여기에 표시됩니다.</span>
            </EmptyState>
          )}
          <QueryStatus query={workersQuery} />
        </Panel>

        <Panel $span={1} $tabletSpan={1}>
          <PanelHeader>
            <div>
              <PanelLabel>제품</PanelLabel>
              <h2>제품별 오늘 생산 현황</h2>
            </div>
            <PanelLinkMore onClick={() => navigate("/production-results/analysis")}>더보기 ›</PanelLinkMore>
          </PanelHeader>
          {byProductRows.length ? (
            <ProductRowList>
              {byProductRows.map((product, index) => (
                <ProductRow key={product.name} $delay={index * 50}>
                  <ProductRowHead>
                    <span>{product.name}</span>
                    <span>
                      {formatNumber(product.productionQty)} / {formatNumber(product.targetQty)} EA
                    </span>
                  </ProductRowHead>
                  <ProductBarTrack>
                    <ProductBarFill
                      $value={(product.productionQty / Math.max(product.targetQty, 1)) * 100}
                      $tone={product.productionQty >= product.targetQty ? "success" : "neutral"}
                    />
                  </ProductBarTrack>
                </ProductRow>
              ))}
            </ProductRowList>
          ) : (
            <EmptyState $compact>
              <FiBox />
              <strong>오늘 생산 실적이 없습니다</strong>
              <span>제품별 생산이 시작되면 여기에 표시됩니다.</span>
            </EmptyState>
          )}
          <QueryStatus query={byProductQuery} />
        </Panel>
      </SplitRow>
    </Page>
  );
}
