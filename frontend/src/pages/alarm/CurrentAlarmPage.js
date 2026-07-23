import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageShell,
  PageHeader,
  TitleBlock,
  Eyebrow,
  StateSwitch,
  MetricGrid,
  MetricHeader,
  Toolbar,
  SearchBox,
  SelectGroup,
  MainGrid,
  Panel,
  PanelHeader,
  PanelLabel,
  PanelMeta,
  TableFrame,
  AlarmTable,
  EquipmentCell,
  TimeStack,
  MonoText,
  StatusPill,
  QueueList,
  QueueItem,
  Divider,
  EventList,
  EmptyState,
  SidePanel,
  SwitchButton,
  MetricCard,
  SeverityChip
} from './CurrentAlarmPageCss';
import CommonPagination from '../../components/CommonPagination';
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiSearch,
  FiTool,
} from 'react-icons/fi';

const currentAlarmRows = [
  {
    id: 'ALM-260709-018',
    equipment: '배합기 MX-01',
    location: '배합 공정 / 원료 계량부',
    message: '분말 스프 계량 호퍼 잔량 센서 응답 지연',
    severity: 'warning',
    severityLabel: '경고',
    occurredAt: '2026-07-09 18:42:15',
    elapsed: '00:18:24',
    status: '확인 대기',
    owner: '미배정',
  },
  {
    id: 'ALM-260709-017',
    equipment: '증숙기 ST-01',
    location: '증숙 공정 / 스팀 밸브',
    message: '스팀 압력 상한 초과',
    severity: 'critical',
    severityLabel: '심각',
    occurredAt: '2026-07-09 18:35:03',
    elapsed: '00:25:36',
    status: '조치 중',
    owner: '박현우',
  },
  {
    id: 'ALM-260709-016',
    equipment: '유탕기 FR-01',
    location: '유탕 공정 / 순환 펌프',
    message: '유온 순환 펌프 진동값 기준치 근접',
    severity: 'warning',
    severityLabel: '경고',
    occurredAt: '2026-07-09 18:21:48',
    elapsed: '00:38:51',
    status: '점검 예약',
    owner: '정유진',
  },
  {
    id: 'ALM-260709-015',
    equipment: '검사기 IN-01',
    location: '검사 공정 / 중량 검사 센서',
    message: '제품 중량 검사값 일시 변동 감지',
    severity: 'info',
    severityLabel: '정보',
    occurredAt: '2026-07-09 18:08:22',
    elapsed: '00:52:17',
    status: '모니터링',
    owner: '라인 A',
  },
];

const responseQueue = [
  { label: '즉시 조치', value: 1, tone: 'critical' },
  { label: '10분 내 확인', value: 2, tone: 'warning' },
  { label: '모니터링', value: 1, tone: 'info' },
];

const paginatedAlarmRows = currentAlarmRows.concat([
  {
    id: 'ALM-260709-014',
    equipment: '포장기 PK-01',
    location: '포장 공정 / 필름 텐션부',
    message: '포장 텐션 제어부 온도 경고',
    severity: 'warning',
    severityLabel: '경고',
    occurredAt: '2026-07-09 17:58:44',
    elapsed: '01:01:55',
    status: '처리 완료',
    owner: '김민재',
  },
  {
    id: 'ALM-260709-013',
    equipment: '튀김기 FR-01',
    location: '튀김 공정 / 유온 제어부',
    message: '튀김 온도 측정값 허용 범위 초과',
    severity: 'critical',
    severityLabel: '심각',
    occurredAt: '2026-07-09 17:41:19',
    elapsed: '01:19:20',
    status: '처리 완료',
    owner: '정유진',
  },
  {
    id: 'ALM-260709-012',
    equipment: '제면기 NM-01',
    location: '제면 공정 / 면대 공급 롤러',
    message: '면대 공급 시간 지연',
    severity: 'warning',
    severityLabel: '경고',
    occurredAt: '2026-07-09 16:52:05',
    elapsed: '02:08:34',
    status: '처리 완료',
    owner: '라인 A',
  },
  {
    id: 'ALM-260709-011',
    equipment: '검사기 IN-01',
    location: '검사 공정 / 조명 모듈',
    message: '비전 검사 조명 보정',
    severity: 'info',
    severityLabel: '정보',
    occurredAt: '2026-07-09 15:33:27',
    elapsed: '03:27:12',
    status: '자동 등록',
    owner: '자동 처리',
  },
  {
    id: 'ALM-260709-010',
    equipment: '검사기 IN-01',
    location: '검사 공정 / 비전 조명',
    message: '비전 검사 조명 모듈 점검 예정',
    severity: 'info',
    severityLabel: '정보',
    occurredAt: '2026-07-09 14:21:39',
    elapsed: '04:38:60',
    status: '미처리',
    owner: '미배정',
  },
  {
    id: 'ALM-260709-008',
    equipment: '배합기 MX-01',
    location: '배합 공정 / 원료 투입부',
    message: '배합 원료 투입 시간 지연',
    severity: 'info',
    severityLabel: '정보',
    occurredAt: '2026-07-09 12:17:09',
    elapsed: '06:43:30',
    status: '처리 완료',
    owner: '자동 처리',
  },
  {
    id: 'ALM-260708-044',
    equipment: '배합기 MX-01',
    location: '배합 공정 / 구동 모터',
    message: '배합 모터 부하율 기준치 근접',
    severity: 'warning',
    severityLabel: '경고',
    occurredAt: '2026-07-08 21:04:36',
    elapsed: '21:56:03',
    status: '처리 완료',
    owner: '라인 A',
  },
]);

const PAGE_SIZE = 8;


function CurrentAlarmPage() {
  const [showEmpty, setShowEmpty] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const alarms = useMemo(() => (showEmpty ? [] : paginatedAlarmRows), [showEmpty]);
  const criticalCount = alarms.filter((alarm) => alarm.severity === 'critical').length;
  const warningCount = alarms.filter((alarm) => alarm.severity === 'warning').length;
  const totalPages = Math.max(1, Math.ceil(alarms.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageAlarms = alarms.slice(pageStart, pageStart + PAGE_SIZE);
  const openDetail = (alarmId) => navigate(`/alarm/detail/${alarmId}`);

  return (
    <PageShell>
      <PageHeader>
        <TitleBlock>
          <Eyebrow>Alarm Control</Eyebrow>
          <h1>현재 알람</h1>
          <p>컵라면 생산 라인에서 현재 발생 중인 알람과 조치 상태를 실시간 운영 화면으로 확인합니다.</p>
        </TitleBlock>
      </PageHeader>

      <StateSwitch aria-label="데이터 상태 미리보기">
        <SwitchButton type="button" $active={!showEmpty} onClick={() => { setShowEmpty(false); setCurrentPage(1); }}>
          데이터 있음
        </SwitchButton>
        <SwitchButton type="button" $active={showEmpty} onClick={() => { setShowEmpty(true); setCurrentPage(1); }}>
          데이터 없음
        </SwitchButton>
      </StateSwitch>

      <MetricGrid>
        <MetricCard $tone="critical">
          <MetricHeader>
            <FiAlertTriangle />
            <span>Critical</span>
          </MetricHeader>
          <strong>{criticalCount}</strong>
          <small>즉시 조치 필요</small>
        </MetricCard>
        <MetricCard $tone="warning">
          <MetricHeader>
            <FiClock />
            <span>Warning</span>
          </MetricHeader>
          <strong>{warningCount}</strong>
          <small>점검 및 확인 대기</small>
        </MetricCard>
        <MetricCard $tone="normal">
          <MetricHeader>
            <FiCheckCircle />
            <span>Handled</span>
          </MetricHeader>
          <strong>87%</strong>
          <small>30분 내 처리율</small>
        </MetricCard>
        <MetricCard $tone="info">
          <MetricHeader>
            <FiTool />
            <span>Equipment</span>
          </MetricHeader>
          <strong>{alarms.length}</strong>
          <small>알람 발생 설비</small>
        </MetricCard>
      </MetricGrid>

      <Toolbar>
        <SearchBox>
          <FiSearch />
          <input aria-label="현재 알람 검색" placeholder="설비명, 알람 내용, 알람 번호 검색" />
        </SearchBox>
        <SelectGroup>
          <FiFilter />
          <select aria-label="심각도 필터" defaultValue="all">
            <option value="all">전체 심각도</option>
            <option value="critical">심각</option>
            <option value="warning">경고</option>
            <option value="info">정보</option>
          </select>
        </SelectGroup>
        <SelectGroup>
          <select aria-label="처리 상태 필터" defaultValue="all">
            <option value="all">전체 처리 상태</option>
            <option value="pending">확인 대기</option>
            <option value="working">조치 중</option>
            <option value="watch">모니터링</option>
          </select>
        </SelectGroup>
      </Toolbar>

      <MainGrid>
        <Panel>
          <PanelHeader>
            <div>
              <PanelLabel>Live Alarm List</PanelLabel>
              <h2>발생 중인 알람 목록</h2>
            </div>
            <PanelMeta>Last sync 18:59:39</PanelMeta>
          </PanelHeader>

          {alarms.length > 0 ? (
            <TableFrame>
              <AlarmTable>
                <thead>
                  <tr>
                    <th>알람 번호</th>
                    <th>설비명</th>
                    <th>알람 내용</th>
                    <th>심각도</th>
                    <th>발생 시간</th>
                    <th>처리 상태</th>
                    <th>처리자</th>
                  </tr>
                </thead>
                <tbody>
                  {pageAlarms.map((alarm) => (
                    <tr
                      key={alarm.id}
                      className="alarm-clickable-row"
                      tabIndex={0}
                      onClick={() => openDetail(alarm.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          openDetail(alarm.id);
                        }
                      }}
                    >
                      <td>
                        <MonoText>{alarm.id}</MonoText>
                      </td>
                      <td>
                        <EquipmentCell>
                          <strong>{alarm.equipment}</strong>
                          <span>{alarm.location}</span>
                        </EquipmentCell>
                      </td>
                      <td>{alarm.message}</td>
                      <td>
                        <SeverityChip $severity={alarm.severity}>{alarm.severityLabel}</SeverityChip>
                      </td>
                      <td>
                        <TimeStack>
                          <MonoText>{alarm.occurredAt}</MonoText>
                          <span>경과 {alarm.elapsed}</span>
                        </TimeStack>
                      </td>
                      <td>
                        <StatusPill>{alarm.status}</StatusPill>
                      </td>
                      <td>{alarm.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </AlarmTable>
              <CommonPagination
                ariaLabel="현재 알람 목록 페이지 이동"
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                pageSize={PAGE_SIZE}
                totalItems={alarms.length}
                totalPages={totalPages}
              />
            </TableFrame>
          ) : (
            <EmptyState>
              <FiCheckCircle />
              <strong>현재 발생 중인 알람이 없습니다.</strong>
              <span>설비 상태가 정상 범위에 있으며, 신규 알람 발생 시 이 영역에 즉시 표시됩니다.</span>
            </EmptyState>
          )}
        </Panel>

        <SidePanel>
          <PanelLabel>Response Queue</PanelLabel>
          <h2>조치 우선순위</h2>
          <QueueList>
            {responseQueue.map((item) => (
              <QueueItem key={item.label}>
                <span>{item.label}</span>
                <SeverityChip $severity={item.tone}>{item.value}건</SeverityChip>
              </QueueItem>
            ))}
          </QueueList>
          <Divider />
          <PanelLabel>Recent Event</PanelLabel>
          <EventList>
            <li>
              <MonoText>18:57:02</MonoText>
              증숙기 ST-01 조치 담당자 지정
            </li>
            <li>
              <MonoText>18:49:11</MonoText>
              유탕기 FR-01 점검 예약 등록
            </li>
            <li>
              <MonoText>18:42:15</MonoText>
              배합기 MX-01 신규 알람 발생
            </li>
          </EventList>
        </SidePanel>
      </MainGrid>
    </PageShell>
  );
}

export default CurrentAlarmPage;
