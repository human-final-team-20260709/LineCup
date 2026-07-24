import styled, { css, keyframes } from "styled-components";

const clampPercentage = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 0;
  }
  return Math.min(100, Math.max(0, number));
};

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const PageShell = styled.main`
  width: 100%;
  min-width: 0;
  min-height: calc(100dvh - 56px);
  padding: 40px 32px 48px 88px;
  overflow-x: clip;
  background: #0b1326;
  color: #dae2fd;

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
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 20px;
  }
`;

export const TitleBlock = styled.div`
  max-width: 760px;

  h1 {
    margin: 4px 0 8px;
    font-size: clamp(26px, 3vw, 32px);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    color: #bccbb9;
    font-size: 14px;
    line-height: 22px;
  }
`;

export const Eyebrow = styled.span`
  color: #4be277;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 16px;
`;

export const RefreshState = styled.div`
  display: inline-flex;
  min-height: 36px;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(75, 226, 119, 0.46)" : "#334155"};
  border-radius: 4px;
  background: #131b2e;
  color: ${({ $active }) => ($active ? "#4be277" : "#bccbb9")};
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 11px;
  line-height: 16px;

  svg {
    width: 14px;
    height: 14px;
    color: #4be277;
    ${({ $active }) =>
      $active &&
      css`
        animation: ${spin} 0.9s linear infinite;
      `}
  }

  @media (max-width: 720px) {
    align-self: flex-start;
  }

  @media (prefers-reduced-motion: reduce) {
    svg {
      animation: none;
    }
  }
`;

export const ControlRow = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #131b2e;

  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const ControlHint = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #869585;
  font-size: 12px;
  line-height: 18px;

  svg {
    width: 15px;
    height: 15px;
    color: #4be277;
  }
`;

export const FilterField = styled.label`
  display: flex;
  width: 180px;
  height: 40px;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #869585;

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
    color: #dae2fd;
    color-scheme: dark;
    font-size: 14px;
    cursor: pointer;
  }

  select option {
    background: #131b2e;
    color: #dae2fd;
  }

  &:focus-within {
    border-color: #4be277;
    box-shadow: 0 0 0 2px rgba(75, 226, 119, 0.12);
  }

  @media (max-width: 560px) {
    width: 100%;
  }
`;

export const MetricGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 20px 0 16px;

  @media (max-width: 820px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.article`
  min-width: 0;
  padding: 16px;
  border: 1px solid
    ${({ $tone }) =>
      $tone === "critical" ? "rgba(255, 138, 131, 0.42)" : "#334155"};
  border-radius: 4px;
  background: ${({ $tone }) =>
    $tone === "critical"
      ? "linear-gradient(135deg, rgba(255, 138, 131, 0.09), #171f33 65%)"
      : "#171f33"};

  > strong {
    display: block;
    margin-top: 14px;
    color: ${({ $tone }) =>
      $tone === "critical" ? "#ffb4ab" : "#4be277"};
    font-family: "JetBrains Mono", Consolas, monospace;
    font-size: clamp(26px, 3vw, 30px);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 34px;
  }

  > span {
    display: block;
    margin-top: 4px;
    color: #bccbb9;
    font-size: 13px;
    line-height: 18px;
  }

  @media (min-width: 561px) and (max-width: 820px) {
    &:last-child {
      grid-column: 1 / -1;
    }
  }
`;

export const MetricLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #bccbb9;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 16px;

  svg {
    width: 16px;
    height: 16px;
    color: #4be277;
  }
`;

export const DashboardGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
  }
`;

export const InsightsGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(300px, 0.8fr) minmax(0, 1.2fr);
  gap: 16px;

  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.article`
  min-width: 0;
  overflow: hidden;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
`;

export const PanelHeader = styled.header`
  display: flex;
  min-height: 70px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-bottom: 1px solid #334155;

  h2 {
    margin: 4px 0 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }

  @media (max-width: 480px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
`;

export const PanelLabel = styled.span`
  color: #4be277;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 16px;
`;

export const PanelMeta = styled.span`
  flex: 0 0 auto;
  color: #bccbb9;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  line-height: 16px;
`;

export const BarChart = styled.div`
  display: grid;
  width: 100%;
  min-width: 0;
  height: 310px;
  grid-template-columns: repeat(
    ${({ $count }) => Math.max(1, Number($count) || 1)},
    minmax(
      ${({ $count }) => (Math.max(0, Number($count) || 0) > 14 ? "42px" : "28px")},
      1fr
    )
  );
  align-items: end;
  gap: 10px;
  padding: 20px 16px 16px;
  overflow-x: auto;

  @media (max-width: 560px) {
    grid-template-columns: repeat(
      ${({ $count }) => Math.max(1, Number($count) || 1)},
      minmax(40px, 1fr)
    );
    height: 280px;
    gap: 8px;
  }
`;

export const BarColumn = styled.div`
  display: grid;
  height: 100%;
  grid-template-rows: auto 1fr auto;
  gap: 7px;
  text-align: center;

  > span {
    color: #869585;
    font-family: "JetBrains Mono", Consolas, monospace;
    font-size: 11px;
    line-height: 16px;
    white-space: nowrap;
  }
`;

export const BarTrack = styled.div`
  display: flex;
  min-height: 190px;
  align-items: end;
  overflow: hidden;
  border: 1px solid #2d3449;
  border-radius: 4px;
  background: #060e20;
`;

export const BarFill = styled.div`
  width: 100%;
  height: ${({ $value }) => {
    const value = clampPercentage($value);
    return value > 0 ? `max(4px, ${value}%)` : "0";
  }};
  background: linear-gradient(180deg, #6bff8f 0%, #22c55e 100%);
  transition: height 220ms ease;
`;

export const RatioWrap = styled.div`
  display: grid;
  justify-items: center;
  gap: 18px;
  padding: 22px 16px 20px;
`;

export const DonutChart = styled.div`
  display: flex;
  width: 176px;
  height: 176px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border-radius: 999px;
  background: ${({ $critical, $warning, $total }) => {
    if (Number($total) <= 0) {
      return "radial-gradient(circle at center, #171f33 0 58%, transparent 59%), conic-gradient(#2d3449 0 100%)";
    }

    const criticalEnd = clampPercentage($critical);
    const warningEnd = clampPercentage(
      criticalEnd + clampPercentage($warning),
    );
    return `radial-gradient(circle at center, #171f33 0 58%, transparent 59%),
      conic-gradient(
        #ff8a83 0 ${criticalEnd}%,
        #ffb95f ${criticalEnd}% ${warningEnd}%,
        #38bdf8 ${warningEnd}% 100%
      )`;
  }};

  strong {
    color: #ffb4ab;
    font-family: "JetBrains Mono", Consolas, monospace;
    font-size: 26px;
    font-weight: 600;
    line-height: 32px;
  }

  span {
    color: #bccbb9;
    font-size: 12px;
    line-height: 16px;
  }
`;

export const LegendList = styled.div`
  display: grid;
  width: 100%;
  gap: 8px;
`;

export const LegendItem = styled.div`
  display: grid;
  min-height: 34px;
  grid-template-columns: 10px 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border: 1px solid #2d3449;
  border-radius: 4px;
  background: #060e20;

  > span:first-child {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: ${({ $severity }) =>
      $severity === "critical"
        ? "#ffb4ab"
        : $severity === "warning"
          ? "#ffb95f"
          : "#8bd5ff"};
  }

  strong {
    color: #dae2fd;
    font-size: 13px;
    line-height: 18px;
  }

  @media (max-width: 380px) {
    grid-template-columns: 10px 1fr;

    > span:last-child {
      grid-column: 2;
    }
  }
`;

export const HorizontalList = styled.div`
  display: grid;
  gap: 16px;
  padding: 18px 16px 20px;
`;

export const HorizontalItem = styled.div`
  display: grid;
  gap: 9px;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  > div > span:first-child {
    display: grid;
    min-width: 0;
    grid-template-columns: 18px minmax(0, 1fr) auto;
    align-items: center;
    gap: 7px;
  }

  svg {
    color: #4be277;
  }

  strong {
    overflow: hidden;
    color: #dae2fd;
    font-size: 13px;
    line-height: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    color: #869585;
    font-family: "JetBrains Mono", Consolas, monospace;
    font-size: 10px;
    line-height: 14px;
  }

  @media (max-width: 420px) {
    > div > span:first-child {
      grid-template-columns: 18px minmax(0, 1fr);
    }

    small {
      display: none;
    }
  }
`;

export const ProgressTrack = styled.div`
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: #060e20;
`;

export const ProgressFill = styled.div`
  width: ${({ $value }) => `${clampPercentage($value)}%`};
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22c55e, #6bff8f);
  transition: width 220ms ease;
`;

export const TableFrame = styled.div`
  width: 100%;
  min-width: 0;
  overflow: hidden;
`;

export const RankTable = styled.table`
  width: 100%;
  min-width: 0;
  border-collapse: collapse;
  table-layout: fixed;

  th:nth-child(1),
  td:nth-child(1) {
    width: 64px;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 26%;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 88px;
  }

  th:nth-child(5),
  td:nth-child(5) {
    width: 68px;
  }

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid #2d3449;
    text-align: left;
    vertical-align: middle;
    overflow-wrap: anywhere;
  }

  th {
    background: #131b2e;
    color: #bccbb9;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    line-height: 16px;
  }

  td {
    color: #dae2fd;
    font-size: 13px;
    line-height: 20px;
  }

  td:nth-child(2) {
    max-width: 360px;
  }

  td:nth-child(3) > div {
    min-width: 0;
  }

  td:nth-child(3) strong,
  td:nth-child(3) span {
    display: block;
  }

  td:nth-child(3) span {
    margin-top: 2px;
    color: #869585;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  tbody tr:nth-child(even) {
    background: rgba(6, 14, 32, 0.46);
  }

  tbody tr:hover {
    background: rgba(75, 226, 119, 0.05);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  @media (max-width: 720px) {
    display: block;

    thead {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    tbody {
      display: grid;
      gap: 10px;
      padding: 12px;
    }

    tbody tr,
    tbody tr:nth-child(even) {
      display: grid;
      min-width: 0;
      overflow: hidden;
      border: 1px solid #2d3449;
      border-radius: 4px;
      background: #131b2e;
    }

    td,
    td:nth-child(1),
    td:nth-child(2),
    td:nth-child(3),
    td:nth-child(4),
    td:nth-child(5) {
      display: grid;
      width: auto;
      max-width: none;
      min-width: 0;
      grid-template-columns: 76px minmax(0, 1fr);
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-bottom: 1px solid #2d3449;
    }

    td::before {
      content: attr(data-label);
      color: #869585;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.04em;
      line-height: 16px;
    }

    tbody tr:last-child td {
      border-bottom: 1px solid #2d3449;
    }

    tbody tr td:last-child,
    tbody tr:last-child td:last-child {
      border-bottom: 0;
    }
  }

  @media (max-width: 380px) {
    tbody {
      padding: 10px;
    }

    td,
    td:nth-child(1),
    td:nth-child(2),
    td:nth-child(3),
    td:nth-child(4),
    td:nth-child(5) {
      grid-template-columns: 68px minmax(0, 1fr);
      padding: 8px 10px;
    }
  }
`;

export const RankBadge = styled.span`
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #4be277;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
`;

export const MonoText = styled.span`
  color: #dae2fd;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  line-height: 16px;
  white-space: nowrap;
`;

export const SeverityChip = styled.span`
  display: inline-flex;
  min-width: 54px;
  min-height: 24px;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid
    ${({ $severity }) =>
      $severity === "critical"
        ? "rgba(255, 138, 131, 0.42)"
        : $severity === "warning"
          ? "rgba(255, 185, 95, 0.34)"
          : "rgba(56, 189, 248, 0.32)"};
  border-radius: 999px;
  background: ${({ $severity }) =>
    $severity === "critical"
      ? "rgba(255, 138, 131, 0.16)"
      : $severity === "warning"
        ? "rgba(255, 185, 95, 0.14)"
        : "rgba(56, 189, 248, 0.14)"};
  color: ${({ $severity }) =>
    $severity === "critical"
      ? "#ffb4ab"
      : $severity === "warning"
        ? "#ffb95f"
        : "#8bd5ff"};
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
`;

export const EmptyPanel = styled.div`
  display: grid;
  min-height: 180px;
  place-items: center;
  padding: 32px 20px;
  color: #bccbb9;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
`;
