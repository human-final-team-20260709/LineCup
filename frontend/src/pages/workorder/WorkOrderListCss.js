import styled, { css, keyframes } from 'styled-components';

/* =========================================================
 * DESIGN.md ("Kinetic Industrial") 디자인 토큰
 * - 공통 테마 파일을 새로 만들지 않기 위해, 이 페이지 전용으로 로컬 선언합니다.
 * ========================================================= */
const colors = {
  surface: '#0b1326',
  surfaceContainerLowest: '#060e20',
  surfaceContainerLow: '#131b2e',
  surfaceContainer: '#171f33',
  surfaceContainerHigh: '#222a3d',
  surfaceBright: '#31394d',
  onSurface: '#dae2fd',
  onSurfaceVariant: '#bccbb9',
  outline: '#869585',
  outlineVariant: '#3d4a3d',
  primary: '#4be277',
  onPrimary: '#003915',
  secondary: '#ffb95f',
  onSecondary: '#472a00',
  tertiary: '#ffb4ae',
  errorContainer: '#93000a',
};

const signal = {
  nominal: colors.primary,
  warning: colors.secondary,
  alarm: '#ffb4ab',
  neutral: colors.onSurfaceVariant,
};

const hexToRgba = (hex, alpha = 1) => {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const font = {
  ui: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace",
};

const typography = {
  displayLg: css`
    font-family: ${font.ui};
    font-size: 40px;
    font-weight: 700;
    line-height: 48px;
    letter-spacing: -0.02em;

    @media (min-width: 1200px) {
      font-size: 48px;
      line-height: 56px;
    }
  `,
  headlineMd: css`
    font-family: ${font.ui};
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
  `,
  headlineSm: css`
    font-family: ${font.ui};
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  `,
  bodyLg: css`
    font-family: ${font.ui};
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  `,
  bodySm: css`
    font-family: ${font.ui};
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  `,
  dataSm: css`
    font-family: ${font.mono};
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  `,
  labelCaps: css`
    font-family: ${font.ui};
    font-size: 11px;
    font-weight: 700;
    line-height: 16px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  `,
};

const radius = {
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  full: '9999px',
};

const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

export const tokens = { colors, signal, hexToRgba, typography, radius, spacing };

/* =========================================================
 * 애니메이션 (DESIGN.md의 "Mission Control" 톤에 맞춘 절제된 모션)
 * ========================================================= */
const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
`;

const pulseDot = keyframes`
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 currentColor; }
  50% { opacity: 0.45; }
`;

const dashOffset = keyframes`
  from { stroke-dashoffset: 220; }
  to { stroke-dashoffset: 0; }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: none; }
`;

const flashHighlight = keyframes`
  0% { background: ${hexToRgba(colors.primary, 0.28)}; }
  100% { background: transparent; }
`;

/* =========================================================
 * Layout
 * ========================================================= */
export const Page = styled.div`
  min-height: 100vh;
  background: ${colors.surface};
  color: ${colors.onSurface};
  padding: ${spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  animation: ${fadeSlideUp} 0.4s ease both;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${spacing.md};
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TitleLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Title = styled.h1`
  ${typography.headlineMd};
  margin: 0;
`;

export const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: ${radius.full};
  background: ${colors.primary};
  color: ${colors.primary};
  animation: ${pulseDot} 1.8s ease-in-out infinite;
`;

export const Subtitle = styled.p`
  ${typography.bodySm};
  color: ${colors.onSurfaceVariant};
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

/* =========================================================
 * KPI 요약 카드 (DESIGN.md "Data Cards" + "Sparklines")
 * ========================================================= */
export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.md};

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const KpiCard = styled.div`
  position: relative;
  overflow: hidden;
  background: ${colors.surfaceContainer};
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.lg};
  padding: ${spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  opacity: 0;
  animation: ${fadeSlideUp} 0.45s ease both;
  animation-delay: ${({ $delay }) => $delay || 0}ms;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:hover {
    border-color: ${({ $accent }) => $accent || colors.primary};
    box-shadow: inset 0 0 0 1px ${({ $accent }) => hexToRgba($accent || colors.primary, 0.35)};
  }

  &:focus-visible {
    outline: 2px solid ${({ $accent }) => $accent || colors.primary};
    outline-offset: 2px;
  }

  ${({ $emphasis, $accent }) =>
    $emphasis &&
    css`
      background: ${hexToRgba($accent, 0.14)};
      border-color: ${hexToRgba($accent, 0.5)};
    `}

  ${({ $selected, $accent }) =>
    $selected &&
    css`
      border-color: ${$accent};
      box-shadow: inset 0 0 0 1px ${$accent};
    `}
`;

export const KpiCardProgress = styled(KpiCard)`
  grid-column: span 2;
  justify-content: center;

  @media (max-width: 1000px) {
    grid-column: span 2;
  }
`;

export const KpiHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const KpiLabel = styled.span`
  ${typography.labelCaps};
  color: ${colors.onSurfaceVariant};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const KpiIcon = styled.span`
  display: inline-flex;
  color: ${({ $color }) => $color || colors.onSurfaceVariant};
`;

export const KpiValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

export const KpiValue = styled.span`
  ${typography.displayLg};
  color: ${({ $color }) => $color || colors.onSurface};
`;

export const KpiUnit = styled.span`
  ${typography.bodySm};
  color: ${colors.onSurfaceVariant};
`;

export const KpiFootRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.sm};
  min-height: 28px;
`;

export const KpiTrendText = styled.span`
  ${typography.dataSm};
  text-transform: none;
  color: ${({ $color }) => $color || colors.onSurfaceVariant};
`;

export const SparkWrap = styled.span`
  display: inline-flex;
  line-height: 0;

  polyline,
  path {
    stroke-dasharray: 220;
    stroke-dashoffset: 220;
    animation: ${dashOffset} 0.9s ease forwards;
    animation-delay: 0.2s;
  }
`;

/* =========================================================
 * Toolbar
 * ========================================================= */
export const ToolBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${spacing.md};
`;

export const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const FilterChip = styled.button`
  ${typography.bodySm};
  font-weight: 600;
  padding: 8px 14px;
  border-radius: ${radius.full};
  border: 1px solid ${({ $active, $accent }) => ($active ? $accent || colors.primary : colors.outlineVariant)};
  background: ${({ $active, $accent }) => ($active ? $accent || colors.primary : 'transparent')};
  color: ${({ $active }) => ($active ? colors.onPrimary : colors.onSurfaceVariant)};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ $accent }) => $accent || colors.primary};
    color: ${({ $active }) => ($active ? colors.onPrimary : colors.onSurface)};
  }
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  min-width: 260px;
  background: ${colors.surfaceContainerLow};
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.DEFAULT};
  color: ${colors.onSurfaceVariant};
  transition: border-color 0.15s ease;

  &:focus-within {
    border-color: ${colors.primary};
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  ${typography.bodySm};
  color: ${colors.onSurface};

  &::placeholder {
    color: ${colors.onSurfaceVariant};
  }
`;

/* =========================================================
 * Table
 * ========================================================= */
export const TableCard = styled.div`
  background: ${colors.surfaceContainer};
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.lg};
  overflow: hidden;
  animation: ${fadeSlideUp} 0.45s ease both;
  animation-delay: 120ms;
`;

export const ChartCard = styled.div`
  background: ${colors.surfaceContainer};
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.lg};
  padding: ${spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  animation: ${fadeSlideUp} 0.45s ease both;
  animation-delay: 120ms;
`;

export const ChartHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${spacing.sm};
`;

export const ChartTitle = styled.h2`
  ${typography.headlineSm};
  margin: 0;
`;

export const ChartLegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

export const ChartLegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  ${typography.dataSm};
  text-transform: none;
  color: ${colors.onSurfaceVariant};
`;

export const ChartLegendSwatch = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const ChartFrame = styled.div`
  width: 100%;
  height: 320px;

  /* recharts가 막대/서페이스에 붙이는 브라우저 기본 포커스 링을 제거합니다.
     막대는 클릭 동작이 없는 순수 데이터 시각화라 포커스 표시가 필요 없습니다.
     recharts 버전에 따라 포커스를 받는 실제 태그(svg/g/path/rect)가 달라질 수 있어
     범위를 넓게 잡고 !important로 확실히 덮습니다. */
  & svg,
  & svg *,
  & .recharts-wrapper,
  & .recharts-wrapper *,
  & .recharts-surface,
  & .recharts-rectangle,
  & .recharts-bar-rectangle,
  & .recharts-bar-rectangle * {
    outline: none !important;
  }

  & svg:focus,
  & svg *:focus,
  & .recharts-wrapper *:focus {
    outline: none !important;
  }
`;

/* =========================================================
 * 차트 커스텀 툴팁
 * (recharts 기본 툴팁은 항목 텍스트를 막대 색으로 칠하는데,
 *  "목표" 막대 색이 툴팁 배경색과 같아서 글자가 안 보이는 문제가 있어
 *  색을 직접 지정하는 커스텀 툴팁으로 대체합니다.)
 * ========================================================= */
export const ChartTooltipBox = styled.div`
  background: ${colors.surfaceContainerHigh};
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.md};
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 160px;
`;

export const ChartTooltipTitle = styled.div`
  ${typography.bodySm};
  font-weight: 700;
  color: ${colors.onSurface};
`;

export const ChartTooltipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ChartTooltipDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const ChartTooltipLabel = styled.span`
  ${typography.dataSm};
  text-transform: none;
  color: ${colors.onSurfaceVariant};
  flex: 1;
`;

export const ChartTooltipValue = styled.span`
  ${typography.dataSm};
  text-transform: none;
  font-weight: 600;
  color: ${colors.onSurface};
`;

export const TableHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.md} ${spacing.md} 0;
`;

export const CountChip = styled.span`
  ${typography.dataSm};
  text-transform: none;
  color: ${colors.onSurfaceVariant};
  background: ${colors.surfaceContainerHigh};
  border-radius: ${radius.full};
  padding: 3px 10px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: left;
  ${typography.labelCaps};
  color: ${colors.onSurfaceVariant};
  padding: 12px 16px;
  border-bottom: 1px solid ${colors.outlineVariant};
  background: ${colors.surfaceContainerLow};
  white-space: nowrap;
  width: ${({ $wide }) => ($wide ? '180px' : 'auto')};
`;

export const Tr = styled.tr`
  cursor: pointer;
  opacity: 0;
  animation: ${fadeSlideUp} 0.3s ease both;
  animation-delay: ${({ $delay }) => $delay || 0}ms;
  transition: background 0.12s ease, box-shadow 0.12s ease;
  box-shadow: inset 3px 0 0 0 transparent;

  &:nth-child(even) {
    background: ${colors.surfaceContainerLowest};
  }

  &:hover {
    background: ${colors.surfaceContainerHigh};
    box-shadow: inset 3px 0 0 0 ${colors.primary};
  }

  &:not(:last-child) td {
    border-bottom: 1px solid ${colors.outlineVariant};
  }

  ${({ $justAdded }) =>
    $justAdded &&
    css`
      animation: ${flashHighlight} 1.6s ease-out;
    `}
`;

export const Td = styled.td`
  padding: 10px 16px;
  ${({ $mono }) => ($mono ? typography.dataSm : typography.bodySm)};
  text-transform: none;
  color: ${colors.onSurface};
  vertical-align: middle;
`;

export const QtyCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 160px;
`;

export const QtySub = styled.span`
  ${typography.dataSm};
  text-transform: none;
  color: ${colors.onSurfaceVariant};
`;

/* =========================================================
 * Status Badge (DESIGN.md "Status Chips")
 * ========================================================= */
export const Badge = styled.span`
  ${typography.dataSm};
  text-transform: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: ${radius.full};
  color: ${({ $color }) => $color};
  background: ${({ $color }) => hexToRgba($color, 0.16)};
  white-space: nowrap;
`;

export const BadgeDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: ${radius.full};
  background: ${({ $color }) => $color};
  flex-shrink: 0;

  ${({ $pulse }) =>
    $pulse &&
    css`
      animation: ${pulseDot} 1.2s ease-in-out infinite;
    `}
`;

/* =========================================================
 * Progress Bar
 * ========================================================= */
export const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  width: 100%;
`;

export const ProgressTrack = styled.div`
  flex: 1;
  height: 8px;
  border-radius: ${radius.full};
  background: ${colors.surfaceContainerHigh};
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  border-radius: ${radius.full};
  width: ${({ $rate }) => $rate}%;
  background: ${({ $color }) => $color || colors.primary};
  transition: width 0.6s ease;
`;

export const ProgressRate = styled.span`
  ${typography.dataSm};
  text-transform: none;
  color: ${colors.onSurfaceVariant};
  min-width: 36px;
  text-align: right;
`;

/* =========================================================
 * Button
 * ========================================================= */
const buttonVariants = {
  primary: css`
    background: ${colors.primary};
    color: ${colors.onPrimary};
    border: 1px solid ${colors.primary};
    &:hover {
      filter: brightness(1.06);
    }
  `,
  outline: css`
    background: transparent;
    color: ${colors.onSurface};
    border: 1px solid ${colors.outlineVariant};
    &:hover {
      background: ${colors.surfaceContainerHigh};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${colors.onSurfaceVariant};
    border: 1px solid ${colors.outlineVariant};
    &:hover {
      background: ${colors.surfaceContainerHigh};
      color: ${colors.onSurface};
      border-color: ${colors.outline};
    }
  `,
};

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.DEFAULT};
  cursor: pointer;
  white-space: nowrap;
  font-weight: 600;
  ${typography.bodySm};
  transition: filter 0.15s ease, background 0.15s ease, transform 0.1s ease;

  ${({ $variant }) => buttonVariants[$variant] || buttonVariants.primary};

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    filter: none;
    transform: none;
  }
`;

/* =========================================================
 * Empty State ("데이터 없음")
 * ========================================================= */
export const EmptyWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${spacing.xl} ${spacing.lg};
  gap: ${spacing.sm};
`;

export const EmptyIconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${hexToRgba(colors.onSurfaceVariant, 0.12)};
  color: ${colors.onSurfaceVariant};
  margin-bottom: ${spacing.xs};
`;

export const EmptyTitle = styled.p`
  ${typography.bodyLg};
  font-weight: 600;
  margin: 0;
`;

export const EmptyDesc = styled.p`
  ${typography.bodySm};
  color: ${colors.onSurfaceVariant};
  margin: 0;
  max-width: 320px;
`;

export const EmptyActionBtn = styled.button`
  margin-top: ${spacing.sm};
  ${typography.bodySm};
  font-weight: 600;
  color: ${colors.onPrimary};
  background: ${colors.primary};
  border: none;
  border-radius: ${radius.DEFAULT};
  padding: ${spacing.sm} ${spacing.md};
  cursor: pointer;

  &:hover {
    filter: brightness(1.05);
  }
`;

/* =========================================================
 * 데이터 있음 / 없음 데모 토글
 * ========================================================= */
export const ToggleWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1px dashed ${colors.outlineVariant};
  border-radius: ${radius.DEFAULT};
  background: ${colors.surfaceContainerLow};
`;

export const ToggleLabel = styled.span`
  ${typography.dataSm};
  text-transform: none;
  color: ${({ $muted }) => ($muted ? colors.onSurfaceVariant : colors.onSurface)};
`;

export const ToggleSwitch = styled.button`
  position: relative;
  width: 34px;
  height: 18px;
  border-radius: ${radius.full};
  border: none;
  cursor: pointer;
  background: ${({ $on }) => ($on ? colors.primary : colors.surfaceContainerHigh)};
  transition: background 0.15s ease;
`;

export const ToggleKnob = styled.span`
  position: absolute;
  top: 2px;
  left: ${({ $on }) => ($on ? '18px' : '2px')};
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${colors.onSurface};
  transition: left 0.15s ease;
`;

/* =========================================================
 * 등록 완료 토스트
 * ========================================================= */
export const Toast = styled.div`
  position: fixed;
  top: ${spacing.lg};
  right: ${spacing.lg};
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${colors.surfaceContainerHigh};
  border: 1px solid ${hexToRgba(colors.primary, 0.5)};
  border-left: 3px solid ${colors.primary};
  border-radius: ${radius.md};
  padding: 12px 16px;
  box-shadow: inset 0 0 0 1px ${hexToRgba(colors.primary, 0.15)};
  animation: ${slideDown} 0.25s ease both;
  z-index: 1200;
`;

export const ToastText = styled.span`
  ${typography.bodySm};
  color: ${colors.onSurface};
`;

/* =========================================================
 * 작업지시 등록 모달 (README 3.3 — 목록 페이지 위에 모달로 표시)
 * ========================================================= */
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.64);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${spacing.md};
  animation: ${fadeSlideUp} 0.15s ease both;
  color: ${colors.onSurface};
`;

export const ModalPanel = styled.div`
  width: 100%;
  max-width: ${({ $width }) => $width || '640px'};
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  background: ${colors.surfaceContainer};
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.lg};
  animation: ${fadeSlideUp} 0.22s ease both;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.md} ${spacing.lg};
  border-bottom: 1px solid ${colors.outlineVariant};
  flex-shrink: 0;
`;

export const ModalTitle = styled.h2`
  ${typography.headlineSm};
  margin: 0;
`;

export const ModalCloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${radius.DEFAULT};
  border: none;
  background: transparent;
  color: ${colors.onSurfaceVariant};
  cursor: pointer;

  &:hover {
    background: ${colors.surfaceContainerHigh};
    color: ${colors.onSurface};
  }
`;

export const ModalBody = styled.div`
  padding: ${spacing.lg};
  overflow-y: auto;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.sm};
  padding: ${spacing.md} ${spacing.lg};
  border-top: 1px solid ${colors.outlineVariant};
  flex-shrink: 0;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.lg} ${spacing.md};

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  grid-column: ${({ $span2 }) => ($span2 ? 'span 2' : 'span 1')};

  @media (max-width: 560px) {
    grid-column: span 1;
  }
`;

export const Label = styled.label`
  ${typography.labelCaps};
  color: ${colors.onSurfaceVariant};
`;

const baseControl = css`
  padding: 10px 12px;
  background: ${colors.surfaceContainerLow};
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.DEFAULT};
  color: ${colors.onSurface};
  outline: none;
  transition: border-color 0.15s ease;
`;

export const Select = styled.select`
  ${baseControl};
  ${typography.bodySm};

  &:focus {
    border-color: ${colors.primary};
  }
`;

export const Input = styled.input`
  ${baseControl};
  ${typography.bodySm};

  &[type='date'] {
    color-scheme: dark;
  }

  &[type='date']::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: brightness(0) invert(1);
    opacity: 1;
  }

  &:focus {
    border-color: ${colors.primary};
  }

  &::placeholder {
    color: ${colors.onSurfaceVariant};
  }
`;

export const Textarea = styled.textarea`
  ${baseControl};
  ${typography.bodySm};
  resize: vertical;
  font-family: inherit;

  &:focus {
    border-color: ${colors.primary};
  }

  &::placeholder {
    color: ${colors.onSurfaceVariant};
  }
`;

export const ErrorText = styled.span`
  ${typography.dataSm};
  text-transform: none;
  color: ${colors.tertiary};
`;

export const PickerRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  flex-wrap: wrap;
`;

export const PickerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  ${typography.bodySm};
  font-weight: 600;
  padding: 10px ${spacing.md};
  background: ${colors.surfaceContainerLow};
  border: 1px dashed ${colors.outlineVariant};
  border-radius: ${radius.DEFAULT};
  color: ${colors.onSurface};
  cursor: pointer;

  &:hover {
    border-color: ${colors.primary};
    color: ${colors.primary};
  }
`;

export const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

export const Chip = styled.span`
  ${typography.dataSm};
  text-transform: none;
  color: ${colors.onSurface};
  background: ${colors.surfaceContainerHigh};
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.full};
  padding: 4px 10px;
`;

export const PickerSearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${colors.surfaceContainerLow};
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.DEFAULT};
  color: ${colors.onSurfaceVariant};
  margin-bottom: ${spacing.md};
`;

export const PickerSearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  ${typography.bodySm};
  color: ${colors.onSurface};

  &::placeholder {
    color: ${colors.onSurfaceVariant};
  }
`;

export const PickerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 280px;
  overflow-y: auto;
`;

export const PickerListRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm};
  border-radius: ${radius.DEFAULT};
  border: 1px solid ${({ $active }) => ($active ? colors.primary : 'transparent')};
  background: ${({ $active }) => ($active ? colors.surfaceContainerHigh : 'transparent')};
  cursor: pointer;

  &:hover {
    background: ${colors.surfaceContainerHigh};
  }
`;

export const PickerRadioDot = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid ${({ $active }) => ($active ? colors.primary : colors.outline)};
  background: ${({ $active }) => ($active ? colors.primary : 'transparent')};
  flex-shrink: 0;
`;

export const PickerInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

export const PickerName = styled.span`
  ${typography.bodySm};
  font-weight: 600;
  color: ${colors.onSurface};
`;

export const PickerMeta = styled.span`
  ${typography.dataSm};
  text-transform: none;
  color: ${colors.onSurfaceVariant};
`;

export const PickerTaskLoad = styled.span`
  ${typography.dataSm};
  text-transform: none;
  color: ${({ $busy }) => ($busy ? colors.secondary : colors.onSurfaceVariant)};
  white-space: nowrap;
  flex-shrink: 0;
`;
