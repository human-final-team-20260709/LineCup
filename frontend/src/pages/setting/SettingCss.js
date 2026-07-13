import styled, { css } from 'styled-components';

const colors = {
  background: '#0b1326',
  surfaceLowest: '#060e20',
  surfaceLow: '#131b2e',
  surface: '#171f33',
  surfaceHigh: '#222a3d',
  surfaceHighest: '#2d3449',
  border: '#3d4a3d',
  text: '#dae2fd',
  textMuted: '#bccbb9',
  outline: '#869585',
  primary: '#4be277',
  primaryText: '#003915',
  warning: '#ffb95f',
  error: '#ffb4ab',
};

export const PageShell = styled.main`
  min-height: 100vh;
  padding: 32px;
  background: ${colors.background};
  color: ${colors.text};
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  @media (max-width: 768px) { padding: 20px 16px; }
`;

export const PageHeader = styled.header`
  width: min(1440px, 100%);
  margin: 0 auto 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 680px) { flex-direction: column; }
`;

export const SectionLabel = styled.span`
  display: block;
  color: ${colors.primary};
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.1em;
`;

export const PageTitle = styled.h1`
  margin: 6px 0 4px;
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 700;
  line-height: 56px;
  letter-spacing: -0.02em;
`;

export const PageDescription = styled.p`
  margin: 0;
  color: ${colors.textMuted};
  font-size: 15px;
  line-height: 24px;
`;

export const SystemBadge = styled.span`
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border: 1px solid ${colors.primary};
  border-radius: 4px;
  background: rgba(75, 226, 119, 0.08);
  color: ${colors.primary};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  white-space: nowrap;
`;

export const SummaryGrid = styled.section`
  width: min(1440px, 100%);
  margin: 0 auto 20px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 960px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

export const SummaryCard = styled.article`
  min-height: 98px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
`;

export const SummaryIcon = styled.span`
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  place-items: center;
  border: 1px solid ${({ $tone }) => $tone === 'warning' ? colors.warning : $tone === 'neutral' ? colors.outline : colors.primary};
  border-radius: 4px;
  background: ${({ $tone }) => $tone === 'warning' ? 'rgba(255,185,95,.09)' : $tone === 'neutral' ? colors.surfaceHigh : 'rgba(75,226,119,.08)'};
  color: ${({ $tone }) => $tone === 'warning' ? colors.warning : $tone === 'neutral' ? colors.textMuted : colors.primary};
  svg { width: 20px; height: 20px; }
`;

export const SummaryLabel = styled.span`
  display: block;
  color: ${colors.textMuted};
  font-size: 12px;
  line-height: 18px;
`;

export const SummaryValue = styled.strong`
  display: block;
  margin-top: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: 500;
  line-height: 30px;
`;

export const ActionNotice = styled.div`
  width: min(1440px, 100%);
  min-height: 44px;
  margin: 0 auto 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid ${colors.primary};
  border-radius: 4px;
  background: rgba(75, 226, 119, 0.08);
  color: ${colors.text};
  font-size: 13px;
  line-height: 20px;
  > svg { color: ${colors.primary}; }
  span { flex: 1; }
  button { padding: 4px; background: transparent; color: ${colors.textMuted}; cursor: pointer; }
`;

export const SectionCard = styled.section`
  width: min(1440px, 100%);
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
`;

export const SectionHeading = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid ${colors.border};
  h2 { margin: 4px 0 0; font-size: 20px; line-height: 28px; }
  @media (max-width: 650px) { align-items: stretch; flex-direction: column; }
`;

export const SegmentedControl = styled.div`
  display: inline-flex;
  padding: 3px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceLow};
`;

export const StateButton = styled.button`
  min-height: 34px;
  padding: 0 12px;
  border: 0;
  border-radius: 2px;
  background: ${({ $active }) => $active ? colors.surfaceHighest : 'transparent'};
  color: ${({ $active }) => $active ? colors.text : colors.outline};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  ${({ $active }) => $active && css`box-shadow: inset 0 -2px ${colors.primary};`}
`;

export const Tabs = styled.div`
  display: flex;
  padding: 0 20px;
  gap: 22px;
  border-bottom: 1px solid ${colors.border};
`;

export const Tab = styled.button`
  min-height: 52px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-bottom: 2px solid ${({ $active }) => $active ? colors.primary : 'transparent'};
  background: transparent;
  color: ${({ $active }) => $active ? colors.text : colors.textMuted};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

export const Badge = styled.span`
  min-width: 22px;
  padding: 2px 6px;
  border-radius: 999px;
  background: ${({ $warning, $role }) => $warning ? 'rgba(255,185,95,.12)' : $role ? colors.surfaceHighest : 'rgba(75,226,119,.1)'};
  color: ${({ $warning }) => $warning ? colors.warning : colors.primary};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  line-height: 16px;
  text-align: center;
`;

export const ControlBar = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid ${colors.border};
  background: ${colors.surfaceLow};
  @media (max-width: 640px) { flex-direction: column; }
`;

export const SearchField = styled.label`
  width: min(420px, 100%);
  min-height: 42px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceLowest};
  color: ${colors.outline};
  &:focus-within { border-color: ${colors.primary}; }
  input { width: 100%; border: 0; outline: 0; background: transparent; color: ${colors.text}; font: inherit; font-size: 13px; }
  input::placeholder { color: ${colors.outline}; }
`;

export const FilterGroup = styled.div`display: flex; gap: 8px;`;

export const SelectField = styled.select`
  min-width: 132px;
  min-height: 42px;
  padding: 0 34px 0 12px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  outline: 0;
  background: ${colors.surfaceHigh};
  color: ${colors.text};
  font: inherit;
  font-size: 13px;
  &:focus { border-color: ${colors.primary}; }
`;

export const TableScroll = styled.div`overflow-x: auto;`;

export const Table = styled.table`
  width: 100%;
  min-width: 920px;
  border-collapse: collapse;
  th, td { padding: 12px 16px; border-bottom: 1px solid ${colors.border}; text-align: left; vertical-align: middle; }
  th { background: ${colors.surfaceLow}; color: ${colors.outline}; font-size: 11px; font-weight: 700; line-height: 16px; letter-spacing: .06em; }
  td { color: ${colors.text}; font-size: 13px; line-height: 20px; }
  tbody tr:nth-child(even) { background: rgba(34, 42, 61, .34); }
  tbody tr:hover { background: ${colors.surfaceHigh}; }
  tbody tr:last-child td { border-bottom: 0; }
  .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
`;

export const UserIdentity = styled.div`min-width: 220px;`;
export const ApprovalUser = styled(UserIdentity)`min-width: 260px;`;
export const UserName = styled.strong`display: block; font-size: 14px; line-height: 20px;`;
export const UserMeta = styled.span`
  display: block;
  margin-top: 2px;
  color: ${colors.textMuted};
  font-family: ${({ $mono }) => $mono ? "'JetBrains Mono', monospace" : 'inherit'};
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
`;
export const ApprovalMeta = styled(UserMeta)``;

export const RoleSelect = styled.select`
  min-height: 36px;
  padding: 0 30px 0 10px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  outline: 0;
  background: ${colors.surfaceLowest};
  color: ${colors.text};
  font: inherit;
  font-size: 12px;
  &:focus { border-color: ${colors.primary}; }
`;

export const StatusButton = styled.button`
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  gap: 7px;
  padding: 0 10px;
  border: 1px solid ${({ $active }) => $active ? 'rgba(75,226,119,.35)' : colors.border};
  border-radius: 4px;
  background: ${({ $active }) => $active ? 'rgba(75,226,119,.07)' : colors.surfaceHigh};
  color: ${({ $active }) => $active ? colors.primary : colors.textMuted};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

export const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $active }) => $active ? colors.primary : colors.outline};
`;

export const IconButton = styled.button`
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceHigh};
  color: ${({ $danger }) => $danger ? colors.error : colors.text};
  cursor: pointer;
  &:hover, &:focus-visible {
    border-color: ${({ $danger }) => $danger ? colors.error : colors.primary};
    color: ${({ $danger }) => $danger ? colors.error : colors.primary};
    outline: 0;
  }
`;

export const EmptyState = styled.div`
  min-height: 330px;
  padding: 48px 20px;
  display: grid;
  place-items: center;
  align-content: center;
  text-align: center;
  h3 { margin: 16px 0 6px; font-size: 18px; line-height: 24px; }
  p { max-width: 480px; margin: 0; color: ${colors.textMuted}; font-size: 13px; line-height: 20px; }
`;

export const EmptyStateIcon = styled.span`
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceHigh};
  color: ${colors.outline};
  svg { width: 24px; height: 24px; }
`;

export const ActionGroup = styled.div`display: flex; gap: 8px;`;

export const ActionButton = styled.button`
  min-height: 36px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid ${({ $approve, $danger }) => $danger ? colors.error : $approve ? colors.primary : colors.border};
  border-radius: 4px;
  background: ${({ $approve, $danger }) => $danger ? 'rgba(147, 0, 10, .28)' : $approve ? colors.primary : colors.surfaceHigh};
  color: ${({ $approve, $danger }) => $danger ? colors.error : $approve ? colors.primaryText : colors.text};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  &:hover { filter: brightness(1.08); }
  &:focus-visible { outline: 2px solid ${colors.primary}; outline-offset: 2px; }
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  padding: 20px;
  display: grid;
  place-items: center;
  background: rgba(6, 14, 32, .82);
`;

export const ModalCard = styled.section`
  width: min(640px, 100%);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
`;

export const ModalHeader = styled.header`
  padding: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid ${colors.border};
  h2 { margin: 4px 0; font-size: 20px; line-height: 28px; }
  p { margin: 0; color: ${colors.textMuted}; font-size: 13px; }
`;

export const ModalBody = styled.div`
  padding: 24px 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  > svg { width: 24px; height: 24px; flex: 0 0 24px; color: ${colors.error}; }
  strong { display: block; color: ${colors.text}; font-size: 16px; line-height: 24px; }
  p { margin: 8px 0 0; color: ${colors.textMuted}; font-size: 13px; line-height: 20px; }
`;

export const ModalFooter = styled.footer`
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid ${colors.border};
  background: ${colors.surfaceLow};
`;
