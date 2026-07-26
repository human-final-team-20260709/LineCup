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
  margin-bottom: 24px;
}

& .alarm-title-block {
  max-width: 760px;
}

& .alarm-title-block h1 {
  margin: 4px 0 8px;
  font-size: clamp(26px, 3vw, 32px);
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

& .alarm-hero-panel--warning {
  border-color: rgba(255, 185, 95, 0.34);
}

& .alarm-hero-panel--info {
  border-color: rgba(56, 189, 248, 0.32);
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

& .alarm-info-panel h2 {
  margin: 4px 0 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
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
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  padding: 16px 16px 0;
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

& .alarm-form-field small {
  color: #869585;
  font-size: 11px;
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
  height: 42px;
  padding: 0 12px;
}

& .alarm-form-field select {
  color-scheme: dark;
  cursor: pointer;
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

& .alarm-form-field input[readonly] {
  background: #10182a;
  color: #bccbb9;
}

& .alarm-status-field {
  gap: 8px;
  padding: 12px;
  border: 1px solid rgba(75, 226, 119, 0.24);
  border-radius: 4px;
  background: rgba(75, 226, 119, 0.055);
}

& .alarm-status-field > span {
  color: #4be277;
}

& .alarm-status-field select {
  height: 44px;
  border-color: rgba(75, 226, 119, 0.4);
  background: #0c1729;
  font-weight: 600;
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
  grid-column: 1 / -1;
  justify-content: flex-end;
  gap: 8px;
  margin: 4px -16px 0;
  padding: 14px 16px 16px;
  border-top: 1px solid #2d3449;
  background: rgba(6, 14, 32, 0.34);
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
  transition:
    border-color 140ms ease,
    background-color 140ms ease,
    color 140ms ease,
    transform 100ms ease;
}

& .alarm-button--primary {
  min-height: 42px;
  padding: 0 18px;
  border-color: #4be277;
  background: #22c55e;
  color: #003915;
  font-weight: 700;
}

& .alarm-button--secondary {
  background: #131b2e;
}

& .alarm-button:hover {
  border-color: #4be277;
}

& .alarm-button--primary:hover:not(:disabled) {
  background: #4be277;
}

& .alarm-button:active:not(:disabled) {
  transform: translateY(1px);
}

& .alarm-button:focus-visible {
  outline: 2px solid #4be277;
  outline-offset: 2px;
}

& .alarm-button:disabled {
  cursor: not-allowed;
  opacity: 0.52;
}

& .alarm-message {
  margin: 12px 16px 16px;
  padding: 10px 12px;
  border: 1px solid rgba(75, 226, 119, 0.3);
  border-radius: 4px;
  background: rgba(75, 226, 119, 0.1);
  color: #4be277;
  font-size: 13px;
  line-height: 20px;
}

& .alarm-message.is-error {
  border-color: rgba(255, 180, 171, 0.34);
  background: rgba(147, 0, 10, 0.16);
  color: #ffb4ab;
}

& .alarm-resolution-grid {
  display: grid;
  gap: 10px;
  padding: 16px;
}

& .alarm-resolution-item {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 10px;
  padding: 12px;
  border: 1px solid #2d3449;
  border-radius: 4px;
  background: #060e20;
}

& .alarm-resolution-item > svg {
  margin-top: 2px;
  color: #4be277;
}

& .alarm-resolution-item div {
  display: grid;
  gap: 3px;
}

& .alarm-resolution-item span {
  color: #869585;
  font-size: 12px;
  line-height: 16px;
}

& .alarm-resolution-item strong {
  color: #dae2fd;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  white-space: pre-wrap;
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

& .alarm-severity-chip--info,
& .alarm-status-pill--active {
  border-color: rgba(56, 189, 248, 0.32);
  background: rgba(56, 189, 248, 0.14);
  color: #8bd5ff;
}

& .alarm-status-pill--resolved {
  border-color: rgba(75, 226, 119, 0.3);
  background: rgba(75, 226, 119, 0.12);
  color: #4be277;
}

& .alarm-status-pill--pending {
  border-color: rgba(255, 185, 95, 0.34);
  background: rgba(255, 185, 95, 0.14);
  color: #ffb95f;
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

@media (max-width: 920px) {
  & {
    padding: 32px 20px 40px 68px;
  }

  & .alarm-detail-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  & .alarm-related-panel {
    grid-column: auto;
  }
}

@media (max-width: 640px) {
  & {
    min-height: calc(100dvh - 52px);
    padding: 32px 16px 32px 56px;
  }

  & .alarm-page-header,
  & .alarm-hero-header,
  & .alarm-panel-header {
    align-items: stretch;
    flex-direction: column;
    gap: 10px;
  }

  & .alarm-hero-meta-grid,
  & .alarm-form-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  & .alarm-textarea-field {
    grid-column: auto;
  }

  & .alarm-button-row {
    justify-content: stretch;
  }

  & .alarm-button-row .alarm-button {
    width: 100%;
  }
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
export const SecondaryButton = withClass('button', 'alarm-button alarm-button--secondary');
export const ResolutionGrid = withClass('div', 'alarm-resolution-grid');
export const ResolutionItem = withClass('div', 'alarm-resolution-item');
export const TableFrame = withClass('div', 'alarm-table-frame');
export const RelatedTable = withClass('table', 'alarm-table');
export const TimeCell = withClass('div', 'alarm-time-cell');
export const MonoText = withClass('span', 'alarm-mono');
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

export const StatusPill = styled.span.attrs(({ $status, className }) => ({
  className: cx('alarm-status-pill', $status && `alarm-status-pill--${$status}`, className),
}))``;

export const Message = styled.p.attrs(({ $error, className }) => ({
  className: cx('alarm-message', $error && 'is-error', className),
}))``;
