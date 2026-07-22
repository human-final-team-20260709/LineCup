import { useMemo, useState } from 'react';
import {
  FiAlertTriangle,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiTarget,
} from 'react-icons/fi';
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
} from 'recharts';
import {
  PRODUCTION_STATUS,
  dailyProduction,
  formatNumber,
  productionRecords,
} from './productionData';
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
} from './ProductionAnalysisPageCss';

const chartColors = {
  green: '#4be277',
  blue: '#8bd5ff',
  amber: '#ffb95f',
  red: '#ffb4ab',
  grid: '#334155',
  tick: '#869585',
};

const PRODUCT_COLORS = ['#4be277', '#8bd5ff', '#ffb95f', '#b9c6ff'];
const PERIOD_DAYS = { today: 1, 7: 7, 30: 30 };

const filterDailyProductionByPeriod = (periodDays) => {
  const latestDate = dailyProduction[dailyProduction.length - 1]?.date;

  if (!latestDate) {
    return [];
  }

  const periodEnd = new Date(`${latestDate}T00:00:00Z`);
  const periodStart = new Date(periodEnd);
  periodStart.setUTCDate(periodEnd.getUTCDate() - periodDays + 1);

  return dailyProduction.filter((item) => {
    const itemDate = new Date(`${item.date}T00:00:00Z`);
    return itemDate >= periodStart && itemDate <= periodEnd;
  });
};

const groupRecords = (records, key, limit) => {
  const grouped = records.reduce((result, item) => {
    const name = item[key];
    const current = result.get(name) || {
      name,
      target: 0,
      production: 0,
      good: 0,
      defect: 0,
    };

    current.target += Number(item.targetQty) || 0;
    current.production += Number(item.productionQty) || 0;
    current.good += Number(item.goodQty) || 0;
    current.defect += Number(item.defectQty) || 0;
    result.set(name, current);
    return result;
  }, new Map());

  return [...grouped.values()]
    .sort((first, second) => second.production - first.production)
    .slice(0, limit);
};

const groupRecordsByHour = (records) => Array.from({ length: 10 }, (_, index) => {
  const hour = String(index + 8).padStart(2, '0');
  const hourRecords = records.filter((item) => item.occurredAt.slice(11, 13) === hour);

  return {
    time: `${hour}:00`,
    production: hourRecords.reduce((total, item) => total + item.productionQty, 0),
  };
});

function ProductionTooltip({ active, label, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <TooltipCard>
      <strong>{label}</strong>
      {payload.map((item) => (
        <TooltipRow key={item.dataKey || item.name} $color={item.color || item.fill}>
          <span>{item.name}</span>
          <Mono>{formatNumber(item.value)} EA</Mono>
        </TooltipRow>
      ))}
    </TooltipCard>
  );
}

function ProductionAnalysisPage() {
  const [period, setPeriod] = useState('today');
  const periodDays = PERIOD_DAYS[period] || PERIOD_DAYS.today;
  const days = useMemo(
    () => filterDailyProductionByPeriod(periodDays),
    [periodDays],
  );

  const analysis = useMemo(() => {
    const selectedDates = new Set(days.map((item) => item.date));
    const records = productionRecords.filter(
      (item) => item.status !== PRODUCTION_STATUS.CANCELED
        && selectedDates.has(item.occurredAt.slice(0, 10)),
    );
    const products = groupRecords(records, 'product', 5);
    const processes = groupRecords(records, 'process', 7);
    const workOrders = groupRecords(records, 'workOrder', 6).map((item) => ({
      ...item,
      achievement: item.target
        ? Math.round((item.production / item.target) * 1000) / 10
        : 0,
    }));
    const total = records.reduce(
      (summary, item) => ({
        target: summary.target + item.targetQty,
        production: summary.production + item.productionQty,
        good: summary.good + item.goodQty,
        defect: summary.defect + item.defectQty,
      }),
      { target: 0, production: 0, good: 0, defect: 0 },
    );

    return {
      hourly: groupRecordsByHour(records),
      processes,
      products,
      total,
      workOrders,
    };
  }, [days]);

  const achievement = analysis.total.target
    ? (analysis.total.production / analysis.total.target) * 100
    : 0;
  const goodRate = analysis.total.production
    ? (analysis.total.good / analysis.total.production) * 100
    : 0;
  const defectRate = analysis.total.production
    ? (analysis.total.defect / analysis.total.production) * 100
    : 0;
  const periodMeta = period === 'today' ? 'TODAY' : `DATA ${days.length}/${period} DAYS`;

  return (
    <Page>
      <PageHeader>
        <TitleGroup>
          <Eyebrow>Production Performance / Analytics</Eyebrow>
          <h1>실적 분석</h1>
          <p>생산량과 목표 달성 흐름을 일자·제품·공정·작업지시 기준으로 비교합니다.</p>
        </TitleGroup>
        <PeriodField>
          <FiCalendar aria-hidden="true" />
          <span>분석 기간</span>
          <select
            aria-label="생산 실적 분석 기간"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            <option value="today">오늘</option>
            <option value="7">7일</option>
            <option value="30">30일</option>
          </select>
        </PeriodField>
      </PageHeader>

      <MetricGrid aria-label="생산 실적 분석 요약">
        <MetricCard>
          <MetricLabel><FiBarChart2 aria-hidden="true" /> 누적 생산량</MetricLabel>
          <MetricValue>{formatNumber(analysis.total.production)}<small>EA</small></MetricValue>
          <span>선택 기간에 수집된 생산 실적</span>
        </MetricCard>
        <MetricCard>
          <MetricLabel><FiTarget aria-hidden="true" /> 평균 목표 달성률</MetricLabel>
          <MetricValue $tone={achievement >= 100 ? 'success' : 'warning'}>
            {achievement.toFixed(1)}<small>%</small>
          </MetricValue>
          <span>목표 {formatNumber(analysis.total.target)} EA 기준</span>
        </MetricCard>
        <MetricCard>
          <MetricLabel><FiCheckCircle aria-hidden="true" /> 정상 생산 비율</MetricLabel>
          <MetricValue $tone="success">{goodRate.toFixed(1)}<small>%</small></MetricValue>
          <span>정상 {formatNumber(analysis.total.good)} EA</span>
        </MetricCard>
        <MetricCard>
          <MetricLabel><FiAlertTriangle aria-hidden="true" /> 불량 반영 수량</MetricLabel>
          <MetricValue $tone="warning">{formatNumber(analysis.total.defect)}<small>EA</small></MetricValue>
          <span>전체 생산량 대비 {defectRate.toFixed(2)}%</span>
        </MetricCard>
      </MetricGrid>

      <AnalysisGrid>
        <Panel $span={7} aria-labelledby="daily-production-title">
          <PanelHeader>
            <div><PanelLabel>Daily Production</PanelLabel><h2 id="daily-production-title">일별 생산량</h2></div>
            <PanelMeta>{periodMeta}</PanelMeta>
          </PanelHeader>
          <ChartBody role="img" aria-label="일별 목표 수량과 생산량 비교 차트">
            <VisuallyHidden>최근 일별 생산량과 목표 수량을 막대와 선으로 비교합니다.</VisuallyHidden>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={days} margin={{ top: 12, right: 16, left: 2, bottom: 4 }}>
                <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke={chartColors.tick} tickLine={false} axisLine={false} />
                <YAxis stroke={chartColors.tick} tickLine={false} axisLine={false} width={48} />
                <Tooltip cursor={false} content={<ProductionTooltip />} />
                <Legend />
                <Bar dataKey="target" name="목표" fill="#334155" radius={[3, 3, 0, 0]} />
                <Line dataKey="production" name="생산량" type="monotone" stroke={chartColors.green} strokeWidth={2.5} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartBody>
        </Panel>

        <Panel $span={5} aria-labelledby="product-production-title">
          <PanelHeader>
            <div><PanelLabel>By Product</PanelLabel><h2 id="product-production-title">제품별 생산량</h2></div>
            <PanelMeta>TOP {analysis.products.length}</PanelMeta>
          </PanelHeader>
          <ChartBody role="img" aria-label="제품별 생산량 가로 막대 차트">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.products} layout="vertical" margin={{ top: 8, right: 20, left: 16, bottom: 4 }}>
                <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke={chartColors.tick} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke={chartColors.tick} tickLine={false} axisLine={false} width={104} />
                <Tooltip cursor={false} content={<ProductionTooltip />} />
                <Bar dataKey="production" name="생산량" radius={[0, 3, 3, 0]}>
                  {analysis.products.map((item, index) => <Cell key={item.name} fill={PRODUCT_COLORS[index % PRODUCT_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartBody>
        </Panel>

        <Panel $span={5} aria-labelledby="process-production-title">
          <PanelHeader>
            <div><PanelLabel>By Process</PanelLabel><h2 id="process-production-title">공정별 생산량</h2></div>
            <PanelMeta>ALL PROCESS</PanelMeta>
          </PanelHeader>
          <ChartBody role="img" aria-label="공정별 정상 수량과 불량 수량 누적 막대 차트">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.processes} margin={{ top: 12, right: 12, left: 2, bottom: 4 }}>
                <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke={chartColors.tick} tickLine={false} axisLine={false} />
                <YAxis stroke={chartColors.tick} tickLine={false} axisLine={false} width={45} />
                <Tooltip cursor={false} content={<ProductionTooltip />} />
                <Legend />
                <Bar dataKey="good" name="정상" stackId="result" fill={chartColors.green} />
                <Bar dataKey="defect" name="불량" stackId="result" fill={chartColors.red} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartBody>
        </Panel>

        <Panel $span={7} aria-labelledby="work-order-achievement-title">
          <PanelHeader>
            <div><PanelLabel>Work Order Achievement</PanelLabel><h2 id="work-order-achievement-title">작업지시별 달성률</h2></div>
            <PanelMeta>TOP {analysis.workOrders.length}</PanelMeta>
          </PanelHeader>
          <AchievementList>
            {analysis.workOrders.map((item) => (
              <AchievementItem key={item.name}>
                <AchievementHead>
                  <div><strong>{item.name}</strong><span>{formatNumber(item.production)} / {formatNumber(item.target)} EA</span></div>
                  <Mono $tone={item.achievement >= 100 ? 'success' : item.achievement >= 90 ? 'warning' : 'alarm'}>{item.achievement.toFixed(1)}%</Mono>
                </AchievementHead>
                <AchievementTrack aria-label={`${item.name} 목표 달성률 ${item.achievement.toFixed(1)}%`}>
                  <AchievementFill $value={item.achievement} $complete={item.achievement >= 100} />
                </AchievementTrack>
              </AchievementItem>
            ))}
          </AchievementList>
        </Panel>

        <Panel $span={7} aria-labelledby="target-trend-title">
          <PanelHeader>
            <div><PanelLabel>Target vs Actual</PanelLabel><h2 id="target-trend-title">목표 대비 실적 추이</h2></div>
            <PanelMeta>{achievement.toFixed(1)}% AVG</PanelMeta>
          </PanelHeader>
          <ChartBody role="img" aria-label="일자별 목표 대비 생산 실적 추이 차트">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={days} margin={{ top: 12, right: 16, left: 2, bottom: 4 }}>
                <defs>
                  <linearGradient id="productionArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.green} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={chartColors.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke={chartColors.tick} tickLine={false} axisLine={false} />
                <YAxis stroke={chartColors.tick} tickLine={false} axisLine={false} width={48} />
                <Tooltip cursor={false} content={<ProductionTooltip />} />
                <Legend />
                <Area dataKey="production" name="실적" type="monotone" stroke={chartColors.green} fill="url(#productionArea)" strokeWidth={2.5} />
                <Line dataKey="target" name="목표" type="monotone" stroke={chartColors.amber} strokeDasharray="6 5" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartBody>
        </Panel>

        <Panel $span={5} aria-labelledby="hourly-analysis-title">
          <PanelHeader>
            <div><PanelLabel>Hourly Output</PanelLabel><h2 id="hourly-analysis-title">시간대별 생산량</h2></div>
            <PanelMeta>{periodMeta}</PanelMeta>
          </PanelHeader>
          <ChartBody role="img" aria-label="선택 기간 시간대별 생산량 차트">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.hourly} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
                <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" stroke={chartColors.tick} tickLine={false} axisLine={false} />
                <YAxis stroke={chartColors.tick} tickLine={false} axisLine={false} width={42} />
                <Tooltip cursor={false} content={<ProductionTooltip />} />
                <Bar dataKey="production" name="생산량" fill={chartColors.blue} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartBody>
        </Panel>

      </AnalysisGrid>
    </Page>
  );
}

export default ProductionAnalysisPage;
