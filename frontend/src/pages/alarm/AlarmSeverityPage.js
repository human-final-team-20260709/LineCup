import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { alarmApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { currentKstDate, kstPeriod } from "../../api/time";
import { Badge, Header, Page, Toolbar, Button, pageContent } from "../../components/OperationalUi";
import { QueryStatus } from "../../components/ApiState";
import AlarmDataTable from "./AlarmDataTable";

const labels = { CRITICAL: "심각", WARNING: "경고", INFO: "정보" };

export default function AlarmSeverityPage() {
  const [severity, setSeverity] = useState("CRITICAL");
  const params = { severity, period: { days: 30, through: currentKstDate() }, page: 0, size: 100 };
  const query = useQuery({ queryKey: queryKeys.alarms("severity", params), queryFn: () => {
    const livePeriod = kstPeriod(30);
    return alarmApi.list({
      severity,
      page: 0,
      size: 100,
      startAt: livePeriod.from,
      endAt: livePeriod.to,
    });
  }, refetchInterval: POLLING.HISTORY, placeholderData: (previous) => previous });
  const rows = pageContent(query.data);
  return <Page>
    <Header><div><h1>심각도별 알람</h1><p>최근 30일 알람을 심각도 코드로 서버 조회합니다.</p></div></Header>
    <Toolbar>{Object.entries(labels).map(([value, label]) => <Button key={value} $secondary={severity !== value} onClick={() => setSeverity(value)}><Badge $tone={value === "CRITICAL" ? "danger" : value === "WARNING" ? "warn" : "success"}>{label}</Badge></Button>)}</Toolbar>
    <QueryStatus query={query} empty={rows.length === 0} /><AlarmDataTable alarms={rows} />
  </Page>;
}
