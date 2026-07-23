import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { defectApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { currentKstDate, kstPeriod } from "../../api/time";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import { Button, Card, Grid, Header, Metric, Page, formatNumber } from "../../components/OperationalUi";
import DefectDataTable from "./DefectDataTable";

export default function DefectDashboardPage() {
  const navigate = useNavigate();
  const periodKey = { scope: "today", date: currentKstDate() };
  const dashboardQuery = useQuery({ queryKey: queryKeys.defectDashboard(), queryFn: defectApi.dashboard, refetchInterval: POLLING.DEFECT });
  const statsQuery = useQuery({ queryKey: queryKeys.defectStatistics(periodKey), queryFn: () => defectApi.statistics(kstPeriod(1)), refetchInterval: POLLING.STATISTICS });
  const dashboard = dashboardQuery.data || {};
  const stats = statsQuery.data || {};
  return <Page>
    <Header><div><h1>불량 현황</h1><p>오늘 불량과 최근 처리 대상을 확인합니다.</p></div><div><Button $secondary onClick={() => navigate("/quality/defects")}>목록</Button> <Button onClick={() => navigate("/quality/defects/new")}>불량 등록</Button></div></Header>
    <Grid><Metric><span>오늘 불량 수량</span><strong>{formatNumber(dashboard.todayDefectQuantity)}</strong></Metric><Metric><span>미처리 건수</span><strong>{dashboard.unhandledDefectCount || 0}</strong></Metric><Metric><span>오늘 생산 수량</span><strong>{formatNumber(stats.totalProductionQty)}</strong></Metric><Metric><span>오늘 불량률</span><strong>{stats.periodDefectRate || 0}%</strong></Metric></Grid>
    <ApiErrors queries={[statsQuery]} />
    <Grid>{(stats.processQuantities || []).map((item) => <Card key={item.processName}><span>공정별 불량 수량</span><h2>{item.processName}</h2><strong>{formatNumber(item.defectQty)} EA</strong></Card>)}</Grid>
    <h2>최근 불량</h2><QueryStatus query={dashboardQuery} empty={dashboard.recentDefects?.length === 0} /><DefectDataTable defects={dashboard.recentDefects || []} />
  </Page>;
}
