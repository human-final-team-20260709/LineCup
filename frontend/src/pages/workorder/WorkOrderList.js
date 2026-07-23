import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { referenceApi, usersApi, workOrderApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import {
  Badge,
  Button,
  Card,
  FormGrid,
  Grid,
  Header,
  Input,
  Page,
  Select,
  Table,
  TableWrap,
  Toolbar,
  formatNumber,
  pageContent,
  toneForStatus,
} from "../../components/OperationalUi";

const statusOptions = [
  ["", "전체"], ["PENDING", "대기"], ["IN_PROGRESS", "진행 중"], ["HOLD", "보류"], ["DONE", "완료"],
];

export default function WorkOrderList({ view = "table" }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setKeyword(draft.trim());
      setPage(0);
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [draft]);

  const params = { status: status || undefined, keyword: keyword || undefined, page, size: 20 };
  const workOrdersQuery = useQuery({
    queryKey: queryKeys.workOrders(params),
    queryFn: () => workOrderApi.list(params),
    refetchInterval: POLLING.WORK_ORDER,
    placeholderData: (previous) => previous,
  });
  const productsQuery = useQuery({
    queryKey: queryKeys.products({ status: "ACTIVE", size: 100 }),
    queryFn: () => referenceApi.products({ status: "ACTIVE", size: 100 }),
  });
  const supervisorsQuery = useQuery({
    queryKey: queryKeys.users({ role: "SUPERVISOR", size: 100 }),
    queryFn: () => usersApi.list({ role: "SUPERVISOR", size: 100 }),
  });
  const createMutation = useMutation({
    mutationFn: workOrderApi.create,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      setMessage(`${created.workOrderNo} 작업지시를 등록했습니다.`);
      setShowForm(false);
    },
  });

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage("");
    const data = new FormData(event.currentTarget);
    try {
      await createMutation.mutateAsync({
        productId: Number(data.get("productId")),
        targetQty: Number(data.get("targetQty")),
        hourlyTargetQty: Number(data.get("hourlyTargetQty")),
        plannedStartDate: data.get("plannedStartDate"),
        supervisorUserId: Number(data.get("supervisorUserId")),
        remarks: String(data.get("remarks") || "").trim() || null,
        workerUserIds: [],
        equipmentIds: [],
      });
      event.currentTarget.reset();
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  const rows = pageContent(workOrdersQuery.data);

  return (
    <Page>
      <Header>
        <div><h1>작업지시</h1><p>서버 검색 결과를 5초마다 갱신합니다.</p></div>
        <Button onClick={() => setShowForm((value) => !value)}>{showForm ? "등록 닫기" : "작업지시 등록"}</Button>
      </Header>
      <Toolbar>
        <Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }}>
          {statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
        <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="작업번호 또는 제품명 검색" />
      </Toolbar>

      {showForm && (
        <Card>
          <h2>새 작업지시</h2>
          <FormGrid onSubmit={handleCreate}>
            <label>제품<Select name="productId" required>
              <option value="">제품 선택</option>
              {pageContent(productsQuery.data).map((product) => <option key={product.productId} value={product.productId}>{product.productName}</option>)}
            </Select></label>
            <label>목표 수량<Input name="targetQty" type="number" min="1" required /></label>
            <label>시간 목표 수량<Input name="hourlyTargetQty" type="number" min="1" required /></label>
            <label>예정일<Input name="plannedStartDate" type="date" required /></label>
            <label>지시자<Select name="supervisorUserId" required>
              <option value="">지시자 선택</option>
              {pageContent(supervisorsQuery.data).filter((user) => user.active && user.approvalStatus === "APPROVED").map((user) => (
                <option key={user.userId} value={user.userId}>{user.name} ({user.empNo})</option>
              ))}
            </Select></label>
            <label>비고<Input name="remarks" /></label>
            <Button disabled={createMutation.isPending}>{createMutation.isPending ? "등록 중..." : "등록"}</Button>
          </FormGrid>
        </Card>
      )}
      {message && <p role="status">{message}</p>}
      <ApiErrors queries={[productsQuery, supervisorsQuery]} />
      <QueryStatus query={workOrdersQuery} empty={rows.length === 0} />

      {view === "chart" ? (
        <Grid>
          {rows.map((order) => (
            <Card key={order.workOrderId} onClick={() => navigate(`/work-orders/${order.workOrderId}`)} style={{ cursor: "pointer" }}>
              <h3>{order.productName}</h3><p>{order.workOrderNo}</p>
              <progress max={order.targetQty} value={order.currentQty} style={{ width: "100%" }} />
              <p>{formatNumber(order.currentQty)} / {formatNumber(order.targetQty)} EA ({order.progressRate}%)</p>
              <Badge $tone={toneForStatus(order.status)}>{order.statusLabel}</Badge>
            </Card>
          ))}
        </Grid>
      ) : (
        <TableWrap>
          <Table>
            <thead><tr><th>작업지시</th><th>제품</th><th>상태</th><th>목표/실적</th><th>시간 목표</th><th>지시자</th><th>예정일</th></tr></thead>
            <tbody>{rows.map((order) => (
              <tr key={order.workOrderId} onClick={() => navigate(`/work-orders/${order.workOrderId}`)} style={{ cursor: "pointer" }}>
                <td>{order.workOrderNo}</td><td>{order.productName}</td>
                <td><Badge $tone={toneForStatus(order.status)}>{order.statusLabel}</Badge></td>
                <td>{formatNumber(order.currentQty)} / {formatNumber(order.targetQty)}</td>
                <td>{formatNumber(order.hourlyTargetQty)}</td><td>{order.supervisorName}</td><td>{order.plannedStartDate}</td>
              </tr>
            ))}</tbody>
          </Table>
        </TableWrap>
      )}
      <Toolbar>
        <Button $secondary disabled={page === 0} onClick={() => setPage((value) => value - 1)}>이전</Button>
        <span>{page + 1} / {workOrdersQuery.data?.totalPages || 1}</span>
        <Button $secondary disabled={page + 1 >= (workOrdersQuery.data?.totalPages || 1)} onClick={() => setPage((value) => value + 1)}>다음</Button>
      </Toolbar>
    </Page>
  );
}
