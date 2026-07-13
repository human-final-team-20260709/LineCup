import styled, { css } from 'styled-components';

const colors = {
  background: '#0b1326',
  lowest: '#060e20',
  low: '#131b2e',
  surface: '#171f33',
  high: '#222a3d',
  highest: '#2d3449',
  border: '#3d4a3d',
  text: '#dae2fd',
  muted: '#bccbb9',
  outline: '#869585',
  primary: '#4be277',
  primaryText: '#003915',
  warning: '#ffb95f',
  error: '#ffb4ab',
};

const focus = css`
  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

const toneColor = {
  primary: colors.primary,
  success: colors.primary,
  warning: colors.warning,
  neutral: colors.outline,
};

export const Page = styled.main`
  min-height: 100vh;
  padding: 32px;
  background: ${colors.background};
  color: ${colors.text};
  font-family: Inter, system-ui, sans-serif;

  *, *::before, *::after { box-sizing: border-box; }

  @media (max-width: 720px) { padding: 20px 16px; }
`;

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 20px;

  @media (max-width: 700px) { flex-direction: column; }
`;

export const TitleGroup = styled.div`
  h1 { margin: 6px 0 4px; font-size: 32px; line-height: 40px; }
  p { margin: 0; color: ${colors.muted}; font-size: 14px; line-height: 22px; }
`;

export const Eyebrow = styled.span`
  color: ${colors.primary};
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.1em;
`;

export const HeaderAction = styled.button`
  ${focus}
  min-height: 40px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid ${colors.primary};
  border-radius: 4px;
  background: ${colors.primary};
  color: ${colors.primaryText};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

export const Notice = styled.div`
  min-height: 44px;
  margin-bottom: 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(75, 226, 119, 0.42);
  border-radius: 4px;
  background: rgba(75, 226, 119, 0.08);
  font-size: 13px;
  line-height: 20px;

  > svg { color: ${colors.primary}; }
  span { flex: 1; }
  button { padding: 4px; border: 0; background: transparent; color: ${colors.muted}; cursor: pointer; }
`;

export const ControlBar = styled.section`
  padding: 12px;
  display: grid;
  grid-template-columns: minmax(260px, 1fr) auto auto;
  gap: 8px;
  margin-bottom: 16px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.low};

  @media (max-width: 850px) { grid-template-columns: 1fr; }
`;

export const SearchField = styled.label`
  min-height: 42px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.lowest};
  color: ${colors.outline};

  &:focus-within { border-color: ${colors.primary}; }
  input { width: 100%; border: 0; outline: 0; background: transparent; color: ${colors.text}; font: inherit; font-size: 13px; }
  input::placeholder { color: ${colors.outline}; }
`;

export const SelectField = styled.select`
  ${focus}
  min-width: 150px;
  min-height: 42px;
  padding: 0 34px 0 12px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.high};
  color: ${colors.text};
  font: inherit;
  font-size: 13px;
`;

export const DataStateControl = styled.div`
  display: inline-flex;
  padding: 3px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.lowest};
`;

export const StateButton = styled.button`
  ${focus}
  min-height: 34px;
  padding: 0 12px;
  border: 0;
  border-radius: 2px;
  background: ${({ $active }) => ($active ? colors.highest : 'transparent')};
  color: ${({ $active }) => ($active ? colors.text : colors.outline)};
  box-shadow: ${({ $active }) => ($active ? `inset 0 -2px ${colors.primary}` : 'none')};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

export const MetricGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

export const MetricCard = styled.article`
  min-height: 94px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
`;

export const MetricIcon = styled.span`
  width: 42px;
  height: 42px;
  display: grid;
  flex: 0 0 42px;
  place-items: center;
  border: 1px solid ${({ $tone }) => toneColor[$tone]};
  border-radius: 4px;
  background: ${({ $tone }) => `${toneColor[$tone]}14`};
  color: ${({ $tone }) => toneColor[$tone]};
`;

export const MetricLabel = styled.span`
  display: block;
  color: ${colors.muted};
  font-size: 12px;
  line-height: 18px;
`;

export const MetricValue = styled.strong`
  display: block;
  margin-top: 2px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  line-height: 30px;
`;

export const WorkerGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1180px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

export const WorkerCard = styled.article`
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${colors.border};
  border-top: 3px solid ${({ $tone }) => toneColor[$tone]};
  border-radius: 4px;
  background: ${colors.surface};
`;

export const CardHeader = styled.header`
  min-height: 76px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid ${colors.border};
`;

export const WorkerAvatar = styled.span`
  width: 42px;
  height: 42px;
  display: grid;
  flex: 0 0 42px;
  place-items: center;
  border: 1px solid rgba(75, 226, 119, 0.45);
  border-radius: 4px;
  background: rgba(75, 226, 119, 0.1);
  color: ${colors.primary};
  font-size: 16px;
  font-weight: 700;
`;

export const Identity = styled.div`
  min-width: 0;
  flex: 1;
  strong { display: block; font-size: 15px; line-height: 22px; }
  span { display: block; overflow: hidden; color: ${colors.muted}; font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 16px; text-overflow: ellipsis; white-space: nowrap; }
`;

export const StatusChip = styled.span`
  flex: 0 0 auto;
  padding: 3px 8px;
  border-radius: 999px;
  background: ${({ $tone }) => `${toneColor[$tone]}16`};
  color: ${({ $tone }) => toneColor[$tone]};
  font-size: 11px;
  font-weight: 700;
`;

export const CardBody = styled.div`
  min-height: 174px;
  padding: 14px;
  display: grid;
  gap: 14px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  > svg { flex: 0 0 auto; color: ${colors.outline}; }
`;

export const InfoLabel = styled.span`
  display: block;
  color: ${colors.outline};
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.04em;
`;

export const InfoValue = styled.strong`
  display: block;
  margin-top: 2px;
  color: ${colors.text};
  font-family: ${({ $mono }) => ($mono ? "'JetBrains Mono', monospace" : 'inherit')};
  font-size: 12px;
  line-height: 18px;
`;

export const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
`;

export const Skill = styled.span`
  padding: 3px 7px;
  border: 1px solid ${colors.border};
  border-radius: 3px;
  background: ${colors.high};
  color: ${colors.muted};
  font-size: 11px;
  line-height: 16px;
`;

export const CardFooter = styled.footer`
  min-height: 64px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid ${colors.border};
  background: ${colors.low};

  > div:first-child { margin-right: auto; }
  @media (max-width: 430px) { align-items: stretch; flex-direction: column; }
`;

export const StatusSelect = styled.select`
  ${focus}
  min-height: 34px;
  padding: 0 28px 0 9px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.lowest};
  color: ${colors.text};
  font-size: 11px;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 6px;
`;

export const ActionButton = styled.button`
  ${focus}
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.high};
  color: ${({ $danger }) => ($danger ? colors.error : colors.text)};
  cursor: pointer;

  &:hover { border-color: ${({ $danger }) => ($danger ? colors.error : colors.primary)}; }
`;

export const EmptyState = styled.section`
  min-height: 360px;
  padding: 48px 20px;
  display: grid;
  place-items: center;
  align-content: center;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
  text-align: center;

  > svg { width: 38px; height: 38px; color: ${colors.outline}; }
  h2 { margin: 16px 0 6px; font-size: 18px; line-height: 24px; }
  p { max-width: 480px; margin: 0; color: ${colors.muted}; font-size: 13px; line-height: 20px; }
`;

export const EmptyAction = styled.button`
  ${focus}
  min-height: 36px;
  margin-top: 16px;
  padding: 0 12px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.high};
  color: ${colors.text};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

export const EditorBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  padding: 20px;
  display: grid;
  place-items: center;
  background: rgba(6, 14, 32, 0.84);
`;

export const EditorDialog = styled.section`
  width: min(720px, 100%);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
  color: ${colors.text};
`;

export const EditorHeader = styled.header`
  padding: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid ${colors.border};

  h2 { margin: 4px 0; font-size: 22px; line-height: 30px; }
  p { margin: 0; color: ${colors.muted}; font-size: 13px; line-height: 20px; }
`;

export const EditorClose = styled.button`
  ${focus}
  width: 36px;
  height: 36px;
  display: grid;
  flex: 0 0 36px;
  place-items: center;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.high};
  color: ${colors.text};
  cursor: pointer;
`;

export const EditorBody = styled.div`
  padding: 20px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

export const FormField = styled.div`
  display: grid;
  align-content: start;
  gap: 7px;
  grid-column: ${({ $wide }) => ($wide ? '1 / -1' : 'auto')};
`;

export const FormLabel = styled.label`
  color: ${colors.muted};
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
`;

const formControl = css`
  ${focus}
  width: 100%;
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  outline: 0;
  background: ${colors.lowest};
  color: ${colors.text};
  font: inherit;
  font-size: 13px;

  &:focus { border-color: ${colors.primary}; }
`;

export const FormInput = styled.input`
  ${formControl}
  color-scheme: dark;
`;

export const FormSelect = styled.select`
  ${formControl}
  padding-right: 34px;
`;

export const FieldHint = styled.span`
  color: ${colors.outline};
  font-size: 11px;
  line-height: 16px;
`;

export const FormError = styled.p`
  margin: 14px 0 0;
  padding: 10px 12px;
  border: 1px solid rgba(255, 180, 171, 0.42);
  border-radius: 4px;
  background: rgba(147, 0, 10, 0.18);
  color: ${colors.error};
  font-size: 12px;
  line-height: 18px;
`;

export const EditorFooter = styled.footer`
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid ${colors.border};
  background: ${colors.low};
`;

export const FormButton = styled.button`
  ${focus}
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid ${({ $primary }) => ($primary ? colors.primary : colors.border)};
  border-radius: 4px;
  background: ${({ $primary }) => ($primary ? colors.primary : colors.high)};
  color: ${({ $primary }) => ($primary ? colors.primaryText : colors.text)};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;
