import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiAlertOctagon,
  FiAlertTriangle,
  FiCheckCircle,
  FiFilter,
  FiInfo,
  FiMapPin,
  FiSearch,
  FiTool,
} from "react-icons/fi";
import { alarmApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { toKst } from "../../api/time";
import { QueryStatus } from "../../components/ApiState";
import CommonPagination from "../../components/CommonPagination";
import { formatNumber, pageContent } from "../../components/OperationalUi";
import {
  AlarmTable,
  EmptyState,
  EquipmentCell,
  Eyebrow,
  MainGrid,
  MessageCell,
  MetricCard,
  MetricGrid,
  MetricHeader,
  MonoText,
  PageHeader,
  PageShell,
  Panel,
  PanelControls,
  PanelHeader,
  PanelHeading,
  PanelLabel,
  PanelMeta,
  SearchBox,
  SelectGroup,
  SeverityChip,
  StateSwitch,
  StatusPill,
  SwitchButton,
  TableFrame,
  TimeStack,
  TitleBlock,
  Toolbar,
} from "./CurrentAlarmPageCss";

const PAGE_SIZE = 20;

const severityLabels = {
  CRITICAL: "심각",
  WARNING: "경고",
  INFO: "정보",
};

const severityPriority = {
  CRITICAL: 3,
  WARNING: 2,
  INFO: 1,
};

const statusLabels = {
  PENDING_CONFIRMATION: "확인 대기",
  IN_PROGRESS: "조치 중",
  INSPECTION_RESERVED: "점검 예약",
  MONITORING: "모니터링",
  RESOLVED: "처리 완료",
};

const severityTone = (severity) => {
  if (severity === "CRITICAL") {
    return "critical";
  }
  if (severity === "WARNING") {
    return "warning";
  }
  return "info";
};

const statusTone = (status) => {
  if (status === "PENDING_CONFIRMATION") {
    return "pending";
  }
  if (status === "IN_PROGRESS") {
    return "progress";
  }
  if (status === "INSPECTION_RESERVED") {
    return "reserved";
  }
  if (status === "MONITORING") {
    return "monitoring";
  }
  return "neutral";
};

const occurredAtValue = (alarm) => {
  const time = new Date(alarm.occurredAt).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export default function CurrentAlarmPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortMode, setSortMode] = useState("latest");

  const params = useMemo(
    () => ({ page, size: PAGE_SIZE }),
    [page],
  );

  const query = useQuery({
    queryKey: queryKeys.alarms("current", params),
    queryFn: () => alarmApi.current(params),
    refetchInterval: POLLING.CURRENT_ALARM,
    placeholderData: (previous) => previous,
  });

  const pageRows = pageContent(query.data);
  const totalPages = Math.max(query.data?.totalPages || 1, 1);
  const totalActive = query.data?.totalElements ?? pageRows.length;

  useEffect(() => {
    if (page >= totalPages) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  const severityCounts = useMemo(
    () =>
      pageRows.reduce(
        (counts, alarm) => {
          if (
            Object.prototype.hasOwnProperty.call(counts, alarm.severity)
          ) {
            counts[alarm.severity] += 1;
          }
          return counts;
        },
        { CRITICAL: 0, WARNING: 0, INFO: 0 },
      ),
    [pageRows],
  );

  const rows = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase("ko-KR");
    const filtered = pageRows.filter((alarm) => {
      const matchesSeverity = !severity || alarm.severity === severity;
      const matchesStatus = !status || alarm.status === status;
      const searchableText = [
        alarm.alarmNo,
        alarm.equipmentCode,
        alarm.equipmentName,
        alarm.processName,
        alarm.location,
        alarm.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("ko-KR");

      return (
        matchesSeverity &&
        matchesStatus &&
        (!normalizedKeyword || searchableText.includes(normalizedKeyword))
      );
    });

    return [...filtered].sort((first, second) => {
      if (sortMode === "priority") {
        const priorityDifference =
          (severityPriority[second.severity] || 0) -
          (severityPriority[first.severity] || 0);
        if (priorityDifference !== 0) {
          return priorityDifference;
        }
      }
      return occurredAtValue(second) - occurredAtValue(first);
    });
  }, [keyword, pageRows, severity, sortMode, status]);

  const goToDetail = (alarmId) => {
    navigate(`/alarm/detail/${alarmId}`);
  };

  const handleRowKeyDown = (event, alarmId) => {
    if (event.currentTarget !== event.target) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToDetail(alarmId);
    }
  };

  const metricValue = (value) =>
    query.isPending && !query.data ? "—" : formatNumber(value);

  return (
    <PageShell>
      <PageHeader>
        <TitleBlock>
          <Eyebrow>ALARM MONITORING · LIVE</Eyebrow>
          <h1>현재 알람</h1>
          <p>
            현재 발생 중인 설비 알람과 처리 상태를 실시간으로 확인합니다.
            심각 알람은 즉시 상세 화면에서 조치해 주세요.
          </p>
        </TitleBlock>

      </PageHeader>

      <MetricGrid aria-label="현재 알람 요약">
        <MetricCard $tone="active">
          <MetricHeader>
            <FiActivity aria-hidden="true" />
            <span>활성 알람</span>
          </MetricHeader>
          <strong>{metricValue(totalActive)}</strong>
          <small>서버 기준 미처리 전체</small>
        </MetricCard>
        <MetricCard $tone="critical">
          <MetricHeader>
            <FiAlertOctagon aria-hidden="true" />
            <span>심각</span>
          </MetricHeader>
          <strong>{metricValue(severityCounts.CRITICAL)}</strong>
          <small>현재 페이지 즉시 조치 대상</small>
        </MetricCard>
        <MetricCard $tone="warning">
          <MetricHeader>
            <FiAlertTriangle aria-hidden="true" />
            <span>경고</span>
          </MetricHeader>
          <strong>{metricValue(severityCounts.WARNING)}</strong>
          <small>현재 페이지 점검 필요</small>
        </MetricCard>
        <MetricCard $tone="info">
          <MetricHeader>
            <FiInfo aria-hidden="true" />
            <span>정보</span>
          </MetricHeader>
          <strong>{metricValue(severityCounts.INFO)}</strong>
          <small>현재 페이지 상태 알림</small>
        </MetricCard>
      </MetricGrid>

      <Toolbar aria-label="현재 알람 검색 필터">
        <SearchBox>
          <FiSearch aria-hidden="true" />
          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="알람 번호, 내용, 설비명 검색"
            aria-label="현재 알람 검색"
          />
        </SearchBox>
        <SelectGroup>
          <FiFilter aria-hidden="true" />
          <select
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
            aria-label="심각도 필터"
          >
            <option value="">전체 심각도</option>
            <option value="CRITICAL">심각</option>
            <option value="WARNING">경고</option>
            <option value="INFO">정보</option>
          </select>
        </SelectGroup>
        <SelectGroup>
          <FiTool aria-hidden="true" />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="처리 상태 필터"
          >
            <option value="">전체 처리 상태</option>
            <option value="PENDING_CONFIRMATION">확인 대기</option>
            <option value="IN_PROGRESS">조치 중</option>
            <option value="INSPECTION_RESERVED">점검 예약</option>
            <option value="MONITORING">모니터링</option>
          </select>
        </SelectGroup>
      </Toolbar>

      <MainGrid>
        <Panel>
          <PanelHeader>
            <PanelHeading>
              <PanelLabel>ACTIVE ALARM QUEUE</PanelLabel>
              <h2>발생 알람 목록</h2>
            </PanelHeading>
            <PanelControls>
              <StateSwitch role="group" aria-label="알람 정렬 방식">
                <SwitchButton
                  type="button"
                  $active={sortMode === "latest"}
                  onClick={() => setSortMode("latest")}
                  aria-pressed={sortMode === "latest"}
                >
                  최신순
                </SwitchButton>
                <SwitchButton
                  type="button"
                  $active={sortMode === "priority"}
                  onClick={() => setSortMode("priority")}
                  aria-pressed={sortMode === "priority"}
                >
                  심각도순
                </SwitchButton>
              </StateSwitch>
              <PanelMeta aria-live="polite">
                <strong>{formatNumber(rows.length)}</strong>건 표시 · {page + 1}/
                {totalPages} 페이지
              </PanelMeta>
            </PanelControls>
          </PanelHeader>

          <TableFrame>
            <QueryStatus query={query} empty={false} />

            {!query.isPending &&
              !query.isError &&
              pageRows.length === 0 && (
                <EmptyState>
                  <FiCheckCircle aria-hidden="true" />
                  <strong>현재 발생 중인 알람이 없습니다</strong>
                  <span>
                    모든 설비가 안정적으로 운영되고 있습니다. 새 알람은
                    자동으로 이 목록에 표시됩니다.
                  </span>
                </EmptyState>
              )}

            {pageRows.length > 0 && rows.length === 0 && (
              <EmptyState>
                <FiSearch aria-hidden="true" />
                <strong>조건에 맞는 알람이 없습니다</strong>
                <span>
                  현재 페이지에서 검색어나 필터 조건을 변경해 다시 확인해
                  주세요.
                </span>
              </EmptyState>
            )}

            {rows.length > 0 && (
              <AlarmTable>
                <caption>현재 발생 중인 설비 알람 목록</caption>
                <thead>
                  <tr>
                    <th scope="col">알람 번호</th>
                    <th scope="col">설비명</th>
                    <th scope="col">알람 내용</th>
                    <th scope="col">심각도</th>
                    <th scope="col">발생 시간</th>
                    <th scope="col">처리 상태</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((alarm) => (
                    <tr
                      key={alarm.alarmId}
                      className="alarm-clickable-row"
                      tabIndex={0}
                      onClick={() => goToDetail(alarm.alarmId)}
                      onKeyDown={(event) =>
                        handleRowKeyDown(event, alarm.alarmId)
                      }
                    >
                      <td data-label="알람 번호">
                        <MonoText>{alarm.alarmNo || "-"}</MonoText>
                      </td>
                      <td data-label="설비명">
                        <EquipmentCell>
                          <strong>{alarm.equipmentName || "-"}</strong>
                          <span>{alarm.equipmentCode || "설비 코드 없음"}</span>
                          <small>
                            <FiMapPin aria-hidden="true" />
                            {[alarm.processName, alarm.location]
                              .filter(Boolean)
                              .join(" · ") || "위치 정보 없음"}
                          </small>
                        </EquipmentCell>
                      </td>
                      <td data-label="알람 내용">
                        <MessageCell>
                          <strong>{alarm.message || "알람 내용 없음"}</strong>
                        </MessageCell>
                      </td>
                      <td data-label="심각도">
                        <SeverityChip
                          $severity={severityTone(alarm.severity)}
                        >
                          {alarm.severityLabel ||
                            severityLabels[alarm.severity] ||
                            alarm.severity ||
                            "-"}
                        </SeverityChip>
                      </td>
                      <td data-label="발생 시간">
                        <TimeStack>
                          <strong>
                            {toKst(alarm.occurredAt, "YYYY-MM-DD")}
                          </strong>
                          <span>{toKst(alarm.occurredAt, "HH:mm:ss")} KST</span>
                        </TimeStack>
                      </td>
                      <td data-label="처리 상태">
                        <StatusPill $tone={statusTone(alarm.status)}>
                          {alarm.statusLabel ||
                            statusLabels[alarm.status] ||
                            alarm.status ||
                            "-"}
                        </StatusPill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </AlarmTable>
            )}
          </TableFrame>

          {query.data && totalActive > 0 && (
            <CommonPagination
              ariaLabel="현재 알람 페이지 이동"
              currentPage={page + 1}
              onPageChange={(nextPage) => setPage(nextPage - 1)}
              pageSize={query.data.size || PAGE_SIZE}
              totalItems={totalActive}
              totalPages={totalPages}
            />
          )}
        </Panel>
      </MainGrid>
    </PageShell>
  );
}
