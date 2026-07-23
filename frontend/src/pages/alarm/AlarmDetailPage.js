import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { alarmApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { toKst } from "../../api/time";
import { useAuth } from "../../context/AuthContext";
import { QueryStatus } from "../../components/ApiState";
import { Badge, Button, Card, FormGrid, Grid, Header, Page, Select, toneForStatus } from "../../components/OperationalUi";

export default function AlarmDetailPage() {
  const { alarmId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const query = useQuery({
    queryKey: queryKeys.alarm(alarmId),
    queryFn: () => alarmApi.detail(alarmId),
    refetchInterval: (state) => state.state.data?.summary?.status === "RESOLVED" ? false : POLLING.CURRENT_ALARM,
  });
  const mutation = useMutation({
    mutationFn: (body) => alarmApi.handle(alarmId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alarms"] });
    },
  });
  const detail = query.data;
  if (!detail) return <Page><Header><div><h1>알람 상세</h1></div></Header><QueryStatus query={query} /></Page>;
  const alarm = detail.summary;
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setMessage("");
    try {
      await mutation.mutateAsync({
        handlerId: user.userId,
        handlingContent: String(data.get("handlingContent") || "").trim() || null,
        status: data.get("status"),
        resolvedAt: null,
      });
      setMessage("알람 처리 상태를 저장했습니다.");
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };
  return <Page>
    <Header><div><h1>{alarm.alarmNo}</h1><p>{alarm.message}</p></div><Button $secondary onClick={() => navigate("/alarms/current")}>목록</Button></Header>
    <Grid>
      <Card><h3>설비</h3><p>{alarm.equipmentCode} {alarm.equipmentName}</p><p>{alarm.processName} · {alarm.location}</p></Card>
      <Card><h3>상태</h3><p><Badge $tone={toneForStatus(alarm.status)}>{alarm.statusLabel}</Badge></p><p>{alarm.severityLabel}</p></Card>
      <Card><h3>시각</h3><p>발생 {toKst(alarm.occurredAt)}</p><p>해결 {toKst(alarm.resolvedAt)}</p></Card>
    </Grid>
    <Card><h2>상세 설명</h2><p>{detail.description || "-"}</p><p>처리자: {detail.handlerName || "-"}</p><p>조치: {detail.handlingContent || "-"}</p></Card>
    {alarm.status !== "RESOLVED" && <Card><h2>처리 등록</h2><FormGrid onSubmit={handleSubmit}>
      <label>상태<Select name="status" defaultValue="IN_PROGRESS"><option value="IN_PROGRESS">처리 중</option><option value="INSPECTION_RESERVED">점검 예정</option><option value="MONITORING">모니터링</option><option value="RESOLVED">처리 완료</option></Select></label>
      <label>조치 내용<textarea name="handlingContent" rows="3" /></label>
      <Button disabled={mutation.isPending}>{mutation.isPending ? "저장 중..." : "저장"}</Button>
    </FormGrid></Card>}
    {message && <p role="status">{message}</p>}
    <QueryStatus query={query} />
  </Page>;
}
