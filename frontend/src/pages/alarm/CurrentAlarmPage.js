import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { alarmApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { QueryStatus } from "../../components/ApiState";
import { Header, Input, Metric, Grid, Page, Select, Toolbar, Button, pageContent } from "../../components/OperationalUi";
import AlarmDataTable from "./AlarmDataTable";

export default function CurrentAlarmPage() {
  const [page, setPage] = useState(0);
  const [severity, setSeverity] = useState("");
  const [keyword, setKeyword] = useState("");
  const params = { page, size: 20 };
  const query = useQuery({ queryKey: queryKeys.alarms("current", params), queryFn: () => alarmApi.current(params), refetchInterval: POLLING.CURRENT_ALARM, placeholderData: (previous) => previous });
  const source = pageContent(query.data);
  const rows = source.filter((alarm) => (!severity || alarm.severity === severity) && (!keyword || `${alarm.message} ${alarm.equipmentCode} ${alarm.equipmentName}`.toLowerCase().includes(keyword.toLowerCase())));
  return <Page>
    <Header><div><h1>현재 알람</h1><p>미해결 알람을 5초마다 갱신합니다.</p></div></Header>
    <Grid><Metric><span>현재 페이지</span><strong>{source.length}</strong></Metric><Metric><span>심각</span><strong>{source.filter((alarm) => alarm.severity === "CRITICAL").length}</strong></Metric><Metric><span>경고</span><strong>{source.filter((alarm) => alarm.severity === "WARNING").length}</strong></Metric></Grid>
    <Toolbar><Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="메시지·설비 검색" /><Select value={severity} onChange={(event) => setSeverity(event.target.value)}><option value="">전체 심각도</option><option value="CRITICAL">심각</option><option value="WARNING">경고</option><option value="INFO">정보</option></Select></Toolbar>
    <QueryStatus query={query} empty={rows.length === 0} /><AlarmDataTable alarms={rows} />
    <Toolbar><Button $secondary disabled={page === 0} onClick={() => setPage((value) => value - 1)}>이전</Button><span>{page + 1} / {query.data?.totalPages || 1}</span><Button $secondary disabled={page + 1 >= (query.data?.totalPages || 1)} onClick={() => setPage((value) => value + 1)}>다음</Button></Toolbar>
  </Page>;
}
