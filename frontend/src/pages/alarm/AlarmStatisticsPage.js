import { useMemo, useState } from 'react';
import './AlarmStatisticsPage.css';
import { FiBarChart2, FiCalendar, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

const dailyCounts = [
  { day: '07-03', count: 16 },
  { day: '07-04', count: 21 },
  { day: '07-05', count: 13 },
  { day: '07-06', count: 18 },
  { day: '07-07', count: 25 },
  { day: '07-08', count: 19 },
  { day: '07-09', count: 31 },
];

const equipmentCounts = [
  { name: '증숙기 ST-01', count: 24 },
  { name: '배합기 MX-01', count: 18 },
  { name: '유탕기 FR-01', count: 18 },
  { name: '제면기 NM-01', count: 15 },
  { name: '포장기 PK-01', count: 15 },
];

const frequentAlarms = [
  { rank: 1, alarm: '스팀 압력 편차', equipment: '증숙기 ST-01', count: 11, severity: 'critical' },
  { rank: 2, alarm: '계량 호퍼 센서 지연', equipment: '배합기 MX-01', count: 8, severity: 'warning' },
  { rank: 3, alarm: '유탕 온도 편차', equipment: '유탕기 FR-01', count: 7, severity: 'critical' },
  { rank: 4, alarm: '면대 공급량 편차', equipment: '제면기 NM-01', count: 6, severity: 'warning' },
  { rank: 5, alarm: '검사값 일시 변동', equipment: '검사기 IN-01', count: 5, severity: 'info' },
];

const severityRatio = {
  critical: 24,
  warning: 46,
  info: 30,
};

const severityLabels = {
  info: '정보',
  warning: '경고',
  critical: '심각',
};

function AlarmStatisticsPage() {
  const [showEmpty, setShowEmpty] = useState(false);

  const stats = useMemo(
    () => ({
      daily: showEmpty ? [] : dailyCounts,
      equipment: showEmpty ? [] : equipmentCounts,
      frequent: showEmpty ? [] : frequentAlarms,
      ratio: showEmpty ? { critical: 0, warning: 0, info: 0 } : severityRatio,
    }),
    [showEmpty],
  );

  const totalCount = stats.daily.reduce((sum, item) => sum + item.count, 0);
  const peakDay = stats.daily.reduce((max, item) => (item.count > max.count ? item : max), { day: '-', count: 0 });
  const maxDaily = Math.max(...stats.daily.map((item) => item.count), 1);
  const maxEquipment = Math.max(...stats.equipment.map((item) => item.count), 1);

  return (
    <PageShell>
      <PageHeader>
        <TitleBlock>
          <Eyebrow>Alarm Analytics</Eyebrow>
          <h1>알람 통계</h1>
          <p>일별 발생 수, 설비별 발생 수, 심각도 비율, 반복 알람 순위를 운영 지표로 확인합니다.</p>
        </TitleBlock>
      </PageHeader>

      <ControlRow>
        <StateSwitch aria-label="데이터 상태 미리보기">
          <SwitchButton type="button" $active={!showEmpty} onClick={() => setShowEmpty(false)}>
            데이터 있음
          </SwitchButton>
          <SwitchButton type="button" $active={showEmpty} onClick={() => setShowEmpty(true)}>
            데이터 없음
          </SwitchButton>
        </StateSwitch>
        <FilterField>
          <FiCalendar />
          <select aria-label="통계 기간" defaultValue="7days">
            <option value="7days">최근 7일</option>
            <option value="30days">최근 30일</option>
            <option value="shift">현재 교대조</option>
          </select>
        </FilterField>
      </ControlRow>

      <MetricGrid>
        <MetricCard>
          <MetricLabel>
            <FiBarChart2 />
            Total Alarms
          </MetricLabel>
          <strong>{totalCount}</strong>
          <span>선택 기간 전체 발생 수</span>
        </MetricCard>
        <MetricCard>
          <MetricLabel>
            <FiTrendingUp />
            Peak Day
          </MetricLabel>
          <strong>{peakDay.count}</strong>
          <span>{peakDay.day} 최대 발생</span>
        </MetricCard>
        <MetricCard>
          <MetricLabel>
            <FiCheckCircle />
            Critical Ratio
          </MetricLabel>
          <strong>{stats.ratio.critical}%</strong>
          <span>심각 알람 비율</span>
        </MetricCard>
      </MetricGrid>

      {stats.daily.length > 0 ? (
        <DashboardGrid>
          <Panel>
            <PanelHeader>
              <div>
                <PanelLabel>Daily Count</PanelLabel>
                <h2>일별 알람 발생 수</h2>
              </div>
              <PanelMeta>최근 7일</PanelMeta>
            </PanelHeader>
            <BarChart>
              {stats.daily.map((item) => (
                <BarColumn key={item.day}>
                  <BarTrack>
                    <BarFill $value={(item.count / maxDaily) * 100} />
                  </BarTrack>
                  <strong>{item.count}</strong>
                  <span>{item.day}</span>
                </BarColumn>
              ))}
            </BarChart>
          </Panel>

          <Panel>
            <PanelHeader>
              <div>
                <PanelLabel>Severity Ratio</PanelLabel>
                <h2>심각도별 알람 비율</h2>
              </div>
              <PanelMeta>100%</PanelMeta>
            </PanelHeader>
            <RatioWrap>
              <DonutChart
                $critical={stats.ratio.critical}
                $warning={stats.ratio.warning}
                aria-label="심각도별 알람 비율 차트"
              >
                <strong>{stats.ratio.critical}%</strong>
                <span>심각</span>
              </DonutChart>
              <LegendList>
                {Object.entries(stats.ratio).map(([key, value]) => (
                  <LegendItem key={key} $severity={key}>
                    <span />
                    <strong>{severityLabels[key]}</strong>
                    <MonoText>{value}%</MonoText>
                  </LegendItem>
                ))}
              </LegendList>
            </RatioWrap>
          </Panel>

          <Panel>
            <PanelHeader>
              <div>
                <PanelLabel>Equipment Count</PanelLabel>
                <h2>설비별 알람 발생 수</h2>
              </div>
              <PanelMeta>Top 5</PanelMeta>
            </PanelHeader>
            <HorizontalList>
              {stats.equipment.map((item) => (
                <HorizontalItem key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <MonoText>{item.count}건</MonoText>
                  </div>
                  <ProgressTrack>
                    <ProgressFill $value={(item.count / maxEquipment) * 100} />
                  </ProgressTrack>
                </HorizontalItem>
              ))}
            </HorizontalList>
          </Panel>

          <Panel>
            <PanelHeader>
              <div>
                <PanelLabel>Frequent Ranking</PanelLabel>
                <h2>자주 발생하는 알람 순위</h2>
              </div>
              <PanelMeta>반복 알람</PanelMeta>
            </PanelHeader>
            <TableFrame>
              <RankTable>
                <thead>
                  <tr>
                    <th>순위</th>
                    <th>알람명</th>
                    <th>설비명</th>
                    <th>심각도</th>
                    <th>발생 수</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.frequent.map((item) => (
                    <tr key={item.rank}>
                      <td>
                        <RankBadge>{item.rank}</RankBadge>
                      </td>
                      <td>{item.alarm}</td>
                      <td>{item.equipment}</td>
                      <td>
                        <SeverityChip $severity={item.severity}>{severityLabels[item.severity]}</SeverityChip>
                      </td>
                      <td>
                        <MonoText>{item.count}건</MonoText>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </RankTable>
            </TableFrame>
          </Panel>
        </DashboardGrid>
      ) : (
        <EmptyState>
          <FiCheckCircle />
          <strong>통계 데이터가 없습니다.</strong>
          <span>선택한 기간에 알람 발생 내역이 없으면 차트와 순위 대신 이 안내 상태가 표시됩니다.</span>
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

const PageShell = withClass('main', 'alarm-statistics-page');
const PageHeader = withClass('section', 'alarm-page-header');
const TitleBlock = withClass('div', 'alarm-title-block');
const Eyebrow = withClass('span', 'alarm-eyebrow');
const ControlRow = withClass('section', 'alarm-control-row');
const StateSwitch = withClass('div', 'alarm-state-switch');
const FilterField = withClass('label', 'alarm-field alarm-stat-filter-field');
const MetricGrid = withClass('section', 'alarm-stat-metric-grid');
const MetricCard = withClass('article', 'alarm-stat-metric-card');
const MetricLabel = withClass('div', 'alarm-stat-metric-label');
const DashboardGrid = withClass('section', 'alarm-stat-dashboard-grid');
const Panel = withClass('article', 'alarm-panel');
const PanelHeader = withClass('div', 'alarm-panel-header');
const PanelLabel = withClass('span', 'alarm-panel-label');
const PanelMeta = withClass('span', 'alarm-panel-meta');
const BarChart = withClass('div', 'alarm-bar-chart');
const BarColumn = withClass('div', 'alarm-bar-column');
const BarTrack = withClass('div', 'alarm-bar-track');
const RatioWrap = withClass('div', 'alarm-ratio-wrap');
const LegendList = withClass('div', 'alarm-legend-list');
const HorizontalList = withClass('div', 'alarm-horizontal-list');
const HorizontalItem = withClass('div', 'alarm-horizontal-item');
const ProgressTrack = withClass('div', 'alarm-progress-track');
const TableFrame = withClass('div', 'alarm-table-frame');
const RankTable = withClass('table', 'alarm-table');
const RankBadge = withClass('span', 'alarm-rank-badge');
const MonoText = withClass('span', 'alarm-mono');
const EmptyState = withClass('div', 'alarm-empty-state');

const SwitchButton = ({ $active, className, ...props }) => (
  <button className={cx('alarm-state-switch__button', $active && 'is-active', className)} {...props} />
);

const BarFill = ({ $value, className, ...props }) => (
  <div className={cx('alarm-bar-fill', `alarm-bar-fill--${Math.round($value || 0)}`, className)} {...props} />
);

const DonutChart = ({ $critical, $warning, className, ...props }) => (
  <div className={cx('alarm-donut-chart', $critical + $warning > 0 && 'has-data', className)} {...props} />
);

const LegendItem = ({ $severity, className, ...props }) => (
  <div className={cx('alarm-legend-item', $severity && `alarm-legend-item--${$severity}`, className)} {...props} />
);

const ProgressFill = ({ $value, className, ...props }) => (
  <div className={cx('alarm-progress-fill', `alarm-progress-fill--${Math.round($value || 0)}`, className)} {...props} />
);

const SeverityChip = ({ $severity, className, ...props }) => (
  <span className={cx('alarm-severity-chip', $severity && `alarm-severity-chip--${$severity}`, className)} {...props} />
);
export default AlarmStatisticsPage;
