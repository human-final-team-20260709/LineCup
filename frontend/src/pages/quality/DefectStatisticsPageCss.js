import styled, { css } from "styled-components";

const c = {
  bg: "var(--color-bg)",
  lowest: "var(--color-surface-lowest)",
  low: "var(--color-surface-low)",
  card: "var(--color-surface)",
  high: "var(--color-surface-high)",
  border: "var(--color-border)",
  borderSoft: "var(--color-border-soft)",
  text: "var(--color-text)",
  muted: "var(--color-text-muted)",
  dim: "var(--color-text-dim)",
  green: "var(--color-primary)",
  greenInk: "var(--color-primary-ink)",
  amber: "var(--color-warning)",
  red: "var(--color-danger)",
};

const mono = css`
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Consolas,
    monospace;
  font-variant-numeric: tabular-nums;
`;

const boundedPercent = (value) =>
  Math.min(100, Math.max(0, Number(value) || 0));

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  min-height: calc(100dvh - 56px);
  padding: 40px 32px 48px 88px;
  overflow-x: clip;
  background: ${c.bg};
  color: ${c.text};
  font-family: Inter, Pretendard, "Noto Sans KR", sans-serif;

  button,
  select {
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
    margin-bottom: 18px;
  }
`;

export const TitleGroup = styled.div`
  min-width: 0;

  h1 {
    margin: 4px 0 8px;
    font-size: clamp(26px, 3vw, 32px);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  p {
    max-width: 680px;
    margin: 0;
    color: ${c.muted};
    font-size: 14px;
    line-height: 22px;
  }
`;

export const Eyebrow = styled.span`
  color: ${c.green};
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const ControlRow = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid ${c.border};
  border-radius: 4px;
  background: ${c.low};

  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const ControlHint = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${c.dim};
  font-size: 12px;
  line-height: 18px;

  svg {
    width: 15px;
    height: 15px;
    color: ${c.green};
  }
`;

export const FilterField = styled.label`
  display: flex;
  width: 180px;
  height: 40px;
  min-width: 0;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border: 1px solid ${c.border};
  border-radius: 4px;
  background: ${c.lowest};
  color: ${c.dim};

  svg {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
  }

  select {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: ${c.text};
    color-scheme: dark;
    font-size: 14px;
    cursor: pointer;
  }

  select option {
    background: ${c.low};
    color: ${c.text};
  }

  &:focus-within {
    border-color: ${c.green};
    box-shadow: 0 0 0 2px rgba(75, 226, 119, 0.12);
  }

  @media (max-width: 560px) {
    width: 100%;
  }
`;

export const Mono = styled.span`
  ${mono}
  color: ${c.muted};
  font-size: 11px;
  line-height: 16px;
`;

export const QueryRegion = styled.div`
  &:empty {
    display: none;
  }

  ${({ $standalone }) =>
    $standalone &&
    css`
      display: grid;
      align-items: center;
      min-height: 180px;
      margin-top: 16px;
      border: 1px solid ${c.border};
      border-radius: 4px;
      background: ${c.card};

      > p {
        width: 100%;
        margin: 0;
      }
    `}
`;

export const MetricGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1040px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.article`
  min-width: 0;
  min-height: 132px;
  padding: 16px;
  border: 1px solid ${c.border};
  border-radius: 4px;
  background: ${c.card};

  > span {
    display: block;
    margin-top: 6px;
    overflow: hidden;
    color: ${c.dim};
    font-size: 11px;
    line-height: 17px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const MetricLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${c.muted};
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  svg {
    flex: 0 0 auto;
    color: ${c.green};
  }
`;

export const MetricValue = styled.strong`
  ${mono}
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 16px;
  color: ${({ $warning, $success }) =>
    $warning ? c.amber : $success ? c.green : c.text};
  font-size: clamp(24px, 2.4vw, 30px);
  font-weight: 600;
  line-height: 34px;

  small {
    color: ${c.muted};
    font-size: 11px;
    font-weight: 600;
  }
`;

export const StatsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.article`
  grid-column: span ${({ $span }) => $span || 12};
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${c.border};
  border-radius: 4px;
  background: ${c.card};

  @media (max-width: 1040px) {
    grid-column: 1;
  }
`;

export const PanelHeader = styled.header`
  display: flex;
  min-height: 82px;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid ${c.border};
  background: linear-gradient(
    90deg,
    rgba(75, 226, 119, 0.035),
    transparent 42%
  );

  h2 {
    margin: 3px 0 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: -0.01em;
  }

  > ${Mono} {
    flex: 0 0 auto;
    margin-top: 3px;
  }

  @media (max-width: 520px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
`;

export const PanelLabel = styled.span`
  color: ${c.green};
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const PanelDescription = styled.p`
  margin: 4px 0 0;
  color: ${c.dim};
  font-size: 12px;
  line-height: 18px;
`;

export const PanelEmpty = styled.p`
  display: grid;
  min-height: 172px;
  place-items: center;
  margin: 0;
  color: ${c.muted};
  padding: 24px 16px;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
`;

export const DailyChart = styled.div`
  display: grid;
  grid-auto-columns: minmax(52px, 1fr);
  grid-auto-flow: column;
  grid-template-rows: 1fr;
  align-items: end;
  gap: 12px;
  min-height: 280px;
  margin: 0;
  padding: 24px 18px 18px;
  overflow-x: auto;
  list-style: none;
  overscroll-behavior-inline: contain;
  scrollbar-color: ${c.borderSoft} ${c.lowest};
`;

export const DailyColumn = styled.div`
  display: grid;
  grid-template-rows: 18px 180px 18px;
  justify-items: center;
  gap: 8px;
  min-width: 44px;

  time {
    ${mono}
    color: ${c.dim};
    font-size: 10px;
    line-height: 16px;
    white-space: nowrap;
  }
`;

export const BarValue = styled.span`
  ${mono}
  color: ${c.muted};
  font-size: 10px;
  line-height: 16px;
  white-space: nowrap;
`;

export const BarTrack = styled.div`
  display: flex;
  width: 28px;
  height: 180px;
  align-items: flex-end;
  overflow: hidden;
  border-radius: 3px 3px 0 0;
  background:
    linear-gradient(
      to top,
      transparent calc(50% - 1px),
      rgba(134, 149, 133, 0.16) 50%,
      transparent calc(50% + 1px)
    ),
    ${c.lowest};
`;

export const BarFill = styled.div`
  width: 100%;
  height: ${({ $value }) => `${boundedPercent($value)}%`};
  min-height: ${({ $value }) => (boundedPercent($value) > 0 ? "4px" : 0)};
  border-radius: 3px 3px 0 0;
  background: ${({ $warning }) => ($warning ? c.amber : c.green)};
`;

export const HorizontalList = styled.div`
  display: grid;
  gap: 18px;
  margin: 0;
  padding: 20px 16px;
  list-style: none;
`;

export const HorizontalItem = styled.div`
  display: grid;
  gap: 8px;
  min-width: 0;
`;

export const ItemHeader = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  strong {
    min-width: 0;
    overflow: hidden;
    font-size: 13px;
    line-height: 19px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ${Mono} {
    flex: 0 0 auto;
    color: ${c.text};
  }
`;

export const ItemDetail = styled.span`
  color: ${c.dim};
  font-size: 10px;
  line-height: 16px;
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: ${c.lowest};
`;

export const ProgressFill = styled.div`
  width: ${({ $value }) => `${boundedPercent($value)}%`};
  min-width: ${({ $value }) => (boundedPercent($value) > 0 ? "4px" : 0)};
  height: 100%;
  border-radius: inherit;
  background: ${({ $warning }) => ($warning ? c.amber : c.green)};
`;

export const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
  padding: 16px;
  list-style: none;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const TypeCard = styled.div`
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  min-height: 76px;
  padding: 10px;
  border: 1px solid ${c.high};
  border-radius: 4px;
  background: ${c.low};
`;

export const TypeIcon = styled.span`
  ${mono}
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid rgba(75, 226, 119, 0.28);
  border-radius: 4px;
  background: rgba(75, 226, 119, 0.07);
  color: ${c.green};
  font-size: 11px;
`;

export const TypeCopy = styled.div`
  display: grid;
  min-width: 0;
  gap: 4px;

  strong {
    overflow: hidden;
    font-size: 12px;
    line-height: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: ${c.dim};
    font-size: 10px;
    line-height: 16px;
  }
`;

export const TypeCount = styled.div`
  display: flex;
  align-items: baseline;
  gap: 3px;

  strong {
    ${mono}
    color: ${c.text};
    font-size: 18px;
    line-height: 24px;
  }

  span {
    color: ${c.muted};
    font-size: 10px;
  }
`;

export const TableWrap = styled.div`
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-color: ${c.borderSoft} ${c.lowest};
`;

export const Table = styled.table`
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;

  th,
  td {
    padding: 11px 16px;
    border-bottom: 1px solid ${c.high};
    text-align: left;
    vertical-align: middle;
  }

  th {
    background: ${c.low};
    color: ${c.muted};
    font-size: 11px;
    font-weight: 700;
    line-height: 17px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  td {
    font-size: 13px;
    line-height: 20px;
  }

  tbody tr:nth-child(even) {
    background: rgba(6, 14, 32, 0.42);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

export const TableCaption = styled.caption`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
`;

export const Rank = styled.span`
  ${mono}
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 1px solid ${c.border};
  border-radius: 4px;
  background: ${c.low};
  color: ${c.green};
  font-weight: 700;
`;

export const Trend = styled.span`
  ${mono}
  color: ${({ $trend }) =>
    $trend === "up"
      ? c.red
      : $trend === "new"
        ? c.amber
        : $trend === "flat"
          ? c.muted
          : c.green};
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
`;

export const EmptyState = styled.section`
  display: grid;
  min-height: 360px;
  align-content: center;
  justify-items: center;
  gap: 8px;
  border: 1px solid ${c.border};
  border-radius: 4px;
  background: ${c.card};
  color: ${c.muted};
  padding: 32px 20px;
  text-align: center;

  svg {
    width: 38px;
    height: 38px;
    margin-bottom: 4px;
    color: ${c.green};
  }

  strong {
    color: ${c.text};
    font-size: 18px;
    line-height: 24px;
  }

  span {
    max-width: 480px;
    font-size: 13px;
    line-height: 20px;
  }
`;
