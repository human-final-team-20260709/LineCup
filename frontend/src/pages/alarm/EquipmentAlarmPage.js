import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { alarmApi, referenceApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { currentKstDate, kstPeriod } from "../../api/time";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import { Header, Page, Select, Toolbar, pageContent } from "../../components/OperationalUi";
import AlarmDataTable from "./AlarmDataTable";

export default function EquipmentAlarmPage() {
  const [equipmentId, setEquipmentId] = useState("");
  const equipmentsQuery = useQuery({ queryKey: queryKeys.equipments({ size: 100 }), queryFn: () => referenceApi.equipments({ size: 100 }) });
  const params = { equipmentId: equipmentId || undefined, period: { days: 30, through: currentKstDate() }, page: 0, size: 100 };
  const alarmsQuery = useQuery({ queryKey: queryKeys.alarms("equipment", params), queryFn: () => {
    const livePeriod = kstPeriod(30);
    return alarmApi.list({
      equipmentId: equipmentId || undefined,
      page: 0,
      size: 100,
      startAt: livePeriod.from,
      endAt: livePeriod.to,
    });
  }, refetchInterval: POLLING.HISTORY, placeholderData: (previous) => previous });
  const rows = pageContent(alarmsQuery.data);
  return <Page>
    <Header><div><h1>설비별 알람</h1><p>설비를 선택해 최근 30일 알람을 확인합니다.</p></div></Header>
    <Toolbar><Select value={equipmentId} onChange={(event) => setEquipmentId(event.target.value)}><option value="">전체 설비</option>{pageContent(equipmentsQuery.data).map((equipment) => <option key={equipment.equipmentId} value={equipment.equipmentId}>{equipment.equipmentCode} {equipment.equipmentName}</option>)}</Select></Toolbar>
    <ApiErrors queries={[equipmentsQuery]} /><QueryStatus query={alarmsQuery} empty={rows.length === 0} /><AlarmDataTable alarms={rows} />
  </Page>;
}
