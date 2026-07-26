import styled, { css, keyframes } from 'styled-components';

const colors = {
  surface: '#0b1326',
  surfaceLowest: '#060e20',
  surfaceLow: '#131b2e',
  surfaceContainer: '#171f33',
  surfaceHigh: '#222a3d',
  text: '#dae2fd',
  muted: '#bccbb9',
  dim: '#869585',
  border: '#334155',
  primary: '#4be277',
  warning: '#ffb95f',
  alarm: '#ffb4ab',
  info: '#8bd5ff',
};

const toneColors = {
  success: colors.primary,
  warning: colors.warning,
  alarm: colors.alarm,
  info: colors.info,
  neutral: colors.muted,
};

const mono = css`
  font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
`;

const labelCaps = css`
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
`;

export const chartColors = colors;

export const Page = styled.main`
  min-height: 100vh;
  padding: 32px;
  background: ${colors.surface};
  color: ${colors.text};
  font-family: Inter, system-ui, sans-serif;

  *, *::before, *::after {
    box-sizing: border-box;
  }

  @media (max-width: 720px) {
    padding: 16px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

export const TitleGroup = styled.div`
  display: grid;
  gap: 4px;

  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    line-height: 36px;
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    color: ${colors.muted};
    font-size: 14px;
    line-height: 20px;
  }
`;

export const Eyebrow = styled.span`
  ${labelCaps};
  color: ${colors.primary};
`;

export const LiveStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 8px 12px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceLow};

  > div {
    display: grid;
    gap: 2px;
  }

  strong {
    ${labelCaps};
    color: ${colors.text};
  }

  span:last-child {
    ${mono};
    color: ${colors.muted};
    font-size: 11px;
    line-height: 16px;
  }
`;

export const LiveDot = styled.span`
  width: 9px;
  height: 9px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: ${colors.primary};
  box-shadow: 0 0 0 4px rgba(75, 226, 119, 0.12);
  animation: ${pulse} 1.8s ease-in-out infinite;
`;

export const KpiGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1320px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 440px) {
    grid-template-columns: 1fr;
  }
`;

export const KpiCard = styled.article`
  min-width: 0;
  min-height: 132px;
  padding: 16px;
  border: 1px solid ${({ $tone }) => `${toneColors[$tone] || colors.border}55`};
  border-radius: 4px;
  background: ${colors.surfaceContainer};
  animation: ${fadeIn} 0.35s ease both;
  animation-delay: ${({ $delay = 0 }) => `${$delay}ms`};
`;

export const KpiHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: ${colors.muted};

  span {
    ${labelCaps};
  }

  svg {
    width: 17px;
    height: 17px;
    flex: 0 0 auto;
    color: ${({ $tone }) => toneColors[$tone] || colors.primary};
  }
`;

export const KpiValue = styled.strong`
  ${mono};
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin-top: 18px;
  font-size: clamp(23px, 2vw, 28px);
  font-weight: 600;
  line-height: 32px;

  small {
    color: ${colors.muted};
    font-size: 12px;
    font-weight: 500;
  }
`;

export const KpiMeta = styled.p`
  margin: 8px 0 0;
  color: ${colors.dim};
  font-size: 12px;
  line-height: 16px;
`;

export const OverviewGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;
`;

export const Panel = styled.article`
  grid-column: span ${({ $span = 6 }) => $span};
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceContainer};
  animation: ${fadeIn} 0.4s ease both;

  @media (max-width: 1120px) {
    grid-column: span ${({ $tabletSpan = 6 }) => $tabletSpan};
  }

  @media (max-width: 760px) {
    grid-column: 1 / -1;
  }
`;

export const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 72px;
  padding: 16px;
  border-bottom: 1px solid ${colors.border};

  h2 {
    margin: 4px 0 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }
`;

export const PanelLabel = styled.span`
  ${labelCaps};
  color: ${colors.primary};
`;

export const PanelMeta = styled.span`
  ${mono};
  color: ${colors.muted};
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
`;

export const ProcessPager = styled.nav`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;

  > span {
    ${mono};
    min-width: 34px;
    color: ${colors.muted};
    font-size: 11px;
    line-height: 16px;
    text-align: center;
    white-space: nowrap;
  }
`;

export const ProcessPageButton = styled.button`
  display: grid;
  width: 30px;
  height: 30px;
  padding: 0;
  place-items: center;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceLow};
  color: ${colors.primary};
  cursor: pointer;
  transition:
    border-color 140ms ease,
    background-color 140ms ease,
    color 140ms ease;

  svg {
    width: 17px;
    height: 17px;
  }

  &:hover:not(:disabled) {
    border-color: ${colors.primary};
    background: ${colors.surfaceHigh};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    color: ${colors.dim};
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

export const ChartBody = styled.div`
  position: relative;
  width: 100%;
  height: ${({ $height = 300 }) => `${$height}px`};
  padding: 16px 12px 8px 4px;

  .recharts-cartesian-axis-tick-value {
    ${mono};
  }

  .recharts-legend-item-text {
    color: ${colors.muted} !important;
    font-size: 12px;
  }

  .recharts-wrapper,
  .recharts-wrapper *,
  .recharts-surface {
    outline: none;
  }

  @media (max-width: 520px) {
    height: 270px;
  }
`;

export const TooltipBox = styled.div`
  min-width: 150px;
  padding: 10px 12px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceLowest};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
`;

export const TooltipTitle = styled.strong`
  ${mono};
  display: block;
  margin-bottom: 7px;
  color: ${colors.text};
  font-size: 12px;
`;

export const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 4px;
  color: ${colors.muted};
  font-size: 12px;

  strong {
    ${mono};
    color: ${colors.text};
    font-size: 11px;
  }
`;

export const TooltipKey = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 2px;
    background: ${({ $color }) => $color || colors.primary};
  }
`;

export const ProcessList = styled.div`
  display: grid;
  min-height: 318px;
  grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: 0;

  @media (max-width: 520px) {
    min-height: 270px;
  }
`;

export const ProcessItem = styled.div`
  display: grid;
  gap: 8px;
  padding: 15px 16px;
  border-bottom: 1px solid ${colors.surfaceHigh};

  &:last-child {
    border-bottom: 0;
  }

  &:nth-child(even) {
    background: rgba(6, 14, 32, 0.32);
  }

  > small {
    ${mono};
    color: ${colors.dim};
    font-size: 10px;
    line-height: 14px;
  }
`;

export const ProcessHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;

  > div:first-child {
    min-width: 0;
  }

  strong {
    font-size: 13px;
    line-height: 18px;
  }

  small {
    display: block;
    margin-top: 2px;
    overflow: hidden;
    color: ${colors.dim};
    font-size: 11px;
    line-height: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const MetricPair = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex: 0 0 auto;

  strong,
  span {
    ${mono};
  }

  strong {
    color: ${colors.text};
    font-size: 13px;
  }

  span {
    color: ${({ $tone }) => toneColors[$tone] || colors.primary};
    font-size: 12px;
    font-weight: 700;
  }
`;

export const ProgressTrack = styled.div`
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: ${colors.surfaceLowest};
`;

export const ProgressFill = styled.div`
  width: ${({ $value }) => `${Math.max(0, Math.min(100, numberOrZero($value)))}%`};
  height: 100%;
  border-radius: inherit;
  background: ${({ $tone }) => toneColors[$tone] || colors.primary};
  transition: width 0.25s ease;
`;

export const TableWrap = styled.div`
  overflow-x: auto;
  scrollbar-color: ${colors.border} ${colors.surfaceLowest};

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: -2px;
  }
`;

export const Table = styled.table`
  width: 100%;
  min-width: 1040px;
  border-collapse: collapse;
  table-layout: fixed;

  caption {
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

  th,
  td {
    padding: 12px 14px;
    border-bottom: 1px solid ${colors.surfaceHigh};
    text-align: left;
    vertical-align: middle;
  }

  th {
    ${labelCaps};
    color: ${colors.muted};
  }

  td {
    color: ${colors.muted};
    font-size: 12px;
    line-height: 18px;
  }

  th:first-child { width: 150px; }
  th:nth-child(2) { width: 180px; }
  th:nth-child(3) { width: 190px; }
  th:nth-child(4) { width: 90px; }
  th:nth-child(5) { width: 105px; }
  th:nth-child(6) { width: 145px; }
  th:last-child { width: 130px; }

  tbody tr:nth-child(even) {
    background: rgba(6, 14, 32, 0.32);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  tbody tr:hover {
    background: rgba(75, 226, 119, 0.055);
  }

  td strong,
  td small {
    display: block;
  }

  td strong {
    overflow: hidden;
    color: ${colors.text};
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  td small {
    margin-top: 2px;
    color: ${colors.dim};
    font-size: 10px;
  }
`;

export const Mono = styled.span`
  ${mono};
  color: ${colors.text};
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
`;

export const StatusChip = styled.span`
  ${mono};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border: 1px solid ${({ $tone }) => `${toneColors[$tone] || colors.muted}66`};
  border-radius: 999px;
  background: ${({ $tone }) => `${toneColors[$tone] || colors.muted}14`};
  color: ${({ $tone }) => toneColors[$tone] || colors.muted};
  font-size: 10px;
  font-weight: 700;
  line-height: 14px;
  white-space: nowrap;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
`;

export const EmptyState = styled.div`
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 8px;
  min-height: 260px;
  padding: 32px;
  color: ${colors.muted};
  text-align: center;

  svg {
    width: 32px;
    height: 32px;
    color: ${colors.primary};
  }

  strong {
    color: ${colors.text};
    font-size: 15px;
  }

  span {
    max-width: 360px;
    font-size: 12px;
    line-height: 18px;
  }
`;

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

function numberOrZero(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
