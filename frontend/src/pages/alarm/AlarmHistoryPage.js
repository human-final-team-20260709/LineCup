import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiFileText,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import { alarmApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import {
  currentKstDate,
  dateInputPeriod,
  kstPeriod,
  toKst,
} from "../../api/time";
import { QueryStatus } from "../../components/ApiState";
import CommonPagination from "../../components/CommonPagination";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import {
  EmptyState,
  Eyebrow,
  FilterField,
  FilterPanel,
  HistoryTable,
  MonoText,
  PageHeader,
  PageShell,
  Panel,
  PanelHeader,
  PanelLabel,
  PanelMeta,
  SelectField,
  SeverityChip,
  StatusChip,
  SummaryCard,
  SummaryGrid,
  TableFrame,
  TimeCell,
  TitleBlock,
} from "./AlarmHistoryPageCss";

const PAGE_SIZE = 20;
const DEFAULT_END_DATE = currentKstDate();
const DEFAULT_START_DATE = toKst(kstPeriod(30).from, "YYYY-MM-DD");

const severityClass = (severity) =>
  String(severity || "INFO").toLowerCase();

export default function AlarmHistoryPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [fromDate, setFromDate] = useState(DEFAULT_START_DATE);
  const [toDate, setToDate] = useState(DEFAULT_END_DATE);
  const [handled, setHandled] = useState("");
  const [severity, setSeverity] = useState("");
  const [keywordDraft, setKeywordDraft] = useState("");
  const keyword = useDebouncedValue(keywordDraft.trim());
  const period = dateInputPeriod(fromDate, toDate);
  const handledFilter =
    handled === "" ? undefined : handled === "true";
  const queryParams = {
    page,
    size: PAGE_SIZE,
    fromDate,
    toDate,
    handled: handledFilter,
    severity: severity || undefined,
    keyword: keyword || undefined,
  };

  const query = useQuery({
    queryKey: queryKeys.alarms("history", queryParams),
    queryFn: () =>
      alarmApi.list({
        page,
        size: PAGE_SIZE,
        handled: handledFilter,
        severity: severity || undefined,
        keyword: keyword || undefined,
        startAt: period.from,
        endAt: period.to,
      }),
    refetchInterval: POLLING.HISTORY,
    placeholderData: (previous) => previous,
  });

  const rows = Array.isArray(query.data)
    ? query.data
    : query.data?.content || [];
  const totalItems = query.data?.totalElements || 0;
  const totalPages = query.data?.totalPages || 0;
  const handledCount = rows.filter((alarm) => alarm.handled).length;
  const pendingCount = rows.length - handledCount;

  useEffect(() => {
    if (totalPages > 0 && page >= totalPages) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  const resetPage = () => setPage(0);

  const handleFromDateChange = (event) => {
    const nextDate = event.target.value;
    if (!nextDate) {
      return;
    }
    setFromDate(nextDate);
    if (nextDate > toDate) {
      setToDate(nextDate);
    }
    resetPage();
  };

  const handleToDateChange = (event) => {
    const nextDate = event.target.value;
    if (!nextDate) {
      return;
    }
    setToDate(nextDate);
    if (nextDate < fromDate) {
      setFromDate(nextDate);
    }
    resetPage();
  };

  const openDetail = (alarmId) => {
    navigate(`/alarm/detail/${alarmId}`);
  };

  const handleRowKeyDown = (event, alarmId) => {
    if (
      event.currentTarget === event.target &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      openDetail(alarmId);
    }
  };

  return (
    <PageShell>
      <PageHeader>
        <TitleBlock>
          <Eyebrow>Alarm Archive</Eyebrow>
          <h1>알람 이력 목록</h1>
          <p>
            전체 알람의 발생 일시, 설비, 심각도와 처리 상태를 기간별로
            추적합니다.
          </p>
        </TitleBlock>
      </PageHeader>

      <SummaryGrid aria-label="알람 이력 요약">
        <SummaryCard>
          <span>조회 알람</span>
          <strong>{totalItems.toLocaleString("ko-KR")}</strong>
          <small>현재 검색 조건의 전체 발생 건수</small>
        </SummaryCard>
        <SummaryCard>
          <span>처리 완료</span>
          <strong>{handledCount.toLocaleString("ko-KR")}</strong>
          <small>현재 페이지 {rows.length}건 중 처리 완료</small>
        </SummaryCard>
        <SummaryCard>
          <span>미처리</span>
          <strong>{pendingCount.toLocaleString("ko-KR")}</strong>
          <small>담당자 확인 또는 조치가 필요한 건수</small>
        </SummaryCard>
      </SummaryGrid>

      <FilterPanel aria-label="알람 이력 검색 조건">
        <FilterField title="조회 시작일">
          <FiCalendar aria-hidden="true" />
          <input
            type="date"
            aria-label="조회 시작일"
            value={fromDate}
            max={toDate}
            onChange={handleFromDateChange}
          />
        </FilterField>
        <FilterField title="조회 종료일">
          <FiCalendar aria-hidden="true" />
          <input
            type="date"
            aria-label="조회 종료일"
            value={toDate}
            min={fromDate}
            max={DEFAULT_END_DATE}
            onChange={handleToDateChange}
          />
        </FilterField>
        <FilterField>
          <FiSearch aria-hidden="true" />
          <input
            type="search"
            aria-label="알람 이력 검색"
            placeholder="알람 번호, 설비명, 알람 유형 검색"
            value={keywordDraft}
            onChange={(event) => {
              setKeywordDraft(event.target.value);
              resetPage();
            }}
          />
        </FilterField>
        <SelectField>
          <FiFilter aria-hidden="true" />
          <select
            aria-label="처리 여부 필터"
            value={handled}
            onChange={(event) => {
              setHandled(event.target.value);
              resetPage();
            }}
          >
            <option value="">전체 처리 여부</option>
            <option value="false">미처리</option>
            <option value="true">처리 완료</option>
          </select>
        </SelectField>
        <SelectField>
          <select
            aria-label="심각도 필터"
            value={severity}
            onChange={(event) => {
              setSeverity(event.target.value);
              resetPage();
            }}
          >
            <option value="">전체 심각도</option>
            <option value="CRITICAL">심각</option>
            <option value="WARNING">경고</option>
            <option value="INFO">정보</option>
          </select>
        </SelectField>
      </FilterPanel>

      <Panel aria-busy={query.isFetching}>
        <PanelHeader>
          <div>
            <PanelLabel>History Table</PanelLabel>
            <h2>전체 알람 발생 이력</h2>
          </div>
          <PanelMeta aria-live="polite">
            {query.isFetching ? "갱신 중 · " : ""}
            총 {totalItems.toLocaleString("ko-KR")}건
          </PanelMeta>
        </PanelHeader>

        <QueryStatus query={query} />

        {rows.length > 0 ? (
          <TableFrame>
            <HistoryTable>
              <thead>
                <tr>
                  <th>발생 일시</th>
                  <th>설비명</th>
                  <th>알람 유형</th>
                  <th>심각도</th>
                  <th>해제 시간</th>
                  <th>처리 여부</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((alarm) => (
                  <tr
                    key={alarm.alarmId}
                    className="alarm-clickable-row"
                    tabIndex={0}
                    aria-label={`${alarm.alarmNo} 알람 상세 보기`}
                    onClick={() => openDetail(alarm.alarmId)}
                    onKeyDown={(event) =>
                      handleRowKeyDown(event, alarm.alarmId)
                    }
                  >
                    <td>
                      <TimeCell>
                        <MonoText>{toKst(alarm.occurredAt)}</MonoText>
                        <MonoText>{alarm.alarmNo}</MonoText>
                      </TimeCell>
                    </td>
                    <td>
                      <strong>
                        {alarm.equipmentCode} {alarm.equipmentName}
                      </strong>
                      <small>
                        {alarm.processName}
                        {alarm.location ? ` · ${alarm.location}` : ""}
                      </small>
                    </td>
                    <td>{alarm.message}</td>
                    <td>
                      <SeverityChip $severity={severityClass(alarm.severity)}>
                        {alarm.severityLabel}
                      </SeverityChip>
                    </td>
                    <td>
                      <MonoText>{toKst(alarm.resolvedAt)}</MonoText>
                    </td>
                    <td>
                      <StatusChip $handled={alarm.handled}>
                        {alarm.handled ? "처리 완료" : "미처리"}
                      </StatusChip>
                      <small>{alarm.statusLabel}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </HistoryTable>
          </TableFrame>
        ) : (
          !query.isPending &&
          (query.data || !query.isError) && (
            <EmptyState>
              <FiFileText aria-hidden="true" />
              <strong>조회된 알람 이력이 없습니다.</strong>
              <span>
                조회 기간, 검색어, 처리 여부 또는 심각도 조건을 변경해
                주세요.
              </span>
            </EmptyState>
          )
        )}

        <CommonPagination
          ariaLabel="알람 이력 페이지 이동"
          currentPage={page + 1}
          onPageChange={(nextPage) => setPage(nextPage - 1)}
          pageSize={PAGE_SIZE}
          totalItems={totalItems}
          totalPages={totalPages}
        />
      </Panel>
    </PageShell>
  );
}
