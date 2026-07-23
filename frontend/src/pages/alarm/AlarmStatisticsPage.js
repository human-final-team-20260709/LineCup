import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { alarmApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { currentKstDate, kstPeriod } from "../../api/time";
import { QueryStatus } from "../../components/ApiState";
import { Badge, Card, Grid, Header, Metric, Page, Select, Table, TableWrap, toneForStatus } from "../../components/OperationalUi";

export default function AlarmStatisticsPage() {
  const [days, setDays] = useState(7);
  const periodKey = { days, through: currentKstDate() };
  const query = useQuery({ queryKey: queryKeys.alarmStatistics(periodKey), queryFn: () => alarmApi.statistics(kstPeriod(days)), refetchInterval: POLLING.STATISTICS, placeholderData: (previous) => previous });
  const stats = query.data || {};
  return <Page>
    <Header><div><h1>알람 통계</h1><p>KST 일별 집계이며 빈 날짜도 0으로 표시합니다.</p></div><Select value={days} onChange={(event) => setDays(Number(event.target.value))}><option value={7}>최근 7일</option><option value={30}>최근 30일</option></Select></Header>
    <QueryStatus query={query} />
    <Grid><Metric><span>전체 알람</span><strong>{stats.totalCount || 0}</strong></Metric>{(stats.severityCounts || []).map((item) => <Metric key={item.severity}><span>{item.severityLabel}</span><strong>{item.count} ({item.ratio}%)</strong></Metric>)}</Grid>
    <Grid>
      <Card><h2>일별 발생 건수</h2>{(stats.dailyCounts || []).map((item) => <p key={item.date}>{item.date}: <strong>{item.count}</strong></p>)}</Card>
      <Card><h2>설비별 상위 5개</h2>{(stats.equipmentCounts || []).map((item) => <p key={item.equipmentId}>{item.equipmentCode} {item.equipmentName}: <strong>{item.count}</strong></p>)}</Card>
    </Grid>
    <h2>빈발 알람 상위 5개</h2>
    <TableWrap><Table><thead><tr><th>순위</th><th>메시지</th><th>설비</th><th>심각도</th><th>건수</th></tr></thead><tbody>{(stats.frequentAlarms || []).map((item) => <tr key={`${item.rank}-${item.equipmentCode}-${item.message}`}><td>{item.rank}</td><td>{item.message}</td><td>{item.equipmentCode} {item.equipmentName}</td><td><Badge $tone={toneForStatus(item.severity)}>{item.severityLabel}</Badge></td><td>{item.count}</td></tr>)}</tbody></Table></TableWrap>
  </Page>;
}
