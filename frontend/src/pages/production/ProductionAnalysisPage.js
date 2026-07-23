import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productionApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { BUSINESS_ZONE, currentKstDate, kstPeriod } from "../../api/time";
import {
  Card,
  Grid,
  Header,
  Metric,
  Page,
  Select,
  Table,
  TableWrap,
  formatNumber,
} from "../../components/OperationalUi";
import { ApiErrors, QueryStatus } from "../../components/ApiState";

export default function ProductionAnalysisPage() {
  const [days, setDays] = useState(7);
  const periodKey = { days, through: currentKstDate() };
  const queryOptions = { refetchInterval: POLLING.PRODUCTION, placeholderData: (previous) => previous };
  const summaryQuery = useQuery({ queryKey: queryKeys.productionSummary(periodKey), queryFn: () => productionApi.summary(kstPeriod(days)), ...queryOptions });
  const productQuery = useQuery({ queryKey: queryKeys.productionGroups("by-product", periodKey), queryFn: () => productionApi.byProduct(kstPeriod(days)), ...queryOptions });
  const orderQuery = useQuery({ queryKey: queryKeys.productionGroups("by-work-order", periodKey), queryFn: () => productionApi.byWorkOrder(kstPeriod(days)), ...queryOptions });
  const hourlyQuery = useQuery({ queryKey: queryKeys.hourlyProduction(periodKey), queryFn: () => productionApi.hourly(kstPeriod(days)), ...queryOptions });
  const daily = useMemo(() => {
    const grouped = new Map();
    (hourlyQuery.data || []).forEach((row) => {
      const date = new Intl.DateTimeFormat("en-CA", { timeZone: BUSINESS_ZONE }).format(new Date(row.bucketStart));
      const value = grouped.get(date) || { date, productionQty: 0, goodQty: 0, defectQty: 0 };
      value.productionQty += row.productionQty;
      value.goodQty += row.goodQty;
      value.defectQty += row.defectQty;
      grouped.set(date, value);
    });
    return [...grouped.values()].sort((a, b) => a.date.localeCompare(b.date));
  }, [hourlyQuery.data]);
  const summary = summaryQuery.data || {};

  return (
    <Page>
      <Header><div><h1>생산 실적 분석</h1><p>현재를 포함한 기간은 60초마다 다시 집계합니다.</p></div><Select value={days} onChange={(event) => setDays(Number(event.target.value))}><option value={1}>오늘</option><option value={7}>최근 7일</option><option value={30}>최근 30일</option></Select></Header>
      <QueryStatus query={summaryQuery} />
      <ApiErrors queries={[productQuery, orderQuery]} />
      <Grid>
        <Metric><span>누적 생산</span><strong>{formatNumber(summary.productionQty)}</strong></Metric>
        <Metric><span>목표 달성률</span><strong>{summary.achievementRate || 0}%</strong></Metric>
        <Metric><span>정상 수량</span><strong>{formatNumber(summary.goodQty)}</strong></Metric>
        <Metric><span>불량률</span><strong>{summary.defectRate || 0}%</strong></Metric>
      </Grid>
      <Grid>
        <Card><h2>제품별 생산량</h2>{(productQuery.data || []).map((item) => <p key={item.name}>{item.name}: <strong>{formatNumber(item.productionQty)} EA</strong> ({item.achievementRate}%)</p>)}</Card>
        <Card><h2>작업지시별 달성률</h2>{(orderQuery.data || []).map((item) => <p key={item.name}>{item.name}: <strong>{item.achievementRate}%</strong></p>)}</Card>
      </Grid>
      <h2>일별 시간 집계 합계</h2>
      <QueryStatus query={hourlyQuery} empty={daily.length === 0} />
      <TableWrap><Table><thead><tr><th>일자(KST)</th><th>생산</th><th>정상</th><th>불량</th></tr></thead><tbody>{daily.map((item) => <tr key={item.date}><td>{item.date}</td><td>{formatNumber(item.productionQty)}</td><td>{formatNumber(item.goodQty)}</td><td>{formatNumber(item.defectQty)}</td></tr>)}</tbody></Table></TableWrap>
    </Page>
  );
}
