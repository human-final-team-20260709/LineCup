import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { defectApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { QueryStatus } from "../../components/ApiState";
import { Button, Header, Input, Page, Select, Toolbar, pageContent } from "../../components/OperationalUi";
import DefectDataTable from "./DefectDataTable";

export default function DefectListPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  useEffect(() => { const timeout = window.setTimeout(() => { setKeyword(draft.trim()); setPage(0); }, 300); return () => window.clearTimeout(timeout); }, [draft]);
  const params = { keyword: keyword || undefined, status: status || undefined, page, size: 20 };
  const query = useQuery({ queryKey: queryKeys.defects(params), queryFn: () => defectApi.list(params), refetchInterval: POLLING.DEFECT, placeholderData: (previous) => previous });
  const rows = pageContent(query.data);
  return <Page>
    <Header><div><h1>불량 목록</h1><p>서버 필터·페이징 결과를 5초마다 갱신합니다.</p></div><Button onClick={() => navigate("/quality/defects/new")}>불량 등록</Button></Header>
    <Toolbar><Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="불량·작업지시·LOT·제품 검색" /><Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }}><option value="">전체 상태</option><option value="UNHANDLED">미처리</option><option value="IN_PROGRESS">처리 중</option><option value="ON_HOLD">보류</option><option value="COMPLETED">처리 완료</option></Select></Toolbar>
    <QueryStatus query={query} empty={rows.length === 0} /><DefectDataTable defects={rows} />
    <Toolbar><Button $secondary disabled={page === 0} onClick={() => setPage((value) => value - 1)}>이전</Button><span>{page + 1} / {query.data?.totalPages || 1}</span><Button $secondary disabled={page + 1 >= (query.data?.totalPages || 1)} onClick={() => setPage((value) => value + 1)}>다음</Button></Toolbar>
  </Page>;
}
