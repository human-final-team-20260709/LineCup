import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiActivity,
  FiAlertTriangle,
  FiCpu,
  FiInbox,
  FiSearch,
  FiSliders,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { alarmApi, referenceApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { currentKstDate, kstPeriod, toKst } from "../../api/time";
import { QueryStatus } from "../../components/ApiState";
import CommonPagination from "../../components/CommonPagination";
import { pageContent } from "../../components/OperationalUi";
import {
  AlarmCountRow,
  AlarmTable,
  CardTopLine,
  ContentGrid,
  CountItem,
  DetailGrid,
  EmptyState,
  EquipmentCard,
  EquipmentColumn,
  EquipmentPagination,
  EquipmentMeta,
  EquipmentTitle,
  Eyebrow,
  FilterBar,
  FrequencyPanel,
  HealthChip,
  MonoText,
  PageHeader,
  PageShell,
  Panel,
  PanelHeader,
  PanelLabel,
  PanelMeta,
  ProgressFill,
  ProgressTrack,
  RankBody,
  RankItem,
  RankList,
  RankNumber,
  RecentAlarm,
  SearchBox,
  SelectBox,
  SeverityChip,
  SplitGrid,
  SplitItem,
  SubPanel,
  TableFrame,
  TimeStack,
  TitleBlock,
  TrendCard,
} from "./EquipmentAlarmPageCss";

const EQUIPMENT_PAGE_SIZE = 3;
const RECENT_ALARM_PAGE_SIZE = 10;

const severityKey = (severity) => String(severity || "INFO").toLowerCase();
const isOpenAlarm = (alarm) => alarm.status !== "RESOLVED" && !alarm.handled;

const byLatest = (left, right) =>
  new Date(right.occurredAt || 0).getTime() -
  new Date(left.occurredAt || 0).getTime();

function countBySeverity(alarms, severity) {
  return alarms.filter((alarm) => alarm.severity === severity).length;
}

function healthForAlarms(alarms) {
  const openAlarms = alarms.filter(isOpenAlarm);
  if (openAlarms.some((alarm) => alarm.severity === "CRITICAL")) return "위험";
  if (openAlarms.some((alarm) => alarm.severity === "WARNING")) return "주의";
  return "정상";
}

function messageFrequency(alarms) {
  const frequency = alarms.reduce((result, alarm) => {
    const key = alarm.message || "내용 미등록";
    result.set(key, (result.get(key) || 0) + 1);
    return result;
  }, new Map());

  return [...frequency.entries()]
    .map(([message, count]) => ({ message, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 3);
}

export default function EquipmentAlarmPage() {
  const navigate = useNavigate();
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [severity, setSeverity] = useState("");
  const [handled, setHandled] = useState("");
  const [equipmentPage, setEquipmentPage] = useState(1);
  const [recentAlarmPage, setRecentAlarmPage] = useState(1);

  const equipmentsQuery = useQuery({
    queryKey: queryKeys.equipments({ size: 100 }),
    queryFn: () => referenceApi.equipments({ size: 100 }),
  });

  const periodKey = { days: 30, through: currentKstDate() };
  const alarmsQuery = useQuery({
    queryKey: queryKeys.alarms("equipment-overview", periodKey),
    queryFn: () => {
      const period = kstPeriod(30);
      return alarmApi.list({
        page: 0,
        size: 200,
        startAt: period.from,
        endAt: period.to,
      });
    },
    refetchInterval: POLLING.HISTORY,
    placeholderData: (previous) => previous,
  });

  const equipments = pageContent(equipmentsQuery.data);
  const alarms = useMemo(
    () => [...pageContent(alarmsQuery.data)].sort(byLatest),
    [alarmsQuery.data],
  );

  const equipmentAlarmMap = useMemo(() => {
    const result = new Map();
    alarms.forEach((alarm) => {
      const key = String(alarm.equipmentId);
      result.set(key, [...(result.get(key) || []), alarm]);
    });
    return result;
  }, [alarms]);

  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredEquipments = equipments.filter((equipment) =>
    !normalizedKeyword ||
    `${equipment.equipmentCode} ${equipment.equipmentName} ${equipment.processName}`
      .toLowerCase()
      .includes(normalizedKeyword),
  );
  const equipmentTotalPages = Math.max(
    1,
    Math.ceil(filteredEquipments.length / EQUIPMENT_PAGE_SIZE),
  );
  const currentEquipmentPage = Math.min(equipmentPage, equipmentTotalPages);
  const visibleEquipments = filteredEquipments.slice(
    (currentEquipmentPage - 1) * EQUIPMENT_PAGE_SIZE,
    currentEquipmentPage * EQUIPMENT_PAGE_SIZE,
  );

  const selectedId =
    visibleEquipments.some(
      (equipment) => String(equipment.equipmentId) === selectedEquipmentId,
    )
      ? selectedEquipmentId
      : String(visibleEquipments[0]?.equipmentId || "");
  const selectedEquipment = visibleEquipments.find(
    (equipment) => String(equipment.equipmentId) === selectedId,
  );
  const allSelectedAlarms = equipmentAlarmMap.get(selectedId) || [];
  const selectedAlarms = allSelectedAlarms.filter(
    (alarm) =>
      (!severity || alarm.severity === severity) &&
      (!handled ||
        (handled === "open" ? isOpenAlarm(alarm) : !isOpenAlarm(alarm))),
  );
  const recentAlarmTotalPages = Math.max(
    1,
    Math.ceil(selectedAlarms.length / RECENT_ALARM_PAGE_SIZE),
  );
  const currentRecentAlarmPage = Math.min(
    recentAlarmPage,
    recentAlarmTotalPages,
  );
  const visibleSelectedAlarms = selectedAlarms.slice(
    (currentRecentAlarmPage - 1) * RECENT_ALARM_PAGE_SIZE,
    currentRecentAlarmPage * RECENT_ALARM_PAGE_SIZE,
  );

  useEffect(() => {
    setEquipmentPage((currentPage) =>
      Math.min(currentPage, equipmentTotalPages),
    );
  }, [equipmentTotalPages]);

  useEffect(() => {
    setRecentAlarmPage(1);
  }, [selectedId, severity, handled]);

  useEffect(() => {
    setRecentAlarmPage((currentPage) =>
      Math.min(currentPage, recentAlarmTotalPages),
    );
  }, [recentAlarmTotalPages]);

  const criticalCount = countBySeverity(allSelectedAlarms, "CRITICAL");
  const warningCount = countBySeverity(allSelectedAlarms, "WARNING");
  const infoCount = countBySeverity(allSelectedAlarms, "INFO");
  const openCount = allSelectedAlarms.filter(isOpenAlarm).length;
  const topMessages = messageFrequency(allSelectedAlarms);
  const maxFrequency = Math.max(1, ...topMessages.map((item) => item.count));

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
          <Eyebrow>Equipment intelligence</Eyebrow>
          <h1>설비별 알람 조회</h1>
          <p>
            설비별 최근 30일 알람 빈도와 심각도 분포, 가장 최근 발생 내역을
            한 화면에서 확인합니다.
          </p>
        </TitleBlock>
      </PageHeader>

      <FilterBar aria-label="설비별 알람 필터">
        <SearchBox>
          <FiSearch aria-hidden="true" />
          <input
            aria-label="설비 검색"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
              setEquipmentPage(1);
              setSelectedEquipmentId("");
            }}
            placeholder="설비 코드·설비명·공정 검색"
          />
        </SearchBox>
        <SelectBox>
          <FiAlertTriangle aria-hidden="true" />
          <select
            aria-label="심각도"
            value={severity}
            onChange={(event) => {
              setSeverity(event.target.value);
              setRecentAlarmPage(1);
            }}
          >
            <option value="">전체 심각도</option>
            <option value="CRITICAL">심각</option>
            <option value="WARNING">경고</option>
            <option value="INFO">정보</option>
          </select>
        </SelectBox>
        <SelectBox>
          <FiSliders aria-hidden="true" />
          <select
            aria-label="처리 상태"
            value={handled}
            onChange={(event) => {
              setHandled(event.target.value);
              setRecentAlarmPage(1);
            }}
          >
            <option value="">전체 처리 상태</option>
            <option value="open">미처리</option>
            <option value="handled">처리됨</option>
          </select>
        </SelectBox>
      </FilterBar>

      <QueryStatus query={equipmentsQuery} />
      <QueryStatus query={alarmsQuery} />

      {!equipmentsQuery.isPending && !alarmsQuery.isPending &&
        (filteredEquipments.length === 0 ? (
          <EmptyState>
            <FiInbox aria-hidden="true" />
            <strong>조건에 맞는 설비가 없습니다.</strong>
            <span>검색어를 변경해 다시 조회해 주세요.</span>
          </EmptyState>
        ) : (
          <ContentGrid>
            <EquipmentColumn aria-label="설비 목록">
              {visibleEquipments.map((equipment) => {
                const equipmentId = String(equipment.equipmentId);
                const equipmentAlarms =
                  equipmentAlarmMap.get(equipmentId) || [];
                const latestAlarm = equipmentAlarms[0];

                return (
                  <EquipmentCard
                    key={equipment.equipmentId}
                    type="button"
                    $active={selectedId === equipmentId}
                    aria-pressed={selectedId === equipmentId}
                    onClick={() => {
                      setSelectedEquipmentId(equipmentId);
                      setRecentAlarmPage(1);
                    }}
                  >
                    <CardTopLine>
                      <EquipmentTitle>
                        <FiCpu aria-hidden="true" />
                        <span>{equipment.equipmentName}</span>
                      </EquipmentTitle>
                      <HealthChip $health={healthForAlarms(equipmentAlarms)}>
                        {healthForAlarms(equipmentAlarms)}
                      </HealthChip>
                    </CardTopLine>
                    <EquipmentMeta>
                      <MonoText>{equipment.equipmentCode}</MonoText>
                      <span>{equipment.processName || "공정 미지정"}</span>
                    </EquipmentMeta>
                    <AlarmCountRow>
                      <CountItem>
                        <strong>{equipmentAlarms.length}</strong>
                        <span>전체</span>
                      </CountItem>
                      <CountItem>
                        <strong>
                          {countBySeverity(equipmentAlarms, "CRITICAL")}
                        </strong>
                        <span>심각</span>
                      </CountItem>
                      <CountItem>
                        <strong>
                          {countBySeverity(equipmentAlarms, "WARNING")}
                        </strong>
                        <span>경고</span>
                      </CountItem>
                      <CountItem>
                        <strong>
                          {equipmentAlarms.filter(isOpenAlarm).length}
                        </strong>
                        <span>미처리</span>
                      </CountItem>
                    </AlarmCountRow>
                    <RecentAlarm>
                      <span>최근 알람</span>
                      <strong>{latestAlarm?.message || "최근 알람 없음"}</strong>
                      <MonoText>
                        {latestAlarm
                          ? toKst(latestAlarm.occurredAt, "MM-DD HH:mm:ss")
                          : "-"}
                      </MonoText>
                    </RecentAlarm>
                  </EquipmentCard>
                );
              })}
              <EquipmentPagination>
                <CommonPagination
                  ariaLabel="설비 목록 페이지 이동"
                  currentPage={currentEquipmentPage}
                  onPageChange={(nextPage) => {
                    setEquipmentPage(nextPage);
                    setSelectedEquipmentId("");
                    setRecentAlarmPage(1);
                  }}
                  pageSize={EQUIPMENT_PAGE_SIZE}
                  totalItems={filteredEquipments.length}
                  totalPages={equipmentTotalPages}
                />
              </EquipmentPagination>
            </EquipmentColumn>

            <Panel>
              <PanelHeader>
                <div>
                  <PanelLabel>Selected equipment</PanelLabel>
                  <h2>{selectedEquipment?.equipmentName}</h2>
                </div>
                <PanelMeta>
                  {selectedEquipment?.equipmentCode} · 최근 30일{" "}
                  {allSelectedAlarms.length}건
                </PanelMeta>
              </PanelHeader>

              <DetailGrid>
                <FrequencyPanel>
                  <PanelLabel>Alarm frequency</PanelLabel>
                  <h3>자주 발생한 알람</h3>
                  {topMessages.length > 0 ? (
                    <RankList>
                      {topMessages.map((item, index) => (
                        <RankItem key={item.message}>
                          <RankNumber>{index + 1}</RankNumber>
                          <RankBody>
                            <div>
                              <strong>{item.message}</strong>
                              <MonoText>{item.count}건</MonoText>
                            </div>
                            <ProgressTrack aria-hidden="true">
                              <ProgressFill
                                $value={(item.count / maxFrequency) * 100}
                              />
                            </ProgressTrack>
                          </RankBody>
                        </RankItem>
                      ))}
                    </RankList>
                  ) : (
                    <RecentAlarm>
                      <span>최근 30일간 발생한 알람이 없습니다.</span>
                    </RecentAlarm>
                  )}
                </FrequencyPanel>

                <TrendCard>
                  <PanelLabel>Severity split</PanelLabel>
                  <h3>심각도 및 처리 현황</h3>
                  <SplitGrid>
                    <SplitItem>
                      <span>심각</span>
                      <strong>{criticalCount}</strong>
                    </SplitItem>
                    <SplitItem>
                      <span>경고</span>
                      <strong>{warningCount}</strong>
                    </SplitItem>
                    <SplitItem>
                      <span>정보</span>
                      <strong>{infoCount}</strong>
                    </SplitItem>
                    <SplitItem>
                      <span>미처리</span>
                      <strong>{openCount}</strong>
                    </SplitItem>
                  </SplitGrid>
                </TrendCard>
              </DetailGrid>

              <SubPanel>
                <PanelHeader>
                  <div>
                    <PanelLabel>Recent alarms</PanelLabel>
                    <h2>최근 알람 내역</h2>
                  </div>
                  <PanelMeta>{selectedAlarms.length}건 표시</PanelMeta>
                </PanelHeader>
                {selectedAlarms.length > 0 ? (
                  <TableFrame>
                    <AlarmTable>
                      <thead>
                        <tr>
                          <th>발생 일시</th>
                          <th>알람 번호</th>
                          <th>알람 내용</th>
                          <th>심각도</th>
                          <th>처리 상태</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleSelectedAlarms.map((alarm) => (
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
                              <TimeStack>
                                <MonoText>
                                  {toKst(alarm.occurredAt, "YYYY-MM-DD")}
                                </MonoText>
                                <span>
                                  {toKst(alarm.occurredAt, "HH:mm:ss")}
                                </span>
                              </TimeStack>
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
                              {isOpenAlarm(alarm)
                                ? alarm.statusLabel || "미처리"
                                : "처리됨"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </AlarmTable>
                  </TableFrame>
                ) : (
                  <EmptyState>
                    <FiActivity aria-hidden="true" />
                    <strong>조회된 알람이 없습니다.</strong>
                    <span>
                      선택한 심각도와 처리 상태 조건을 변경해 보세요.
                    </span>
                  </EmptyState>
                )}
                {selectedAlarms.length > 0 && (
                  <CommonPagination
                    ariaLabel="최근 알람 내역 페이지 이동"
                    currentPage={currentRecentAlarmPage}
                    onPageChange={setRecentAlarmPage}
                    pageSize={RECENT_ALARM_PAGE_SIZE}
                    totalItems={selectedAlarms.length}
                    totalPages={recentAlarmTotalPages}
                  />
                )}
              </SubPanel>
            </Panel>
          </ContentGrid>
        ))}
    </PageShell>
  );
}
