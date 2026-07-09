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
};

export const PageShell = styled.main`
  min-height: 100%;
  background: ${colors.background};
  color: ${colors.text};
  padding: 32px;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const PageHeader = styled.header`
  max-width: 1180px;
  margin: 0 auto 16px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceLow};
  padding: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  h1 {
    margin: 8px 0;
    font-size: clamp(30px, 5vw, 48px);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: ${colors.textMuted};
    font-size: 14px;
    line-height: 20px;
  }

  @media (max-width: 700px) {
    flex-direction: column;
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

export const TopLink = styled(Link)`
  min-height: 40px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceHigh};
  color: ${colors.text};
  text-decoration: none;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  white-space: nowrap;

  &:hover {
    border-color: ${colors.primary};
  }
`;

export const FindLayout = styled.section`
  max-width: 1180px;
  margin: 0 auto 16px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const FindCard = styled.section`
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
  padding: 24px;
`;

export const Panel = styled.section`
  max-width: 1180px;
  margin: 0 auto;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
  padding: 16px;

  h2 {
    margin: 4px 0 14px;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }
`;

export const ModeSwitch = styled.div`
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(120px, 1fr);
  border: 1px solid ${colors.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 18px;

  @media (max-width: 520px) {
    display: grid;
    grid-auto-flow: row;
  }
`;

export const ModeButton = styled.button`
  min-height: 40px;
  border: 0;
  border-left: 1px solid ${colors.border};
  background: ${({ $active }) => ($active ? colors.surfaceHighest : colors.surfaceLow)};
  color: ${({ $active }) => ($active ? colors.primary : colors.textMuted)};
  padding: 0 12px;
  font-size: 13px;
  font-weight: 700;
  line-height: 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:first-child {
    border-left: 0;
  }
`;

export const Form = styled.form`
  display: grid;
  gap: 18px;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
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
  min-height: 44px;
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
  }
`;

export const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Button = styled.button`
  min-height: 46px;
  border: 1px solid ${colors.primary};
  border-radius: 4px;
  background: ${colors.primary};
  color: ${colors.primaryText};
  padding: 0 18px;
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

  @media (max-width: 520px) {
    width: 100%;
  }
`;

export const StepList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StepItem = styled.div`
  border: 1px solid ${colors.borderSoft};
  border-radius: 4px;
  background: #060e20;
  padding: 12px;

  span {
    color: ${colors.secondary};
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
  }

  strong {
    display: block;
    margin-top: 6px;
    font-size: 16px;
    line-height: 24px;
  }

  p {
    margin: 4px 0 0;
    color: ${colors.textMuted};
    font-size: 13px;
    line-height: 18px;
  }
`;

export const ResultCard = styled.div`
  border: 1px solid ${colors.borderSoft};
  border-radius: 4px;
  background: #060e20;
  padding: 16px;
  display: grid;
  gap: 8px;

  strong {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 24px;
    font-weight: 500;
    line-height: 32px;
  }

  span {
    color: ${colors.textMuted};
    font-size: 14px;
    line-height: 20px;
  }
`;

export const EmptyState = styled.div`
  min-height: 154px;
  border: 1px dashed ${colors.border};
  border-radius: 4px;
  background: #060e20;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;

  strong {
    color: ${colors.text};
    font-size: 16px;
    line-height: 24px;
  }

  span {
    color: ${colors.textMuted};
    font-size: 14px;
    line-height: 20px;
  }
`;

export const StatusTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  line-height: 20px;

  th,
  td {
    padding: 8px;
    border-bottom: 1px solid ${colors.borderSoft};
    text-align: left;
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

  td:first-child {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  }
`;

export const Badge = styled.span`
  width: fit-content;
  border-radius: 9999px;
  background: ${({ $tone }) =>
    $tone === 'secondary' ? 'rgba(255, 185, 95, 0.16)' : 'rgba(75, 226, 119, 0.16)'};
  color: ${({ $tone }) => ($tone === 'secondary' ? colors.secondary : colors.primary)};
  padding: 3px 8px;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
`;
