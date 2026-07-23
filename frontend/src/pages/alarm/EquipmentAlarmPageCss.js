import styled from 'styled-components';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function withClass(Tag, baseClass) {
  return styled(Tag).attrs(({ className }) => ({
    className: cx(baseClass, className),
  }))``;
}

const healthClassMap = {
  '\uC815\uC0C1': 'normal',
  '\uC8FC\uC758': 'warning',
  '\uC704\uD5D8': 'danger',
};

export const PageShell = styled.main.attrs({ className: 'equipment-alarm-page' })`
& {
  min-height: 100vh;
  padding: 32px;
  background: #0b1326;
  color: #dae2fd;
}

& button,
& input,
& select {
  font: inherit;
}

& button {
  border: 0;
}

& .alarm-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
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

& .alarm-state-switch {
  display: inline-flex;
  padding: 3px;
  margin-bottom: 16px;
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

& .alarm-filter-bar {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) 180px 180px;
  gap: 8px;
  margin-bottom: 16px;
}

& .alarm-field {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #869585;
}

& .alarm-field input,
& .alarm-field select {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #dae2fd;
  font-size: 14px;
}

& .alarm-field select {
  color-scheme: dark;
}

& .alarm-field select option {
  background: #131b2e;
  color: #dae2fd;
}

& .alarm-field:focus-within {
  border-color: #4be277;
}

& .equipment-content-grid {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 16px;
}

& .equipment-column {
  display: grid;
  align-content: start;
  gap: 12px;
}

& .equipment-card {
  display: grid;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
  color: #dae2fd;
  text-align: left;
  cursor: pointer;
}

& .equipment-card.is-active {
  border-color: #4be277;
  background: rgba(75, 226, 119, 0.08);
}

& .equipment-card-top-line,
& .equipment-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

& .equipment-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
}

& .equipment-title svg {
  color: #4be277;
}

& .equipment-meta {
  color: #bccbb9;
  font-size: 12px;
  line-height: 16px;
}

& .equipment-count-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

& .equipment-count-item {
  padding: 8px;
  border: 1px solid #2d3449;
  border-radius: 4px;
  background: #060e20;
}

& .equipment-count-item strong {
  display: block;
  color: #dae2fd;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 18px;
  line-height: 24px;
}

& .equipment-count-item span {
  color: #869585;
  font-size: 11px;
  line-height: 16px;
}

& .equipment-recent-alarm {
  display: grid;
  gap: 4px;
  color: #bccbb9;
  font-size: 13px;
  line-height: 18px;
}

& .alarm-panel {
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
}

& .alarm-panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
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

& .equipment-detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 16px;
  padding: 16px;
}

& .equipment-frequency-panel {
  padding: 16px;
  border: 1px solid #2d3449;
  border-radius: 4px;
  background: #131b2e;
}

& .equipment-frequency-panel h3 {
  margin: 4px 0 14px;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
}

& .equipment-rank-list,
& .equipment-split-grid {
  display: grid;
  gap: 10px;
}

& .equipment-rank-item {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
}

& .equipment-rank-number {
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

& .equipment-rank-body {
  display: grid;
  gap: 8px;
}

& .equipment-rank-body div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

& .equipment-rank-body strong {
  color: #dae2fd;
  font-size: 13px;
  line-height: 18px;
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

& .equipment-split-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  padding: 0 10px;
  border: 1px solid #2d3449;
  border-radius: 4px;
  background: #060e20;
}

& .equipment-split-item strong {
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 20px;
  line-height: 28px;
}

& .equipment-sub-panel {
  margin: 0 16px 16px;
  border: 1px solid #2d3449;
  border-radius: 4px;
  overflow: hidden;
}

& .alarm-table-frame {
  overflow-x: auto;
}

& .alarm-table {
  width: 100%;
  min-width: 760px;
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

& .alarm-clickable-row {
  cursor: pointer;
}

& .alarm-clickable-row:hover {
  background: rgba(75, 226, 119, 0.06);
}

& .alarm-clickable-row:focus {
  outline: 2px solid #4be277;
  outline-offset: -2px;
  background: rgba(75, 226, 119, 0.08);
}

& .alarm-time-stack {
  display: grid;
  gap: 2px;
}

& .alarm-time-stack span:last-child {
  color: #869585;
  font-size: 12px;
  line-height: 16px;
}

& .alarm-severity-chip,
& .equipment-health-chip {
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

& .alarm-severity-chip--warning,
& .equipment-health-chip--warning {
  border-color: rgba(255, 185, 95, 0.34);
  background: rgba(255, 185, 95, 0.14);
  color: #ffb95f;
}

& .alarm-severity-chip--critical,
& .equipment-health-chip--danger {
  border-color: rgba(255, 138, 131, 0.42);
  background: rgba(255, 138, 131, 0.16);
  color: #ffb4ab;
}

& .equipment-health-chip--normal {
  border-color: rgba(75, 226, 119, 0.28);
  background: rgba(75, 226, 119, 0.12);
  color: #4be277;
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
export const StateSwitch = withClass('div', 'alarm-state-switch');
export const FilterBar = withClass('section', 'alarm-filter-bar');
export const SearchBox = withClass('label', 'alarm-field alarm-search-box');
export const SelectBox = withClass('label', 'alarm-field alarm-select-box');
export const ContentGrid = withClass('section', 'equipment-content-grid');
export const EquipmentColumn = withClass('div', 'equipment-column');
export const CardTopLine = withClass('div', 'equipment-card-top-line');
export const EquipmentTitle = withClass('div', 'equipment-title');
export const EquipmentMeta = withClass('div', 'equipment-meta');
export const AlarmCountRow = withClass('div', 'equipment-count-row');
export const CountItem = withClass('div', 'equipment-count-item');
export const RecentAlarm = withClass('div', 'equipment-recent-alarm');
export const Panel = withClass('article', 'alarm-panel');
export const PanelHeader = withClass('div', 'alarm-panel-header');
export const PanelLabel = withClass('span', 'alarm-panel-label');
export const PanelMeta = withClass('span', 'alarm-panel-meta');
export const DetailGrid = withClass('div', 'equipment-detail-grid');
export const FrequencyPanel = withClass('section', 'equipment-frequency-panel');
export const TrendCard = withClass('section', 'equipment-frequency-panel');
export const RankList = withClass('div', 'equipment-rank-list');
export const RankItem = withClass('div', 'equipment-rank-item');
export const RankNumber = withClass('span', 'equipment-rank-number');
export const RankBody = withClass('div', 'equipment-rank-body');
export const ProgressTrack = withClass('div', 'alarm-progress-track');
export const SplitGrid = withClass('div', 'equipment-split-grid');
export const SplitItem = withClass('div', 'equipment-split-item');
export const SubPanel = withClass('section', 'equipment-sub-panel');
export const TableFrame = withClass('div', 'alarm-table-frame');
export const AlarmTable = withClass('table', 'alarm-table');
export const TimeStack = withClass('div', 'alarm-time-stack');
export const MonoText = withClass('span', 'alarm-mono');
export const EmptyState = withClass('div', 'alarm-empty-state');

export const SwitchButton = styled.button.attrs(({ $active, className }) => ({
  className: cx('alarm-state-switch__button', $active && 'is-active', className),
}))``;

export const EquipmentCard = styled.button.attrs(({ $active, className }) => ({
  className: cx('equipment-card', $active && 'is-active', className),
}))``;

export const ProgressFill = styled.div.attrs(({ $value, className }) => ({
  className: cx('alarm-progress-fill', `alarm-progress-fill--${Math.round($value || 0)}`, className),
}))``;

export const SeverityChip = styled.span.attrs(({ $severity, className }) => ({
  className: cx('alarm-severity-chip', $severity && `alarm-severity-chip--${$severity}`, className),
}))``;

export const HealthChip = styled.span.attrs(({ $health, className }) => ({
  className: cx(
    'equipment-health-chip',
    $health && `equipment-health-chip--${healthClassMap[$health] || 'unknown'}`,
    className
  ),
}))``;
