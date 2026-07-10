import styled from 'styled-components';
import { Link } from 'react-router-dom';

const colors = {
  background: '#0b1326',
  surfaceLowest: '#060e20',
  surfaceLow: '#131b2e',
  surface: '#171f33',
  surfaceHigh: '#222a3d',
  surfaceHighest: '#2d3449',
  border: '#334155',
  text: '#dae2fd',
  textMuted: '#bccbb9',
  primary: '#4be277',
};

export const PageShell = styled.main`
  min-height: 100vh;
  box-sizing: border-box;
  background: ${colors.background};
  color: ${colors.text};
  padding: 32px;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const PageHeader = styled.header`
  width: 100%;
  max-width: 720px;
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
    font-size: clamp(30px, 4vw, 42px);
    font-weight: 700;
    line-height: 48px;
    letter-spacing: -0.02em;
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

export const Card = styled.section`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
  padding: 32px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  h2 {
    margin: 4px 0 0;
    font-size: 28px;
    font-weight: 600;
    line-height: 36px;
  }

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const Badge = styled.span`
  width: fit-content;
  border-radius: 9999px;
  background: rgba(75, 226, 119, 0.16);
  color: ${colors.primary};
  padding: 4px 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
`;

export const Form = styled.form`
  display: grid;
  gap: 20px;
`;

export const Field = styled.div`
  display: grid;
  gap: 8px;
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
  background: ${colors.surfaceLowest};
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

export const HelperText = styled.span`
  color: ${colors.textMuted};
  font-size: 14px;
  line-height: 20px;
`;

export const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Button = styled.button`
  width: 100%;
  min-height: 60px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surfaceHigh};
  color: ${colors.text};
  padding: 0 18px;
  font-size: 19px;
  font-weight: 700;
  line-height: 24px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    border-color: ${colors.primary};
    background: ${colors.surfaceHighest};
  }
`;
