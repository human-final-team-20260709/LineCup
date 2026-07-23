import { useNavigate } from "react-router-dom";
import { toKst } from "../../api/time";
import { Badge, Table, TableWrap, toneForStatus } from "../../components/OperationalUi";

export default function AlarmDataTable({ alarms = [] }) {
  const navigate = useNavigate();
  return (
    <TableWrap><Table>
      <thead><tr><th>알람</th><th>설비/공정</th><th>메시지</th><th>심각도</th><th>상태</th><th>발생 시각</th></tr></thead>
      <tbody>{alarms.map((alarm) => (
        <tr key={alarm.alarmId} onClick={() => navigate(`/alarm/detail/${alarm.alarmId}`)} style={{ cursor: "pointer" }}>
          <td>{alarm.alarmNo}</td><td>{alarm.equipmentCode} {alarm.equipmentName}<br />{alarm.processName}</td><td>{alarm.message}</td>
          <td><Badge $tone={alarm.severity === "CRITICAL" ? "danger" : alarm.severity === "WARNING" ? "warn" : "success"}>{alarm.severityLabel}</Badge></td>
          <td><Badge $tone={toneForStatus(alarm.status)}>{alarm.statusLabel}</Badge></td><td>{toKst(alarm.occurredAt)}</td>
        </tr>
      ))}</tbody>
    </Table></TableWrap>
  );
}
