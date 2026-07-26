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
};

const toneColors = {
  success: colors.primary,
  warning: colors.warning,
  alarm: colors.alarm,
  info: colors.muted,
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

const ringPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(75, 226, 119, 0.35); }
  70% { box-shadow: 0 0 0 7px rgba(75, 226, 119, 0); }
  100% { box-shadow: 0 0 0 0 rgba(75, 226, 119, 0); }
`;

const dashOffset = keyframes`
  from { stroke-dashoffset: 120; }
  to { stroke-dashoffset: 0; }
`;

const dotPulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.75); }
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
  animation: ${pulse} 1.8s ease-in-out infinite, ${ringPulse} 1.8s ease-out infinite;
`;

export const SparkWrap = styled.span`
  display: inline-flex;
  line-height: 0;

  polyline {
    stroke-dasharray: 120;
    stroke-dashoffset: 120;
    animation: ${dashOffset} 0.8s ease forwards;
    animation-delay: ${({ $delay = 0 }) => `${$delay}ms`};
  }
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
`;

export const KpiCard = styled.article`
  display: flex;
  min-width: 0;
  min-height: 88px;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceContainer};
  cursor: pointer;
  animation: ${fadeIn} 0.35s ease both;
  animation-delay: ${({ $delay = 0 }) => `${$delay}ms`};
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(3, 7, 18, 0.4);
  }
`;

export const KpiIconBadge = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ $tone }) => `${toneColors[$tone] || colors.primary}26`};

  svg {
    width: 17px;
    height: 17px;
    color: ${({ $tone }) => toneColors[$tone] || colors.primary};
  }
`;

export const KpiBody = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
`;

export const KpiHead = styled.div`
  color: ${colors.muted};

  span {
    ${labelCaps};
  }
`;

export const KpiValue = styled.strong`
  ${mono};
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin-top: 6px;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;

  small {
    color: ${colors.muted};
    font-size: 11px;
    font-weight: 500;
  }
`;

export const KpiMeta = styled.p`
  margin: 4px 0 0;
  overflow: hidden;
  color: ${colors.dim};
  font-size: 11px;
  line-height: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${colors.surfaceHigh};
  }

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
  gap: 6px;
  padding: 12px 16px;
  border-bottom: 1px solid ${colors.surfaceHigh};
`;

export const WorkerMetric = styled.div`
  display: grid;
  gap: 2px;
  padding: 8px 10px;
  border-radius: 4px;
  background: ${colors.surfaceLow};
  opacity: 0;
  animation: ${fadeIn} 0.3s ease both;
  animation-delay: ${({ $delay = 0 }) => `${$delay}ms`};

  strong {
    ${mono};
    color: ${({ $tone }) => toneColors[$tone] || colors.text};
    font-size: 15px;
    line-height: 20px;
  }

  span {
    color: ${colors.muted};
    font-size: 10px;
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
  min-height: 40px;
  padding: 6px 16px;
  border-bottom: 1px solid ${colors.surfaceHigh};
  opacity: 0;
  animation: ${fadeIn} 0.3s ease both;
  animation-delay: ${({ $delay = 0 }) => `${$delay}ms`};
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: 0;
  }

  &:nth-child(even) {
    background: rgba(6, 14, 32, 0.32);
  }

  &:hover {
    background: rgba(75, 226, 119, 0.06);
  }

  strong {
    display: block;
    font-size: 12px;
    line-height: 16px;
  }

  small {
    display: block;
    margin-top: 1px;
    color: ${colors.dim};
    font-size: 10px;
    line-height: 14px;
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
    animation: ${({ $tone }) => ($tone === 'alarm' || $tone === 'warning' ? css`${dotPulse} 1.1s ease-in-out infinite` : 'none')};
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
  grid-template-columns: 30px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  min-height: 58px;
  padding: 10px 14px 10px 12px;
  border-bottom: 1px solid ${colors.surfaceHigh};
  border-left: 2px solid ${({ $tone }) => toneColors[$tone] || colors.border};
  cursor: pointer;
  opacity: 0;
  animation: ${fadeIn} 0.3s ease both;
  animation-delay: ${({ $delay = 0 }) => `${$delay}ms`};
  transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;

  &:last-child {
    border-bottom: 0;
  }

  &:nth-child(even) {
    background: rgba(6, 14, 32, 0.32);
  }

  &:hover {
    background: rgba(75, 226, 119, 0.07);
    transform: translateX(2px);
  }

  &:focus-visible {
    outline: none;
    background: rgba(75, 226, 119, 0.07);
    box-shadow: inset 0 0 0 2px ${colors.primary};
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

export const AlarmIconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: ${colors.surfaceLow};

  svg {
    width: 13px;
    height: 13px;
    color: ${({ $tone }) => toneColors[$tone] || colors.primary};
  }
`;

export const AlarmMessageBlock = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
`;

export const AlarmSideCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

export const AlarmTime = styled.span`
  ${mono};
  color: ${colors.dim};
  font-size: 10px;
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
  opacity: 0;
  animation: ${fadeIn} 0.3s ease both;
  animation-delay: ${({ $delay = 0 }) => `${$delay}ms`};
  transition: transform 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ $tone }) => toneColors[$tone] || colors.primary};
  }

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
  transition: background 0.15s ease;

  &:hover {
    background: rgba(75, 226, 119, 0.05);
  }

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

export const SplitRow = styled.div`
  display: grid;
  grid-template-columns: ${({ $ratio = '1fr 1fr' }) => $ratio};
  gap: 12px;
  margin-bottom: 12px;
  align-items: stretch;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 16px 0;
  margin-bottom: 10px;
`;

export const ChartTitleBlock = styled.div`
  h3 {
    margin: 4px 0 0;
    font-size: 14px;
    font-weight: 600;
  }
`;

export const ChartLegendRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 11px;
  color: ${colors.muted};
`;

export const ChartLegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const ChartLegendSwatch = styled.span`
  display: inline-block;
  width: 10px;
  height: 2px;
  background: ${({ $color, $dashed }) => ($dashed ? 'transparent' : $color)};
  border-top: ${({ $dashed, $color }) => ($dashed ? `2px dashed ${$color}` : 'none')};
`;

export const ChartFrame = styled.div`
  width: 100%;
  height: ${({ $height = 190 }) => `${$height}px`};
  padding: 0 16px 16px;
`;

export const ChartTooltipBox = styled.div`
  min-width: 140px;
  padding: 10px 12px;
  border: 1px solid ${colors.surfaceHigh};
  border-radius: 4px;
  background: ${colors.surfaceHigh};
  box-shadow: 0 8px 20px rgba(3, 7, 18, 0.45);
`;

export const ChartTooltipTitle = styled.div`
  margin-bottom: 6px;
  ${mono};
  font-size: 11px;
  color: ${colors.muted};
`;

export const ChartTooltipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;

  & + & {
    margin-top: 4px;
  }
`;

export const ChartTooltipDot = styled.span`
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export const ChartTooltipLabel = styled.span`
  color: ${colors.muted};
`;

export const ChartTooltipValue = styled.span`
  margin-left: auto;
  ${mono};
`;

export const DonutWrap = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  padding: 0 16px;
`;

export const DonutCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);
  pointer-events: none;

  strong {
    ${mono};
    font-size: 20px;
    font-weight: 600;
  }

  span {
    margin-top: 2px;
    font-size: 10px;
    color: ${colors.muted};
  }
`;

export const DonutLegendRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-top: 8px;
  padding: 0 16px 16px;
  font-size: 12px;

  strong {
    ${mono};
  }
`;

export const PanelBody = styled.div`
  padding: 16px;
`;

export const ProcessMiniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
  gap: 8px;
`;

export const ProcessMiniCard = styled.div`
  padding: 10px;
  border: 1px solid ${colors.surfaceHigh};
  border-radius: 4px;
  background: ${colors.surfaceLow};
  opacity: 0;
  animation: ${fadeIn} 0.3s ease both;
  animation-delay: ${({ $delay = 0 }) => `${$delay}ms`};
  transition: transform 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${colors.primary};
  }
`;

export const ProcessMiniName = styled.div`
  font-size: 12px;
  font-weight: 600;
`;

export const ProcessMiniEquip = styled.div`
  margin: 3px 0 8px;
  ${mono};
  font-size: 10px;
  color: ${colors.dim};
`;

export const PipelineRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 6px;
  padding: 16px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.surfaceHigh};
    border-radius: 999px;
  }
`;

export const PipelineArrow = styled.div`
  display: flex;
  flex: 0 0 20px;
  align-items: center;
  justify-content: center;
  color: ${colors.border};
  font-size: 16px;
`;

export const PipelineCard = styled.div`
  display: flex;
  flex: 0 0 130px;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  min-height: 104px;
  padding: 10px 12px;
  border: 1px ${({ $dashed }) => ($dashed ? 'dashed' : 'solid')} ${colors.border};
  border-radius: 6px;
  background: ${colors.surfaceLow};
  opacity: 0;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  animation: ${fadeIn} 0.3s ease both;
  animation-delay: ${({ $delay = 0 }) => `${$delay}ms`};
  transition: transform 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${colors.primary};
  }

  strong {
    display: block;
    margin: 4px 0 8px;
    overflow: hidden;
    font-size: 12px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    display: block;
    ${mono};
    font-size: 9px;
    color: ${colors.dim};
  }
`;

export const PipelineActiveCard = styled.div`
  position: relative;
  display: flex;
  flex: 0 0 210px;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  min-height: 136px;
  padding: 14px;
  border: 1.5px solid ${colors.primary};
  border-radius: 8px;
  background: ${colors.surfaceContainer};
  box-shadow: 0 0 0 4px rgba(75, 226, 119, 0.12);
  opacity: 0;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  animation: ${fadeIn} 0.3s ease both;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-2px);
  }

  strong {
    display: block;
    margin: 4px 0 10px;
    overflow: hidden;
    font-size: 14px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    display: block;
    ${mono};
    font-size: 9px;
    color: ${colors.dim};
  }
`;

export const PipelineActiveEyebrow = styled.span`
  ${labelCaps};
  display: block;
  margin-bottom: 2px;
  color: ${colors.primary};
`;

export const PipelineLiveDot = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${colors.primary};
  animation: ${pulse} 1.8s ease-in-out infinite, ${ringPulse} 1.8s ease-out infinite;
`;

export const PipelineProgressTrack = styled.div`
  height: 6px;
  margin-bottom: 6px;
  border-radius: 999px;
  background: ${colors.surfaceLowest};
  overflow: hidden;
`;

export const PipelineProgressFill = styled.div`
  height: 100%;
  width: ${({ $value }) => `${Math.max(0, Math.min(100, $value || 0))}%`};
  border-radius: 999px;
  background: linear-gradient(90deg, #22c55e, ${colors.primary});
  transition: width 0.5s ease;
`;

export const PipelineMeta = styled.div`
  ${mono};
  font-size: 10px;
  color: ${colors.dim};
`;

export const RangeToggleGroup = styled.div`
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid ${colors.border};
  border-radius: 999px;
  background: ${colors.surfaceLow};
`;

export const RangeToggleButton = styled.button`
  ${mono};
  padding: 4px 10px;
  border: none;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? colors.primary : 'transparent')};
  color: ${({ $active }) => ($active ? colors.primaryInk : colors.muted)};
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    color: ${({ $active }) => ($active ? colors.primaryInk : colors.text)};
  }
`;

export const ChartCaption = styled.p`
  margin: 0;
  padding: 0 16px 14px;
  font-size: 11px;
  color: ${colors.dim};
`;

export const ProductRowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 16px 16px;
`;

export const ProductRow = styled.div`
  opacity: 0;
  animation: ${fadeIn} 0.3s ease both;
  animation-delay: ${({ $delay = 0 }) => `${$delay}ms`};
`;

export const ProductRowHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 5px;
  font-size: 12px;

  span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span:last-child {
    ${mono};
    flex: 0 0 auto;
    color: ${colors.dim};
    font-size: 11px;
  }
`;

export const ProductBarTrack = styled.div`
  height: 8px;
  border-radius: 999px;
  background: ${colors.surfaceLowest};
  overflow: hidden;
`;

export const ProductBarFill = styled.div`
  height: 100%;
  width: ${({ $value }) => `${Math.max(0, Math.min(100, $value || 0))}%`};
  border-radius: 999px;
  background: ${({ $tone }) => toneColors[$tone] || colors.primary};
  transition: width 0.5s ease;
`;

export const PanelLinkMore = styled.a`
  ${mono};
  font-size: 11px;
  color: ${colors.primary};
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const WorkerCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 14px 16px 16px;
`;

export const WorkerAvatarCard = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid ${colors.surfaceHigh};
  border-radius: 6px;
  background: ${colors.surfaceLow};
  opacity: 0;
  cursor: pointer;
  animation: ${fadeIn} 0.3s ease both;
  animation-delay: ${({ $delay = 0 }) => `${$delay}ms`};
  transition: transform 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${colors.primary};
  }
`;

export const WorkerAvatar = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({ $tone }) => toneColors[$tone] || colors.primary};
  color: ${colors.surfaceLowest};
  font-size: 12px;
  font-weight: 700;
`;

export const WorkerCardBody = styled.div`
  min-width: 0;

  strong {
    display: block;
    overflow: hidden;
    font-size: 12px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    display: block;
    overflow: hidden;
    margin-top: 2px;
    ${mono};
    color: ${colors.dim};
    font-size: 9px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;


