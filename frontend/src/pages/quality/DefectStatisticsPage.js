import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { defectApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { currentKstDate, kstPeriod } from "../../api/time";
import { QueryStatus } from "../../components/ApiState";
import { Card, Grid, Header, Metric, Page, Select, Table, TableWrap, formatNumber } from "../../components/OperationalUi";

export default function DefectStatisticsPage() {
  const [days, setDays] = useState(7);
  const periodKey = { days, through: currentKstDate() };
  const query = useQuery({ queryKey: queryKeys.defectStatistics(periodKey), queryFn: () => defectApi.statistics(kstPeriod(days)), refetchInterval: POLLING.STATISTICS, placeholderData: (previous) => previous });
  const stats = query.data || {};
  return <Page>
    <Header><div><h1>불량 통계</h1><p>HourlyProduction 생산수량을 분모로 계산한 통계입니다.</p></div><Select value={days} onChange={(event) => setDays(Number(event.target.value))}><option value={7}>최근 7일</option><option value={30}>최근 30일</option></Select></Header>
    <QueryStatus query={query} />
    <Grid><Metric><span>생산 수량</span><strong>{formatNumber(stats.totalProductionQty)}</strong></Metric><Metric><span>불량 건수 / 수량</span><strong>{stats.totalDefectCount || 0} / {formatNumber(stats.totalDefectQuantity)}</strong></Metric><Metric><span>기간 불량률</span><strong>{stats.periodDefectRate || 0}%</strong></Metric><Metric><span>처리율</span><strong>{stats.handlingRate || 0}%</strong></Metric></Grid>
    <Grid>
      <Card><h2>일별 불량률</h2>{(stats.dailyRates || []).map((item) => <p key={item.date}>{item.date}: {item.defectRate}% ({item.defectQty}/{item.productionQty})</p>)}</Card>
      <Card><h2>제품별 불량률</h2>{(stats.productRates || []).map((item) => <p key={item.productId}>{item.productName}: {item.defectRate}%</p>)}</Card>
      <Card><h2>공정별 불량 수량</h2>{(stats.processQuantities || []).map((item) => <p key={item.processName}>{item.processName}: {formatNumber(item.defectQty)} EA</p>)}</Card>
      <Card><h2>유형별 비중</h2>{(stats.typeCounts || []).map((item) => <p key={item.defectType}>{item.defectTypeLabel}: {item.eventCount}건 / {item.quantity}EA ({item.ratio}%)</p>)}</Card>
    </Grid>
    <h2>불량 유형 순위</h2><TableWrap><Table><thead><tr><th>순위</th><th>유형</th><th>주요 공정</th><th>건수</th><th>이전 기간 대비</th></tr></thead><tbody>{(stats.rankings || []).map((item) => <tr key={item.rank}><td>{item.rank}</td><td>{item.defectTypeLabel}</td><td>{item.mainProcessName}</td><td>{item.eventCount}</td><td>{item.changeRatePercent == null ? "신규" : `${item.changeRatePercent}%`}</td></tr>)}</tbody></Table></TableWrap>
  </Page>;
}
