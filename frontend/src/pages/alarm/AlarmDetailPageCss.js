import styled from 'styled-components';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function withClass(Tag, baseClass) {
  return styled(Tag).attrs(({ className }) => ({
    className: cx(baseClass, className),
  }))``;
}

export const PageShell = styled.main.attrs({ className: 'alarm-detail-page' })`
& {
  min-height: 100vh;
  padding: 32px;
  background: #0b1326;
  color: #dae2fd;
}

& button,
& input,
& select,
& textarea {
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

& .alarm-detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) 360px;
  gap: 16px;
}

& .alarm-hero-panel,
& .alarm-info-panel,
& .alarm-timeline-panel,
& .alarm-action-panel {
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
}

& .alarm-hero-panel {
  padding: 16px;
}

& .alarm-hero-panel--critical {
  border-color: rgba(255, 138, 131, 0.42);
}

& .alarm-hero-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

& .alarm-hero-header h2 {
  margin: 4px 0 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
}

& .alarm-hero-description {
  margin: 16px 0 0;
  color: #bccbb9;
  font-size: 14px;
  line-height: 20px;
}

& .alarm-hero-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 16px;
}

& .alarm-meta-item {
  padding: 12px;
  border: 1px solid #2d3449;
  border-radius: 4px;
  background: #060e20;
}

& .alarm-meta-item span {
  display: block;
  color: #869585;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 16px;
  text-transform: uppercase;
}

& .alarm-meta-item strong {
  display: block;
  margin-top: 6px;
  color: #dae2fd;
  font-size: 14px;
  line-height: 20px;
}

& .alarm-info-panel,
& .alarm-timeline-panel {
  padding: 16px;
}

& .alarm-info-grid {
  display: grid;
  gap: 12px;
  margin: 12px 0 0;
}

& .alarm-info-item {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 10px;
  align-items: flex-start;
  min-height: 54px;
  padding: 10px;
  border: 1px solid #2d3449;
  border-radius: 4px;
  background: #060e20;
}

& .alarm-info-item svg {
  margin-top: 2px;
  color: #4be277;
}

& .alarm-info-item dt {
  color: #869585;
  font-size: 12px;
  line-height: 16px;
}

& .alarm-info-item dd {
  margin: 2px 0 0;
  color: #dae2fd;
  font-size: 14px;
  line-height: 20px;
}

& .alarm-timeline-panel {
  align-self: start;
}

& .alarm-timeline-panel h2 {
  margin: 4px 0 16px;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

& .alarm-timeline {
  display: grid;
  gap: 10px;
}

& .alarm-timeline-item {
  display: grid;
  gap: 3px;
  padding: 12px;
  border: 1px solid #2d3449;
  border-left: 3px solid #3d4a3d;
  border-radius: 4px;
  background: #060e20;
}

& .alarm-timeline-item.is-active {
  border-color: #334155;
  border-left-color: #4be277;
  background: #131b2e;
}

& .alarm-timeline-item strong {
  color: #dae2fd;
  font-size: 14px;
  line-height: 20px;
}

& .alarm-timeline-item span:last-child {
  color: #bccbb9;
  font-size: 13px;
  line-height: 18px;
}

& .alarm-related-panel {
  grid-column: 1 / -1;
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

& .alarm-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 16px;
}

& .alarm-form-field {
  display: grid;
  gap: 6px;
}

& .alarm-form-field span {
  color: #bccbb9;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
}

& .alarm-form-field input,
& .alarm-form-field select,
& .alarm-form-field textarea {
  border: 1px solid #334155;
  border-radius: 4px;
  outline: 0;
  background: #060e20;
  color: #dae2fd;
  font-size: 14px;
}

& .alarm-form-field input,
& .alarm-form-field select {
  height: 40px;
  padding: 0 10px;
}

& .alarm-form-field select {
  color-scheme: dark;
}

& .alarm-form-field select option {
  background: #131b2e;
  color: #dae2fd;
}

& .alarm-form-field textarea {
  min-height: 120px;
  padding: 10px;
  resize: vertical;
  line-height: 20px;
}

& .alarm-form-field input:focus,
& .alarm-form-field select:focus,
& .alarm-form-field textarea:focus {
  border-color: #4be277;
}

& .alarm-textarea-field {
  grid-column: 1 / -1;
}

& .alarm-button-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 16px 16px;
}

& .alarm-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid #334155;
  border-radius: 4px;
  color: #dae2fd;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

& .alarm-button--primary {
  background: #31394d;
}

& .alarm-button:hover {
  border-color: #4be277;
}

& .alarm-table-frame {
  overflow-x: auto;
}

& .alarm-table {
  width: 100%;
  min-width: 820px;
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

& .alarm-severity-chip--warning,
& .alarm-status-pill--warning {
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
export const StateSwitch = withClass('div', 'alarm-state-switch');
export const DetailLayout = withClass('section', 'alarm-detail-layout');
export const HeroHeader = withClass('div', 'alarm-hero-header');
export const HeroDescription = withClass('p', 'alarm-hero-description');
export const HeroMetaGrid = withClass('div', 'alarm-hero-meta-grid');
export const MetaItem = withClass('div', 'alarm-meta-item');
export const InfoPanel = withClass('article', 'alarm-info-panel');
export const InfoGrid = withClass('dl', 'alarm-info-grid');
export const InfoItem = withClass('div', 'alarm-info-item');
export const TimelinePanel = withClass('article', 'alarm-timeline-panel');
export const Timeline = withClass('div', 'alarm-timeline');
export const ActionPanel = withClass('article', 'alarm-action-panel');
export const RelatedPanel = withClass('article', 'alarm-action-panel alarm-related-panel');
export const PanelHeader = withClass('div', 'alarm-panel-header');
export const PanelLabel = withClass('span', 'alarm-panel-label');
export const PanelMeta = withClass('span', 'alarm-panel-meta');
export const FormGrid = withClass('div', 'alarm-form-grid');
export const Field = withClass('label', 'alarm-form-field');
export const TextAreaField = withClass('label', 'alarm-form-field alarm-textarea-field');
export const ButtonRow = withClass('div', 'alarm-button-row');
export const PrimaryButton = withClass('button', 'alarm-button alarm-button--primary');
export const TableFrame = withClass('div', 'alarm-table-frame');
export const RelatedTable = withClass('table', 'alarm-table');
export const TimeCell = withClass('div', 'alarm-time-cell');
export const MonoText = withClass('span', 'alarm-mono');
export const StatusPill = withClass('span', 'alarm-status-pill alarm-status-pill--warning');
export const EmptyState = withClass('div', 'alarm-empty-state');

export const SwitchButton = styled.button.attrs(({ $active, className }) => ({
  className: cx('alarm-state-switch__button', $active && 'is-active', className),
}))``;

export const HeroPanel = styled.article.attrs(({ $severity, className }) => ({
  className: cx('alarm-hero-panel', $severity && `alarm-hero-panel--${$severity}`, className),
}))``;

export const TimelineItem = styled.div.attrs(({ $active, className }) => ({
  className: cx('alarm-timeline-item', $active && 'is-active', className),
}))``;

export const SeverityChip = styled.span.attrs(({ $severity, className }) => ({
  className: cx('alarm-severity-chip', $severity && `alarm-severity-chip--${$severity}`, className),
}))``;
