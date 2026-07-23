import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { defectApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { toKst } from "../../api/time";
import { useAuth } from "../../context/AuthContext";
import { QueryStatus } from "../../components/ApiState";
import { Badge, Button, Card, FormGrid, Grid, Header, Page, Select, Table, TableWrap, toneForStatus } from "../../components/OperationalUi";

export default function DefectDetailPage() {
  const { defectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const query = useQuery({ queryKey: queryKeys.defect(defectId), queryFn: () => defectApi.detail(defectId), refetchInterval: (state) => state.state.data?.summary?.status === "COMPLETED" ? false : POLLING.DEFECT });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["defects"] });
  const causeMutation = useMutation({ mutationFn: (cause) => defectApi.cause(defectId, { cause }), onSuccess: invalidate });
  const handleMutation = useMutation({ mutationFn: (body) => defectApi.handle(defectId, body), onSuccess: invalidate });
  const detail = query.data;
  const run = async (work) => { setMessage(""); try { await work(); setMessage("변경사항을 저장했습니다."); } catch (error) { setMessage(extractApiError(error)); } };
  if (!detail) return <Page><Header><div><h1>불량 상세</h1></div></Header><QueryStatus query={query} /></Page>;
  const defect = detail.summary;
  return <Page>
    <Header><div><h1>{defect.defectNo}</h1><p>{defect.productName} · {defect.lotNo}</p></div><Button $secondary onClick={() => navigate("/quality/defects")}>목록</Button></Header>
    <Grid><Card><h3>유형·수량</h3><p>{defect.defectTypeLabel} · {defect.quantity} EA</p></Card><Card><h3>설비·공정</h3><p>{defect.equipmentCode} {defect.equipmentName}</p><p>{defect.processName}</p></Card><Card><h3>상태</h3><Badge $tone={toneForStatus(defect.status)}>{defect.statusLabel}</Badge><p>{toKst(defect.occurredAt)}</p></Card></Grid>
    <Grid>
      <Card><h2>원인</h2><FormGrid onSubmit={(event) => { event.preventDefault(); run(() => causeMutation.mutateAsync(String(new FormData(event.currentTarget).get("cause") || ""))); }}><label>원인<textarea name="cause" defaultValue={detail.cause || ""} rows="4" /></label><Button disabled={causeMutation.isPending}>원인 저장</Button></FormGrid></Card>
      {defect.status !== "COMPLETED" && <Card><h2>처리</h2><FormGrid onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); run(() => handleMutation.mutateAsync({ handlerId: user.userId, handleMethod: data.get("handleMethod"), status: data.get("status"), handlingContent: String(data.get("handlingContent") || "").trim() || null })); }}>
        <label>상태<Select name="status"><option value="IN_PROGRESS">처리 중</option><option value="ON_HOLD">보류</option><option value="COMPLETED">처리 완료</option></Select></label>
        <label>처리 방법<Select name="handleMethod"><option value="NORMAL_APPROVAL">정상 승인</option><option value="REWORK">재작업</option><option value="DISPOSAL">폐기</option></Select></label>
        <label>처리 내용<textarea name="handlingContent" rows="4" /></label><Button disabled={handleMutation.isPending}>처리 저장</Button>
      </FormGrid></Card>}
    </Grid>
    {message && <p role="status">{message}</p>}
    <h2>처리 이력</h2><TableWrap><Table><thead><tr><th>시각</th><th>상태</th><th>방법</th><th>처리자</th><th>내용</th></tr></thead><tbody>{detail.handlingHistories.map((history) => <tr key={history.defectHandlingHistoryId}><td>{toKst(history.handledAt)}</td><td>{history.statusLabel}</td><td>{history.handleMethodLabel || "-"}</td><td>{history.handledByName}</td><td>{history.content || "-"}</td></tr>)}</tbody></Table></TableWrap>
  </Page>;
}
