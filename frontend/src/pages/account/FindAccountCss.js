import styled from 'styled-components';
import { Link } from 'react-router-dom';

const colors = {
  background: '#0b1326',
  surfaceLow: '#131b2e',
  surface: '#171f33',
  surfaceHigh: '#222a3d',
  surfaceHighest: '#2d3449',
  border: '#334155',
  text: '#dae2fd',
  textMuted: '#bccbb9',
  primary: '#4be277',
  primaryText: '#003915',
};

export const PageShell = styled.main`
  min-height: 100vh;
  background: ${colors.background};
  color: ${colors.text};
  padding: 40px 32px;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const PageHeader = styled.header`
  width: 100%;
  max-width: 760px;
  margin: 0 auto 18px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceLow};
  padding: 22px 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  h1 {
    margin: 8px 0;
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: ${colors.textMuted};
    font-size: 14px;
    line-height: 22px;
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
  min-height: 42px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceHigh};
  color: ${colors.text};
  text-decoration: none;
  padding: 0 14px;
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
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
`;

export const FindCard = styled.section`
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
  padding: 32px;
  box-sizing: border-box;
  min-height: 420px;
  display: grid;
  align-content: center;
  gap: 28px;

  @media (max-width: 768px) {
    padding: 24px;
    min-height: auto;
  }
`;

export const ModeSwitch = styled.div`
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(180px, 1fr);
  border: 1px solid ${colors.border};
  border-radius: 4px;
  overflow: hidden;
  width: 100%;

  @media (max-width: 520px) {
    width: 100%;
    display: grid;
    grid-auto-flow: row;
  }
`;

export const ModeButton = styled.button`
  min-height: 54px;
  border: 0;
  border-left: 1px solid ${colors.border};
  background: ${({ $active }) => ($active ? colors.surfaceHighest : colors.surfaceLow)};
  color: ${({ $active }) => ($active ? colors.primary : colors.textMuted)};
  padding: 0 22px;
  font-size: 17px;
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
  gap: 22px;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
`;

export const Field = styled.div`
  display: grid;
  gap: 10px;
`;

export const Label = styled.label`
  color: ${colors.text};
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`;

export const Input = styled.input`
  width: 100%;
  min-height: 58px;
  box-sizing: border-box;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: #060e20;
  color: ${colors.text};
  padding: 12px 16px;
  font: inherit;
  font-size: 18px;
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
  justify-content: stretch;
`;

export const Button = styled.button`
  width: 100%;
  min-height: 60px;
  border: 1px solid ${colors.primary};
  border-radius: 4px;
  background: ${colors.primary};
  color: ${colors.primaryText};
  padding: 0 28px;
  font-size: 19px;
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

export const ResultArea = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: #060e20;
  box-sizing: border-box;
  padding: 18px;
  display: grid;
  gap: 12px;
`;

export const ResultValue = styled.div`
  width: 100%;
  min-height: 56px;
  box-sizing: border-box;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceLow};
  color: ${colors.text};
  padding: 12px 16px;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  display: flex;
  align-items: center;
`;

export const ResultText = styled.span`
  color: ${colors.textMuted};
  font-size: 15px;
  line-height: 22px;
`;
