import styled from 'styled-components';

export const PaginationRoot = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: auto;
  padding: 14px 16px;
  border-top: 1px solid #334155;

  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const PaginationMeta = styled.span`
  color: #bccbb9;
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  overflow-x: auto;
`;

export const PageButton = styled.button`
  min-width: 34px;
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid ${({ $active }) => ($active ? '#4be277' : '#334155')};
  border-radius: 4px;
  outline: 0;
  background: ${({ $active }) => ($active ? 'rgba(75, 226, 119, 0.14)' : '#131b2e')};
  color: ${({ $active }) => ($active ? '#4be277' : '#dae2fd')};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: #4be277;
    background: rgba(75, 226, 119, 0.14);
    color: #4be277;
  }

  &:focus-visible {
    outline: 2px solid #4be277;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.42;
  }
`;
