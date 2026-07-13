import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EquipmentAlarmPage.css';
import {
  FiCheckCircle,
  FiCpu,
  FiFilter,
  FiSearch,
} from 'react-icons/fi';

const equipmentRows = [
  {
    id: 'EQ-MX-01',
    name: '배합기 MX-01',
    process: '배합',
    total: 18,
    critical: 2,
    warning: 9,
    info: 7,
    lastAlarm: '분말 스프 계량 호퍼 잔량 센서 응답 지연',
    lastAt: '2026-07-09 18:42:15',
    health: '주의',
  },
  {
    id: 'EQ-RL-01',
    name: '압연기 RL-01',
    process: '압연',
    total: 9,
    critical: 1,
    warning: 5,
    info: 3,
    lastAlarm: '압연 롤러 간격 편차',
    lastAt: '2026-07-09 17:12:28',
    health: '정상',
  },
  {
    id: 'EQ-NM-01',
    name: '제면기 NM-01',
    process: '제면',
    total: 15,
    critical: 2,
    warning: 8,
    info: 5,
    lastAlarm: '면대 공급량 순간 편차',
    lastAt: '2026-07-09 16:52:05',
    health: '주의',
  },
  {
    id: 'EQ-ST-01',
    name: '증숙기 ST-01',
    process: '증숙',
    total: 24,
    critical: 5,
    warning: 13,
    info: 6,
    lastAlarm: '스팀 압력 상한 초과',
    lastAt: '2026-07-09 18:35:03',
    health: '위험',
  },
  {
    id: 'EQ-CT-01',
    name: '성형/절단기 CT-01',
    process: '성형/절단',
    total: 7,
    critical: 1,
    warning: 3,
    info: 3,
    lastAlarm: '면 블록 절단 위치 일시 보정',
    lastAt: '2026-07-09 18:08:22',
    health: '정상',
  },
  {
    id: 'EQ-FR-01',
    name: '유탕기 FR-01',
    process: '유탕',
    total: 18,
    critical: 3,
    warning: 10,
    info: 5,
    lastAlarm: '유온 순환 펌프 진동값 기준치 근접',
    lastAt: '2026-07-09 18:21:48',
    health: '주의',
  },
  {
    id: 'EQ-CL-01',
    name: '냉각기 CL-01',
    process: '냉각',
    total: 9,
    critical: 1,
    warning: 6,
    info: 2,
    lastAlarm: '냉각 팬 회전수 편차',
    lastAt: '2026-07-09 17:33:16',
    health: '주의',
  },
  {
    id: 'EQ-PK-01',
    name: '포장기 PK-01',
    process: '포장',
    total: 15,
    critical: 1,
    warning: 8,
    info: 6,
    lastAlarm: '포장 씰링 온도 편차',
    lastAt: '2026-07-09 17:58:44',
    health: '정상',
  },
  {
    id: 'EQ-IN-01',
    name: '검사기 IN-01',
    process: '검사',
    total: 7,
    critical: 0,
    warning: 3,
    info: 4,
    lastAlarm: '제품 중량 검사값 일시 변동 감지',
    lastAt: '2026-07-09 18:08:22',
    health: '정상',
  },
];

const selectedEquipmentAlarms = [
  {
    id: 'ALM-260709-018',
    occurredAt: '2026-07-09 18:42:15',
    type: '센서 응답',
    message: '분말 스프 계량 호퍼 잔량 센서 응답 지연',
    severity: 'warning',
    severityLabel: '경고',
    status: '확인 대기',
  },
  {
    id: 'ALM-260709-008',
    occurredAt: '2026-07-09 12:17:09',
    type: '원료 투입',
    message: '배합 원료 투입량 순간 편차',
    severity: 'info',
    severityLabel: '정보',
    status: '처리 완료',
  },
  {
    id: 'ALM-260708-044',
    occurredAt: '2026-07-08 21:04:36',
    type: '구동 모터',
    message: '배합 모터 부하율 기준치 근접',
    severity: 'warning',
    severityLabel: '경고',
    status: '처리 완료',
  },
];



function EquipmentAlarmPage() {
  const [showEmpty, setShowEmpty] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('EQ-MX-01');
  const navigate = useNavigate();

  const equipments = useMemo(() => (showEmpty ? [] : equipmentRows), [showEmpty]);
  const selectedEquipment = equipments.find((equipment) => equipment.id === selectedEquipmentId) || equipments[0];
  const alarms = showEmpty ? [] : selectedEquipmentAlarms;
  const openDetail = (alarmId) => navigate(`/alarm/detail/${alarmId}`);

  return (
    <PageShell>
      <PageHeader>
        <TitleBlock>
          <Eyebrow>Equipment Alarm</Eyebrow>
          <h1>설비별 알람 조회</h1>
          <p>설비 단위로 알람 발생 빈도, 최근 알람, 심각도 분포를 비교해 반복 이상 설비를 파악합니다.</p>
        </TitleBlock>
      </PageHeader>

      <StateSwitch aria-label="데이터 상태 미리보기">
        <SwitchButton type="button" $active={!showEmpty} onClick={() => setShowEmpty(false)}>
          데이터 있음
        </SwitchButton>
        <SwitchButton type="button" $active={showEmpty} onClick={() => setShowEmpty(true)}>
          데이터 없음
        </SwitchButton>
      </StateSwitch>

      <FilterBar>
        <SearchBox>
          <FiSearch />
          <input aria-label="설비 검색" placeholder="설비명, 공정명, 알람 내용 검색" />
        </SearchBox>
        <SelectBox>
          <FiFilter />
          <select aria-label="공정 필터" defaultValue="all">
            <option value="all">전체 공정</option>
            <option value="mix">배합</option>
            <option value="roll">압연</option>
            <option value="noodle">제면</option>
            <option value="steam">증숙</option>
            <option value="cut">성형/절단</option>
            <option value="fry">유탕</option>
            <option value="cool">냉각</option>
            <option value="pack">포장</option>
            <option value="inspect">검사</option>
          </select>
        </SelectBox>
        <SelectBox>
          <select aria-label="정렬 기준" defaultValue="frequency">
            <option value="frequency">발생 빈도순</option>
            <option value="latest">최근 발생순</option>
            <option value="critical">심각 알람순</option>
          </select>
        </SelectBox>
      </FilterBar>

      {equipments.length > 0 ? (
        <ContentGrid>
          <EquipmentColumn>
            {equipments.map((equipment) => (
              <EquipmentCard
                key={equipment.id}
                type="button"
                $active={equipment.id === selectedEquipment?.id}
                onClick={() => setSelectedEquipmentId(equipment.id)}
              >
                <CardTopLine>
                  <EquipmentTitle>
                    <FiCpu />
                    <span>{equipment.name}</span>
                  </EquipmentTitle>
                  <HealthChip $health={equipment.health}>{equipment.health}</HealthChip>
                </CardTopLine>
                <EquipmentMeta>
                  <span>{equipment.process} 공정</span>
                  <MonoText>{equipment.id}</MonoText>
                </EquipmentMeta>
                <AlarmCountRow>
                  <CountItem>
                    <strong>{equipment.total}</strong>
                    <span>전체</span>
                  </CountItem>
                  <CountItem>
                    <strong>{equipment.critical}</strong>
                    <span>심각</span>
                  </CountItem>
                  <CountItem>
                    <strong>{equipment.warning}</strong>
                    <span>경고</span>
                  </CountItem>
                  <CountItem>
                    <strong>{equipment.info}</strong>
                    <span>정보</span>
                  </CountItem>
                </AlarmCountRow>
                <RecentAlarm>
                  <MonoText>{equipment.lastAt}</MonoText>
                  <span>{equipment.lastAlarm}</span>
                </RecentAlarm>
              </EquipmentCard>
            ))}
          </EquipmentColumn>

          <Panel>
            <PanelHeader>
              <div>
                <PanelLabel>Selected Equipment</PanelLabel>
                <h2>{selectedEquipment?.name}</h2>
              </div>
              <HealthChip $health={selectedEquipment?.health}>{selectedEquipment?.health}</HealthChip>
            </PanelHeader>

            <DetailGrid>
              <FrequencyPanel>
                <PanelLabel>Alarm Frequency</PanelLabel>
                <h3>설비별 알람 빈도</h3>
                <RankList>
                  {equipments.map((equipment, index) => (
                    <RankItem key={equipment.id}>
                      <RankNumber>{index + 1}</RankNumber>
                      <RankBody>
                        <div>
                          <strong>{equipment.name}</strong>
                          <MonoText>{equipment.total}건</MonoText>
                        </div>
                        <ProgressTrack>
                          <ProgressFill $value={(equipment.total / 24) * 100} />
                        </ProgressTrack>
                      </RankBody>
                    </RankItem>
                  ))}
                </RankList>
              </FrequencyPanel>

              <TrendCard>
                <PanelLabel>Severity Split</PanelLabel>
                <h3>선택 설비 심각도 분포</h3>
                <SplitGrid>
                  <SplitItem>
                    <SeverityChip $severity="critical">심각</SeverityChip>
                    <strong>{selectedEquipment?.critical}</strong>
                  </SplitItem>
                  <SplitItem>
                    <SeverityChip $severity="warning">경고</SeverityChip>
                    <strong>{selectedEquipment?.warning}</strong>
                  </SplitItem>
                  <SplitItem>
                    <SeverityChip $severity="info">정보</SeverityChip>
                    <strong>{selectedEquipment?.info}</strong>
                  </SplitItem>
                </SplitGrid>
              </TrendCard>
            </DetailGrid>

            <SubPanel>
              <PanelHeader>
                <div>
                  <PanelLabel>Recent List</PanelLabel>
                  <h2>설비별 최근 알람</h2>
                </div>
                <PanelMeta>최근 24시간</PanelMeta>
              </PanelHeader>
              <TableFrame>
                <AlarmTable>
                  <thead>
                    <tr>
                      <th>발생 시간</th>
                      <th>알람 유형</th>
                      <th>내용</th>
                      <th>심각도</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alarms.map((alarm) => (
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
                          <TimeStack>
                            <MonoText>{alarm.occurredAt}</MonoText>
                            <MonoText>{alarm.id}</MonoText>
                          </TimeStack>
                        </td>
                        <td>{alarm.type}</td>
                        <td>{alarm.message}</td>
                        <td>
                          <SeverityChip $severity={alarm.severity}>{alarm.severityLabel}</SeverityChip>
                        </td>
                        <td>{alarm.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </AlarmTable>
              </TableFrame>
            </SubPanel>
          </Panel>
        </ContentGrid>
      ) : (
        <EmptyState>
          <FiCheckCircle />
          <strong>조회된 설비 알람이 없습니다.</strong>
          <span>선택한 공정 또는 설비 조건에 해당하는 알람 발생 내역이 없습니다.</span>
        </EmptyState>
      )}
    </PageShell>
  );
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function withClass(Tag, baseClass) {
  return function ClassComponent({ className, ...props }) {
    return <Tag className={cx(baseClass, className)} {...props} />;
  };
}

const healthClassMap = {
  '\uC815\uC0C1': 'normal',
  '\uC8FC\uC758': 'warning',
  '\uC704\uD5D8': 'danger',
};

const PageShell = withClass('main', 'equipment-alarm-page');
const PageHeader = withClass('section', 'alarm-page-header');
const TitleBlock = withClass('div', 'alarm-title-block');
const Eyebrow = withClass('span', 'alarm-eyebrow');
const StateSwitch = withClass('div', 'alarm-state-switch');
const FilterBar = withClass('section', 'alarm-filter-bar');
const SearchBox = withClass('label', 'alarm-field alarm-search-box');
const SelectBox = withClass('label', 'alarm-field alarm-select-box');
const ContentGrid = withClass('section', 'equipment-content-grid');
const EquipmentColumn = withClass('div', 'equipment-column');
const CardTopLine = withClass('div', 'equipment-card-top-line');
const EquipmentTitle = withClass('div', 'equipment-title');
const EquipmentMeta = withClass('div', 'equipment-meta');
const AlarmCountRow = withClass('div', 'equipment-count-row');
const CountItem = withClass('div', 'equipment-count-item');
const RecentAlarm = withClass('div', 'equipment-recent-alarm');
const Panel = withClass('article', 'alarm-panel');
const PanelHeader = withClass('div', 'alarm-panel-header');
const PanelLabel = withClass('span', 'alarm-panel-label');
const PanelMeta = withClass('span', 'alarm-panel-meta');
const DetailGrid = withClass('div', 'equipment-detail-grid');
const FrequencyPanel = withClass('section', 'equipment-frequency-panel');
const TrendCard = withClass('section', 'equipment-frequency-panel');
const RankList = withClass('div', 'equipment-rank-list');
const RankItem = withClass('div', 'equipment-rank-item');
const RankNumber = withClass('span', 'equipment-rank-number');
const RankBody = withClass('div', 'equipment-rank-body');
const ProgressTrack = withClass('div', 'alarm-progress-track');
const SplitGrid = withClass('div', 'equipment-split-grid');
const SplitItem = withClass('div', 'equipment-split-item');
const SubPanel = withClass('section', 'equipment-sub-panel');
const TableFrame = withClass('div', 'alarm-table-frame');
const AlarmTable = withClass('table', 'alarm-table');
const TimeStack = withClass('div', 'alarm-time-stack');
const MonoText = withClass('span', 'alarm-mono');
const EmptyState = withClass('div', 'alarm-empty-state');

const SwitchButton = ({ $active, className, ...props }) => (
  <button className={cx('alarm-state-switch__button', $active && 'is-active', className)} {...props} />
);

const EquipmentCard = ({ $active, className, ...props }) => (
  <button className={cx('equipment-card', $active && 'is-active', className)} {...props} />
);

const ProgressFill = ({ $value, className, ...props }) => (
  <div className={cx('alarm-progress-fill', `alarm-progress-fill--${Math.round($value || 0)}`, className)} {...props} />
);

const SeverityChip = ({ $severity, className, ...props }) => (
  <span className={cx('alarm-severity-chip', $severity && `alarm-severity-chip--${$severity}`, className)} {...props} />
);

const HealthChip = ({ $health, className, ...props }) => (
  <span className={cx('equipment-health-chip', $health && `equipment-health-chip--${healthClassMap[$health] || 'unknown'}`, className)} {...props} />
);
export default EquipmentAlarmPage;
