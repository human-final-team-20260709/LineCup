import styled from "styled-components";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function withClass(Tag, baseClass) {
  return styled(Tag).attrs(({ className }) => ({
    className: cx(baseClass, className),
  }))``;
}

export const PageShell = styled.main.attrs({
  className: "current-alarm-page",
})`
  & {
    width: 100%;
    min-width: 0;
    min-height: calc(100dvh - 56px);
    padding: 40px 32px 48px 88px;
    overflow-x: clip;
    background: var(--color-bg);
    color: var(--color-text);
  }

  & button,
  & input,
  & select {
    font: inherit;
  }

  & button {
    border: 0;
  }

  & .alarm-visually-hidden,
  & .alarm-table caption {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  & .alarm-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 32px;
    margin-bottom: 24px;
  }

  & .alarm-title-block {
    max-width: 760px;
  }

  & .alarm-title-block h1 {
    margin: 5px 0 8px;
    font-size: clamp(27px, 3vw, 32px);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  & .alarm-title-block p {
    max-width: 680px;
    margin: 0;
    color: var(--color-text-muted);
    font-size: 14px;
    line-height: 22px;
  }

  & .alarm-eyebrow,
  & .alarm-panel-label {
    color: var(--color-primary);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    line-height: 16px;
    text-transform: uppercase;
  }

  & .alarm-state-switch__button:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  & .alarm-metric-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }

  & .alarm-current-metric-card {
    position: relative;
    min-width: 0;
    min-height: 126px;
    padding: 18px;
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-surface);
  }

  & .alarm-current-metric-card::before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 3px;
    background: var(--metric-color, var(--color-border-soft));
    content: "";
  }

  & .alarm-current-metric-card::after {
    position: absolute;
    top: 18px;
    right: 18px;
    width: 38px;
    height: 38px;
    border: 1px solid color-mix(
      in srgb,
      var(--metric-color, var(--color-border-soft)) 38%,
      transparent
    );
    border-radius: 999px;
    background: color-mix(
      in srgb,
      var(--metric-color, var(--color-border-soft)) 9%,
      transparent
    );
    content: "";
  }

  & .alarm-current-metric-card--active {
    --metric-color: var(--color-primary);
  }

  & .alarm-current-metric-card--critical {
    --metric-color: var(--color-danger);
  }

  & .alarm-current-metric-card--warning {
    --metric-color: var(--color-warning);
  }

  & .alarm-current-metric-card--info {
    --metric-color: #8bd5ff;
  }

  & .alarm-current-metric-card strong {
    display: block;
    margin-top: 14px;
    color: var(--metric-color);
    font-family: "JetBrains Mono", Consolas, monospace;
    font-size: clamp(25px, 3vw, 30px);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 34px;
  }

  & .alarm-current-metric-card small {
    display: block;
    margin-top: 3px;
    overflow: hidden;
    color: var(--color-text-muted);
    font-size: 12px;
    line-height: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .alarm-metric-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-right: 42px;
    color: var(--color-text-muted);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    line-height: 16px;
    text-transform: uppercase;
  }

  & .alarm-metric-header svg {
    position: absolute;
    top: 28px;
    right: 28px;
    z-index: 1;
    width: 18px;
    height: 18px;
    color: var(--metric-color);
  }

  & .alarm-toolbar {
    display: grid;
    grid-template-columns: minmax(280px, 1fr) minmax(165px, 190px) minmax(
        175px,
        200px
      );
    gap: 8px;
    margin-bottom: 16px;
  }

  & .alarm-field {
    display: flex;
    min-width: 0;
    min-height: 42px;
    align-items: center;
    gap: 9px;
    padding: 0 11px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-surface-lowest);
    color: var(--color-text-dim);
    transition:
      border-color 140ms ease,
      background-color 140ms ease;
  }

  & .alarm-field > svg {
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
  }

  & .alarm-field input,
  & .alarm-field select {
    width: 100%;
    min-width: 0;
    min-height: 40px;
    padding: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--color-text);
    font-size: 14px;
  }

  & .alarm-field input::placeholder {
    color: var(--color-text-dim);
  }

  & .alarm-field select {
    color-scheme: dark;
    cursor: pointer;
  }

  & .alarm-field select option {
    background: var(--color-surface-low);
    color: var(--color-text);
  }

  & .alarm-field:hover {
    border-color: var(--color-border-soft);
  }

  & .alarm-field:focus-within {
    border-color: var(--color-primary);
    background: var(--color-surface-low);
  }

  & .alarm-main-grid {
    display: grid;
    gap: 16px;
  }

  & .alarm-panel {
    min-width: 0;
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-surface);
  }

  & .alarm-panel-header {
    display: flex;
    min-height: 76px;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--color-border);
    background: linear-gradient(
      90deg,
      var(--color-surface-low) 0%,
      var(--color-surface) 55%
    );
  }

  & .alarm-panel-heading h2 {
    margin: 3px 0 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }

  & .alarm-panel-controls {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
  }

  & .alarm-state-switch {
    display: inline-flex;
    flex: 0 0 auto;
    padding: 3px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-surface-lowest);
  }

  & .alarm-state-switch__button {
    min-width: 76px;
    min-height: 30px;
    padding: 0 10px;
    border-radius: 3px;
    background: transparent;
    color: var(--color-text-muted);
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition:
      background-color 140ms ease,
      color 140ms ease;
  }

  & .alarm-state-switch__button:hover {
    color: var(--color-text);
  }

  & .alarm-state-switch__button.is-active {
    background: var(--color-primary);
    color: var(--color-primary-ink);
  }

  & .alarm-panel-meta,
  & .alarm-mono {
    font-family: "JetBrains Mono", Consolas, monospace;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    line-height: 16px;
  }

  & .alarm-panel-meta {
    color: var(--color-text-muted);
    white-space: nowrap;
  }

  & .alarm-panel-meta strong {
    color: var(--color-text);
  }

  & .alarm-table-frame {
    min-height: 420px;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scrollbar-color: var(--color-border-soft) var(--color-surface-lowest);
  }

  & .alarm-table-frame > p {
    margin: 16px;
  }

  & .alarm-table {
    width: 100%;
    min-width: 920px;
    border-collapse: collapse;
    table-layout: fixed;
  }

  & .alarm-table th:nth-child(1),
  & .alarm-table td:nth-child(1) {
    width: 142px;
  }

  & .alarm-table th:nth-child(2),
  & .alarm-table td:nth-child(2) {
    width: 218px;
  }

  & .alarm-table th:nth-child(3),
  & .alarm-table td:nth-child(3) {
    width: auto;
  }

  & .alarm-table th:nth-child(4),
  & .alarm-table td:nth-child(4) {
    width: 88px;
  }

  & .alarm-table th:nth-child(5),
  & .alarm-table td:nth-child(5) {
    width: 148px;
  }

  & .alarm-table th:nth-child(6),
  & .alarm-table td:nth-child(6) {
    width: 118px;
  }

  & .alarm-table th,
  & .alarm-table td {
    padding: 11px 14px;
    border-bottom: 1px solid var(--color-surface-high);
    text-align: left;
    vertical-align: middle;
  }

  & .alarm-table th {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--color-surface-low);
    color: var(--color-text-muted);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    line-height: 16px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  & .alarm-table td {
    color: var(--color-text);
    font-size: 14px;
    line-height: 20px;
    overflow-wrap: anywhere;
  }

  & .alarm-table tbody tr {
    transition: background-color 140ms ease;
  }

  & .alarm-table tbody tr:nth-child(even) {
    background: rgba(6, 14, 32, 0.3);
  }

  & .alarm-table tbody tr:hover {
    background: rgba(75, 226, 119, 0.055);
  }

  & .alarm-table tbody tr:last-child td {
    border-bottom: 0;
  }

  & .alarm-clickable-row {
    cursor: pointer;
  }

  & .alarm-clickable-row:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
    background: rgba(75, 226, 119, 0.08);
  }

  & .alarm-equipment-cell,
  & .alarm-time-stack,
  & .alarm-message-cell {
    display: grid;
    min-width: 0;
    gap: 2px;
  }

  & .alarm-equipment-cell strong,
  & .alarm-message-cell strong,
  & .alarm-time-stack strong {
    overflow: hidden;
    color: var(--color-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .alarm-equipment-cell > span,
  & .alarm-time-stack span {
    color: var(--color-text-dim);
    font-family: "JetBrains Mono", Consolas, monospace;
    font-size: 11px;
    line-height: 16px;
  }

  & .alarm-equipment-cell small {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 4px;
    overflow: hidden;
    color: var(--color-text-muted);
    font-size: 11px;
    line-height: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .alarm-equipment-cell small svg {
    width: 11px;
    height: 11px;
    flex: 0 0 11px;
    color: var(--color-text-dim);
  }

  & .alarm-message-cell strong {
    white-space: normal;
  }

  & .alarm-severity-chip,
  & .alarm-status-pill {
    display: inline-flex;
    min-height: 24px;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border);
    border-radius: 999px;
    white-space: nowrap;
  }

  & .alarm-severity-chip {
    min-width: 54px;
    padding: 2px 8px;
    background: var(--color-surface-high);
    color: var(--color-text);
    font-family: "JetBrains Mono", Consolas, monospace;
    font-size: 12px;
    font-weight: 700;
    line-height: 16px;
  }

  & .alarm-severity-chip--info {
    border-color: rgba(139, 213, 255, 0.34);
    background: rgba(139, 213, 255, 0.1);
    color: #8bd5ff;
  }

  & .alarm-severity-chip--warning {
    border-color: rgba(255, 185, 95, 0.4);
    background: rgba(238, 152, 0, 0.13);
    color: var(--color-warning);
  }

  & .alarm-severity-chip--critical {
    border-color: rgba(255, 180, 171, 0.44);
    background: rgba(147, 0, 10, 0.2);
    color: var(--color-danger);
  }

  & .alarm-status-pill {
    gap: 6px;
    padding: 2px 9px;
    background: var(--color-surface-low);
    color: var(--color-text-muted);
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  }

  & .alarm-status-pill::before {
    width: 6px;
    height: 6px;
    flex: 0 0 6px;
    border-radius: 999px;
    background: currentColor;
    content: "";
  }

  & .alarm-status-pill--pending {
    border-color: rgba(255, 185, 95, 0.36);
    color: var(--color-warning);
  }

  & .alarm-status-pill--progress {
    border-color: rgba(139, 213, 255, 0.32);
    color: #8bd5ff;
  }

  & .alarm-status-pill--reserved {
    border-color: rgba(189, 168, 255, 0.32);
    color: #c4b5fd;
  }

  & .alarm-status-pill--monitoring {
    border-color: rgba(75, 226, 119, 0.34);
    color: var(--color-primary);
  }

  & .alarm-empty-state {
    display: grid;
    min-height: 330px;
    align-content: center;
    justify-items: center;
    gap: 8px;
    padding: 44px 24px;
    color: var(--color-text-muted);
    text-align: center;
  }

  & .alarm-empty-state > svg {
    width: 36px;
    height: 36px;
    margin-bottom: 4px;
    color: var(--color-primary);
  }

  & .alarm-empty-state strong {
    color: var(--color-text);
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }

  & .alarm-empty-state span {
    max-width: 430px;
    font-size: 14px;
    line-height: 21px;
  }

  @media (max-width: 1100px) {
    & .alarm-metric-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    & .alarm-toolbar {
      grid-template-columns: minmax(240px, 1fr) repeat(
          2,
          minmax(150px, 190px)
        );
    }

  }

  @media (max-width: 820px) {
    & .alarm-page-header {
      align-items: stretch;
      flex-direction: column;
      gap: 16px;
    }

    & .alarm-toolbar {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    & .alarm-search-box {
      grid-column: 1 / -1;
    }

    & .alarm-panel-header {
      align-items: flex-start;
      flex-direction: column;
      gap: 12px;
    }

    & .alarm-panel-controls {
      width: 100%;
      justify-content: space-between;
    }
  }

  @media (max-width: 720px) {
    & {
      min-height: calc(100dvh - 52px);
      padding: 30px 16px 36px 56px;
    }
  }

  @media (max-width: 560px) {
    & {
      padding: 24px 12px 32px 52px;
    }

    & .alarm-page-header {
      margin-bottom: 18px;
    }

    & .alarm-title-block h1 {
      font-size: 26px;
    }

    & .alarm-metric-grid {
      gap: 8px;
    }

    & .alarm-current-metric-card {
      min-height: 118px;
      padding: 15px;
    }

    & .alarm-current-metric-card::after {
      top: 14px;
      right: 14px;
      width: 34px;
      height: 34px;
    }

    & .alarm-metric-header {
      padding-right: 34px;
      font-size: 10px;
    }

    & .alarm-metric-header svg {
      top: 22px;
      right: 22px;
      width: 16px;
      height: 16px;
    }

    & .alarm-current-metric-card strong {
      margin-top: 12px;
      font-size: 25px;
      line-height: 30px;
    }

    & .alarm-current-metric-card small {
      font-size: 11px;
    }

    & .alarm-toolbar {
      grid-template-columns: minmax(0, 1fr);
    }

    & .alarm-search-box {
      grid-column: auto;
    }

    & .alarm-panel-header {
      min-height: auto;
      padding: 13px 12px;
    }

    & .alarm-panel-controls {
      align-items: stretch;
      flex-direction: column;
    }

    & .alarm-state-switch {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    & .alarm-panel-meta {
      white-space: normal;
    }

    & .alarm-table-frame {
      min-height: 360px;
      overflow-x: hidden;
    }

    & .alarm-table {
      min-width: 0;
    }

    & .alarm-table,
    & .alarm-table tbody,
    & .alarm-table tr,
    & .alarm-table td {
      display: block;
      width: 100%;
    }

    & .alarm-table thead {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
    }

    & .alarm-table tbody {
      display: grid;
      gap: 10px;
      padding: 12px;
    }

    & .alarm-table tbody tr {
      position: relative;
      padding: 10px 12px;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      background: var(--color-surface-low);
    }

    & .alarm-table tbody tr:nth-child(even) {
      background: var(--color-surface-low);
    }

    & .alarm-table th:nth-child(n),
    & .alarm-table td:nth-child(n) {
      width: 100%;
    }

    & .alarm-table td {
      display: grid;
      grid-template-columns: 82px minmax(0, 1fr);
      gap: 9px;
      align-items: start;
      padding: 6px 0;
      border: 0;
    }

    & .alarm-table td::before {
      color: var(--color-text-dim);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.07em;
      line-height: 20px;
      text-transform: uppercase;
      content: attr(data-label);
    }

    & .alarm-message-cell strong,
    & .alarm-equipment-cell strong {
      white-space: normal;
    }

    & .alarm-empty-state {
      min-height: 300px;
      padding: 36px 18px;
    }
  }

  @media (max-width: 390px) {
    & .alarm-metric-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    & .alarm-current-metric-card {
      min-height: 112px;
    }
  }

`;

export const PageHeader = withClass("section", "alarm-page-header");
export const TitleBlock = withClass("div", "alarm-title-block");
export const Eyebrow = withClass("span", "alarm-eyebrow");
export const MetricGrid = withClass("section", "alarm-metric-grid");
export const MetricHeader = withClass("div", "alarm-metric-header");
export const Toolbar = withClass("section", "alarm-toolbar");
export const SearchBox = withClass(
  "label",
  "alarm-field alarm-search-box",
);
export const SelectGroup = withClass(
  "label",
  "alarm-field alarm-select-group",
);
export const MainGrid = withClass("section", "alarm-main-grid");
export const Panel = withClass("article", "alarm-panel");
export const PanelHeader = withClass("div", "alarm-panel-header");
export const PanelHeading = withClass("div", "alarm-panel-heading");
export const PanelControls = withClass("div", "alarm-panel-controls");
export const PanelLabel = withClass("span", "alarm-panel-label");
export const PanelMeta = withClass("span", "alarm-panel-meta");
export const StateSwitch = withClass("div", "alarm-state-switch");
export const TableFrame = withClass("div", "alarm-table-frame");
export const AlarmTable = withClass("table", "alarm-table");
export const EquipmentCell = withClass("div", "alarm-equipment-cell");
export const MessageCell = withClass("div", "alarm-message-cell");
export const TimeStack = withClass("div", "alarm-time-stack");
export const MonoText = withClass("span", "alarm-mono");
export const EmptyState = withClass("div", "alarm-empty-state");


export const SwitchButton = styled.button.attrs(
  ({ $active, className }) => ({
    className: cx(
      "alarm-state-switch__button",
      $active && "is-active",
      className,
    ),
  }),
)``;

export const MetricCard = styled.article.attrs(
  ({ $tone, className }) => ({
    className: cx(
      "alarm-current-metric-card",
      $tone && `alarm-current-metric-card--${$tone}`,
      className,
    ),
  }),
)``;

export const SeverityChip = styled.span.attrs(
  ({ $severity, className }) => ({
    className: cx(
      "alarm-severity-chip",
      $severity && `alarm-severity-chip--${$severity}`,
      className,
    ),
  }),
)``;

export const StatusPill = styled.span.attrs(({ $tone, className }) => ({
  className: cx(
    "alarm-status-pill",
    $tone && `alarm-status-pill--${$tone}`,
    className,
  ),
}))``;
