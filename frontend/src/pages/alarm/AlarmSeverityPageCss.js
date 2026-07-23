import styled from 'styled-components';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function withClass(Tag, baseClass) {
  return styled(Tag).attrs(({ className }) => ({
    className: cx(baseClass, className),
  }))``;
}

export const PageShell = styled.main.attrs({ className: 'alarm-severity-page' })`
& {
  min-height: 100vh;
  padding: 32px;
  background: #0b1326;
  color: #dae2fd;
}

& button,
& input {
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

& .alarm-severity-top-controls {
  display: grid;
  grid-template-columns: auto minmax(320px, 1fr);
  gap: 12px;
  align-items: center;
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
  height: 40px;
  padding: 0 12px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #869585;
}

& .alarm-field input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #dae2fd;
  font-size: 14px;
}

& .alarm-field input::placeholder {
  color: #869585;
}

& .alarm-field:focus-within {
  border-color: #4be277;
}

& .alarm-severity-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

& .alarm-severity-card {
  display: grid;
  gap: 12px;
  min-height: 260px;
  padding: 16px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
  color: #dae2fd;
  text-align: left;
  cursor: pointer;
}

& .alarm-severity-card--info.is-active {
  border-color: #8bd5ff;
  background: rgba(56, 189, 248, 0.14);
}

& .alarm-severity-card--warning.is-active {
  border-color: #ffb95f;
  background: rgba(255, 185, 95, 0.14);
}

& .alarm-severity-card--critical.is-active {
  border-color: #ffb4ab;
  background: rgba(255, 138, 131, 0.16);
}

& .alarm-severity-card h2,
& .alarm-definition-panel h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

& .alarm-severity-card p,
& .alarm-definition-panel p {
  margin: 0;
  color: #bccbb9;
  font-size: 14px;
  line-height: 20px;
}

& .alarm-severity-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

& .alarm-severity-card-top svg,
& .alarm-definition-list svg {
  color: #4be277;
}

& .alarm-definition-list {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

& .alarm-definition-list li {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #bccbb9;
  font-size: 13px;
  line-height: 18px;
}

& .alarm-card-metric {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #334155;
}

& .alarm-card-metric strong {
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
}

& .alarm-card-metric span {
  color: #869585;
  font-size: 12px;
  line-height: 16px;
}

& .alarm-severity-main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

& .alarm-definition-panel,
& .alarm-panel {
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
}

& .alarm-definition-panel {
  align-self: start;
  padding: 16px;
}

& .alarm-definition-panel--info {
  border-color: rgba(56, 189, 248, 0.32);
}

& .alarm-definition-panel--warning {
  border-color: rgba(255, 185, 95, 0.34);
}

& .alarm-definition-panel--critical {
  border-color: rgba(255, 138, 131, 0.42);
}

& .alarm-definition-panel h2 {
  margin: 4px 0 12px;
}

& .alarm-definition-panel p {
  margin: 0 0 16px;
}

& .alarm-rule-box {
  display: grid;
  gap: 8px;
}

& .alarm-rule-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 10px;
  border: 1px solid #2d3449;
  border-radius: 4px;
  background: #060e20;
  color: #dae2fd;
  font-size: 13px;
  line-height: 18px;
}

& .alarm-rule-item span {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #4be277;
}

& .alarm-panel-header {
  display: flex;
  align-items: center;
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

& .alarm-table-frame {
  overflow-x: visible;
}

& .alarm-table {
  width: 100%;
  min-width: 0;
  border-collapse: collapse;
  table-layout: fixed;
}

& .alarm-table th:nth-child(1),
& .alarm-table td:nth-child(1) {
  width: 172px;
}

& .alarm-table th:nth-child(2),
& .alarm-table td:nth-child(2) {
  width: 180px;
}

& .alarm-table th:nth-child(3),
& .alarm-table td:nth-child(3) {
  width: 140px;
}

& .alarm-table th:nth-child(5),
& .alarm-table td:nth-child(5) {
  width: 120px;
}

& .alarm-table th:nth-child(6),
& .alarm-table td:nth-child(6) {
  width: 108px;
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
  overflow-wrap: anywhere;
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

& .alarm-time-cell {
  display: grid;
  gap: 2px;
}

& .alarm-time-cell span:last-child {
  color: #869585;
  font-size: 12px;
  line-height: 16px;
}

& .alarm-severity-chip,
& .alarm-status-pill {
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

& .alarm-status-pill {
  background: #131b2e;
  font-family: inherit;
  font-weight: 600;
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
  min-height: 300px;
  padding: 56px 24px;
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
export const TopControls = withClass('section', 'alarm-severity-top-controls');
export const StateSwitch = withClass('div', 'alarm-state-switch');
export const SearchBox = withClass('label', 'alarm-field alarm-search-box');
export const SeverityGrid = withClass('section', 'alarm-severity-grid');
export const SeverityTop = withClass('div', 'alarm-severity-card-top');
export const DefinitionList = withClass('ul', 'alarm-definition-list');
export const CardMetric = withClass('div', 'alarm-card-metric');
export const MainGrid = withClass('section', 'alarm-severity-main-grid');
export const PanelLabel = withClass('span', 'alarm-panel-label');
export const Panel = withClass('article', 'alarm-panel');
export const PanelHeader = withClass('div', 'alarm-panel-header');
export const PanelMeta = withClass('span', 'alarm-panel-meta');
export const TableFrame = withClass('div', 'alarm-table-frame');
export const SeverityTable = withClass('table', 'alarm-table');
export const TimeCell = withClass('div', 'alarm-time-cell');
export const MonoText = withClass('span', 'alarm-mono');
export const StatusPill = withClass('span', 'alarm-status-pill');
export const EmptyState = withClass('div', 'alarm-empty-state');

export const SwitchButton = styled.button.attrs(({ $active, className }) => ({
  className: cx('alarm-state-switch__button', $active && 'is-active', className),
}))``;

export const SeverityCard = styled.button.attrs(({ $severity, $active, className }) => ({
  className: cx(
    'alarm-severity-card',
    $severity && `alarm-severity-card--${$severity}`,
    $active && 'is-active',
    className
  ),
}))``;

export const SeverityChip = styled.span.attrs(({ $severity, className }) => ({
  className: cx('alarm-severity-chip', $severity && `alarm-severity-chip--${$severity}`, className),
}))``;
