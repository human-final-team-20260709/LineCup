import styled from 'styled-components';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function withClass(Tag, baseClass) {
  return styled(Tag).attrs(({ className }) => ({
    className: cx(baseClass, className),
  }))``;
}

export const PageShell = styled.main.attrs({ className: 'current-alarm-page' })`
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

& .alarm-metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

& .alarm-current-metric-card {
  min-height: 128px;
  padding: 16px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
}

& .alarm-current-metric-card--critical {
  border-color: rgba(255, 138, 131, 0.42);
}

& .alarm-current-metric-card--warning {
  border-color: rgba(255, 185, 95, 0.34);
}

& .alarm-current-metric-card--normal {
  border-color: rgba(75, 226, 119, 0.28);
}

& .alarm-current-metric-card--info {
  border-color: rgba(56, 189, 248, 0.32);
}

& .alarm-current-metric-card strong {
  display: block;
  margin-top: 16px;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
}

& .alarm-current-metric-card--critical strong {
  color: #ffb4ab;
}

& .alarm-current-metric-card--warning strong {
  color: #ffb95f;
}

& .alarm-current-metric-card--normal strong {
  color: #4be277;
}

& .alarm-current-metric-card--info strong {
  color: #8bd5ff;
}

& .alarm-current-metric-card small {
  display: block;
  margin-top: 4px;
  color: #bccbb9;
  font-size: 13px;
  line-height: 18px;
}

& .alarm-metric-header {
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

& .alarm-metric-header svg {
  color: #4be277;
}

& .alarm-toolbar {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) 190px 190px;
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

& .alarm-field input::placeholder {
  color: #869585;
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

& .alarm-main-grid {
  display: grid;
  gap: 16px;
}

& .alarm-panel {
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
}

& .alarm-main-grid > .alarm-panel:first-child {
  min-height: 680px;
}

& .alarm-current-side-panel {
  display: none;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
  gap: 10px 16px;
  padding: 16px;
}

& .alarm-current-side-panel h2 {
  margin: 4px 0 16px;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

& .alarm-current-side-panel h2,
& .alarm-current-side-panel .alarm-queue-list {
  grid-column: 1;
}

& .alarm-current-side-panel > .alarm-panel-label:first-child {
  grid-column: 1;
}

& .alarm-current-side-panel > .alarm-panel-label:nth-of-type(2),
& .alarm-current-side-panel .alarm-event-list {
  grid-column: 2;
}

& .alarm-current-side-panel > .alarm-panel-label:nth-of-type(2) {
  grid-row: 1;
}

& .alarm-current-side-panel .alarm-event-list {
  grid-row: 2 / span 2;
  margin-top: 4px;
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
  display: flex;
  flex-direction: column;
  min-height: 600px;
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
  width: 132px;
}

& .alarm-table th:nth-child(2),
& .alarm-table td:nth-child(2) {
  width: 190px;
}

& .alarm-table th:nth-child(4),
& .alarm-table td:nth-child(4) {
  width: 84px;
}

& .alarm-table th:nth-child(5),
& .alarm-table td:nth-child(5) {
  width: 168px;
}

& .alarm-table th:nth-child(6),
& .alarm-table td:nth-child(6) {
  width: 112px;
}

& .alarm-table th:nth-child(7),
& .alarm-table td:nth-child(7) {
  width: 92px;
}

& .alarm-table th,
& .alarm-table td {
  padding: 13px 12px;
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

& .alarm-table tbody tr:hover {
  background: rgba(75, 226, 119, 0.06);
}

& .alarm-clickable-row {
  cursor: pointer;
}

& .alarm-clickable-row:focus {
  outline: 2px solid #4be277;
  outline-offset: -2px;
  background: rgba(75, 226, 119, 0.08);
}

& .alarm-equipment-cell,
& .alarm-time-stack {
  display: grid;
  gap: 2px;
}

& .alarm-equipment-cell strong {
  font-size: 14px;
  font-weight: 600;
}

& .alarm-equipment-cell span,
& .alarm-time-stack span {
  color: #869585;
  font-size: 12px;
  line-height: 16px;
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

& .alarm-status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 8px;
  border: 1px solid #3d4a3d;
  border-radius: 999px;
  background: #131b2e;
  color: #dae2fd;
  font-size: 12px;
  font-weight: 600;
}

& .alarm-queue-list {
  display: grid;
  gap: 8px;
}

& .alarm-queue-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid #2d3449;
  border-radius: 4px;
  background: #131b2e;
  color: #dae2fd;
  font-size: 14px;
}

& .alarm-divider {
  display: none;
  height: 1px;
  margin: 0;
  background: #334155;
}

& .alarm-event-list {
  display: grid;
  gap: 10px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

& .alarm-event-list li {
  display: grid;
  gap: 3px;
  color: #bccbb9;
  font-size: 13px;
  line-height: 18px;
}

& .alarm-empty-state {
  display: grid;
  justify-items: center;
  gap: 8px;
  min-height: 280px;
  padding: 48px 24px;
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
export const MetricGrid = withClass('section', 'alarm-metric-grid');
export const MetricHeader = withClass('div', 'alarm-metric-header');
export const Toolbar = withClass('section', 'alarm-toolbar');
export const SearchBox = withClass('label', 'alarm-field alarm-search-box');
export const SelectGroup = withClass('label', 'alarm-field alarm-select-group');
export const MainGrid = withClass('section', 'alarm-main-grid');
export const Panel = withClass('article', 'alarm-panel');
export const PanelHeader = withClass('div', 'alarm-panel-header');
export const PanelLabel = withClass('span', 'alarm-panel-label');
export const PanelMeta = withClass('span', 'alarm-panel-meta');
export const TableFrame = withClass('div', 'alarm-table-frame');
export const AlarmTable = withClass('table', 'alarm-table');
export const EquipmentCell = withClass('div', 'alarm-equipment-cell');
export const TimeStack = withClass('div', 'alarm-time-stack');
export const MonoText = withClass('span', 'alarm-mono');
export const StatusPill = withClass('span', 'alarm-status-pill');
export const QueueList = withClass('div', 'alarm-queue-list');
export const QueueItem = withClass('div', 'alarm-queue-item');
export const Divider = withClass('div', 'alarm-divider');
export const EventList = withClass('ul', 'alarm-event-list');
export const EmptyState = withClass('div', 'alarm-empty-state');
export const SidePanel = withClass('article', 'alarm-panel alarm-current-side-panel');

export const SwitchButton = styled.button.attrs(({ $active, className }) => ({
  className: cx('alarm-state-switch__button', $active && 'is-active', className),
}))``;

export const MetricCard = styled.article.attrs(({ $tone, className }) => ({
  className: cx('alarm-current-metric-card', $tone && `alarm-current-metric-card--${$tone}`, className),
}))``;

export const SeverityChip = styled.span.attrs(({ $severity, className }) => ({
  className: cx('alarm-severity-chip', $severity && `alarm-severity-chip--${$severity}`, className),
}))``;
