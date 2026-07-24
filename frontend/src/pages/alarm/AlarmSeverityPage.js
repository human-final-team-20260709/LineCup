import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiAlertCircle,
  FiAlertOctagon,
  FiCheck,
  FiInfo,
  FiSearch,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { alarmApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { currentKstDate, kstPeriod, toKst } from "../../api/time";
import { QueryStatus } from "../../components/ApiState";
import CommonPagination from "../../components/CommonPagination";
import { pageContent } from "../../components/OperationalUi";
import {
  CardMetric,
  DefinitionList,
  DefinitionPanel,
  EmptyState,
  Eyebrow,
  MainGrid,
  MonoText,
  PageHeader,
  PageShell,
  Panel,
  PanelHeader,
  PanelLabel,
  PanelMeta,
  RuleBox,
  RuleItem,
  SearchBox,
  SeverityCard,
  SeverityChip,
  SeverityGrid,
  SeverityTable,
  SeverityTop,
  StateSwitch,
  StatusPill,
  SwitchButton,
  TableFrame,
  TimeCell,
  TitleBlock,
  TopControls,
} from "./AlarmSeverityPageCss";

const severityDefinitions = {
  INFO: {
    key: "info",
    label: "정보",
    icon: FiInfo,
    summary: "설비 상태를 기록하는 참고용 알람",
    bullets: ["단순 상태 알림", "참고용 알람", "생산 영향 낮음"],
    rules: [
      "공정 상태 변화를 운영 이력으로 기록합니다.",
      "즉시 조치보다 추세 확인과 참고에 활용합니다.",
      "반복 발생 시 경고 단계 전환 여부를 점검합니다.",
    ],
  },
  WARNING: {
    key: "warning",
    label: "경고",
    icon: FiAlertCircle,
    summary: "점검이 필요한 설비 이상 징후",
    bullets: ["점검 필요", "품질 영향 가능", "설비 이상 징후"],
    rules: [
      "설비 이상 징후를 확인하고 점검 일정을 지정합니다.",
      "생산 품질과 공정 편차에 미치는 영향을 추적합니다.",
      "미처리 상태가 지속되면 현장 책임자에게 공유합니다.",
    ],
  },
  CRITICAL: {
    key: "critical",
    label: "심각",
    icon: FiAlertOctagon,
    summary: "즉시 조치가 필요한 생산 위험 알람",
    bullets: ["즉시 조치", "설비 정지 가능", "중단·불량 위험"],
    rules: [
      "설비 정지 가능성을 먼저 확인하고 즉시 조치합니다.",
      "생산 중단 또는 불량 확산 여부를 현장에서 판단합니다.",
      "원인과 조치 내용을 기록한 뒤 처리 완료로 전환합니다.",
    ],
  },
};

const isOpenAlarm = (alarm) => alarm.status !== "RESOLVED" && !alarm.handled;
const severityKey = (severity) => String(severity || "INFO").toLowerCase();
const PAGE_SIZE = 10;

export default function AlarmSeverityPage() {
  const navigate = useNavigate();
  const [severity, setSeverity] = useState("CRITICAL");
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const periodKey = { days: 30, through: currentKstDate() };

  const statisticsQuery = useQuery({
    queryKey: queryKeys.alarmStatistics(periodKey),
    queryFn: () => alarmApi.statistics(kstPeriod(30)),
    refetchInterval: POLLING.STATISTICS,
    placeholderData: (previous) => previous,
  });

  const alarmsParams = {
    severity,
    period: periodKey,
    page: 0,
    size: 100,
  };
  const alarmsQuery = useQuery({
    queryKey: queryKeys.alarms("severity", alarmsParams),
    queryFn: () => {
      const period = kstPeriod(30);
      return alarmApi.list({
        severity,
        page: 0,
        size: 100,
        startAt: period.from,
        endAt: period.to,
      });
    },
    refetchInterval: POLLING.HISTORY,
    placeholderData: (previous) => previous,
  });

  const rows = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return pageContent(alarmsQuery.data).filter(
      (alarm) =>
        (!showOpenOnly || isOpenAlarm(alarm)) &&
        (!normalizedKeyword ||
          `${alarm.alarmNo} ${alarm.message} ${alarm.equipmentCode} ${alarm.equipmentName}`
            .toLowerCase()
            .includes(normalizedKeyword)),
    );
  }, [alarmsQuery.data, keyword, showOpenOnly]);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedRows = rows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage((previousPage) => Math.min(previousPage, totalPages));
  }, [totalPages]);

  const counts = new Map(
    (statisticsQuery.data?.severityCounts || []).map((item) => [
      item.severity,
      item.count,
    ]),
  );
  const selectedDefinition = severityDefinitions[severity];
  const SelectedSeverityIcon = selectedDefinition.icon;

  const selectSeverity = (nextSeverity) => {
    setSeverity(nextSeverity);
    setPage(1);
  };

  const selectOpenState = (nextOpenOnly) => {
    setShowOpenOnly(nextOpenOnly);
    setPage(1);
  };

  const changeKeyword = (event) => {
    setKeyword(event.target.value);
    setPage(1);
  };

  const openAlarm = (alarmId) => navigate(`/alarm/detail/${alarmId}`);
  const handleRowKeyDown = (event, alarmId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openAlarm(alarmId);
    }
  };

  return (
    <PageShell>
      <PageHeader>
        <TitleBlock>
          <Eyebrow>Severity classification</Eyebrow>
          <h1>심각도별 알람 조회</h1>
          <p>
            정보·경고·심각 단계의 의미와 대응 기준을 확인하고 최근 30일
            발생 내역을 심각도별로 조회합니다.
          </p>
        </TitleBlock>
      </PageHeader>

      <TopControls>
        <StateSwitch aria-label="알람 처리 상태">
          <SwitchButton
            type="button"
            $active={!showOpenOnly}
            aria-pressed={!showOpenOnly}
            onClick={() => selectOpenState(false)}
          >
            전체 이력
          </SwitchButton>
          <SwitchButton
            type="button"
            $active={showOpenOnly}
            aria-pressed={showOpenOnly}
            onClick={() => selectOpenState(true)}
          >
            미처리만
          </SwitchButton>
        </StateSwitch>
        <SearchBox>
          <FiSearch aria-hidden="true" />
          <input
            aria-label="알람 검색"
            value={keyword}
            onChange={changeKeyword}
            placeholder="알람 번호·내용·설비 검색"
          />
        </SearchBox>
      </TopControls>

      <QueryStatus query={statisticsQuery} />

      <SeverityGrid aria-label="심각도 선택">
        {Object.entries(severityDefinitions).map(([value, definition]) => {
          const Icon = definition.icon;
          return (
            <SeverityCard
              key={value}
              type="button"
              $severity={definition.key}
              $active={severity === value}
              aria-pressed={severity === value}
              onClick={() => selectSeverity(value)}
            >
              <SeverityTop>
                <div>
                  <PanelLabel>{value}</PanelLabel>
                  <h2>{definition.label}</h2>
                </div>
                <Icon size={22} aria-hidden="true" />
              </SeverityTop>
              <p>{definition.summary}</p>
              <DefinitionList>
                {definition.bullets.map((bullet) => (
                  <li key={bullet}>
                    <FiCheck aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </DefinitionList>
              <CardMetric>
                <strong>{counts.get(value) || 0}</strong>
                <span>최근 30일 발생</span>
              </CardMetric>
            </SeverityCard>
          );
        })}
      </SeverityGrid>

      <MainGrid>
        <DefinitionPanel $severity={selectedDefinition.key}>
          <PanelLabel>Response guide</PanelLabel>
          <h2>{selectedDefinition.label} 단계 대응 기준</h2>
          <p>{selectedDefinition.summary}</p>
          <RuleBox>
            {selectedDefinition.rules.map((rule) => (
              <RuleItem key={rule}>
                <span aria-hidden="true" />
                {rule}
              </RuleItem>
            ))}
          </RuleBox>
        </DefinitionPanel>

        <Panel>
          <PanelHeader>
            <div>
              <PanelLabel>Alarm records</PanelLabel>
              <h2>{selectedDefinition.label} 알람 내역</h2>
            </div>
            <PanelMeta>
              최근 30일 · {rows.length}건 표시
            </PanelMeta>
          </PanelHeader>
          <QueryStatus query={alarmsQuery} />
          {!alarmsQuery.isPending &&
            (rows.length > 0 ? (
              <TableFrame>
                <SeverityTable>
                  <thead>
                    <tr>
                      <th>발생 일시</th>
                      <th>설비명</th>
                      <th>알람 번호</th>
                      <th>알람 내용</th>
                      <th>심각도</th>
                      <th>처리 상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.map((alarm) => (
                      <tr
                        key={alarm.alarmId}
                        className="alarm-clickable-row"
                        tabIndex={0}
                        aria-label={`${alarm.alarmNo} 상세 보기`}
                        onClick={() => openAlarm(alarm.alarmId)}
                        onKeyDown={(event) =>
                          handleRowKeyDown(event, alarm.alarmId)
                        }
                      >
                        <td>
                          <TimeCell>
                            <MonoText>
                              {toKst(alarm.occurredAt, "YYYY-MM-DD")}
                            </MonoText>
                            <span>{toKst(alarm.occurredAt, "HH:mm:ss")}</span>
                          </TimeCell>
                        </td>
                        <td>
                          <strong>{alarm.equipmentName}</strong>
                          <br />
                          <MonoText>{alarm.equipmentCode}</MonoText>
                        </td>
                        <td>
                          <MonoText>{alarm.alarmNo}</MonoText>
                        </td>
                        <td>{alarm.message}</td>
                        <td>
                          <SeverityChip
                            $severity={severityKey(alarm.severity)}
                          >
                            {alarm.severityLabel}
                          </SeverityChip>
                        </td>
                        <td>
                          <StatusPill $handled={!isOpenAlarm(alarm)}>
                            {alarm.statusLabel ||
                              (isOpenAlarm(alarm) ? "미처리" : "처리됨")}
                          </StatusPill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </SeverityTable>
              </TableFrame>
            ) : (
              <EmptyState>
                <SelectedSeverityIcon aria-hidden="true" />
                <strong>조회된 {selectedDefinition.label} 알람이 없습니다.</strong>
                <span>검색어나 처리 상태 조건을 변경해 보세요.</span>
              </EmptyState>
            ))}
          <CommonPagination
            ariaLabel="심각도별 알람 페이지 이동"
            currentPage={currentPage}
            onPageChange={setPage}
            pageSize={PAGE_SIZE}
            totalItems={rows.length}
            totalPages={totalPages}
          />
        </Panel>
      </MainGrid>
    </PageShell>
  );
}
