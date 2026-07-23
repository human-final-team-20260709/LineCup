import { useQuery } from "@tanstack/react-query";
import { alarmApi, communicationApi, productionApi, workOrderApi, workerApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { currentKstDate, kstPeriod, toKst } from "../../api/time";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
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
  pageContent,
  toneForStatus,
} from "../../components/OperationalUi";

export default function Dashboard() {
  const periodKey = { scope: "today", date: currentKstDate() };
  const productionQuery = useQuery({ queryKey: queryKeys.productionSummary(periodKey), queryFn: () => productionApi.summary(kstPeriod(1)), refetchInterval: POLLING.PRODUCTION });
  const activeQuery = useQuery({ queryKey: queryKeys.activeWorkOrder(), queryFn: workOrderApi.active, refetchInterval: POLLING.WORK_ORDER });
  const orderSummaryQuery = useQuery({ queryKey: queryKeys.workOrderSummary(), queryFn: workOrderApi.summary, refetchInterval: POLLING.WORK_ORDER });
  const alarmQuery = useQuery({ queryKey: queryKeys.alarms("dashboard-current", { size: 5 }), queryFn: () => alarmApi.current({ page: 0, size: 5 }), refetchInterval: POLLING.CURRENT_ALARM });
  const l1Query = useQuery({ queryKey: queryKeys.l1Devices(), queryFn: communicationApi.l1, refetchInterval: POLLING.COMMUNICATION });
  const l2Query = useQuery({ queryKey: queryKeys.l2Collectors(), queryFn: communicationApi.l2, refetchInterval: POLLING.COMMUNICATION });
  const workersQuery = useQuery({ queryKey: queryKeys.workers({ page: 0, size: 100 }), queryFn: () => workerApi.list({ page: 0, size: 100 }) });
  const production = productionQuery.data || {};
  const orderSummary = orderSummaryQuery.data || {};
  const alarms = pageContent(alarmQuery.data);
  const workers = pageContent(workersQuery.data);
  const connectedL1 = (l1Query.data || []).filter((entry) => entry.connectionStatus === "CONNECTED").length;

  return <Page>
    <Header><div><h1>MES 대시보드</h1><p>도메인별 독립 쿼리와 주기로 현재 운영 상태를 조합합니다.</p></div></Header>
    <Grid>
      <Metric><span>오늘 생산</span><strong>{formatNumber(production.productionQty)} EA</strong></Metric>
      <Metric><span>목표 달성률</span><strong>{production.achievementRate || 0}%</strong></Metric>
      <Metric><span>진행/보류 작업</span><strong>{(orderSummary.inProgressCount || 0) + (orderSummary.holdCount || 0)}</strong></Metric>
      <Metric><span>현재 알람</span><strong>{alarmQuery.data?.totalElements || 0}</strong></Metric>
      <Metric><span>L1 연결</span><strong>{connectedL1} / {(l1Query.data || []).length}</strong></Metric>
      <Metric><span>L2 수집기</span><strong>{(l2Query.data || []).filter((entry) => entry.backendConnectionStatus === "CONNECTED").length} / {(l2Query.data || []).length}</strong></Metric>
    </Grid>
    <QueryStatus query={productionQuery} />
    <ApiErrors queries={[orderSummaryQuery, alarmQuery, l1Query, l2Query]} />

    <h2>활성 공정 상태</h2>
    {activeQuery.data ? <><Card><h2>{activeQuery.data.summary.workOrderNo} · {activeQuery.data.summary.productName}</h2><p>집계 생산 {formatNumber(activeQuery.data.summary.currentQty)} / 목표 {formatNumber(activeQuery.data.summary.targetQty)} EA</p></Card><Grid>{activeQuery.data.processes.map((process) => {
      const equipment = activeQuery.data.equipments.find((item) => item.equipmentId === process.equipmentId);
      return <Card key={process.processProgressId}><h3>{process.processName}</h3><p>{process.equipmentCode} {process.equipmentName}</p><Badge $tone={toneForStatus(process.status)}>{process.statusLabel}</Badge>{" "}<Badge $tone={toneForStatus(equipment?.status)}>{equipment?.statusLabel || "설비 상태 미확인"}</Badge></Card>;
    })}</Grid></> : <p>활성 작업지시가 없습니다.</p>}
    <QueryStatus query={activeQuery} />

    <Grid>
      <Card><h2>현재 알람</h2>{alarms.length ? alarms.map((alarm) => <p key={alarm.alarmId}><Badge $tone={alarm.severity === "CRITICAL" ? "danger" : "warn"}>{alarm.severityLabel}</Badge> {alarm.equipmentCode} · {alarm.message} ({toKst(alarm.occurredAt, "HH:mm:ss")})</p>) : <p>현재 알람이 없습니다.</p>}</Card>
      <Card><h2>통신 상태</h2>{(l2Query.data || []).map((collector) => <p key={collector.collectorId}>{collector.collectorCode}: <Badge $tone={collector.backendConnectionStatus === "CONNECTED" ? "success" : "danger"}>{collector.backendConnectionStatusLabel}</Badge> · L1 {collector.connectedL1Count}/{collector.l1Total}</p>)}</Card>
    </Grid>

    <h2>작업자 팀·교대조·주 담당 공정</h2>
    <QueryStatus query={workersQuery} empty={workers.length === 0} />
    <TableWrap><Table><thead><tr><th>작업자</th><th>팀</th><th>교대조</th><th>주 담당 공정</th><th>기술</th></tr></thead><tbody>{workers.map((worker) => <tr key={worker.workerProfileId}><td>{worker.name} ({worker.empNo})</td><td>{worker.teamName}</td><td>{worker.shiftTypeLabel}</td><td>{worker.primaryProcessName}</td><td>{worker.skills.join(", ") || "-"}</td></tr>)}</tbody></Table></TableWrap>
  </Page>;
}
