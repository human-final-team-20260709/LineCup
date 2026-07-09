import { useMemo, useState } from 'react';
import './AlarmSeverityPage.css';
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiSearch, FiZap } from 'react-icons/fi';

const severityDefinitions = [
  {
    key: 'info',
    label: '정보',
    title: '단순 상태 알림',
    description: '생산 영향이 낮은 참고용 알람입니다. 자동 복귀 또는 추세 확인 중심으로 관리합니다.',
    bullets: ['단순 상태 알림', '참고용 알람', '생산 영향 낮음'],
    icon: FiInfo,
  },
  {
    key: 'warning',
    label: '경고',
    title: '점검 필요 알람',
    description: '품질 또는 설비 상태에 영향을 줄 수 있어 담당자 확인과 예방 조치가 필요합니다.',
    bullets: ['점검 필요', '품질 영향 가능', '설비 이상 징후'],
    icon: FiAlertTriangle,
  },
  {
    key: 'critical',
    label: '심각',
    title: '즉시 조치 알람',
    description: '설비 정지, 생산 중단, 불량 발생으로 이어질 수 있어 즉시 조치해야 합니다.',
    bullets: ['즉시 조치 필요', '설비 정지 가능', '생산 중단 위험'],
    icon: FiZap,
  },
];

const severityAlarmRows = [
  {
    id: 'ALM-260709-017',
    severity: 'critical',
    equipment: '증숙기 ST-01',
    type: '스팀 압력',
    message: '스팀 압력 상한 초과',
    occurredAt: '2026-07-09 18:35:03',
    status: '조치 중',
    owner: '박현우',
  },
  {
    id: 'ALM-260709-013',
    severity: 'critical',
    equipment: '유탕기 FR-01',
    type: '유탕 온도',
    message: '유탕 온도 편차가 품질 허용 범위 초과',
    occurredAt: '2026-07-09 17:41:19',
    status: '처리 완료',
    owner: '정유진',
  },
  {
    id: 'ALM-260709-018',
    severity: 'warning',
    equipment: '배합기 MX-01',
    type: '센서 응답',
    message: '분말 스프 계량 호퍼 잔량 센서 응답 지연',
    occurredAt: '2026-07-09 18:42:15',
    status: '확인 대기',
    owner: '미배정',
  },
  {
    id: 'ALM-260709-016',
    severity: 'warning',
    equipment: '냉각기 CL-01',
    type: '진동',
    message: '냉각 팬 진동값 기준치 근접',
    occurredAt: '2026-07-09 18:21:48',
    status: '점검 예약',
    owner: '정유진',
  },
  {
    id: 'ALM-260709-015',
    severity: 'info',
    equipment: '성형/절단기 CT-01',
    type: '절단 위치',
    message: '면 블록 절단 위치 일시 보정',
    occurredAt: '2026-07-09 18:08:22',
    status: '모니터링',
    owner: '라인 A',
  },
  {
    id: 'ALM-260709-011',
    severity: 'info',
    equipment: '검사기 IN-01',
    type: '검사 조명',
    message: '비전 검사 조명 점검 예정 수준 진입',
    occurredAt: '2026-07-09 15:33:27',
    status: '자동 등록',
    owner: '자동 처리',
  },
];


function AlarmSeverityPage() {
  const [selectedSeverity, setSelectedSeverity] = useState('warning');
  const [showEmpty, setShowEmpty] = useState(false);

  const selectedDefinition = severityDefinitions.find((item) => item.key === selectedSeverity);
  const alarms = useMemo(
    () => (showEmpty ? [] : severityAlarmRows.filter((alarm) => alarm.severity === selectedSeverity)),
    [selectedSeverity, showEmpty],
  );

  return (
    <PageShell>
      <PageHeader>
        <TitleBlock>
          <Eyebrow>Severity Matrix</Eyebrow>
          <h1>심각도별 알람 조회</h1>
          <p>정보, 경고, 심각 알람의 운영 의미를 구분하고 우선순위별 조치 대상을 확인합니다.</p>
        </TitleBlock>
      </PageHeader>

      <TopControls>
        <StateSwitch aria-label="데이터 상태 미리보기">
          <SwitchButton type="button" $active={!showEmpty} onClick={() => setShowEmpty(false)}>
            데이터 있음
          </SwitchButton>
          <SwitchButton type="button" $active={showEmpty} onClick={() => setShowEmpty(true)}>
            데이터 없음
          </SwitchButton>
        </StateSwitch>
        <SearchBox>
          <FiSearch />
          <input aria-label="심각도별 알람 검색" placeholder="설비명, 유형, 처리자 검색" />
        </SearchBox>
      </TopControls>

      <SeverityGrid>
        {severityDefinitions.map((definition) => {
          const Icon = definition.icon;
          const count = severityAlarmRows.filter((alarm) => alarm.severity === definition.key).length;

          return (
            <SeverityCard
              key={definition.key}
              type="button"
              $severity={definition.key}
              $active={selectedSeverity === definition.key}
              onClick={() => setSelectedSeverity(definition.key)}
            >
              <SeverityTop>
                <Icon />
                <SeverityChip $severity={definition.key}>{definition.label}</SeverityChip>
              </SeverityTop>
              <h2>{definition.title}</h2>
              <p>{definition.description}</p>
              <DefinitionList>
                {definition.bullets.map((bullet) => (
                  <li key={bullet}>
                    <FiCheckCircle />
                    {bullet}
                  </li>
                ))}
              </DefinitionList>
              <CardMetric>
                <strong>{showEmpty ? 0 : count}</strong>
                <span>최근 24시간</span>
              </CardMetric>
            </SeverityCard>
          );
        })}
      </SeverityGrid>

      <MainGrid>
        <DefinitionPanel $severity={selectedDefinition.key}>
          <PanelLabel>Selected Rule</PanelLabel>
          <h2>{selectedDefinition.label} 알람 기준</h2>
          <p>{selectedDefinition.description}</p>
          <RuleBox>
            {selectedDefinition.bullets.map((bullet) => (
              <RuleItem key={bullet}>
                <span />
                {bullet}
              </RuleItem>
            ))}
          </RuleBox>
        </DefinitionPanel>

        <Panel>
          <PanelHeader>
            <div>
              <PanelLabel>Severity List</PanelLabel>
              <h2>{selectedDefinition.label} 알람 목록</h2>
            </div>
            <PanelMeta>{alarms.length}건</PanelMeta>
          </PanelHeader>

          {alarms.length > 0 ? (
            <TableFrame>
              <SeverityTable>
                <thead>
                  <tr>
                    <th>발생 시간</th>
                    <th>설비명</th>
                    <th>알람 유형</th>
                    <th>알람 내용</th>
                    <th>처리 상태</th>
                    <th>담당</th>
                  </tr>
                </thead>
                <tbody>
                  {alarms.map((alarm) => (
                    <tr key={alarm.id}>
                      <td>
                        <TimeCell>
                          <MonoText>{alarm.occurredAt}</MonoText>
                          <span>{alarm.id}</span>
                        </TimeCell>
                      </td>
                      <td>{alarm.equipment}</td>
                      <td>{alarm.type}</td>
                      <td>{alarm.message}</td>
                      <td>
                        <StatusPill>{alarm.status}</StatusPill>
                      </td>
                      <td>{alarm.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </SeverityTable>
            </TableFrame>
          ) : (
            <EmptyState>
              <FiCheckCircle />
              <strong>{selectedDefinition.label} 알람이 없습니다.</strong>
              <span>선택한 심각도 조건에 해당하는 알람이 없을 때 표시되는 데이터 없음 상태입니다.</span>
            </EmptyState>
          )}
        </Panel>
      </MainGrid>
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

const PageShell = withClass('main', 'alarm-severity-page');
const PageHeader = withClass('section', 'alarm-page-header');
const TitleBlock = withClass('div', 'alarm-title-block');
const Eyebrow = withClass('span', 'alarm-eyebrow');
const TopControls = withClass('section', 'alarm-severity-top-controls');
const StateSwitch = withClass('div', 'alarm-state-switch');
const SearchBox = withClass('label', 'alarm-field alarm-search-box');
const SeverityGrid = withClass('section', 'alarm-severity-grid');
const SeverityTop = withClass('div', 'alarm-severity-card-top');
const DefinitionList = withClass('ul', 'alarm-definition-list');
const CardMetric = withClass('div', 'alarm-card-metric');
const MainGrid = withClass('section', 'alarm-severity-main-grid');
const PanelLabel = withClass('span', 'alarm-panel-label');
const RuleBox = withClass('div', 'alarm-rule-box');
const RuleItem = withClass('div', 'alarm-rule-item');
const Panel = withClass('article', 'alarm-panel');
const PanelHeader = withClass('div', 'alarm-panel-header');
const PanelMeta = withClass('span', 'alarm-panel-meta');
const TableFrame = withClass('div', 'alarm-table-frame');
const SeverityTable = withClass('table', 'alarm-table');
const TimeCell = withClass('div', 'alarm-time-cell');
const MonoText = withClass('span', 'alarm-mono');
const StatusPill = withClass('span', 'alarm-status-pill');
const EmptyState = withClass('div', 'alarm-empty-state');

const SwitchButton = ({ $active, className, ...props }) => (
  <button className={cx('alarm-state-switch__button', $active && 'is-active', className)} {...props} />
);

const SeverityCard = ({ $severity, $active, className, ...props }) => (
  <button className={cx('alarm-severity-card', $severity && `alarm-severity-card--${$severity}`, $active && 'is-active', className)} {...props} />
);

const DefinitionPanel = ({ $severity, className, ...props }) => (
  <aside className={cx('alarm-definition-panel', $severity && `alarm-definition-panel--${$severity}`, className)} {...props} />
);

const SeverityChip = ({ $severity, className, ...props }) => (
  <span className={cx('alarm-severity-chip', $severity && `alarm-severity-chip--${$severity}`, className)} {...props} />
);
export default AlarmSeverityPage;
