import styled, { keyframes } from 'styled-components';

const slideFromRight = keyframes`
  from { opacity: 0; transform: translateX(32px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideFromLeft = keyframes`
  from { opacity: 0; transform: translateX(-32px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: rgba(6, 14, 32, 0.82);
  overflow-y: auto;
  overscroll-behavior: contain;

  @media (max-width: 720px) {
    align-items: flex-start;
    padding: 16px;
  }
`;

export const ModalPanel = styled.section`
  display: flex;
  flex-direction: column;
  width: min(880px, 94vw);
  height: min(760px, calc(100vh - 64px));
  height: min(760px, calc(100dvh - 64px));
  min-height: 0;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
  color: #dae2fd;
  overflow: hidden;

  @media (max-width: 720px) {
    width: 100%;
    height: calc(100vh - 32px);
    height: calc(100dvh - 32px);
  }
`;

export const ModalHeader = styled.header`
  display: flex;
  flex-shrink: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid #334155;
  background: #131b2e;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #dae2fd;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
`;

export const ModalDescription = styled.p`
  margin: 4px 0 0;
  color: #869585;
  font-size: 13px;
  line-height: 18px;
`;

export const StepProgress = styled.ol`
  display: grid;
  flex-shrink: 0;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
  padding: 14px 20px;
  border-bottom: 1px solid #334155;
  background: #060e20;
  list-style: none;
`;

export const StepItem = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ $active, $complete }) =>
    $active || $complete ? '#dae2fd' : '#869585'};
`;

export const StepBadge = styled.span`
  position: relative;
  z-index: 1;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid
    ${({ $active, $complete }) => ($active || $complete ? '#4be277' : '#3d4a3d')};
  border-radius: 9999px;
  background: ${({ $active, $complete }) =>
    $active || $complete ? 'rgba(75, 226, 119, 0.12)' : '#131b2e'};
  color: ${({ $active, $complete }) =>
    $active || $complete ? '#4be277' : '#869585'};
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
`;

export const StepLabel = styled.span`
  position: relative;
  z-index: 1;
  padding-right: 8px;
  background: #060e20;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;

  @media (max-width: 620px) {
    display: none;
  }
`;

export const StepConnector = styled.span`
  position: absolute;
  top: 50%;
  right: 8px;
  left: 36px;
  height: 1px;
  background: ${({ $complete }) => ($complete ? '#4be277' : '#334155')};
`;

export const ModalCloseButton = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #222a3d;
  color: #bccbb9;
  cursor: pointer;

  &:hover {
    border-color: #ff8a83;
    color: #ffb4ae;
  }

  &:focus-visible {
    outline: 2px solid #4be277;
    outline-offset: 2px;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ModalBody = styled.div`
  flex: 1 1 0;
  min-height: 0;
  display: grid;
  align-content: start;
  gap: 16px;
  padding: 18px 20px;
  overflow-y: scroll;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #3d4a3d transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 9999px;
    background: #3d4a3d;
    background-clip: padding-box;
  }
`;

export const StepViewport = styled.div`
  min-height: 100%;
  overflow: hidden;
`;

export const StepContent = styled.div`
  min-height: 100%;
`;

export const StepPanel = styled.div`
  display: ${({ $active }) => ($active ? 'grid' : 'none')};
  gap: 16px;
  animation: ${({ $direction }) =>
      $direction === 'backward' ? slideFromLeft : slideFromRight}
    180ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Section = styled.section`
  border: 1px solid #334155;
  border-radius: 4px;
  background: #131b2e;
  overflow: hidden;
`;

export const SectionHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid #334155;
  background: #060e20;
`;

export const SectionIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(75, 226, 119, 0.3);
  border-radius: 4px;
  background: rgba(75, 226, 119, 0.08);
  color: #4be277;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const SectionTitle = styled.h3`
  margin: 0;
  color: #dae2fd;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
`;

export const SectionDescription = styled.p`
  margin: 2px 0 0;
  color: #869585;
  font-size: 11px;
  line-height: 16px;
`;

export const MovementTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 16px;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const MovementTypeOption = styled.label`
  position: relative;
  cursor: pointer;

  > input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  > input:checked + div {
    border-color: #4be277;
    background: rgba(75, 226, 119, 0.1);
  }

  > input:focus-visible + div {
    outline: 2px solid #4be277;
    outline-offset: 2px;
  }
`;

export const MovementTypeContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 72px;
  padding: 12px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
  transition: border-color 150ms ease, background-color 150ms ease;

  > svg {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    color: ${({ $tone }) => ($tone === 'outbound' ? '#ffb95f' : '#4be277')};
  }

  span {
    display: grid;
    gap: 2px;
  }

  strong {
    color: #dae2fd;
    font-size: 14px;
    line-height: 20px;
  }

  small {
    color: #869585;
    font-size: 11px;
    line-height: 16px;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 16px;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: grid;
  grid-column: ${({ $wide }) => ($wide ? '1 / -1' : 'auto')};
  align-content: start;
  gap: 6px;
`;

export const FieldLabel = styled.label`
  color: #bccbb9;
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const RequiredMark = styled.span`
  color: #ffb95f;
`;

const fieldStyle = `
  width: 100%;
  min-height: 40px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #dae2fd;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #4be277;
  }

  &::placeholder {
    color: #869585;
  }
`;

export const TextInput = styled.input`
  ${fieldStyle}
  padding: 0 12px;
  color-scheme: dark;
`;

export const Select = styled.select`
  ${fieldStyle}
  padding: 0 12px;
`;

export const TextArea = styled.textarea`
  ${fieldStyle}
  min-height: 80px;
  padding: 10px 12px;
  resize: vertical;
  line-height: 20px;
`;

export const FieldGroup = styled.div`
  position: relative;

  > svg {
    position: absolute;
    top: 50%;
    left: 12px;
    z-index: 1;
    width: 15px;
    height: 15px;
    color: #869585;
    transform: translateY(-50%);
    pointer-events: none;
  }

  ${TextInput} {
    padding-left: 36px;
  }
`;

export const HelperText = styled.span`
  color: #869585;
  font-size: 11px;
  line-height: 16px;
`;

export const Notice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border: 1px solid rgba(255, 185, 95, 0.3);
  border-radius: 4px;
  background: rgba(255, 185, 95, 0.08);
  color: #ffddb8;
  font-size: 12px;
  line-height: 18px;

  > svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-top: 1px;
    color: #ffb95f;
  }

  span {
    display: grid;
    gap: 2px;
  }

  strong {
    color: #ffb95f;
  }
`;

export const ModalActions = styled.footer`
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px 20px;
  border-top: 1px solid #334155;
  background: #131b2e;
`;

export const SecondaryButton = styled.button`
  min-width: 88px;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #222a3d;
  color: #dae2fd;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: #4be277;
  }
`;

export const PrimaryButton = styled.button`
  min-width: 88px;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid #4be277;
  border-radius: 4px;
  background: #4be277;
  color: #003915;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: #6bff8f;
    background: #6bff8f;
  }
`;
