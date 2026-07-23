import styled from 'styled-components';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function withClass(Tag, baseClass) {
  return styled(Tag).attrs(({ className }) => ({
    className: cx(baseClass, className),
  }))``;
}

export const PageShell = styled.main.attrs({ className: 'alarm-statistics-page' })`
& {
  min-height: 100vh;
  padding: 32px;
  background: #0b1326;
  color: #dae2fd;
}

& button,
& select {
  font: inherit;
}

& button {
  border: 0;
}

& .alarm-page-header,
& .alarm-panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

& .alarm-page-header {
  gap: 24px;
  margin-bottom: 16px;
}

& .alarm-title-block {
  max-width: 760px;
}

& .alarm-title-block h1 {
  margin: 4px 0 8px;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0;
}

& .alarm-title-block p {
  margin: 0;
  color: #bccbb9;
  font-size: 14px;
  line-height: 20px;
}

& .alarm-eyebrow,
& .alarm-panel-label {
  color: #4be277;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 16px;
  text-transform: uppercase;
}

& .alarm-control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

& .alarm-state-switch {
  display: inline-flex;
  padding: 3px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
}

& .alarm-state-switch__button {
  min-width: 92px;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 3px;
  background: transparent;
  color: #bccbb9;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

& .alarm-state-switch__button.is-active {
  background: #22c55e;
  color: #003915;
}

& .alarm-field {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 180px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #869585;
}

& .alarm-field select {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #dae2fd;
  color-scheme: dark;
  font-size: 14px;
}

& .alarm-field select option {
  background: #131b2e;
  color: #dae2fd;
}

& .alarm-field:focus-within {
  border-color: #4be277;
}

& .alarm-stat-metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

& .alarm-stat-metric-card,
& .alarm-panel {
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
}

& .alarm-stat-metric-card {
  padding: 16px;
}

& .alarm-stat-metric-card strong {
  display: block;
  margin-top: 14px;
  color: #4be277;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
}

& .alarm-stat-metric-card span {
  display: block;
  margin-top: 4px;
  color: #bccbb9;
  font-size: 13px;
  line-height: 18px;
}

& .alarm-stat-metric-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #bccbb9;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 16px;
  text-transform: uppercase;
}

& .alarm-stat-metric-label svg {
  color: #4be277;
}

& .alarm-stat-dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 16px;
}

& .alarm-panel-header {
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #334155;
}

& .alarm-panel-header h2 {
  margin: 4px 0 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

& .alarm-panel-meta,
& .alarm-mono {
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 12px;
  line-height: 16px;
}

& .alarm-panel-meta {
  color: #bccbb9;
}

& .alarm-bar-chart {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: end;
  gap: 12px;
  height: 300px;
  padding: 20px 16px 16px;
}

& .alarm-bar-column {
  display: grid;
  grid-template-rows: 1fr auto auto;
  gap: 6px;
  height: 100%;
  text-align: center;
}

& .alarm-bar-column strong,
& .alarm-bar-column span {
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 12px;
  line-height: 16px;
}

& .alarm-bar-column span {
  color: #869585;
}

& .alarm-bar-track {
  display: flex;
  align-items: end;
  min-height: 180px;
  border: 1px solid #2d3449;
  border-radius: 4px;
  background: #060e20;
  overflow: hidden;
}

& .alarm-bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #6bff8f 0%, #22c55e 100%);
}

& .alarm-bar-fill--42 {
  height: 42%;
}

& .alarm-bar-fill--52 {
  height: 52%;
}

& .alarm-bar-fill--58 {
  height: 58%;
}

& .alarm-bar-fill--61 {
  height: 61%;
}

& .alarm-bar-fill--68 {
  height: 68%;
}

& .alarm-bar-fill--81 {
  height: 81%;
}

& .alarm-bar-fill--100 {
  height: 100%;
}

& .alarm-ratio-wrap {
  display: grid;
  justify-items: center;
  gap: 18px;
  padding: 24px 16px 20px;
}

& .alarm-donut-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background:
    radial-gradient(circle at center, #171f33 0 58%, transparent 59%),
    conic-gradient(#ff8a83 0 24%, #ffb95f 24% 70%, #38bdf8 70% 100%);
}

& .alarm-donut-chart strong {
  color: #ffb4ab;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 28px;
  line-height: 32px;
}

& .alarm-donut-chart span {
  color: #bccbb9;
  font-size: 12px;
  line-height: 16px;
}

& .alarm-legend-list,
& .alarm-horizontal-list {
  display: grid;
  gap: 8px;
  width: 100%;
}

& .alarm-horizontal-list {
  gap: 14px;
  padding: 18px 16px;
}

& .alarm-legend-item {
  display: grid;
  grid-template-columns: 10px 1fr auto;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 10px;
  border: 1px solid #2d3449;
  border-radius: 4px;
  background: #060e20;
}

& .alarm-legend-item span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #4be277;
}

& .alarm-legend-item--critical span {
  background: #ffb4ab;
}

& .alarm-legend-item--warning span {
  background: #ffb95f;
}

& .alarm-legend-item--info span {
  background: #8bd5ff;
}

& .alarm-legend-item strong,
& .alarm-horizontal-item strong {
  color: #dae2fd;
  font-size: 13px;
  line-height: 18px;
}

& .alarm-horizontal-item {
  display: grid;
  gap: 8px;
}

& .alarm-horizontal-item div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

& .alarm-progress-track {
  height: 8px;
  border-radius: 999px;
  background: #060e20;
  overflow: hidden;
}

& .alarm-progress-fill {
  height: 100%;
  border-radius: inherit;
  background: #4be277;
}

& .alarm-progress-fill--29 {
  width: 29%;
}

& .alarm-progress-fill--38 {
  width: 38%;
}

& .alarm-progress-fill--63 {
  width: 63%;
}

& .alarm-progress-fill--75 {
  width: 75%;
}

& .alarm-progress-fill--100 {
  width: 100%;
}

& .alarm-table-frame {
  overflow-x: auto;
}

& .alarm-table {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
}

& .alarm-table th,
& .alarm-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #2d3449;
  text-align: left;
  vertical-align: middle;
}

& .alarm-table th {
  color: #bccbb9;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 16px;
  text-transform: uppercase;
}

& .alarm-table td {
  color: #dae2fd;
  font-size: 14px;
  line-height: 20px;
}

& .alarm-table tbody tr:nth-child(even) {
  background: rgba(6, 14, 32, 0.46);
}

& .alarm-rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #4be277;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
}

& .alarm-severity-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  min-height: 24px;
  padding: 0 8px;
  border: 1px solid #334155;
  border-radius: 999px;
  background: #222a3d;
  color: #dae2fd;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
}

& .alarm-severity-chip--info {
  border-color: rgba(56, 189, 248, 0.32);
  background: rgba(56, 189, 248, 0.14);
  color: #8bd5ff;
}

& .alarm-severity-chip--warning {
  border-color: rgba(255, 185, 95, 0.34);
  background: rgba(255, 185, 95, 0.14);
  color: #ffb95f;
}

& .alarm-severity-chip--critical {
  border-color: rgba(255, 138, 131, 0.42);
  background: rgba(255, 138, 131, 0.16);
  color: #ffb4ab;
}

& .alarm-empty-state {
  display: grid;
  justify-items: center;
  gap: 8px;
  min-height: 420px;
  padding: 64px 24px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
  color: #bccbb9;
  text-align: center;
}

& .alarm-empty-state svg {
  width: 36px;
  height: 36px;
  color: #4be277;
}

& .alarm-empty-state strong {
  color: #dae2fd;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

& .alarm-empty-state span {
  max-width: 420px;
  font-size: 14px;
  line-height: 20px;
}

`;
export const PageHeader = withClass('section', 'alarm-page-header');
export const TitleBlock = withClass('div', 'alarm-title-block');
export const Eyebrow = withClass('span', 'alarm-eyebrow');
export const ControlRow = withClass('section', 'alarm-control-row');
export const StateSwitch = withClass('div', 'alarm-state-switch');
export const FilterField = withClass('label', 'alarm-field alarm-stat-filter-field');
export const MetricGrid = withClass('section', 'alarm-stat-metric-grid');
export const MetricCard = withClass('article', 'alarm-stat-metric-card');
export const MetricLabel = withClass('div', 'alarm-stat-metric-label');
export const DashboardGrid = withClass('section', 'alarm-stat-dashboard-grid');
export const Panel = withClass('article', 'alarm-panel');
export const PanelHeader = withClass('div', 'alarm-panel-header');
export const PanelLabel = withClass('span', 'alarm-panel-label');
export const PanelMeta = withClass('span', 'alarm-panel-meta');
export const BarChart = withClass('div', 'alarm-bar-chart');
export const BarColumn = withClass('div', 'alarm-bar-column');
export const BarTrack = withClass('div', 'alarm-bar-track');
export const RatioWrap = withClass('div', 'alarm-ratio-wrap');
export const LegendList = withClass('div', 'alarm-legend-list');
export const HorizontalList = withClass('div', 'alarm-horizontal-list');
export const HorizontalItem = withClass('div', 'alarm-horizontal-item');
export const ProgressTrack = withClass('div', 'alarm-progress-track');
export const TableFrame = withClass('div', 'alarm-table-frame');
export const RankTable = withClass('table', 'alarm-table');
export const RankBadge = withClass('span', 'alarm-rank-badge');
export const MonoText = withClass('span', 'alarm-mono');
export const EmptyState = withClass('div', 'alarm-empty-state');

export const SwitchButton = styled.button.attrs(({ $active, className }) => ({
  className: cx('alarm-state-switch__button', $active && 'is-active', className),
}))``;

export const BarFill = styled.div.attrs(({ $value, className }) => ({
  className: cx('alarm-bar-fill', `alarm-bar-fill--${Math.round($value || 0)}`, className),
}))``;

export const DonutChart = styled.div.attrs(({ $critical, $warning, className }) => ({
  className: cx('alarm-donut-chart', $critical + $warning > 0 && 'has-data', className),
}))``;

export const LegendItem = styled.div.attrs(({ $severity, className }) => ({
  className: cx('alarm-legend-item', $severity && `alarm-legend-item--${$severity}`, className),
}))``;

export const ProgressFill = styled.div.attrs(({ $value, className }) => ({
  className: cx('alarm-progress-fill', `alarm-progress-fill--${Math.round($value || 0)}`, className),
}))``;

export const SeverityChip = styled.span.attrs(({ $severity, className }) => ({
  className: cx('alarm-severity-chip', $severity && `alarm-severity-chip--${$severity}`, className),
}))``;
