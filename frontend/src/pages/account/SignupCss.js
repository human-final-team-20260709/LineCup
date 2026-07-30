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
  error: '#ffb4ab',
};

export const PageShell = styled.main`
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;
  box-sizing: border-box;
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
  max-width: 960px;
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

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

export const FormLayout = styled.section`
  max-width: 960px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
`;

export const FormCard = styled.section`
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
  padding: 28px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  min-width: 0;
  display: grid;
  gap: 8px;
  align-content: start;
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
    box-shadow: 0 0 0 2px rgba(75, 226, 119, 0.14);
  }
`;

export const Input = styled.input`
  min-height: 44px;
  ${controlStyle}
  border-color: ${({ $invalid }) => ($invalid ? colors.error : colors.border)};

  &:focus {
    border-color: ${({ $invalid }) => ($invalid ? colors.error : colors.primary)};
  }
`;

export const Select = styled.select`
  min-height: 44px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${controlStyle}
`;

export const ErrorText = styled.span`
  min-height: 18px;
  color: ${colors.error};
  font-size: 12px;
  line-height: 18px;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
`;

export const RadioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const RadioCard = styled.label`
  min-height: 116px;
  border: 1px solid ${({ $active }) => ($active ? colors.primary : colors.border)};
  border-radius: 4px;
  background: ${({ $active }) => ($active ? colors.surfaceHighest : colors.surfaceHigh)};
  padding: 14px;
  cursor: pointer;
  display: grid;
  gap: 8px;
  align-content: start;

  input {
    accent-color: ${colors.primary};
    width: 16px;
    height: 16px;
    margin: 0;
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

  &:focus-within {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

export const RadioHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
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

    &:focus-visible {
      outline: 2px solid ${colors.primary};
      outline-offset: 2px;
    }
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
