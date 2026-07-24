import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiActivity,
  FiAlertTriangle,
  FiCalendar,
  FiClock,
  FiCpu,
  FiRefreshCw,
  FiTrendingUp,
} from "react-icons/fi";
import { alarmApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { currentKstDate, kstPeriod } from "../../api/time";
import { QueryStatus } from "../../components/ApiState";
import {
  BarChart,
  BarColumn,
  BarFill,
  BarTrack,
  ControlHint,
  ControlRow,
  DashboardGrid,
  DonutChart,
  EmptyPanel,
  Eyebrow,
  FilterField,
  HorizontalItem,
  HorizontalList,
  InsightsGrid,
  LegendItem,
  LegendList,
  MetricCard,
  MetricGrid,
  MetricLabel,
  MonoText,
  PageHeader,
  PageShell,
  Panel,
  PanelHeader,
  PanelLabel,
  PanelMeta,
  ProgressFill,
  ProgressTrack,
  RankBadge,
  RankTable,
  RefreshState,
  RatioWrap,
  SeverityChip,
  TableFrame,
  TitleBlock,
} from "./AlarmStatisticsPageCss";

const PERIOD_OPTIONS = [
  { value: 1, label: "오늘" },
  { value: 7, label: "최근 7일" },
  { value: 30, label: "최근 30일" },
];

const SEVERITY_ORDER = ["CRITICAL", "WARNING", "INFO"];

const asNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const formatCount = (value) => asNumber(value).toLocaleString("ko-KR");

const formatRatio = (value) =>
  asNumber(value).toLocaleString("ko-KR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const shortDate = (value) => {
  const date = String(value || "");
  return date.length >= 10 ? date.slice(5).replace("-", ".") : date || "-";
};

const normalizeSeverity = (severity) =>
  String(severity || "INFO").toLowerCase();

const updatedTime = (timestamp) => {
  if (!timestamp) {
    return "갱신 대기";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  }).format(timestamp);
};

export default function AlarmStatisticsPage() {
  const [days, setDays] = useState(7);
  const periodKey = { days, through: currentKstDate() };
  const query = useQuery({
    queryKey: queryKeys.alarmStatistics(periodKey),
    queryFn: () => alarmApi.statistics(kstPeriod(days)),
    refetchInterval: POLLING.STATISTICS,
    placeholderData: (previous) => previous,
  });

  const stats = query.data;
  const dailyCounts = Array.isArray(stats?.dailyCounts)
    ? stats.dailyCounts
    : [];
  const equipmentCounts = Array.isArray(stats?.equipmentCounts)
    ? stats.equipmentCounts
    : [];
  const severityCounts = Array.isArray(stats?.severityCounts)
    ? stats.severityCounts
    : [];
  const frequentAlarms = Array.isArray(stats?.frequentAlarms)
    ? stats.frequentAlarms
    : [];
  const totalCount = asNumber(stats?.totalCount);
  const dailyMaximum = Math.max(
    1,
    ...dailyCounts.map((item) => asNumber(item.count)),
  );
  const equipmentMaximum = Math.max(
    1,
    ...equipmentCounts.map((item) => asNumber(item.count)),
  );
  const dailyAverage = dailyCounts.length
    ? totalCount / dailyCounts.length
    : 0;

  const severityByType = new Map(
    severityCounts.map((item) => [
      String(item.severity || "").toUpperCase(),
      item,
    ]),
  );
  const orderedSeverities = SEVERITY_ORDER.map(
    (severity) =>
      severityByType.get(severity) || {
        severity,
        severityLabel:
          severity === "CRITICAL"
            ? "심각"
            : severity === "WARNING"
              ? "경고"
              : "정보",
        count: 0,
        ratio: 0,
      },
  );
  const critical = severityByType.get("CRITICAL") || {
    count: 0,
    ratio: 0,
  };
  const warning = severityByType.get("WARNING") || {
    count: 0,
    ratio: 0,
  };

  return (
    <PageShell>
      <PageHeader>
        <TitleBlock>
          <Eyebrow>ALARM ANALYTICS</Eyebrow>
          <h1>알람 통계</h1>
          <p>
            일별 추이부터 설비·심각도·빈발 유형까지 비교해 반복되는 이상
            패턴과 우선 점검 대상을 확인합니다.
          </p>
        </TitleBlock>
        <RefreshState $active={query.isFetching} aria-live="polite">
          <FiRefreshCw aria-hidden="true" />
          <span>
            {query.isFetching
              ? "데이터 동기화 중"
              : `최근 갱신 ${updatedTime(query.dataUpdatedAt)}`}
          </span>
        </RefreshState>
      </PageHeader>

      <ControlRow>
        <ControlHint>
          <FiClock aria-hidden="true" />
          <span>KST 기준 · 1분마다 자동 갱신</span>
        </ControlHint>
        <FilterField>
          <FiCalendar aria-hidden="true" />
          <select
            aria-label="통계 조회 기간"
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FilterField>
      </ControlRow>

      <QueryStatus query={query} />

      {stats && (
        <>
          <MetricGrid aria-label="알람 핵심 지표">
            <MetricCard>
              <MetricLabel>
                <FiActivity aria-hidden="true" />
                전체 알람
              </MetricLabel>
              <strong>{formatCount(totalCount)}</strong>
              <span>선택한 기간의 총 발생 건수</span>
            </MetricCard>
            <MetricCard>
              <MetricLabel>
                <FiTrendingUp aria-hidden="true" />
                일 평균
              </MetricLabel>
              <strong>{formatRatio(dailyAverage)}</strong>
              <span>하루 평균 알람 발생 건수</span>
            </MetricCard>
            <MetricCard $tone="critical">
              <MetricLabel>
                <FiAlertTriangle aria-hidden="true" />
                심각 알람
              </MetricLabel>
              <strong>{formatCount(critical.count)}</strong>
              <span>전체의 {formatRatio(critical.ratio)}%</span>
            </MetricCard>
          </MetricGrid>

          <DashboardGrid>
            <Panel>
              <PanelHeader>
                <div>
                  <PanelLabel>DAILY TREND</PanelLabel>
                  <h2>일별 알람 발생 수</h2>
                </div>
                <PanelMeta>최고 {formatCount(dailyMaximum)}건</PanelMeta>
              </PanelHeader>
              {dailyCounts.length > 0 ? (
                <BarChart
                  $count={dailyCounts.length}
                  role="img"
                  aria-label={`${days}일간 일별 알람 발생 건수 막대 차트`}
                >
                  {dailyCounts.map((item) => {
                    const count = asNumber(item.count);
                    const height = (count / dailyMaximum) * 100;
                    return (
                      <BarColumn
                        key={item.date}
                        title={`${item.date}: ${formatCount(count)}건`}
                      >
                        <MonoText>{formatCount(count)}</MonoText>
                        <BarTrack>
                          <BarFill $value={height} />
                        </BarTrack>
                        <span>{shortDate(item.date)}</span>
                      </BarColumn>
                    );
                  })}
                </BarChart>
              ) : (
                <EmptyPanel>표시할 일별 통계가 없습니다.</EmptyPanel>
              )}
            </Panel>

            <Panel>
              <PanelHeader>
                <div>
                  <PanelLabel>SEVERITY MIX</PanelLabel>
                  <h2>심각도별 알람 비율</h2>
                </div>
                <PanelMeta>전체 {formatCount(totalCount)}건</PanelMeta>
              </PanelHeader>
              <RatioWrap>
                <DonutChart
                  $critical={asNumber(critical.ratio)}
                  $warning={asNumber(warning.ratio)}
                  $total={totalCount}
                  role="img"
                  aria-label={`심각 알람 비율 ${formatRatio(critical.ratio)}%`}
                >
                  <strong>{formatRatio(critical.ratio)}%</strong>
                  <span>심각 비율</span>
                </DonutChart>
                <LegendList>
                  {orderedSeverities.map((item) => (
                    <LegendItem
                      key={item.severity}
                      $severity={normalizeSeverity(item.severity)}
                    >
                      <span aria-hidden="true" />
                      <strong>{item.severityLabel}</strong>
                      <MonoText>
                        {formatCount(item.count)}건 · {formatRatio(item.ratio)}%
                      </MonoText>
                    </LegendItem>
                  ))}
                </LegendList>
              </RatioWrap>
            </Panel>
          </DashboardGrid>

          <InsightsGrid>
            <Panel>
              <PanelHeader>
                <div>
                  <PanelLabel>EQUIPMENT</PanelLabel>
                  <h2>설비별 알람 발생 수</h2>
                </div>
                <PanelMeta>상위 {equipmentCounts.length}개</PanelMeta>
              </PanelHeader>
              {equipmentCounts.length > 0 ? (
                <HorizontalList>
                  {equipmentCounts.map((item) => (
                    <HorizontalItem
                      key={item.equipmentId ?? item.equipmentCode}
                    >
                      <div>
                        <span>
                          <FiCpu aria-hidden="true" />
                          <strong>{item.equipmentName || "-"}</strong>
                          <small>{item.equipmentCode || "-"}</small>
                        </span>
                        <MonoText>{formatCount(item.count)}건</MonoText>
                      </div>
                      <ProgressTrack>
                        <ProgressFill
                          $value={
                            (asNumber(item.count) / equipmentMaximum) * 100
                          }
                        />
                      </ProgressTrack>
                    </HorizontalItem>
                  ))}
                </HorizontalList>
              ) : (
                <EmptyPanel>설비별 알람 발생 내역이 없습니다.</EmptyPanel>
              )}
            </Panel>

            <Panel>
              <PanelHeader>
                <div>
                  <PanelLabel>FREQUENT ALARMS</PanelLabel>
                  <h2>자주 발생하는 알람 순위</h2>
                </div>
                <PanelMeta>TOP {frequentAlarms.length}</PanelMeta>
              </PanelHeader>
              {frequentAlarms.length > 0 ? (
                <TableFrame>
                  <RankTable>
                    <thead>
                      <tr>
                        <th>순위</th>
                        <th>알람 내용</th>
                        <th>설비</th>
                        <th>심각도</th>
                        <th>건수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {frequentAlarms.map((item, index) => (
                        <tr
                          key={`${item.rank ?? index}-${item.equipmentCode}-${item.message}`}
                        >
                          <td data-label="순위">
                            <RankBadge>{item.rank ?? index + 1}</RankBadge>
                          </td>
                          <td data-label="알람 내용">{item.message || "-"}</td>
                          <td data-label="설비">
                            <div>
                              <strong>{item.equipmentName || "-"}</strong>
                              <MonoText>{item.equipmentCode || "-"}</MonoText>
                            </div>
                          </td>
                          <td data-label="심각도">
                            <SeverityChip
                              $severity={normalizeSeverity(item.severity)}
                            >
                              {item.severityLabel || item.severity || "-"}
                            </SeverityChip>
                          </td>
                          <td data-label="건수">
                            <MonoText>{formatCount(item.count)}</MonoText>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </RankTable>
                </TableFrame>
              ) : (
                <EmptyPanel>집계된 빈발 알람이 없습니다.</EmptyPanel>
              )}
            </Panel>
          </InsightsGrid>
        </>
      )}
    </PageShell>
  );
}
