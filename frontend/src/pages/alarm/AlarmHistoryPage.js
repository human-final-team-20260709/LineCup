import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { alarmApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { currentKstDate, kstPeriod } from "../../api/time";
import { QueryStatus } from "../../components/ApiState";
import { Button, Header, Input, Page, Select, Toolbar, pageContent } from "../../components/OperationalUi";
import AlarmDataTable from "./AlarmDataTable";
import useDebouncedValue from "../../hooks/useDebouncedValue";

export default function AlarmHistoryPage() {
  const [page, setPage] = useState(0);
  const [handled, setHandled] = useState("");
  const [keywordDraft, setKeywordDraft] = useState("");
  const keyword = useDebouncedValue(keywordDraft.trim());
  const params = { page, size: 20, period: { days: 30, through: currentKstDate() }, handled: handled === "" ? undefined : handled === "true", keyword: keyword || undefined };
  const query = useQuery({ queryKey: queryKeys.alarms("history", params), queryFn: () => {
    const livePeriod = kstPeriod(30);
    return alarmApi.list({
      page,
      size: 20,
      handled: handled === "" ? undefined : handled === "true",
      keyword: keyword || undefined,
      startAt: livePeriod.from,
      endAt: livePeriod.to,
    });
  }, refetchInterval: POLLING.HISTORY, placeholderData: (previous) => previous });
  const rows = pageContent(query.data);
  return <Page>
    <Header><div><h1>알람 이력</h1><p>최근 30일 이력을 서버 필터와 페이지 단위로 조회합니다.</p></div></Header>
    <Toolbar><Input value={keywordDraft} onChange={(event) => { setKeywordDraft(event.target.value); setPage(0); }} placeholder="알람·메시지·설비 검색" /><Select value={handled} onChange={(event) => { setHandled(event.target.value); setPage(0); }}><option value="">전체 처리 상태</option><option value="false">미해결</option><option value="true">해결</option></Select></Toolbar>
    <QueryStatus query={query} empty={rows.length === 0} /><AlarmDataTable alarms={rows} />
    <Toolbar><Button $secondary disabled={page === 0} onClick={() => setPage((value) => value - 1)}>이전</Button><span>{page + 1} / {query.data?.totalPages || 1}</span><Button $secondary disabled={page + 1 >= (query.data?.totalPages || 1)} onClick={() => setPage((value) => value + 1)}>다음</Button></Toolbar>
  </Page>;
}
