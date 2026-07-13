import styled from 'styled-components';

const colors = {
  surfaceLowest: '#060e20',
  surface: '#171f33',
  surfaceHigh: '#222a3d',
  border: '#334155',
  text: '#dae2fd',
  textMuted: '#bccbb9',
  primary: '#4be277',
  error: '#ffb4ab',
  info: '#ffb95f',
};

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(6, 14, 32, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const ModalCard = styled.div`
  width: min(420px, 100%);
  border: 1px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.surface};
  color: ${colors.text};
  padding: 24px;
  position: relative;
  display: grid;
  gap: 12px;

  > button:first-child {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    border: 1px solid ${colors.border};
    border-radius: 4px;
    background: ${colors.surfaceHigh};
    color: ${colors.text};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
  }

  p {
    margin: 0;
    color: ${colors.textMuted};
    font-size: 14px;
    line-height: 20px;
  }
`;

export const ModalIcon = styled.span`
  width: 40px;
  height: 40px;
  border: 1px solid
    ${({ $tone }) =>
      $tone === 'error' ? 'rgba(255, 180, 171, 0.32)' : 'rgba(75, 226, 119, 0.32)'};
  border-radius: 9999px;
  background: ${({ $tone }) =>
    $tone === 'error'
      ? 'rgba(255, 180, 171, 0.12)'
      : $tone === 'info'
        ? 'rgba(255, 185, 95, 0.12)'
        : 'rgba(75, 226, 119, 0.12)'};
  color: ${({ $tone }) =>
    $tone === 'error' ? colors.error : $tone === 'info' ? colors.info : colors.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
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
  line-height: 20px;
  cursor: pointer;

  &:hover {
    border-color: ${colors.primary};
    background: ${colors.surfaceLowest};
  }
`;
