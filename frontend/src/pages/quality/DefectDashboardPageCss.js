import styled, { css } from "styled-components";

const mono = css`
  font-family: "JetBrains Mono", Consolas, monospace;
  font-variant-numeric: tabular-nums;
`;

const toneColor = {
  danger: "var(--color-danger)",
  warn: "var(--color-warning)",
  warning: "var(--color-warning)",
  success: "var(--color-primary)",
  info: "#8bd5ff",
};

const toneBorder = {
  danger: "rgba(255, 180, 171, 0.38)",
  warn: "rgba(255, 185, 95, 0.36)",
  warning: "rgba(255, 185, 95, 0.36)",
  success: "rgba(75, 226, 119, 0.34)",
  info: "rgba(139, 213, 255, 0.32)",
};

const toneBackground = {
  danger: "rgba(147, 0, 10, 0.15)",
  warn: "rgba(238, 152, 0, 0.13)",
  warning: "rgba(238, 152, 0, 0.13)",
  success: "rgba(75, 226, 119, 0.11)",
  info: "rgba(139, 213, 255, 0.12)",
};

const getTone = (tones, tone, fallback) => tones[tone] || fallback;

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  min-height: calc(100dvh - 56px);
  padding: 40px 32px 48px 88px;
  overflow-x: clip;
  background: var(--color-bg);
  color: var(--color-text);

  button {
    font: inherit;
  }

  @media (max-width: 720px) {
    min-height: calc(100dvh - 52px);
    padding: 32px 16px 32px 56px;
  }
`;

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 720px) {
    align-items: stretch;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }
`;

export const TitleGroup = styled.div`
  max-width: 760px;

  h1 {
    margin: 4px 0 8px;
    font-size: clamp(26px, 3vw, 32px);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  p {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 14px;
    line-height: 22px;
  }
`;

export const Eyebrow = styled.span`
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 16px;
  text-transform: uppercase;
`;

export const HeaderActions = styled.div`
  display: flex;
  flex: 0 0 auto;
  gap: 8px;

  @media (max-width: 480px) {
    width: 100%;

    > * {
      flex: 1;
    }
  }
`;

export const Button = styled.button`
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid
    ${({ $primary }) =>
      $primary ? "var(--color-primary)" : "var(--color-border)"};
  border-radius: 4px;
  background: ${({ $primary }) =>
    $primary ? "var(--color-primary)" : "var(--color-surface-low)"};
  color: ${({ $primary }) =>
    $primary ? "var(--color-primary-ink)" : "var(--color-text)"};
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    color 140ms ease,
    transform 100ms ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover:not(:disabled) {
    border-color: var(--color-primary);
    background: ${({ $primary }) =>
      $primary ? "#6bff8f" : "var(--color-surface-high)"};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

export const MetricGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1040px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.article`
  --metric-tone: ${({ $tone }) =>
    getTone(toneColor, $tone, "var(--color-text)")};

  position: relative;
  min-width: 0;
  min-height: 142px;
  overflow: hidden;
  padding: 16px;
  border: 1px solid
    ${({ $tone }) =>
      getTone(toneBorder, $tone, "var(--color-border)")};
  border-radius: 4px;
  background: var(--color-surface);

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 2px;
    background: var(--metric-tone);
    content: "";
  }
`;

export const MetricHead = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 16px;

  svg {
    width: 16px;
    height: 16px;
    color: var(--metric-tone);
  }
`;

export const MetricValue = styled.strong`
  ${mono}
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 7px;
  margin-top: 16px;
  color: var(--metric-tone);
  font-size: clamp(26px, 3vw, 30px);
  font-weight: 600;
  line-height: 34px;

  small {
    color: var(--color-text-muted);
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
  }
`;

export const MetricFoot = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  color: var(--color-text-dim);
  font-size: 12px;
  line-height: 16px;

  svg {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
  }
`;

export const DashboardGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
  gap: 16px;
`;

export const Panel = styled.article`
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
`;

export const PanelHeader = styled.header`
  display: flex;
  min-height: 70px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);

  h2 {
    margin: 4px 0 0;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 24px;
  }

  @media (max-width: 480px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
`;

export const PanelLabel = styled.span`
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 16px;
  text-transform: uppercase;
`;

export const PanelMeta = styled.span`
  ${mono}
  flex: 0 0 auto;
  color: var(--color-text-muted);
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
`;

export const ProcessList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 32px;
  row-gap: 20px;
  padding: 20px 16px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 18px;
  }
`;

export const ProcessItem = styled.div`
  display: grid;
  gap: 9px;
`;

export const ProcessHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;

  > div {
    display: grid;
    min-width: 0;
    gap: 3px;
  }

  strong {
    overflow: hidden;
    color: var(--color-text);
    font-size: 13px;
    line-height: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: var(--color-text-dim);
    font-size: 11px;
    line-height: 16px;
  }
`;

export const ProcessCount = styled.span`
  ${mono}
  flex: 0 0 auto;
  color: var(--color-warning);
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
`;

export const ProgressTrack = styled.div`
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-surface-lowest);
`;

export const ProgressFill = styled.div`
  width: ${({ $value }) =>
    `${Math.min(100, Math.max(0, Number($value) || 0))}%`};
  height: 100%;
  border-radius: inherit;
  background: var(--color-warning);
  transition: width 220ms ease;
`;

export const TableWrap = styled.div`
  width: 100%;
  min-width: 0;
  overflow: hidden;

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }
`;

export const Table = styled.table`
  width: 100%;
  min-width: 0;
  border-collapse: collapse;
  table-layout: fixed;

  th,
  td {
    padding: 11px 12px;
    border-bottom: 1px solid var(--color-surface-high);
    overflow-wrap: anywhere;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background: var(--color-surface-low);
    color: var(--color-text-muted);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    line-height: 16px;
    white-space: nowrap;
  }

  td {
    color: var(--color-text);
    font-size: 13px;
    line-height: 19px;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 15%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 13%;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 15%;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 15%;
  }

  th:nth-child(5),
  td:nth-child(5) {
    width: 11%;
  }

  th:nth-child(6),
  td:nth-child(6) {
    width: 12%;
  }

  th:nth-child(7),
  td:nth-child(7) {
    width: 9%;
  }

  th:nth-child(8),
  td:nth-child(8) {
    width: 10%;
  }

  td strong {
    font-size: 13px;
    font-weight: 600;
  }

  tbody tr {
    cursor: pointer;
    transition: background-color 140ms ease;
  }

  tbody tr:nth-child(even) {
    background: rgba(6, 14, 32, 0.42);
  }

  tbody tr:hover {
    background: rgba(75, 226, 119, 0.06);
  }

  tbody tr:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
    background: rgba(75, 226, 119, 0.08);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  @media (max-width: 1080px) {
    display: block;
    min-width: 0;

    thead {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      border: 0;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
    }

    tbody {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      padding: 16px;
    }

    tbody tr,
    tbody tr:nth-child(even) {
      display: grid;
      min-width: 0;
      overflow: hidden;
      border: 1px solid var(--color-surface-high);
      border-radius: 4px;
      background: var(--color-surface-low);
    }

    td,
    td:nth-child(1),
    td:nth-child(2),
    td:nth-child(3),
    td:nth-child(4),
    td:nth-child(5),
    td:nth-child(6),
    td:nth-child(7),
    td:nth-child(8) {
      display: grid;
      width: auto;
      min-width: 0;
      grid-template-columns: 112px minmax(0, 1fr);
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-bottom: 1px solid var(--color-surface-high);
    }

    td::before {
      color: var(--color-text-dim);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.03em;
      line-height: 16px;
      content: attr(data-label);
    }

    tbody tr:last-child td {
      border-bottom: 1px solid var(--color-surface-high);
    }

    tbody tr td:last-child,
    tbody tr:last-child td:last-child {
      border-bottom: 0;
    }
  }

  @media (max-width: 720px) {
    tbody {
      grid-template-columns: 1fr;
      padding: 12px;
    }
  }

  @media (max-width: 400px) {
    tbody {
      padding: 10px;
    }

    td,
    td:nth-child(1),
    td:nth-child(2),
    td:nth-child(3),
    td:nth-child(4),
    td:nth-child(5),
    td:nth-child(6),
    td:nth-child(7),
    td:nth-child(8) {
      grid-template-columns: 96px minmax(0, 1fr);
      padding: 8px 10px;
    }
  }
`;

export const Mono = styled.span`
  ${mono}
  display: inline-block;
  color: var(--color-text);
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;

  @media (max-width: 1080px) {
    white-space: normal;
  }
`;

export const StatusChip = styled.span`
  ${mono}
  display: inline-flex;
  min-width: 68px;
  min-height: 24px;
  align-items: center;
  justify-content: center;
  justify-self: start;
  padding: 3px 8px;
  border: 1px solid
    ${({ $tone }) =>
      getTone(toneBorder, $tone, "var(--color-border)")};
  border-radius: 999px;
  background: ${({ $tone }) =>
    getTone(toneBackground, $tone, "var(--color-surface-high)")};
  color: ${({ $tone }) =>
    getTone(toneColor, $tone, "var(--color-text-muted)")};
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  white-space: nowrap;
`;

export const EmptyState = styled.div`
  display: grid;
  min-height: 244px;
  align-content: center;
  justify-items: center;
  gap: 8px;
  padding: 32px 20px;
  color: var(--color-text-muted);
  text-align: center;

  svg {
    width: 32px;
    height: 32px;
    margin-bottom: 2px;
    color: var(--color-primary);
  }

  strong {
    color: var(--color-text);
    font-size: 16px;
    line-height: 22px;
  }

  span {
    font-size: 13px;
    line-height: 20px;
  }
`;
