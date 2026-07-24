import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiActivity,
  FiAlertTriangle,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { defectApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { currentKstDate, kstPeriod } from "../../api/time";
import { QueryStatus } from "../../components/ApiState";
import { formatNumber } from "../../components/OperationalUi";
import {
  BarFill,
  BarTrack,
  BarValue,
  ControlHint,
  ControlRow,
  DailyChart,
  DailyColumn,
  EmptyState,
  Eyebrow,
  FilterField,
  HorizontalItem,
  HorizontalList,
  ItemDetail,
  ItemHeader,
  MetricCard,
  MetricGrid,
  MetricLabel,
  MetricValue,
  Mono,
  Page,
  PageHeader,
  Panel,
  PanelDescription,
  PanelEmpty,
  PanelHeader,
  PanelLabel,
  ProgressFill,
  ProgressTrack,
  QueryRegion,
  Rank,
  StatsGrid,
  Table,
  TableCaption,
  TableWrap,
  TitleGroup,
  Trend,
  TypeCard,
  TypeCopy,
  TypeCount,
  TypeGrid,
  TypeIcon,
} from "./DefectStatisticsPageCss";

const PERIOD_OPTIONS = [
  { value: 1, label: "오늘" },
  { value: 7, label: "최근 7일" },
  { value: 30, label: "최근 30일" },
];

const asNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const asList = (value) => (Array.isArray(value) ? value : []);

const formatPercent = (value, minimumFractionDigits = 0) =>
  `${asNumber(value).toLocaleString("ko-KR", {
    minimumFractionDigits,
    maximumFractionDigits: 2,
  })}%`;

const formatSignedPoint = (value) => {
  const point = asNumber(value);
  const prefix = point > 0 ? "+" : "";
  return `${prefix}${point.toLocaleString("ko-KR", {
    maximumFractionDigits: 2,
  })}%p`;
};

const formatShortDate = (date) => {
  const [, month, day] = String(date || "").split("-");
  return month && day ? `${month}.${day}` : String(date || "-");
};

const scaleToMax = (value, maximum) =>
  maximum > 0
    ? Math.min(100, Math.max(0, (asNumber(value) / maximum) * 100))
    : 0;

export default function DefectStatisticsPage() {
  const [days, setDays] = useState(7);
  const activePeriodLabel =
    PERIOD_OPTIONS.find((option) => option.value === days)?.label ||
    "선택 기간";
  const periodKey = { days, through: currentKstDate() };
  const query = useQuery({
    queryKey: queryKeys.defectStatistics(periodKey),
    queryFn: () => defectApi.statistics(kstPeriod(days)),
    refetchInterval: POLLING.STATISTICS,
  });
  const stats = query.data || {};

  const totalProductionQty = asNumber(stats.totalProductionQty);
  const totalDefectCount = asNumber(stats.totalDefectCount);
  const totalDefectQuantity = asNumber(stats.totalDefectQuantity);
  const periodDefectRate = asNumber(stats.periodDefectRate);
  const handlingRate = asNumber(stats.handlingRate);
  const dailyRates = asList(stats.dailyRates);
  const productRates = asList(stats.productRates);
  const processRates = asList(stats.processQuantities).map((item) => ({
    ...item,
    derivedRate:
      totalProductionQty > 0
        ? (asNumber(item.defectQty) / totalProductionQty) * 100
        : null,
  }));
  const typeCounts = asList(stats.typeCounts);
  const rankings = asList(stats.rankings);
  const maxDailyRate = Math.max(0, ...dailyRates.map((item) => asNumber(item.defectRate)));
  const maxProductRate = Math.max(0, ...productRates.map((item) => asNumber(item.defectRate)));
  const maxProcessRate = Math.max(
    0,
    ...processRates.map((item) => asNumber(item.derivedRate)),
  );
  const hasOperationalData =
    totalProductionQty > 0 ||
    totalDefectCount > 0 ||
    totalDefectQuantity > 0;

  return (
    <Page
      aria-busy={query.isFetching}
      aria-labelledby="defect-statistics-title"
    >
      <PageHeader>
        <TitleGroup>
          <Eyebrow>Quality / Analytics</Eyebrow>
          <h1 id="defect-statistics-title">불량 통계</h1>
          <p>
            생산 실적과 불량 이력을 같은 기간으로 비교해 품질 추세와 반복
            불량을 확인합니다.
          </p>
        </TitleGroup>
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

      <QueryRegion $standalone={!query.data} aria-live="polite">
        <QueryStatus query={query} />
      </QueryRegion>

      {query.data && (
        <>
          <MetricGrid aria-label="기간 품질 핵심 지표">
            <MetricCard>
              <MetricLabel>
                <FiActivity aria-hidden="true" />
                생산 수량
              </MetricLabel>
              <MetricValue>
                {formatNumber(totalProductionQty)}
                <small>EA</small>
              </MetricValue>
              <span>선택 기간 누적 생산 실적</span>
            </MetricCard>
            <MetricCard>
              <MetricLabel>
                <FiAlertTriangle aria-hidden="true" />
                불량 발생
              </MetricLabel>
              <MetricValue $warning={totalDefectCount > 0}>
                {formatNumber(totalDefectCount)}
                <small>건</small>
              </MetricValue>
              <span>불량 수량 {formatNumber(totalDefectQuantity)} EA</span>
            </MetricCard>
            <MetricCard>
              <MetricLabel>
                <FiBarChart2 aria-hidden="true" />
                기간 불량률
              </MetricLabel>
              <MetricValue $warning={periodDefectRate > 0}>
                {formatPercent(periodDefectRate)}
              </MetricValue>
              <span>
                이전 동일 기간 대비{" "}
                {formatSignedPoint(
                  stats.previousPeriodRateChangePercentagePoint
                )}
              </span>
            </MetricCard>
            <MetricCard>
              <MetricLabel>
                <FiCheckCircle aria-hidden="true" />
                처리율
              </MetricLabel>
              <MetricValue $success={handlingRate >= 100}>
                {formatPercent(handlingRate)}
              </MetricValue>
              <span>
                {formatNumber(stats.completedDefectCount)} /{" "}
                {formatNumber(totalDefectCount)}건 처리 완료
              </span>
            </MetricCard>
          </MetricGrid>

          {!hasOperationalData ? (
            <EmptyState role="status">
              <FiBarChart2 aria-hidden="true" />
              <strong>집계할 생산·불량 데이터가 없습니다.</strong>
              <span>
                {activePeriodLabel}에 등록된 생산 실적 또는 불량 이력을
                확인해 주세요.
              </span>
            </EmptyState>
          ) : (
            <StatsGrid aria-label="불량 통계 상세">
              <Panel $span={8} aria-labelledby="daily-rate-title">
                <PanelHeader>
                  <div>
                    <PanelLabel>Daily rate</PanelLabel>
                    <h2 id="daily-rate-title">일별 불량률</h2>
                    <PanelDescription>
                      일별 생산 수량 대비 불량 수량
                    </PanelDescription>
                  </div>
                  <Mono>최고 {formatPercent(maxDailyRate)}</Mono>
                </PanelHeader>
                {dailyRates.length === 0 ? (
                  <PanelEmpty>일별 집계 데이터가 없습니다.</PanelEmpty>
                ) : (
                  <DailyChart as="ul" aria-label="일별 불량률 비교 차트">
                    {dailyRates.map((item) => {
                      const rate = asNumber(item.defectRate);
                      return (
                        <DailyColumn
                          as="li"
                          key={item.date}
                          aria-label={`${item.date}, 불량률 ${formatPercent(
                            rate
                          )}, 불량 ${formatNumber(
                            item.defectQty
                          )}개, 생산 ${formatNumber(item.productionQty)}개`}
                        >
                          <BarValue>{formatPercent(rate)}</BarValue>
                          <BarTrack
                            role="meter"
                            aria-label={`${item.date} 불량률`}
                            aria-valuemin={0}
                            aria-valuemax={maxDailyRate || 1}
                            aria-valuenow={rate}
                            aria-valuetext={formatPercent(rate)}
                          >
                            <BarFill
                              $value={scaleToMax(rate, maxDailyRate)}
                              $warning={
                                rate > periodDefectRate && rate > 0
                              }
                            />
                          </BarTrack>
                          <time dateTime={item.date}>
                            {formatShortDate(item.date)}
                          </time>
                        </DailyColumn>
                      );
                    })}
                  </DailyChart>
                )}
              </Panel>

              <Panel $span={4} aria-labelledby="product-rate-title">
                <PanelHeader>
                  <div>
                    <PanelLabel>By product</PanelLabel>
                    <h2 id="product-rate-title">제품별 불량률</h2>
                    <PanelDescription>
                      제품별 생산 수량을 분모로 계산
                    </PanelDescription>
                  </div>
                </PanelHeader>
                {productRates.length === 0 ? (
                  <PanelEmpty>제품별 집계 데이터가 없습니다.</PanelEmpty>
                ) : (
                  <HorizontalList as="ul">
                    {productRates.map((item) => {
                      const rate = asNumber(item.defectRate);
                      return (
                        <HorizontalItem as="li" key={item.productId}>
                          <ItemHeader>
                            <strong>{item.productName || "제품 미지정"}</strong>
                            <Mono>{formatPercent(rate)}</Mono>
                          </ItemHeader>
                          <ProgressTrack
                            role="meter"
                            aria-label={`${item.productName || "제품"} 불량률`}
                            aria-valuemin={0}
                            aria-valuemax={maxProductRate || 1}
                            aria-valuenow={rate}
                            aria-valuetext={formatPercent(rate)}
                          >
                            <ProgressFill
                              $value={scaleToMax(rate, maxProductRate)}
                            />
                          </ProgressTrack>
                          <ItemDetail>
                            불량 {formatNumber(item.defectQty)} EA / 생산{" "}
                            {formatNumber(item.productionQty)} EA
                          </ItemDetail>
                        </HorizontalItem>
                      );
                    })}
                  </HorizontalList>
                )}
              </Panel>

              <Panel $span={6} aria-labelledby="process-rate-title">
                <PanelHeader>
                  <div>
                    <PanelLabel>By process</PanelLabel>
                    <h2 id="process-rate-title">
                      공정별 불량률 · 전체 생산 기준
                    </h2>
                    <PanelDescription>
                      공정 생산량 미제공으로 전체 생산량을 공통 분모로 산정한
                      참고 지표
                    </PanelDescription>
                  </div>
                </PanelHeader>
                {processRates.length === 0 ? (
                  <PanelEmpty>공정별 불량 데이터가 없습니다.</PanelEmpty>
                ) : (
                  <HorizontalList as="ul">
                    {processRates.map((item) => {
                      const hasProductionBase = item.derivedRate != null;
                      return (
                        <HorizontalItem as="li" key={item.processName}>
                          <ItemHeader>
                            <strong>
                              {item.processName || "공정 미지정"}
                            </strong>
                            <Mono>
                              {hasProductionBase
                                ? formatPercent(item.derivedRate, 2)
                                : "산정 불가"}
                            </Mono>
                          </ItemHeader>
                          <ProgressTrack
                            role={hasProductionBase ? "meter" : undefined}
                            aria-label={
                              hasProductionBase
                                ? `${
                                    item.processName || "공정"
                                  } 전체 생산량 기준 불량률`
                                : undefined
                            }
                            aria-valuemin={
                              hasProductionBase ? 0 : undefined
                            }
                            aria-valuemax={
                              hasProductionBase
                                ? maxProcessRate || 1
                                : undefined
                            }
                            aria-valuenow={
                              hasProductionBase
                                ? item.derivedRate
                                : undefined
                            }
                            aria-valuetext={
                              hasProductionBase
                                ? formatPercent(item.derivedRate, 2)
                                : undefined
                            }
                          >
                            <ProgressFill
                              $value={
                                hasProductionBase
                                  ? scaleToMax(
                                      item.derivedRate,
                                      maxProcessRate,
                                    )
                                  : 0
                              }
                              $warning
                            />
                          </ProgressTrack>
                          <ItemDetail>
                            {hasProductionBase
                              ? `공정 불량 ${formatNumber(
                                  item.defectQty,
                                )} EA / 전체 생산 ${formatNumber(
                                  totalProductionQty,
                                )} EA`
                              : `공정 불량 ${formatNumber(
                                  item.defectQty,
                                )} EA · 생산 실적이 없어 비율 산정 불가`}
                          </ItemDetail>
                        </HorizontalItem>
                      );
                    })}
                  </HorizontalList>
                )}
              </Panel>

              <Panel $span={6} aria-labelledby="type-count-title">
                <PanelHeader>
                  <div>
                    <PanelLabel>Event count</PanelLabel>
                    <h2 id="type-count-title">불량 유형별 발생 건수</h2>
                    <PanelDescription>
                      유형별 이벤트 건수와 불량 수량
                    </PanelDescription>
                  </div>
                  <Mono>{formatNumber(totalDefectCount)} EVENTS</Mono>
                </PanelHeader>
                {typeCounts.length === 0 ? (
                  <PanelEmpty>유형별 불량 데이터가 없습니다.</PanelEmpty>
                ) : (
                  <TypeGrid as="ul">
                    {typeCounts.map((item, index) => (
                      <TypeCard as="li" key={item.defectType}>
                        <TypeIcon aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </TypeIcon>
                        <TypeCopy>
                          <strong>
                            {item.defectTypeLabel || item.defectType}
                          </strong>
                          <span>
                            {formatNumber(item.quantity)} EA · 이벤트 비중{" "}
                            {formatPercent(item.ratio)}
                          </span>
                        </TypeCopy>
                        <TypeCount>
                          <strong>{formatNumber(item.eventCount)}</strong>
                          <span>건</span>
                        </TypeCount>
                      </TypeCard>
                    ))}
                  </TypeGrid>
                )}
              </Panel>

              <Panel $span={12} aria-labelledby="ranking-title">
                <PanelHeader>
                  <div>
                    <PanelLabel>Recurring defects</PanelLabel>
                    <h2 id="ranking-title">자주 발생하는 불량 순위</h2>
                    <PanelDescription>
                      발생 건수 기준 · 이전 동일 기간과 비교
                    </PanelDescription>
                  </div>
                </PanelHeader>
                {rankings.length === 0 ? (
                  <PanelEmpty>순위로 집계할 불량 데이터가 없습니다.</PanelEmpty>
                ) : (
                  <TableWrap
                    role="region"
                    aria-labelledby="ranking-title"
                  >
                    <Table>
                      <TableCaption>
                        자주 발생하는 불량 유형 순위
                      </TableCaption>
                      <thead>
                        <tr>
                          <th scope="col">순위</th>
                          <th scope="col">불량 유형</th>
                          <th scope="col">주요 발생 공정</th>
                          <th scope="col">발생 건수</th>
                          <th scope="col">이전 기간 대비</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rankings.map((item) => {
                          const change =
                            item.changeRatePercent == null
                              ? null
                              : asNumber(item.changeRatePercent);
                          const trend =
                            change == null
                              ? "new"
                              : change > 0
                                ? "up"
                                : change < 0
                                  ? "down"
                                  : "flat";
                          return (
                            <tr
                              key={`${item.rank}-${item.defectTypeLabel}`}
                            >
                              <td>
                                <Rank>{item.rank}</Rank>
                              </td>
                              <td>{item.defectTypeLabel || "-"}</td>
                              <td>{item.mainProcessName || "-"}</td>
                              <td>{formatNumber(item.eventCount)}건</td>
                              <td>
                                <Trend $trend={trend}>
                                  {change == null
                                    ? "신규"
                                    : `${change > 0 ? "+" : ""}${formatPercent(
                                        change
                                      )}`}
                                </Trend>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </TableWrap>
                )}
              </Panel>
            </StatsGrid>
          )}
        </>
      )}
    </Page>
  );
}
