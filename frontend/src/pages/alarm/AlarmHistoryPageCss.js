import styled from 'styled-components';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function withClass(Tag, baseClass) {
  return styled(Tag).attrs(({ className }) => ({
    className: cx(baseClass, className),
  }))``;
}

export const PageShell = styled.main.attrs({ className: 'alarm-history-page' })`
& {
  width: 100%;
  min-width: 0;
  min-height: calc(100dvh - 56px);
  padding: 40px 32px 48px 88px;
  overflow-x: clip;
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

& .alarm-page-header,
& .alarm-panel-header,
& .alarm-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

& .alarm-page-header {
  gap: 24px;
  margin-bottom: 24px;
}

& .alarm-title-block {
  max-width: 760px;
}

& .alarm-title-block h1,
& .alarm-panel-header h2,
& .alarm-modal-header h2 {
  margin: 4px 0 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0;
}

& .alarm-title-block h1 {
  margin-bottom: 8px;
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

& .alarm-title-block p {
  margin: 0;
  color: #bccbb9;
  font-size: 14px;
  line-height: 20px;
}

& .alarm-eyebrow,
& .alarm-panel-label,
& .alarm-summary-card span {
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

& .alarm-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

& .alarm-summary-card,
& .alarm-panel,
& .alarm-modal {
  min-width: 0;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
}

& .alarm-summary-card {
  position: relative;
  overflow: hidden;
  padding: 16px;
}

& .alarm-summary-card::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 2px;
  background: #4be277;
  content: '';
}

& .alarm-summary-card strong {
  display: block;
  margin-top: 12px;
  color: #4be277;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
}

& .alarm-summary-card small {
  display: block;
  margin-top: 4px;
  color: #bccbb9;
  font-size: 13px;
  line-height: 18px;
}

& .alarm-history-filter-panel {
  display: grid;
  grid-template-columns: 150px 150px minmax(280px, 1fr) 180px 160px;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #131b2e;
}

& .alarm-field {
  display: flex;
  min-width: 0;
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

& .alarm-field svg {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
}

& .alarm-field input::placeholder {
  color: #869585;
}

& .alarm-field input[type="date"] {
  color-scheme: dark;
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
  box-shadow: 0 0 0 2px rgba(75, 226, 119, 0.12);
}

& .alarm-panel-header {
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #334155;
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
  overflow-x: auto;
}

& .alarm-table {
  width: 100%;
  min-width: 900px;
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

& .alarm-table td > strong,
& .alarm-table td > small {
  display: block;
}

& .alarm-table td > strong {
  font-size: 14px;
  font-weight: 600;
}

& .alarm-table td > small {
  margin-top: 3px;
  color: #869585;
  font-size: 12px;
  line-height: 16px;
}

& .alarm-table tbody tr:nth-child(even) {
  background: rgba(6, 14, 32, 0.46);
}

& .alarm-clickable-row {
  cursor: pointer;
}

& .alarm-table tbody .alarm-clickable-row:hover {
  background: rgba(75, 226, 119, 0.06);
}

& .alarm-table tbody .alarm-clickable-row:focus {
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
& .alarm-status-chip {
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
& .alarm-status-chip.is-pending {
  border-color: rgba(255, 185, 95, 0.34);
  background: rgba(255, 185, 95, 0.14);
  color: #ffb95f;
}

& .alarm-severity-chip--critical {
  border-color: rgba(255, 138, 131, 0.42);
  background: rgba(255, 138, 131, 0.16);
  color: #ffb4ab;
}

& .alarm-status-chip.is-handled {
  border-color: rgba(75, 226, 119, 0.3);
  background: rgba(75, 226, 119, 0.12);
  color: #4be277;
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

& .alarm-modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 32px;
  background: rgba(2, 6, 23, 0.74);
  z-index: 20;
}

& .alarm-modal {
  width: min(520px, 100%);
}

& .alarm-modal-header {
  padding: 16px;
  border-bottom: 1px solid #334155;
}

& .alarm-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #dae2fd;
  cursor: pointer;
}

& .alarm-icon-button:hover {
  border-color: #ffb4ab;
  color: #ffb4ab;
}

& .alarm-modal-body {
  display: grid;
  gap: 16px;
  padding: 16px;
}

& .alarm-detail-grid {
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  gap: 8px 12px;
  margin: 0;
}

& .alarm-detail-grid dt {
  color: #bccbb9;
  font-size: 12px;
  line-height: 18px;
}

& .alarm-detail-grid dd {
  margin: 0;
  color: #dae2fd;
  font-size: 14px;
  line-height: 20px;
}

& .alarm-note-box {
  min-height: 96px;
  padding: 12px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #dae2fd;
  font-size: 14px;
  line-height: 20px;
}

@media (max-width: 1180px) {
  & .alarm-history-filter-panel {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  & .alarm-history-filter-panel > :nth-child(3) {
    grid-column: 1 / -1;
  }
}

@media (max-width: 820px) {
  & {
    padding-top: 32px;
    padding-right: 20px;
    padding-bottom: 40px;
    padding-left: 68px;
  }

  & .alarm-summary-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  & .alarm-summary-card {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 2px 16px;
  }

  & .alarm-summary-card strong {
    grid-row: 1 / span 2;
    grid-column: 2;
    margin-top: 0;
  }

  & .alarm-summary-card small {
    margin-top: 0;
  }
}

@media (max-width: 560px) {
  & {
    min-height: calc(100dvh - 52px);
    padding: 28px 16px 36px 56px;
  }

  & .alarm-page-header,
  & .alarm-panel-header {
    align-items: stretch;
    flex-direction: column;
  }

  & .alarm-page-header {
    margin-bottom: 18px;
  }

  & .alarm-title-block h1 {
    font-size: 24px;
  }

  & .alarm-history-filter-panel {
    grid-template-columns: minmax(0, 1fr);
    padding: 10px;
  }

  & .alarm-history-filter-panel > :nth-child(3) {
    grid-column: auto;
  }

  & .alarm-field {
    height: 44px;
  }

  & .alarm-panel-header {
    gap: 8px;
  }

  & .alarm-table {
    min-width: 900px;
  }

  & .alarm-table th,
  & .alarm-table td {
    padding: 10px;
  }

  & .alarm-modal-backdrop {
    align-items: end;
    padding: 12px;
  }
}

`;
export const PageHeader = withClass('section', 'alarm-page-header');
export const TitleBlock = withClass('div', 'alarm-title-block');
export const Eyebrow = withClass('span', 'alarm-eyebrow');
export const StateSwitch = withClass('div', 'alarm-state-switch');
export const SummaryGrid = withClass('section', 'alarm-summary-grid');
export const SummaryCard = withClass('article', 'alarm-summary-card');
export const FilterPanel = withClass('section', 'alarm-history-filter-panel');
export const FilterField = withClass('label', 'alarm-field');
export const SelectField = withClass('label', 'alarm-field');
export const Panel = withClass('article', 'alarm-panel');
export const PanelHeader = withClass('div', 'alarm-panel-header');
export const PanelLabel = withClass('span', 'alarm-panel-label');
export const PanelMeta = withClass('span', 'alarm-panel-meta');
export const TableFrame = withClass('div', 'alarm-table-frame');
export const HistoryTable = withClass('table', 'alarm-table');
export const TimeCell = withClass('div', 'alarm-time-cell');
export const MonoText = withClass('span', 'alarm-mono');
export const EmptyState = withClass('div', 'alarm-empty-state');
export const ModalBackdrop = withClass('div', 'alarm-modal-backdrop');
export const Modal = withClass('div', 'alarm-modal');
export const ModalHeader = withClass('div', 'alarm-modal-header');
export const IconButton = withClass('button', 'alarm-icon-button');
export const ModalBody = withClass('div', 'alarm-modal-body');
export const DetailGrid = withClass('dl', 'alarm-detail-grid');
export const NoteBox = withClass('div', 'alarm-note-box');

export const SwitchButton = styled.button.attrs(({ $active, className }) => ({
  className: cx('alarm-state-switch__button', $active && 'is-active', className),
}))``;

export const SeverityChip = styled.span.attrs(({ $severity, className }) => ({
  className: cx('alarm-severity-chip', $severity && `alarm-severity-chip--${$severity}`, className),
}))``;

export const StatusChip = styled.span.attrs(({ $handled, className }) => ({
  className: cx('alarm-status-chip', $handled ? 'is-handled' : 'is-pending', className),
}))``;
