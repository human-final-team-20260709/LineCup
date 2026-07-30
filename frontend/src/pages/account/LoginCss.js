import styled from 'styled-components';
import { Link } from 'react-router-dom';

const colors = {
  background: '#0b1326',
  surfaceLow: '#131b2e',
  surface: '#171f33',
  surfaceHigh: '#222a3d',
  surfaceHighest: '#2d3449',
  border: '#334155',
  borderSoft: '#3d4a3d',
  text: '#dae2fd',
  textMuted: '#bccbb9',
  primary: '#4be277',
  primaryText: '#003915',
  secondary: '#ffb95f',
  secondaryText: '#472a00',
};

export const AuthShell = styled.main`
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;
  background: ${colors.background};
  color: ${colors.text};
  padding: 32px;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  display: grid;
  place-items: center;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const LoginLayout = styled.section`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(360px, 0.88fr);
  gap: 24px;
  align-items: stretch;
  max-width: 1080px;
  margin: 0 auto;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    max-width: 680px;
  }
`;

export const PageIntro = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceLow};
  padding: clamp(28px, 4vw, 40px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 420px;

  @media (max-width: 860px) {
    min-height: auto;
  }
`;

export const SectionLabel = styled.span`
  display: block;
  color: ${colors.primary};
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const PageTitle = styled.h1`
  margin: 16px 0 10px;
  font-size: clamp(36px, 5vw, 52px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
`;

export const MutedText = styled.p`
  max-width: 620px;
  margin: 6px 0 0;
  color: ${colors.textMuted};
  font-size: 16px;
  line-height: 26px;
`;

export const FeatureList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 28px;
`;

export const FeatureChip = styled.span`
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
  color: ${colors.text};
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
`;

export const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 24px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricItem = styled.div`
  border: 1px solid
    ${({ $tone }) => ($tone === 'primary' ? colors.primary : colors.border)};
  border-radius: 4px;
  background: ${colors.surface};
  padding: 12px;

  span {
    display: block;
    color: ${colors.textMuted};
    font-size: 11px;
    font-weight: 700;
    line-height: 16px;
    letter-spacing: 0.1em;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: ${({ $tone }) =>
      $tone === 'secondary' ? colors.secondary : colors.text};
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
  }
`;

export const AuthCard = styled.section`
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
  padding: clamp(28px, 4vw, 40px);
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  h2 {
    margin: 4px 0 0;
    font-size: clamp(24px, 3vw, 30px);
    font-weight: 600;
    line-height: 1.3;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FieldGrid = styled.div`
  display: grid;
  gap: 16px;
`;

export const Field = styled.div`
  display: grid;
  gap: 8px;
`;

export const Label = styled.label`
  color: ${colors.text};
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

export const Input = styled.input`
  width: 100%;
  min-height: 50px;
  box-sizing: border-box;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: #060e20;
  color: ${colors.text};
  padding: 10px 12px;
  font: inherit;
  outline: none;

  &::placeholder {
    color: #869585;
  }

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(75, 226, 119, 0.14);
  }
`;

export const Button = styled.button`
  min-height: 50px;
  border: 1px solid ${colors.primary};
  border-radius: 4px;
  background: ${colors.primary};
  color: ${colors.primaryText};
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #6bff8f;
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const HelperLinkGroup = styled.nav`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const ActionLink = styled(Link)`
  min-height: 44px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceHigh};
  color: ${colors.text};
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    border-color: ${colors.primary};
    background: ${colors.surfaceHighest};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

export const PanelGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.6fr);
  gap: 16px;
  max-width: 1180px;
  margin: 16px auto 0;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.section`
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
  padding: 16px;

  h3 {
    margin: 4px 0 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }
`;

export const ActivityHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const SwitchGroup = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(88px, 1fr));
  border: 1px solid ${colors.border};
  border-radius: 4px;
  overflow: hidden;
`;

export const SwitchButton = styled.button`
  border: 0;
  background: ${({ $active }) => ($active ? colors.surfaceHighest : colors.surfaceLow)};
  color: ${({ $active }) => ($active ? colors.primary : colors.textMuted)};
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  cursor: pointer;

  & + & {
    border-left: 1px solid ${colors.border};
  }
`;

export const StatusTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  font-size: 14px;
  line-height: 20px;

  th,
  td {
    padding: 8px;
    border-bottom: 1px solid ${colors.borderSoft};
    text-align: left;
    vertical-align: middle;
  }

  th {
    color: ${colors.textMuted};
    font-size: 11px;
    font-weight: 700;
    line-height: 16px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  tbody tr:nth-child(odd) {
    background: rgba(45, 52, 73, 0.35);
  }

  td:first-child,
  td:last-child {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  }
`;

export const Badge = styled.span`
  min-height: 24px;
  border-radius: 9999px;
  background: ${({ $tone }) =>
    $tone === 'secondary' ? 'rgba(255, 185, 95, 0.16)' : 'rgba(75, 226, 119, 0.16)'};
  color: ${({ $tone }) => ($tone === 'secondary' ? colors.secondary : colors.primary)};
  padding: 3px 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
`;

export const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: ${colors.primary};
`;

export const EmptyState = styled.div`
  min-height: 152px;
  border: 1px dashed ${colors.border};
  border-radius: 4px;
  background: #060e20;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 16px;
  color: ${colors.textMuted};

  strong {
    color: ${colors.text};
    font-size: 16px;
    line-height: 24px;
  }

  span {
    font-size: 14px;
    line-height: 20px;
  }
`;

export const TextButton = styled.button`
  width: 100%;
  min-height: 42px;
  margin-top: 12px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceHigh};
  color: ${colors.text};
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 12px;

  &:hover {
    border-color: ${colors.primary};
  }
`;
