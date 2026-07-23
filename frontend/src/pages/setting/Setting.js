import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../../api/services";
import { queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { toKst } from "../../api/time";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import WorkerManagement from "./WorkerManagement";
import {
  Badge,
  Button,
  Grid,
  Header,
  Input,
  Metric,
  Page,
  Select,
  Table,
  TableWrap,
  Toolbar,
  pageContent,
  toneForStatus,
} from "../../components/OperationalUi";

export default function Setting({ activeTab = "users" }) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const timeout = window.setTimeout(() => setKeyword(draft.trim()), 300);
    return () => window.clearTimeout(timeout);
  }, [draft]);
  const params = { keyword: keyword || undefined, role: role || undefined, page: 0, size: 100 };
  const usersQuery = useQuery({ queryKey: queryKeys.users(params), queryFn: () => usersApi.list(params), enabled: activeTab === "users", placeholderData: (previous) => previous });
  const pendingQuery = useQuery({ queryKey: queryKeys.pendingUsers(), queryFn: usersApi.pending, enabled: activeTab === "approvals" });
  const summaryQuery = useQuery({ queryKey: ["users", "summary"], queryFn: usersApi.summary });
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["workers"] });
  };
  const mutation = useMutation({
    mutationFn: ({ kind, id, value }) => {
      if (kind === "role") return usersApi.role(id, { role: value });
      if (kind === "active") return usersApi.activation(id, { active: value });
      if (kind === "approval") return usersApi.approval(id, { approvalStatus: value });
      return usersApi.remove(id);
    },
    onSuccess: invalidate,
  });
  const act = async (payload, successMessage) => {
    setMessage("");
    try {
      await mutation.mutateAsync(payload);
      setMessage(successMessage);
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  if (activeTab === "workers") return <WorkerManagement />;
  const summary = summaryQuery.data || {};
  const rows = activeTab === "users" ? pageContent(usersQuery.data) : (pendingQuery.data || []);
  const activeQuery = activeTab === "users" ? usersQuery : pendingQuery;

  return (
    <Page>
      <Header><div><h1>설정</h1><p>사용자 역할·활성·가입 승인과 작업자 프로필을 관리합니다.</p></div></Header>
      <Grid>
        <Metric><span>전체 사용자</span><strong>{summary.totalUserCount || 0}</strong></Metric>
        <Metric><span>활성 계정</span><strong>{summary.activeUserCount || 0}</strong></Metric>
        <Metric><span>관리자</span><strong>{summary.adminCount || 0}</strong></Metric>
        <Metric><span>승인 대기</span><strong>{summary.pendingApprovalCount || 0}</strong></Metric>
      </Grid>
      {activeTab === "users" && <Toolbar>
        <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="이름, 사원번호, 이메일" />
        <Select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="">전체 역할</option><option value="admin">관리자</option><option value="supervisor">지시자</option><option value="operator">작업자</option>
        </Select>
      </Toolbar>}
      {message && <p role="status">{message}</p>}
      <ApiErrors queries={[summaryQuery]} />
      <QueryStatus query={activeQuery} empty={rows.length === 0} />
      <TableWrap><Table>
        <thead><tr><th>사용자</th><th>역할</th><th>승인/활성</th><th>최근 접속</th><th>관리</th></tr></thead>
        <tbody>{rows.map((entry) => (
          <tr key={entry.userId}>
            <td><strong>{entry.name}</strong><br />{entry.empNo} · {entry.email}</td>
            <td>{activeTab === "users" ? <Select value={entry.role} disabled={mutation.isPending} onChange={(event) => act({ kind: "role", id: entry.userId, value: event.target.value }, "역할을 변경했습니다.")}>
              <option value="admin">관리자</option><option value="supervisor">지시자</option><option value="operator">작업자</option>
            </Select> : entry.roleLabel}</td>
            <td><Badge $tone={toneForStatus(entry.approvalStatus)}>{entry.approvalStatusLabel}</Badge> <Badge $tone={entry.active ? "success" : "danger"}>{entry.active ? "활성" : "비활성"}</Badge></td>
            <td>{toKst(entry.lastAccessAt)}</td>
            <td>
              {activeTab === "users" ? <>
                <Button $secondary disabled={mutation.isPending} onClick={() => act({ kind: "active", id: entry.userId, value: !entry.active }, "계정 상태를 변경했습니다.")}>{entry.active ? "비활성" : "활성"}</Button>{" "}
                <Button $secondary disabled={mutation.isPending} onClick={() => window.confirm("사용자를 삭제하시겠습니까?") && act({ kind: "delete", id: entry.userId }, "사용자를 삭제했습니다.")}>삭제</Button>
              </> : <>
                <Button disabled={mutation.isPending} onClick={() => act({ kind: "approval", id: entry.userId, value: "APPROVED" }, "가입을 승인했습니다.")}>승인</Button>{" "}
                <Button $secondary disabled={mutation.isPending} onClick={() => act({ kind: "approval", id: entry.userId, value: "REJECTED" }, "가입을 반려했습니다.")}>반려</Button>
              </>}
            </td>
          </tr>
        ))}</tbody>
      </Table></TableWrap>
    </Page>
  );
}
