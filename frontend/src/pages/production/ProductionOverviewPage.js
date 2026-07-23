import { useQuery } from "@tanstack/react-query";
import { productionApi, workOrderApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { currentKstDate, kstPeriod, toKst } from "../../api/time";
import { QueryStatus } from "../../components/ApiState";
import {
  Badge,
  Card,
  Grid,
  Header,
  Metric,
  Page,
  Table,
  TableWrap,
  formatNumber,
  toneForStatus,
} from "../../components/OperationalUi";

export default function ProductionOverviewPage() {
  const periodKey = { scope: "today", date: currentKstDate() };
  const summaryQuery = useQuery({
    queryKey: queryKeys.productionSummary(periodKey),
    queryFn: () => productionApi.summary(kstPeriod(1)),
    refetchInterval: POLLING.PRODUCTION,
  });
  const recentQuery = useQuery({
    queryKey: queryKeys.productionResults({ recent: 5 }),
    queryFn: () => productionApi.recent({ limit: 5 }),
    refetchInterval: POLLING.PRODUCTION,
  });
  const hourlyQuery = useQuery({
    queryKey: queryKeys.hourlyProduction(periodKey),
    queryFn: () => productionApi.hourly(kstPeriod(1)),
    refetchInterval: POLLING.PRODUCTION,
  });
  const activeQuery = useQuery({
    queryKey: queryKeys.activeWorkOrder(),
    queryFn: workOrderApi.active,
    refetchInterval: POLLING.WORK_ORDER,
  });
  const summary = summaryQuery.data || {};

  return (
    <Page>
      <Header><div><h1>생산 실적 현황</h1><p>1시간·보류·완료 집계 데이터를 60초마다 갱신합니다.</p></div></Header>
      <QueryStatus query={summaryQuery} />
      <Grid>
        <Metric><span>오늘 목표</span><strong>{formatNumber(summary.targetQty)} EA</strong></Metric>
        <Metric><span>오늘 생산</span><strong>{formatNumber(summary.productionQty)} EA</strong></Metric>
        <Metric><span>정상 / 불량</span><strong>{formatNumber(summary.goodQty)} / {formatNumber(summary.defectQty)}</strong></Metric>
        <Metric><span>목표 달성률</span><strong>{summary.achievementRate || 0}%</strong></Metric>
      </Grid>

      <h2>활성 공정·설비 상태</h2>
      {activeQuery.data ? <Grid>
        {activeQuery.data.processes.map((process) => (
          <Card key={process.processProgressId}><h3>{process.processName}</h3><p>{process.equipmentCode} {process.equipmentName}</p><Badge $tone={toneForStatus(process.status)}>{process.statusLabel}</Badge>{" "}<Badge $tone={toneForStatus(activeQuery.data.equipments.find((equipment) => equipment.equipmentId === process.equipmentId)?.status)}>{activeQuery.data.equipments.find((equipment) => equipment.equipmentId === process.equipmentId)?.statusLabel || "설비 상태 미확인"}</Badge></Card>
        ))}
      </Grid> : <p>진행 또는 보류 중인 작업지시가 없습니다.</p>}
      <QueryStatus query={activeQuery} />

      <h2>최근 생산 실적</h2>
      <QueryStatus query={recentQuery} empty={recentQuery.data?.length === 0} />
      <TableWrap><Table>
        <thead><tr><th>실적 번호</th><th>작업지시</th><th>제품</th><th>생산/정상/불량</th><th>상태</th><th>마지막 집계 시각</th></tr></thead>
        <tbody>{(recentQuery.data || []).map((result) => (
          <tr key={result.productionResultId}><td>{result.resultNo}</td><td>{result.workOrderNo}</td><td>{result.productName}</td><td>{formatNumber(result.productionQty)} / {formatNumber(result.goodQty)} / {formatNumber(result.defectQty)}</td><td><Badge $tone={toneForStatus(result.status)}>{result.statusLabel}</Badge></td><td>{toKst(result.lastAggregatedAt)}</td></tr>
        ))}</tbody>
      </Table></TableWrap>

      <h2>시간 집계</h2>
      <QueryStatus query={hourlyQuery} empty={hourlyQuery.data?.length === 0} />
      <TableWrap><Table>
        <thead><tr><th>집계 구간</th><th>목표</th><th>생산</th><th>정상</th><th>불량</th><th>종료 사유</th></tr></thead>
        <tbody>{(hourlyQuery.data || []).slice(-12).reverse().map((row) => (
          <tr key={row.hourlyProductionId}><td>{toKst(row.bucketStart)} ~ {toKst(row.bucketEnd)}</td><td>{formatNumber(row.targetQty)}</td><td>{formatNumber(row.productionQty)}</td><td>{formatNumber(row.goodQty)}</td><td>{formatNumber(row.defectQty)}</td><td>{row.closeReason}</td></tr>
        ))}</tbody>
      </Table></TableWrap>
    </Page>
  );
}
