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
  error: '#ffb4ab',
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

export const FormLayout = styled.section`
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 380px);
  gap: 16px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const FormCard = styled.section`
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
  padding: 24px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
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

const controlStyle = `
  width: 100%;
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

export const Input = styled.input`
  min-height: 44px;
  ${controlStyle}
`;

export const Select = styled.select`
  min-height: 44px;
  ${controlStyle}
`;

export const TextArea = styled.textarea`
  min-height: 92px;
  resize: vertical;
  ${controlStyle}
`;

export const RadioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const RadioCard = styled.label`
  min-height: 128px;
  border: 1px solid ${({ $active }) => ($active ? colors.primary : colors.border)};
  border-radius: 4px;
  background: ${({ $active }) => ($active ? colors.surfaceHighest : colors.surfaceHigh)};
  padding: 12px;
  cursor: pointer;
  display: grid;
  gap: 8px;
  align-content: start;

  input {
    accent-color: ${colors.primary};
  }

  strong {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
  }

  span {
    color: ${colors.textMuted};
    font-size: 13px;
    line-height: 18px;
  }
`;

export const CheckboxGrid = styled.div`
  display: grid;
  gap: 8px;

  label {
    color: ${colors.textMuted};
    font-size: 14px;
    line-height: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  input {
    accent-color: ${colors.primary};
  }
`;

export const Button = styled.button`
  min-height: 46px;
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
`;

export const OutlineButton = styled.button`
  min-height: 40px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceHigh};
  color: ${colors.text};
  padding: 0 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: ${colors.primary};
  }
`;

export const SideStack = styled.aside`
  display: grid;
  gap: 16px;
  align-content: start;
`;

export const Panel = styled.section`
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

export const PreviewGrid = styled.div`
  display: grid;
  gap: 8px;
`;

export const SummaryItem = styled.div`
  border: 1px solid ${colors.borderSoft};
  border-radius: 4px;
  background: #060e20;
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
    margin-top: 4px;
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
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

export const EmptyState = styled.section`
  min-height: 132px;
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

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(6, 14, 32, 0.78);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 20;
`;

export const ModalCard = styled.section`
  width: min(420px, 100%);
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
  padding: 20px;
  position: relative;

  > button:first-child {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 34px;
    height: 34px;
    border: 1px solid ${colors.border};
    border-radius: 4px;
    background: ${colors.surfaceHigh};
    color: ${colors.text};
    cursor: pointer;
  }

  > svg {
    color: ${colors.primary};
    width: 32px;
    height: 32px;
  }

  h2 {
    margin: 12px 0 8px;
    font-size: 20px;
    line-height: 28px;
  }

  p {
    margin: 0;
    color: ${colors.textMuted};
    font-size: 14px;
    line-height: 20px;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;
