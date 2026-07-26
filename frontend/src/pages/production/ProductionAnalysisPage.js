import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiAlertTriangle,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiTarget,
} from "react-icons/fi";
import { productionApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { BUSINESS_ZONE, currentKstDate, kstPeriod } from "../../api/time";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import {
  AchievementFill,
  AchievementHead,
  AchievementItem,
  AchievementList,
  AchievementTrack,
  AnalysisGrid,
  ChartBody,
  Eyebrow,
  MetricCard,
  MetricGrid,
  MetricLabel,
  MetricValue,
  Mono,
  Page,
  PageHeader,
  Panel,
  PanelHeader,
  PanelLabel,
  PanelMeta,
  PeriodField,
  TitleGroup,
  TooltipCard,
  TooltipRow,
  VisuallyHidden,
} from "./ProductionAnalysisPageCss";

const chartColors = {
  green: "#4be277",
  blue: "#8bd5ff",
  amber: "#ffb95f",
  red: "#ffb4ab",
  grid: "#334155",
  tick: "#869585",
};

const PRODUCT_COLORS = ["#4be277", "#8bd5ff", "#ffb95f", "#b9c6ff"];
const formatNumber = (value) =>
  new Intl.NumberFormat("ko-KR").format(Number(value) || 0);

const mapGroup = (item) => ({
  name: item.name,
  target: Number(item.targetQty) || 0,
  production: Number(item.productionQty) || 0,
  good: Number(item.goodQty) || 0,
  defect: Number(item.defectQty) || 0,
  achievement: Number(item.achievementRate) || 0,
});

function ProductionTooltip({ active, label, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <TooltipCard>
      <strong>{label}</strong>
      {payload.map((item) => (
        <TooltipRow
          key={item.dataKey || item.name}
          $color={item.color || item.fill}
        >
          <span>{item.name}</span>
          <Mono>{formatNumber(item.value)} EA</Mono>
        </TooltipRow>
      ))}
    </TooltipCard>
  );
}

export default function ProductionAnalysisPage() {
  const [days, setDays] = useState(7);
  const periodKey = { days, through: currentKstDate() };
  const period = kstPeriod(days);
  const queryOptions = {
    refetchInterval: POLLING.PRODUCTION,
    placeholderData: (previous) => previous,
  };
  const summaryQuery = useQuery({
    queryKey: queryKeys.productionSummary(periodKey),
    queryFn: () => productionApi.summary(period),
    ...queryOptions,
  });
  const productQuery = useQuery({
    queryKey: queryKeys.productionGroups("by-product", periodKey),
    queryFn: () => productionApi.byProduct(period),
    ...queryOptions,
  });
  const orderQuery = useQuery({
    queryKey: queryKeys.productionGroups("by-work-order", periodKey),
    queryFn: () => productionApi.byWorkOrder(period),
    ...queryOptions,
  });
  const processQuery = useQuery({
    queryKey: queryKeys.productionGroups("by-process", periodKey),
    queryFn: () => productionApi.byProcess(period),
    ...queryOptions,
  });
  const hourlyQuery = useQuery({
    queryKey: queryKeys.hourlyProduction(periodKey),
    queryFn: () => productionApi.hourly(period),
    ...queryOptions,
  });

  const daily = useMemo(() => {
    const grouped = new Map();
    (hourlyQuery.data || []).forEach((row) => {
      const date = new Intl.DateTimeFormat("en-CA", {
        timeZone: BUSINESS_ZONE,
      }).format(new Date(row.bucketStart));
      const value = grouped.get(date) || {
        date,
        label: date.slice(5),
        target: 0,
        production: 0,
        good: 0,
        defect: 0,
      };
      value.target += Number(row.targetQty) || 0;
      value.production += Number(row.productionQty) || 0;
      value.good += Number(row.goodQty) || 0;
      value.defect += Number(row.defectQty) || 0;
      grouped.set(date, value);
    });
    return [...grouped.values()].sort((first, second) =>
      first.date.localeCompare(second.date),
    );
  }, [hourlyQuery.data]);

  const hourly = useMemo(() => {
    const grouped = new Map();
    (hourlyQuery.data || []).forEach((row) => {
      const hour = new Intl.DateTimeFormat("ko-KR", {
        timeZone: BUSINESS_ZONE,
        hour: "2-digit",
        hour12: false,
      }).format(new Date(row.bucketStart));
      const label = `${hour.padStart(2, "0")}:00`;
      grouped.set(label, (grouped.get(label) || 0) + (Number(row.productionQty) || 0));
    });
    return [...grouped.entries()]
      .map(([time, production]) => ({ time, production }))
      .sort((first, second) => first.time.localeCompare(second.time));
  }, [hourlyQuery.data]);

  const products = (productQuery.data || []).map(mapGroup).slice(0, 5);
  const processes = (processQuery.data || []).map(mapGroup);
  const workOrders = (orderQuery.data || []).map(mapGroup).slice(0, 6);
  const summary = summaryQuery.data || {};
  const productionQty = Number(summary.productionQty) || 0;
  const goodQty = Number(summary.goodQty) || 0;
  const achievement = Number(summary.achievementRate) || 0;
  const defectRate = Number(summary.defectRate) || 0;
  const goodRate = productionQty
    ? Math.round((goodQty / productionQty) * 1000) / 10
    : 0;
  const periodMeta = days === 1 ? "TODAY" : `RECENT ${days} DAYS`;

  return (
    <Page>
      <PageHeader>
        <TitleGroup>
          <Eyebrow>Production Performance / Analytics</Eyebrow>
          <h1>생산 실적 분석</h1>
          <p>생산량과 목표 달성 흐름을 일자·제품·공정·작업지시 기준으로 비교합니다.</p>
        </TitleGroup>
        <PeriodField>
          <FiCalendar aria-hidden="true" />
          <span>분석 기간</span>
          <select
            aria-label="생산 실적 분석 기간"
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
          >
            <option value={1}>오늘</option>
            <option value={7}>최근 7일</option>
            <option value={30}>최근 30일</option>
          </select>
        </PeriodField>
      </PageHeader>

      <QueryStatus query={summaryQuery} />
      <ApiErrors
        queries={[productQuery, orderQuery, processQuery, hourlyQuery]}
      />

      <MetricGrid aria-label="생산 실적 분석 요약">
        <MetricCard>
          <MetricLabel>
            <FiBarChart2 aria-hidden="true" /> 누적 생산량
          </MetricLabel>
          <MetricValue>
            {formatNumber(productionQty)}
            <small>EA</small>
          </MetricValue>
          <span>선택 기간 생산 실적</span>
        </MetricCard>
        <MetricCard>
          <MetricLabel>
            <FiTarget aria-hidden="true" /> 평균 목표 달성률
          </MetricLabel>
          <MetricValue $tone={achievement >= 100 ? "success" : "warning"}>
            {achievement}
            <small>%</small>
          </MetricValue>
          <span>목표 {formatNumber(summary.targetQty)} EA 기준</span>
        </MetricCard>
        <MetricCard>
          <MetricLabel>
            <FiCheckCircle aria-hidden="true" /> 정상 생산 비율
          </MetricLabel>
          <MetricValue $tone="success">
            {goodRate}
            <small>%</small>
          </MetricValue>
          <span>정상 {formatNumber(goodQty)} EA</span>
        </MetricCard>
        <MetricCard>
          <MetricLabel>
            <FiAlertTriangle aria-hidden="true" /> 불량 반영 수량
          </MetricLabel>
          <MetricValue $tone="warning">
            {formatNumber(summary.defectQty)}
            <small>EA</small>
          </MetricValue>
          <span>전체 생산량 대비 {defectRate}%</span>
        </MetricCard>
      </MetricGrid>

      <AnalysisGrid>
        <Panel $span={7} aria-labelledby="daily-production-title">
          <PanelHeader>
            <div>
              <PanelLabel>Daily Production</PanelLabel>
              <h2 id="daily-production-title">일별 목표 대비 생산량</h2>
            </div>
            <PanelMeta>{periodMeta}</PanelMeta>
          </PanelHeader>
          <ChartBody role="img" aria-label="일별 목표 수량과 생산량 비교 차트">
            <VisuallyHidden>
              일별 목표 수량과 생산량을 막대와 선으로 비교합니다.
            </VisuallyHidden>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={daily}
                margin={{ top: 12, right: 16, left: 2, bottom: 4 }}
              >
                <CartesianGrid
                  stroke={chartColors.grid}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  stroke={chartColors.tick}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={chartColors.tick}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                />
                <Tooltip cursor={false} content={<ProductionTooltip />} />
                <Legend />
                <Bar
                  dataKey="target"
                  name="목표"
                  fill={chartColors.grid}
                  radius={[3, 3, 0, 0]}
                />
                <Line
                  dataKey="production"
                  name="생산량"
                  type="monotone"
                  stroke={chartColors.green}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartBody>
        </Panel>

        <Panel $span={5} aria-labelledby="product-production-title">
          <PanelHeader>
            <div>
              <PanelLabel>By Product</PanelLabel>
              <h2 id="product-production-title">제품별 생산량</h2>
            </div>
            <PanelMeta>TOP {products.length}</PanelMeta>
          </PanelHeader>
          <ChartBody role="img" aria-label="제품별 생산량 가로 막대 차트">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={products}
                layout="vertical"
                margin={{ top: 8, right: 20, left: 16, bottom: 4 }}
              >
                <CartesianGrid
                  stroke={chartColors.grid}
                  strokeDasharray="3 3"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke={chartColors.tick}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke={chartColors.tick}
                  tickLine={false}
                  axisLine={false}
                  width={104}
                />
                <Tooltip cursor={false} content={<ProductionTooltip />} />
                <Bar
                  dataKey="production"
                  name="생산량"
                  radius={[0, 3, 3, 0]}
                >
                  {products.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={PRODUCT_COLORS[index % PRODUCT_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartBody>
        </Panel>

        <Panel $span={5} aria-labelledby="process-production-title">
          <PanelHeader>
            <div>
              <PanelLabel>By Process</PanelLabel>
              <h2 id="process-production-title">공정별 정상·불량</h2>
            </div>
            <PanelMeta>{processes.length} PROCESSES</PanelMeta>
          </PanelHeader>
          <ChartBody role="img" aria-label="공정별 정상 수량과 불량 수량 누적 막대 차트">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processes}
                margin={{ top: 12, right: 12, left: 2, bottom: 4 }}
              >
                <CartesianGrid
                  stroke={chartColors.grid}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke={chartColors.tick}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={chartColors.tick}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                />
                <Tooltip cursor={false} content={<ProductionTooltip />} />
                <Legend />
                <Bar
                  dataKey="good"
                  name="정상"
                  stackId="result"
                  fill={chartColors.green}
                />
                <Bar
                  dataKey="defect"
                  name="불량"
                  stackId="result"
                  fill={chartColors.red}
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartBody>
        </Panel>

        <Panel $span={7} aria-labelledby="work-order-achievement-title">
          <PanelHeader>
            <div>
              <PanelLabel>Work Order Achievement</PanelLabel>
              <h2 id="work-order-achievement-title">작업지시별 달성률</h2>
            </div>
            <PanelMeta>TOP {workOrders.length}</PanelMeta>
          </PanelHeader>
          <AchievementList>
            {workOrders.map((item) => (
              <AchievementItem key={item.name}>
                <AchievementHead>
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {formatNumber(item.production)} / {formatNumber(item.target)} EA
                    </span>
                  </div>
                  <Mono
                    $tone={
                      item.achievement >= 100
                        ? "success"
                        : item.achievement >= 90
                          ? "warning"
                          : "alarm"
                    }
                  >
                    {item.achievement}%
                  </Mono>
                </AchievementHead>
                <AchievementTrack
                  role="progressbar"
                  aria-label={`${item.name} 목표 달성률`}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={Math.min(item.achievement, 100)}
                >
                  <AchievementFill
                    $value={item.achievement}
                    $complete={item.achievement >= 100}
                  />
                </AchievementTrack>
              </AchievementItem>
            ))}
          </AchievementList>
        </Panel>

        <Panel $span={7} aria-labelledby="target-trend-title">
          <PanelHeader>
            <div>
              <PanelLabel>Target vs Actual</PanelLabel>
              <h2 id="target-trend-title">목표 대비 실적 추이</h2>
            </div>
            <PanelMeta>{achievement}% AVG</PanelMeta>
          </PanelHeader>
          <ChartBody role="img" aria-label="일자별 목표 대비 생산 실적 추이 차트">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={daily}
                margin={{ top: 12, right: 16, left: 2, bottom: 4 }}
              >
                <defs>
                  <linearGradient
                    id="productionArea"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartColors.green}
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="100%"
                      stopColor={chartColors.green}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke={chartColors.grid}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  stroke={chartColors.tick}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={chartColors.tick}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                />
                <Tooltip cursor={false} content={<ProductionTooltip />} />
                <Legend />
                <Area
                  dataKey="production"
                  name="실적"
                  type="monotone"
                  stroke={chartColors.green}
                  fill="url(#productionArea)"
                  strokeWidth={2.5}
                />
                <Line
                  dataKey="target"
                  name="목표"
                  type="monotone"
                  stroke={chartColors.amber}
                  strokeDasharray="6 5"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartBody>
        </Panel>

        <Panel $span={5} aria-labelledby="hourly-analysis-title">
          <PanelHeader>
            <div>
              <PanelLabel>Hourly Output</PanelLabel>
              <h2 id="hourly-analysis-title">시간대별 생산량</h2>
            </div>
            <PanelMeta>{periodMeta}</PanelMeta>
          </PanelHeader>
          <ChartBody role="img" aria-label="선택 기간 시간대별 생산량 차트">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hourly}
                margin={{ top: 12, right: 12, left: 0, bottom: 4 }}
              >
                <CartesianGrid
                  stroke={chartColors.grid}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  stroke={chartColors.tick}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={chartColors.tick}
                  tickLine={false}
                  axisLine={false}
                  width={42}
                />
                <Tooltip cursor={false} content={<ProductionTooltip />} />
                <Bar
                  dataKey="production"
                  name="생산량"
                  fill={chartColors.blue}
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartBody>
        </Panel>
      </AnalysisGrid>
    </Page>
  );
}
