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
  border: '#3d4a3d',
  primary: '#4be277',
  primaryInk: '#003915',
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
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
    color: ${({ $tone }) => toneColors[$tone] || colors.primary};
  }
`;

export const KpiValue = styled.strong`
  ${mono};
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin-top: 18px;
  font-size: 28px;
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

export const DashboardGrid = styled.section`
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

  @media (max-width: 1180px) {
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

export const ChartBody = styled.div`
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
`;

export const TooltipBox = styled.div`
  min-width: 140px;
  padding: 10px 12px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceLowest};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
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
  gap: 12px;
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

export const PerformanceSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 16px 16px 0;
`;

export const SummaryCell = styled.div`
  padding: 10px 12px;
  border: 1px solid ${colors.surfaceHigh};
  border-radius: 4px;
  background: ${colors.surfaceLow};

  span {
    ${labelCaps};
    display: block;
    color: ${colors.muted};
  }

  strong {
    ${mono};
    display: block;
    margin-top: 5px;
    color: ${({ $tone }) => toneColors[$tone] || colors.text};
    font-size: 16px;
    line-height: 22px;
  }
`;

export const WorkerSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid ${colors.surfaceHigh};
`;

export const WorkerMetric = styled.div`
  display: grid;
  gap: 3px;
  padding: 10px;
  border-radius: 4px;
  background: ${colors.surfaceLow};

  strong {
    ${mono};
    color: ${({ $tone }) => toneColors[$tone] || colors.text};
    font-size: 18px;
    line-height: 24px;
  }

  span {
    color: ${colors.muted};
    font-size: 11px;
  }
`;

export const CompactList = styled.div`
  display: grid;
`;

export const StatusRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(90px, 0.8fr) auto;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 10px 16px;
  border-bottom: 1px solid ${colors.surfaceHigh};

  &:last-child {
    border-bottom: 0;
  }

  &:nth-child(even) {
    background: rgba(6, 14, 32, 0.32);
  }

  strong {
    display: block;
    font-size: 13px;
    line-height: 18px;
  }

  small {
    display: block;
    margin-top: 2px;
    color: ${colors.dim};
    font-size: 11px;
    line-height: 16px;
  }

  > span:not([class]) {
    color: ${colors.muted};
    font-size: 12px;
  }
`;

export const StatusChip = styled.span`
  ${mono};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 64px;
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

export const ProcessList = styled.div`
  display: grid;
  gap: 18px;
  padding: 20px 16px;
`;

export const ProcessItem = styled.div`
  display: grid;
  gap: 8px;
`;

export const ProcessHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;

  strong {
    font-size: 13px;
    line-height: 18px;
  }

  small {
    display: block;
    margin-top: 2px;
    color: ${colors.dim};
    font-size: 11px;
  }

  > span {
    ${mono};
    color: ${({ $tone }) => toneColors[$tone] || colors.primary};
    font-size: 14px;
    font-weight: 700;
  }
`;

export const ProgressTrack = styled.div`
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: ${colors.surfaceLowest};
`;

export const ProgressFill = styled.div`
  width: ${({ $value }) => `${Math.max(0, Math.min(100, $value || 0))}%`};
  height: 100%;
  border-radius: inherit;
  background: ${({ $tone }) => toneColors[$tone] || colors.primary};
  transition: width 0.25s ease;
`;

export const AlarmSummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid ${colors.surfaceHigh};
`;

export const AlarmCount = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 9px;
  border-radius: 4px;
  background: ${colors.surfaceLow};
  color: ${colors.muted};
  font-size: 11px;

  strong {
    ${mono};
    color: ${({ $tone }) => toneColors[$tone] || colors.text};
  }
`;

export const AlarmRow = styled.div`
  display: grid;
  grid-template-columns: 110px minmax(130px, 0.7fr) minmax(0, 1.7fr) auto;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  padding: 10px 16px;
  border-bottom: 1px solid ${colors.surfaceHigh};
  cursor: pointer;
  transition: background 0.15s ease, box-shadow 0.15s ease;

  &:last-child {
    border-bottom: 0;
  }

  &:nth-child(even) {
    background: rgba(6, 14, 32, 0.32);
  }

  &:hover {
    background: rgba(75, 226, 119, 0.07);
  }

  &:focus-visible {
    outline: none;
    background: rgba(75, 226, 119, 0.07);
    box-shadow: inset 0 0 0 2px ${colors.primary};
  }

  time {
    ${mono};
    color: ${colors.muted};
    font-size: 11px;
  }

  strong {
    font-size: 12px;
  }

  p {
    margin: 0;
    overflow: hidden;
    color: ${colors.muted};
    font-size: 12px;
    line-height: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const CommunicationSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid ${colors.surfaceHigh};
`;

export const ConnectionCard = styled.div`
  display: grid;
  gap: 5px;
  padding: 12px;
  border: 1px solid ${({ $tone }) => `${toneColors[$tone] || colors.border}44`};
  border-radius: 4px;
  background: ${colors.surfaceLow};

  svg {
    width: 18px;
    height: 18px;
    color: ${({ $tone }) => toneColors[$tone] || colors.text};
  }

  strong {
    ${mono};
    font-size: 16px;
    line-height: 22px;
  }

  span {
    color: ${colors.muted};
    font-size: 11px;
  }
`;

export const EmptyState = styled.div`
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 8px;
  min-height: ${({ $compact }) => ($compact ? '180px' : '260px')};
  padding: 32px;
  color: ${colors.muted};
  text-align: center;

  svg {
    width: 30px;
    height: 30px;
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

export const DividerLabel = styled.span`
  ${labelCaps};
  display: block;
  padding: 12px 16px 8px;
  color: ${colors.dim};
`;

export const ConnectionList = styled.div`
  display: grid;
`;

export const ConnectionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 45px;
  padding: 8px 16px;
  border-top: 1px solid ${colors.surfaceHigh};

  > div {
    min-width: 0;
  }

  strong {
    display: block;
    overflow: hidden;
    font-size: 12px;
    line-height: 17px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    ${mono};
    display: block;
    margin-top: 2px;
    color: ${colors.dim};
    font-size: 10px;
  }
`;
