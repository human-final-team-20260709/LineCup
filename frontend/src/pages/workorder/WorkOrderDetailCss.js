import styled, { css, keyframes } from 'styled-components';

/* =========================================================
 * DESIGN.md ("Kinetic Industrial") 디자인 토큰 — 이 페이지 전용 로컬 선언
 * ========================================================= */
const colors = {
  surface: '#0b1326',
  surfaceContainerLowest: '#060e20',
  surfaceContainerLow: '#131b2e',
  surfaceContainer: '#171f33',
  surfaceContainerHigh: '#222a3d',
  onSurface: '#dae2fd',
  onSurfaceVariant: '#bccbb9',
  outline: '#869585',
  outlineVariant: '#3d4a3d',
  primary: '#4be277',
  onPrimary: '#003915',
  secondary: '#ffb95f',
  onSecondary: '#472a00',
  tertiary: '#ffb4ae',
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
  dataLg: css`
    font-family: ${font.mono};
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
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

export const tokens = { colors, hexToRgba, typography, radius, spacing };

/* =========================================================
 * 애니메이션 (List 페이지와 동일한 모션 언어)
 * ========================================================= */
const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
`;

const pulseDot = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
`;

const dashOffset = keyframes`
  from { stroke-dashoffset: 220; }
  to { stroke-dashoffset: 0; }
`;

/* =========================================================
 * Layout
 * ========================================================= */
export const Page = styled.div`
  width: 100%;
  min-width: 0;
  min-height: 100vh;
  background: ${colors.surface};
  color: ${colors.onSurface};
  padding: clamp(20px, 3vw, 40px);
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  animation: ${fadeSlideUp} 0.4s ease both;

  @media (max-width: 640px) {
    padding: ${spacing.md};
    gap: ${spacing.md};
  }
`;

export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  ${typography.bodySm};
  color: ${colors.onSurfaceVariant};
  background: none;
  border: none;
  cursor: pointer;
  width: fit-content;
  text-decoration: none;

  &:hover {
    color: ${colors.onSurface};
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${spacing.md};
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  flex-wrap: wrap;
`;

export const Code = styled.span`
  ${typography.dataSm};
  color: ${colors.onSurfaceVariant};
  padding: 4px 8px;
  background: ${colors.surfaceContainerHigh};
  border-radius: ${radius.DEFAULT};
`;

export const Title = styled.h1`
  ${typography.headlineMd};
  margin: 0;
`;

export const OrderCode = styled.p`
  margin: ${spacing.md} 0 2px;
  font-family: ${font.mono};
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 700;
  line-height: 1.2;
  color: ${colors.onSurface};
  letter-spacing: -0.02em;
`;

export const HeaderMeta = styled.p`
  ${typography.bodySm};
  margin: 0;
  color: ${colors.onSurfaceVariant};
`;

export const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: ${radius.full};
  background: ${colors.primary};
  animation: ${pulseDot} 1.8s ease-in-out infinite;
`;

export const SparkWrap = styled.span`
  display: inline-flex;
  line-height: 0;

  polyline,
  path {
    stroke-dasharray: 220;
    stroke-dashoffset: 220;
    animation: ${dashOffset} 0.9s ease forwards;
    animation-delay: 0.3s;
  }
`;

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  flex-wrap: wrap;
`;

/* =========================================================
 * 생산 수량 요약 (3.8 목표 수량 / 3.9 현재 생산 수량)
 * ========================================================= */
export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${spacing.md};

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div`
  background: ${colors.surfaceContainerLow};
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.md};
  padding: ${spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  opacity: 0;
  animation: ${fadeSlideUp} 0.4s ease both;
  animation-delay: ${({ $delay }) => $delay || 0}ms;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: ${({ $accent }) => $accent || colors.primary};
    box-shadow: inset 0 0 0 1px ${({ $accent }) => hexToRgba($accent || colors.primary, 0.3)};
  }
`;

export const SummaryCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.sm};
`;

export const SummaryIcon = styled.span`
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: ${radius.full};
  color: ${({ $color }) => $color || colors.primary};
  background: ${({ $color }) => hexToRgba($color || colors.primary, 0.12)};

  svg {
    width: 17px;
    height: 17px;
  }
`;

export const SummaryProgressCard = styled(SummaryCard)`
  grid-column: span 2;
  justify-content: center;

  @media (max-width: 900px) {
    grid-column: span 2;
  }
`;

export const SummaryLabel = styled.span`
  ${typography.labelCaps};
  color: ${colors.onSurfaceVariant};
`;

export const SummaryValue = styled.span`
  ${typography.dataLg};
  text-transform: none;
  color: ${({ $color }) => $color || colors.onSurface};
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

export const SummaryUnit = styled.span`
  ${typography.dataSm};
  text-transform: none;
  color: ${colors.onSurfaceVariant};
`;

export const SummaryCaption = styled.span`
  ${typography.bodySm};
  color: ${colors.onSurfaceVariant};
`;

/* =========================================================
 * Progress Bar (요약 카드의 목표 대비 진행률에 사용)
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
 * 독립 설비별 공정 진행 현황 (3.5~3.6)
 * ========================================================= */
export const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${spacing.md};

  @media (max-width: 1240px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const ProcessCard = styled.div`
  min-height: 126px;
  background: ${colors.surfaceContainerLow};
  border: 1px solid ${({ $active }) => ($active ? colors.primary : colors.outlineVariant)};
  border-radius: ${radius.md};
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0;
  animation: ${fadeSlideUp} 0.4s ease both;
  animation-delay: ${({ $delay }) => $delay || 0}ms;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-shadow: ${({ $active }) =>
    $active ? `inset 0 0 0 1px ${hexToRgba(colors.primary, 0.24)}` : 'none'};

  &:hover {
    border-color: ${colors.primary};
    box-shadow: inset 0 0 0 1px ${hexToRgba(colors.primary, 0.3)};
  }
`;

export const ProcessCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${spacing.md};
`;

export const ProcessIdentity = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

export const ProcessMode = styled.span`
  ${typography.labelCaps};
  color: ${colors.primary};
`;

export const ProcessName = styled.span`
  ${typography.bodyLg};
  font-weight: 600;
  color: ${colors.onSurface};
`;

export const ProcessQtyRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${spacing.sm};

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

export const ProcessQtyBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding: 10px;
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.DEFAULT};
  background: ${colors.surfaceContainerLowest};
`;

export const ProcessQtyLabel = styled.span`
  ${typography.labelCaps};
  color: ${colors.onSurfaceVariant};
`;

export const ProcessQtyValue = styled.span`
  font-family: ${font.mono};
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
  text-transform: none;
  color: ${({ $alert }) => ($alert ? colors.tertiary : colors.onSurface)};
`;

export const ProcessEquipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.sm};
  padding: 12px 14px;
  border-top: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.DEFAULT};
  background: ${colors.surfaceContainerHigh};

  > div {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  strong {
    ${typography.bodySm};
    overflow: hidden;
    color: ${colors.onSurface};
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ProcessEquipLabel = styled.span`
  ${typography.labelCaps};
  color: ${colors.onSurfaceVariant};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const OverallProgressCard = styled.div`
  display: grid;
  grid-template-columns: auto minmax(160px, 1fr) auto;
  align-items: center;
  gap: ${spacing.md};
  margin-top: ${spacing.sm};
  padding: 12px ${spacing.md};
  background: ${colors.surfaceContainerLow};
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.md};

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    gap: ${spacing.sm};
  }
`;

export const OverallProgressLabel = styled.span`
  ${typography.bodySm};
  font-weight: 600;
  color: ${colors.onSurface};
  white-space: nowrap;
`;

export const OverallProgressValue = styled.div`
  display: grid;
  justify-items: end;
  gap: 2px;

  strong {
    font-family: ${font.mono};
    font-size: 18px;
    color: ${colors.primary};
  }

  span {
    ${typography.dataSm};
    text-transform: none;
    color: ${colors.onSurfaceVariant};
  }

  @media (max-width: 680px) {
    justify-items: start;
  }
`;

/* =========================================================
 * 기본 정보 / 지시자 / 설비 카드
 * ========================================================= */
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: ${spacing.lg};

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: ${colors.surfaceContainer};
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.lg};
  padding: ${spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  opacity: 0;
  animation: ${fadeSlideUp} 0.45s ease both;
  animation-delay: ${({ $delay }) => $delay || 0}ms;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: ${colors.outline};
  }
`;

export const SectionCard = styled(Card).attrs({ as: 'section' })`
  min-width: 0;
  gap: 0;
`;

export const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.md};
  flex-wrap: wrap;
  margin-top: ${({ $spaced }) => ($spaced ? spacing.sm : 0)};

  > svg {
    color: ${colors.primary};
    flex: 0 0 auto;
  }
`;

export const CardTitle = styled.h2`
  ${typography.headlineSm};
  margin: 0;
`;

export const CardDescription = styled.p`
  ${typography.bodySm};
  max-width: 760px;
  margin: 6px 0 0;
  color: ${colors.onSurfaceVariant};
`;

export const LinkButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  ${typography.dataSm};
  text-transform: none;
  font-weight: 600;
  color: ${colors.primary};
  background: ${hexToRgba(colors.primary, 0.08)};
  border: 1px solid ${hexToRgba(colors.primary, 0.4)};
  border-radius: ${radius.DEFAULT};
  padding: 4px 8px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: ${hexToRgba(colors.primary, 0.16)};
    border-color: ${colors.primary};
  }
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px ${spacing.lg};
  border-top: 1px solid ${colors.outlineVariant};
  border-bottom: 1px solid ${colors.outlineVariant};

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.md};
  min-width: 0;
  padding: 10px 0;

  &:nth-child(-n + 6) {
    border-bottom: 1px solid ${colors.outlineVariant};
  }

  @media (max-width: 760px) {
    &:not(:last-child) {
      border-bottom: 1px solid ${colors.outlineVariant};
    }
  }
`;

export const InfoLabel = styled.span`
  ${typography.bodySm};
  color: ${colors.onSurfaceVariant};
`;

export const InfoValue = styled.span`
  ${({ $mono }) => ($mono ? typography.dataSm : typography.bodySm)};
  text-transform: none;
  color: ${colors.onSurface};
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;
  text-align: right;
  overflow-wrap: anywhere;
`;

export const RemarkBox = styled.div`
  ${typography.bodySm};
  display: grid;
  gap: 4px;
  color: ${colors.onSurfaceVariant};
  background: ${colors.surfaceContainerLow};
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.DEFAULT};
  padding: ${spacing.sm} ${spacing.md};

  strong {
    color: ${colors.onSurface};
  }
`;

export const TargetEditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const TargetInput = styled.input`
  width: 100px;
  padding: 4px 8px;
  ${typography.dataSm};
  text-transform: none;
  color: ${colors.onSurface};
  background: ${colors.surfaceContainerLow};
  border: 1px solid ${colors.primary};
  border-radius: ${radius.DEFAULT};
  outline: none;
`;

export const ControlForm = styled.form`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns || 'minmax(0, 1fr) auto'};
  align-items: end;
  gap: ${spacing.sm};
  margin-top: auto;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;

    > button {
      width: 100%;
    }
  }
`;

export const Field = styled.label`
  display: grid;
  gap: 6px;
  min-width: 0;

  > span {
    ${typography.labelCaps};
    color: ${colors.onSurfaceVariant};
  }
`;

const formControl = css`
  width: 100%;
  min-width: 0;
  padding: 9px 11px;
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.DEFAULT};
  outline: none;
  background: ${colors.surfaceContainerLow};
  color: ${colors.onSurface};
  ${typography.bodySm};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px ${hexToRgba(colors.primary, 0.14)};
  }
`;

export const Input = styled.input`
  ${formControl};
  font-family: ${font.mono};
  font-variant-numeric: tabular-nums;
`;

export const Select = styled.select`
  ${formControl};
`;

export const Textarea = styled.textarea`
  ${formControl};
  min-height: 112px;
  resize: vertical;
`;

export const AssignedWorkerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${spacing.sm};

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const AssignedWorkerCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.DEFAULT};
  background: ${colors.surfaceContainerLow};
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${colors.outline};
    background: ${colors.surfaceContainerHigh};
  }

  > svg {
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
    color: ${colors.primary};
  }

  > span {
    display: grid;
    min-width: 0;
    gap: 2px;
  }

  strong {
    ${typography.bodySm};
    color: ${colors.onSurface};
  }
`;

export const WorkerMeta = styled.span`
  ${typography.dataSm};
  text-transform: none;
  color: ${colors.onSurfaceVariant};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const WorkerFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.md};
  margin-top: ${spacing.md};

  > span {
    ${typography.bodySm};
    color: ${colors.onSurfaceVariant};
  }

  @media (max-width: 480px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

/* =========================================================
 * Status Badge
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
  warning: css`
    background: ${colors.secondary};
    color: ${colors.onSecondary};
    border: 1px solid ${colors.secondary};
    &:hover {
      filter: brightness(1.06);
    }
  `,
};

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: ${({ $size }) => ($size === 'sm' ? '6px 8px' : '8px 16px')};
  border-radius: ${radius.DEFAULT};
  cursor: pointer;
  white-space: nowrap;
  font-weight: 600;
  ${typography.bodySm};
  transition: filter 0.15s ease, background 0.15s ease;

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

export const StatusMessage = styled.p`
  ${typography.bodySm};
  margin: 0;
  padding: 10px 12px;
  color: ${colors.onSurface};
  background: ${hexToRgba(colors.primary, 0.1)};
  border: 1px solid ${hexToRgba(colors.primary, 0.35)};
  border-radius: ${radius.DEFAULT};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${spacing.md};
  margin-bottom: ${spacing.md};

  > svg {
    color: ${colors.onSurfaceVariant};
  }
`;

export const SectionTitle = styled.h2`
  ${typography.headlineSm};
  margin: 0;
  color: ${colors.onSurface};
`;

export const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  background: ${colors.surfaceContainerLow};
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.lg};
`;

export const Table = styled.table`
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  ${typography.bodySm};

  th,
  td {
    padding: 12px ${spacing.md};
    text-align: left;
    border-bottom: 1px solid ${colors.outlineVariant};
  }

  th {
    ${typography.labelCaps};
    color: ${colors.onSurfaceVariant};
    background: ${colors.surfaceContainer};
  }

  td {
    color: ${colors.onSurface};
  }

  tbody tr {
    transition: background 0.15s ease;
  }

  tbody tr:hover {
    background: ${colors.surfaceContainerHigh};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  td:first-child {
    font-family: ${font.mono};
    font-size: 12px;
    white-space: nowrap;
  }
`;

export const EmptyCard = styled.div`
  ${typography.bodySm};
  padding: ${spacing.lg};
  color: ${colors.onSurfaceVariant};
  text-align: center;
  background: ${colors.surfaceContainerLow};
  border: 1px dashed ${colors.outlineVariant};
  border-radius: ${radius.md};
`;

/* =========================================================
 * Empty State
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
 * 데이터 있음/없음 데모 토글 (상태 변경 이력 모달에서 사용)
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
 * Modal Base
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
  color: ${colors.onSurface};
`;

export const ModalPanel = styled.div`
  width: 100%;
  max-width: ${({ $width }) => $width || '480px'};
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  background: ${colors.surfaceContainer};
  border: 1px solid ${colors.outlineVariant};
  border-radius: ${radius.lg};
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
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.sm};
  padding: ${spacing.md} ${spacing.lg};
  border-top: 1px solid ${colors.outlineVariant};
  flex-shrink: 0;

  @media (max-width: 480px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const ModalSelectionCount = styled.span`
  ${typography.bodySm};
  color: ${colors.onSurfaceVariant};
`;

export const ModalFieldMeta = styled.span`
  && {
    ${typography.bodySm};
    color: ${({ $error }) => ($error ? colors.tertiary : colors.onSurfaceVariant)};
    letter-spacing: normal;
    text-transform: none;
  }
`;

/* =========================================================
 * 상태 변경 이력 모달 (3.4)
 * ========================================================= */
export const HistoryToolRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${spacing.md};
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HistoryItem = styled.div`
  display: flex;
  gap: ${spacing.sm};
  padding: ${spacing.sm} 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${colors.outlineVariant};
  }
`;

export const HistoryDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  margin-top: 6px;
  flex-shrink: 0;
`;

export const HistoryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const HistoryTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${typography.bodySm};

  span {
    ${typography.dataSm};
    text-transform: none;
    color: ${colors.onSurfaceVariant};
  }
`;

export const HistoryEventLabel = styled.strong`
  color: ${({ $color }) => $color};
`;

export const HistoryNote = styled.p`
  ${typography.bodySm};
  color: ${colors.onSurfaceVariant};
  margin: 0;
`;

/* =========================================================
 * 지시자 배정 모달 (3.7)
 * ========================================================= */
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
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${spacing.sm};
  max-height: 440px;
  overflow-y: auto;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const PickerRow = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: 10px 12px;
  border-radius: ${radius.DEFAULT};
  border: 1px solid ${({ $active }) => ($active ? colors.primary : colors.outlineVariant)};
  background: ${({ $active }) => ($active ? colors.surfaceContainerHigh : 'transparent')};
  color: ${colors.onSurface};
  text-align: left;
  font: inherit;
  cursor: pointer;

  &:hover {
    background: ${colors.surfaceContainerHigh};
  }
`;

export const PickerCheck = styled.span`
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ $active }) => ($active ? colors.primary : colors.outline)};
  border-radius: 3px;
  background: ${({ $active }) => ($active ? colors.primary : 'transparent')};
  color: ${colors.onPrimary};
  flex: 0 0 auto;

  svg {
    width: 13px;
    height: 13px;
    stroke-width: 3;
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

/* =========================================================
 * 작업 시작/보류/완료 확인 모달
 * ========================================================= */
export const ConfirmText = styled.p`
  ${typography.bodyLg};
  margin: 0 0 8px 0;
`;

export const ConfirmSub = styled.p`
  ${typography.bodySm};
  color: ${colors.onSurfaceVariant};
  margin: 0 0 ${spacing.md};
`;
