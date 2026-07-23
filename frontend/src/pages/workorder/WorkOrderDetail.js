import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { usersApi, workOrderApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { toKst } from "../../api/time";
import { useAuth } from "../../context/AuthContext";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import {
  Badge,
  Button,
  Card,
  FormGrid,
  Grid,
  Header,
  Page,
  Select,
  Table,
  TableWrap,
  Toolbar,
  formatNumber,
  pageContent,
  toneForStatus,
} from "../../components/OperationalUi";

const actionForStatus = {
  PENDING: ["START"],
  HOLD: ["RESUME"],
  IN_PROGRESS: ["HOLD", "COMPLETE"],
};
const actionLabel = { START: "시작", RESUME: "재개", HOLD: "보류", COMPLETE: "완료" };

export default function WorkOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const detailQuery = useQuery({
    queryKey: queryKeys.workOrder(id),
    queryFn: () => workOrderApi.detail(id),
    refetchInterval: POLLING.WORK_ORDER,
  });
  const supervisorsQuery = useQuery({
    queryKey: queryKeys.users({ role: "SUPERVISOR", size: 100 }),
    queryFn: () => usersApi.list({ role: "SUPERVISOR", size: 100 }),
  });
  const operatorsQuery = useQuery({
    queryKey: queryKeys.users({ role: "OPERATOR", size: 100 }),
    queryFn: () => usersApi.list({ role: "OPERATOR", size: 100 }),
  });
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["work-orders"] });
    queryClient.invalidateQueries({ queryKey: ["production"] });
  };
  const statusMutation = useMutation({ mutationFn: ({ action }) => workOrderApi.status(id, { action, changedByUserId: user.userId, note: null }), onSuccess: invalidate });
  const targetsMutation = useMutation({ mutationFn: (body) => workOrderApi.targets(id, body), onSuccess: invalidate });
  const supervisorMutation = useMutation({ mutationFn: (supervisorUserId) => workOrderApi.supervisor(id, { supervisorUserId }), onSuccess: invalidate });
  const workersMutation = useMutation({ mutationFn: (ids) => workOrderApi.workers(id, { ids }), onSuccess: invalidate });
  const mutationPending = statusMutation.isPending || targetsMutation.isPending || supervisorMutation.isPending || workersMutation.isPending;

  const run = async (work) => {
    setMessage("");
    try {
      await work();
      setMessage("변경사항을 저장했습니다.");
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  const detail = detailQuery.data;
  const order = detail?.summary;
  if (!order) {
    return <Page><Header><div><h1>작업지시 상세</h1></div></Header><QueryStatus query={detailQuery} /></Page>;
  }

  return (
    <Page>
      <Header>
        <div><h1>{order.workOrderNo}</h1><p>{order.productName} · 5초 주기 갱신</p></div>
        <Button $secondary onClick={() => navigate("/work-orders/list")}>목록</Button>
      </Header>
      <Toolbar>
        <Badge $tone={toneForStatus(order.status)}>{order.statusLabel}</Badge>
        {(actionForStatus[order.status] || []).map((action) => (
          <Button key={action} disabled={mutationPending} onClick={() => run(() => statusMutation.mutateAsync({ action }))}>
            {actionLabel[action]}
          </Button>
        ))}
      </Toolbar>
      {message && <p role="status">{message}</p>}
      <ApiErrors queries={[supervisorsQuery, operatorsQuery]} />

      <Grid>
        <Card><span>목표 수량</span><h2>{formatNumber(order.targetQty)} {detail.productUnit}</h2></Card>
        <Card><span>현재 생산</span><h2>{formatNumber(order.currentQty)}</h2><progress max={order.targetQty} value={order.currentQty} /></Card>
        <Card><span>정상 / 불량</span><h2>{formatNumber(order.goodQty)} / {formatNumber(order.defectQty)}</h2></Card>
        <Card><span>작업 시각</span><p>시작 {toKst(order.startedAt)}</p><p>완료 {toKst(order.completedAt)}</p></Card>
      </Grid>

      <Grid>
        <Card>
          <h3>목표 수정</h3>
          <FormGrid onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            run(() => targetsMutation.mutateAsync({ targetQty: Number(data.get("targetQty")), hourlyTargetQty: Number(data.get("hourlyTargetQty")) }));
          }}>
            <label>총 목표<input name="targetQty" type="number" min="1" defaultValue={order.targetQty} required /></label>
            <label>시간 목표<input name="hourlyTargetQty" type="number" min="1" defaultValue={order.hourlyTargetQty} required /></label>
            <Button disabled={mutationPending}>저장</Button>
          </FormGrid>
        </Card>
        <Card>
          <h3>지시자 변경</h3>
          <FormGrid onSubmit={(event) => {
            event.preventDefault();
            run(() => supervisorMutation.mutateAsync(Number(new FormData(event.currentTarget).get("supervisorUserId"))));
          }}>
            <Select name="supervisorUserId" defaultValue={order.supervisorId}>
              {pageContent(supervisorsQuery.data).filter((entry) => entry.active && entry.approvalStatus === "APPROVED").map((entry) => (
                <option key={entry.userId} value={entry.userId}>{entry.name} ({entry.empNo})</option>
              ))}
            </Select>
            <Button disabled={mutationPending}>변경</Button>
          </FormGrid>
        </Card>
      </Grid>

      <Card>
        <h3>작업자 배정</h3>
        <FormGrid onSubmit={(event) => {
          event.preventDefault();
          const ids = Array.from(event.currentTarget.querySelectorAll("input[name=worker]:checked")).map((input) => Number(input.value));
          run(() => workersMutation.mutateAsync(ids));
        }}>
          <div>
            {pageContent(operatorsQuery.data).filter((entry) => entry.active && entry.approvalStatus === "APPROVED").map((entry) => (
              <label key={entry.userId} style={{ display: "inline-flex", marginRight: 18 }}>
                <input type="checkbox" name="worker" value={entry.userId} defaultChecked={detail.workers.some((worker) => worker.userId === entry.userId)} />
                {entry.name}
              </label>
            ))}
          </div>
          <Button disabled={mutationPending}>배정 저장</Button>
        </FormGrid>
      </Card>

      <h2>공정·설비 진행 상태</h2>
      <Grid>
        {detail.processes.map((process) => (
          <Card key={process.processProgressId}>
            <h3>{process.processName}</h3><p>{process.equipmentCode} {process.equipmentName}</p>
            <Badge $tone={toneForStatus(process.status)}>{process.statusLabel}</Badge>{" "}
            <Badge $tone={toneForStatus(detail.equipments.find((equipment) => equipment.equipmentId === process.equipmentId)?.status)}>
              {detail.equipments.find((equipment) => equipment.equipmentId === process.equipmentId)?.statusLabel || "설비 상태 미확인"}
            </Badge>
          </Card>
        ))}
      </Grid>

      <h2>상태 변경 이력</h2>
      <TableWrap><Table>
        <thead><tr><th>시각</th><th>액션</th><th>상태</th><th>처리자</th><th>메모</th></tr></thead>
        <tbody>{detail.statusHistories.map((history) => (
          <tr key={history.historyId}><td>{toKst(history.changedAt)}</td><td>{history.action}</td><td>{history.newStatusLabel}</td><td>{history.changedByName}</td><td>{history.note || "-"}</td></tr>
        ))}</tbody>
      </Table></TableWrap>
    </Page>
  );
}
