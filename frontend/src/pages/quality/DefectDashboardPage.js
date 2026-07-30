import { useQuery } from "@tanstack/react-query";
import {
  FiAlertCircle,
  FiBarChart2,
  FiBox,
  FiChevronRight,
  FiClock,
  FiGrid,
  FiLayers,
  FiTrendingUp,
} from "react-icons/fi";
import { defectApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { currentKstDate, kstPeriod } from "../../api/time";
import { QueryStatus } from "../../components/ApiState";
import { formatNumber } from "../../components/OperationalUi";
import DefectDataTable from "./DefectDataTable";
import {
  DashboardGrid,
  EmptyState,
  Eyebrow,
  MetricCard,
  MetricFoot,
  MetricGrid,
  MetricHead,
  MetricValue,
  Mono,
  Page,
  PageHeader,
  Panel,
  PanelHeader,
  PanelLabel,
  PanelMeta,
  ProcessCount,
  ProcessHead,
  ProcessItem,
  ProcessList,
  ProgressFill,
  ProgressTrack,
  StatusChip,
  Table,
  TableWrap,
  TitleGroup,
} from "./DefectDashboardPageCss";

const tableComponents = {
  Mono,
  StatusChip,
  Table,
  TableWrap,
};

const asNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export default function DefectDashboardPage() {
  const periodKey = { scope: "today", date: currentKstDate() };
  const dashboardQuery = useQuery({
    queryKey: queryKeys.defectDashboard(),
    queryFn: defectApi.dashboard,
    refetchInterval: POLLING.DEFECT,
  });
  const statsQuery = useQuery({
    queryKey: queryKeys.defectStatistics(periodKey),
    queryFn: () => defectApi.statistics(kstPeriod(1)),
    refetchInterval: POLLING.STATISTICS,
  });
  const dashboard = dashboardQuery.data || {};
  const stats = statsQuery.data || {};
  const hasDashboardData = Boolean(dashboardQuery.data);
  const hasStatisticsData = Boolean(statsQuery.data);
  const typeQuantities = stats.typeCounts || [];
  const topTypeQuantities = typeQuantities.slice(0, 5);
  const recentDefects = dashboard.recentDefects || [];
  const typeTotal = typeQuantities.reduce(
    (sum, item) => sum + asNumber(item.quantity),
    0,
  );
  const typeMaximum = Math.max(
    0,
    ...topTypeQuantities.map((item) => asNumber(item.quantity)),
  );

  return (
    <Page>
      <PageHeader>
        <TitleGroup>
          <Eyebrow>Quality Control</Eyebrow>
          <h1>불량 현황</h1>
          <p>
            오늘 발생한 불량과 유형별 분포, 우선 처리가 필요한 최근 항목을
            한눈에 확인합니다.
          </p>
        </TitleGroup>
      </PageHeader>

      <MetricGrid
        aria-label="오늘의 품질 핵심 지표"
        aria-busy={dashboardQuery.isPending || statsQuery.isPending}
      >
        <MetricCard $tone="danger">
          <MetricHead>
            <FiAlertCircle aria-hidden="true" />
            오늘 불량 수량
          </MetricHead>
          <MetricValue>
            {hasDashboardData
              ? formatNumber(dashboard.todayDefectQuantity)
              : "—"}
            <small>EA</small>
          </MetricValue>
          <MetricFoot>
            <FiClock aria-hidden="true" />
            {hasDashboardData
              ? "금일 누적 불량 수량"
              : dashboardQuery.isError
                ? "현황 데이터를 불러오지 못했습니다"
                : "현황 데이터 불러오는 중"}
          </MetricFoot>
        </MetricCard>
        <MetricCard $tone="warning">
          <MetricHead>
            <FiTrendingUp aria-hidden="true" />
            오늘 불량률
          </MetricHead>
          <MetricValue>
            {hasStatisticsData
              ? asNumber(stats.periodDefectRate).toLocaleString("ko-KR")
              : "—"}
            <small>%</small>
          </MetricValue>
          <MetricFoot>
            <FiBarChart2 aria-hidden="true" />
            {hasStatisticsData
              ? "금일 생산량 대비"
              : statsQuery.isError
                ? "통계 데이터를 불러오지 못했습니다"
                : "통계 데이터 불러오는 중"}
          </MetricFoot>
        </MetricCard>
        <MetricCard $tone="danger">
          <MetricHead>
            <FiLayers aria-hidden="true" />
            미처리 불량 건수
          </MetricHead>
          <MetricValue>
            {hasDashboardData
              ? formatNumber(dashboard.unhandledDefectCount)
              : "—"}
            <small>건</small>
          </MetricValue>
          <MetricFoot>
            <FiChevronRight aria-hidden="true" />
            {hasDashboardData
              ? "확인 및 조치 필요"
              : dashboardQuery.isError
                ? "현황 데이터를 불러오지 못했습니다"
                : "현황 데이터 불러오는 중"}
          </MetricFoot>
        </MetricCard>
        <MetricCard $tone="success">
          <MetricHead>
            <FiBox aria-hidden="true" />
            오늘 생산 수량
          </MetricHead>
          <MetricValue>
            {hasStatisticsData
              ? formatNumber(stats.totalProductionQty)
              : "—"}
            <small>EA</small>
          </MetricValue>
          <MetricFoot>
            <FiGrid aria-hidden="true" />
            {hasStatisticsData
              ? "불량률 산정 기준 생산량"
              : statsQuery.isError
                ? "통계 데이터를 불러오지 못했습니다"
                : "통계 데이터 불러오는 중"}
          </MetricFoot>
        </MetricCard>
      </MetricGrid>

      <DashboardGrid>
        <Panel aria-busy={dashboardQuery.isFetching}>
          <PanelHeader>
            <div>
              <PanelLabel>Recent Defects</PanelLabel>
              <h2>최근 발생 불량</h2>
            </div>
            <PanelMeta>
              {dashboardQuery.isFetching ? "갱신 중 · " : ""}
              최근 {recentDefects.length}건
            </PanelMeta>
          </PanelHeader>
          <QueryStatus query={dashboardQuery} />
          {recentDefects.length > 0 ? (
            <DefectDataTable
              components={tableComponents}
              defects={recentDefects}
            />
          ) : (
            !dashboardQuery.isPending
            && !dashboardQuery.isError
            && (
              <EmptyState>
                <FiAlertCircle aria-hidden="true" />
                <strong>최근 발생한 불량이 없습니다.</strong>
                <span>새 불량이 등록되면 이 영역에 표시됩니다.</span>
              </EmptyState>
            )
          )}
        </Panel>

        <Panel>
          <PanelHeader>
            <div>
              <PanelLabel>Type Distribution</PanelLabel>
              <h2>유형별 불량 수량 TOP 5</h2>
            </div>
            <PanelMeta>총 {formatNumber(typeTotal)} EA</PanelMeta>
          </PanelHeader>
          <QueryStatus query={statsQuery} />
          {topTypeQuantities.length > 0 ? (
            <ProcessList>
              {topTypeQuantities.map((item) => {
                const quantity = asNumber(item.quantity);
                const share = typeTotal > 0
                  ? (quantity / typeTotal) * 100
                  : 0;
                const relativeWidth = typeMaximum > 0
                  ? (quantity / typeMaximum) * 100
                  : 0;
                const typeLabel = item.defectTypeLabel || "미지정 유형";

                return (
                  <ProcessItem key={item.defectType || typeLabel}>
                    <ProcessHead>
                      <div>
                        <strong>{typeLabel}</strong>
                        <span>전체 불량의 {share.toFixed(1)}%</span>
                      </div>
                      <ProcessCount>{formatNumber(quantity)} EA</ProcessCount>
                    </ProcessHead>
                    <ProgressTrack
                      aria-label={`${typeLabel} 불량 수량`}
                      aria-valuemax={typeMaximum || 1}
                      aria-valuemin={0}
                      aria-valuenow={quantity}
                      role="progressbar"
                    >
                      <ProgressFill $value={relativeWidth} />
                    </ProgressTrack>
                  </ProcessItem>
                );
              })}
            </ProcessList>
          ) : (
            !statsQuery.isPending
            && !statsQuery.isError
            && (
              <EmptyState>
                <FiBarChart2 aria-hidden="true" />
                <strong>유형별 불량이 없습니다.</strong>
                <span>오늘 집계된 불량 유형별 수량이 표시됩니다.</span>
              </EmptyState>
            )
          )}
        </Panel>
      </DashboardGrid>
    </Page>
  );
}
