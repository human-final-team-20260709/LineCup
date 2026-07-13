import styled from 'styled-components';

const badge = {
  success: { color: '#4be277', bg: 'rgba(75, 226, 119, 0.12)' },
  warning: { color: '#ffb95f', bg: 'rgba(255, 185, 95, 0.14)' },
  danger: { color: '#ff8a83', bg: 'rgba(255, 138, 131, 0.14)' },
};

const progressColor = {
  정상: '#4be277',
  주의: '#ffb95f',
  부족: '#ff8a83',
};

export const PageSection = styled.div`
  padding: 16px;
`;

export const Toolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 1fr) repeat(4, auto);
  gap: 8px;
  margin-bottom: 16px;
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #869585;
  font-size: 13px;
`;

export const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid ${({ $active }) => ($active ? '#4be277' : '#334155')};
  border-radius: 4px;
  background: ${({ $active }) => ($active ? '#172f2b' : '#222a3d')};
  color: ${({ $active }) => ($active ? '#6bff8f' : '#dae2fd')};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

export const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 16px;
`;

export const MetricCard = styled.article`
  padding: 14px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;

  span {
    color: #869585;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
  }

  strong {
    display: block;
    margin-top: 8px;
    color: #dae2fd;
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px;
  }
`;

export const InventoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

export const StockCard = styled.article`
  padding: 14px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;

  > strong {
    display: block;
    margin-top: 18px;
    color: #dae2fd;
    font-family: 'JetBrains Mono', monospace;
    font-size: 20px;
  }
`;

export const StockHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const StockName = styled.strong`
  display: block;
  color: #dae2fd;
  font-size: 14px;
`;

export const StockMeta = styled.span`
  display: block;
  margin-top: 4px;
  color: #869585;
  font-size: 12px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 9999px;
  background: ${({ $tone }) => (badge[$tone] || badge.success).bg};
  color: ${({ $tone }) => (badge[$tone] || badge.success).color};
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
`;

export const StockProgress = styled.div`
  height: 8px;
  margin-top: 14px;
  border-radius: 9999px;
  background: #060e20;
  overflow: hidden;
`;

export const StockProgressFill = styled.div`
  width: ${({ $value }) => `${$value}%`};
  height: 100%;
  background: ${({ $tone }) => progressColor[$tone] || '#4be277'};
`;

export const StockTable = styled.table`
  width: 100%;
  border: 1px solid #334155;
  border-radius: 4px;
  border-collapse: separate;
  overflow: hidden;
  background: #171f33;

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid #222a3d;
    text-align: left;
    font-size: 13px;
  }

  th {
    background: #060e20;
    color: #bccbb9;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  tbody tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.025);
  }
`;

export const Ledger = styled.section`
  display: grid;
  gap: 8px;
  margin-top: 16px;
`;

export const LedgerItem = styled.article`
  display: grid;
  grid-template-columns: 80px 80px minmax(0, 1fr) 140px 100px;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
  font-size: 13px;

  span,
  b {
    font-family: 'JetBrains Mono', monospace;
  }

  strong {
    color: #4be277;
  }

  em {
    color: #dae2fd;
    font-style: normal;
  }

  small {
    color: #869585;
  }
`;

export const EmptyState = styled.div`
  display: grid;
  place-items: center;
  min-height: 420px;
  padding: 48px;
  border: 1px dashed #3d4a3d;
  border-radius: 4px;
  background: #060e20;
  text-align: center;

  svg {
    width: 36px;
    height: 36px;
    margin-bottom: 16px;
    color: #bccbb9;
  }

  strong {
    color: #dae2fd;
    font-size: 18px;
  }

  p {
    max-width: 420px;
    margin: 8px 0 0;
    color: #869585;
    font-size: 14px;
    line-height: 20px;
  }
`;

export const ConditionSummaryBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding: 10px 12px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #131b2e;

  > span:first-child {
    color: #869585;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
`;

export const ConditionChip = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 8px;
  border: 1px solid rgba(75, 226, 119, 0.28);
  border-radius: 9999px;
  background: rgba(75, 226, 119, 0.1);
  color: #6bff8f;
  font-size: 12px;
  font-weight: 700;
`;

export const ConditionResetButton = styled.button`
  min-height: 28px;
  margin-left: auto;
  padding: 0 10px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #222a3d;
  color: #dae2fd;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: #ffb95f;
    color: #ffddb8;
  }
`;

export const InventoryEmptyState = styled(EmptyState)`
  min-height: 300px;
  margin-bottom: 16px;
`;

export const ConditionModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: rgba(6, 14, 32, 0.78);
`;

export const ConditionModal = styled.section`
  display: flex;
  flex-direction: column;
  width: min(780px, 90vw);
  max-height: 85vh;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
  color: #dae2fd;
  overflow: hidden;
`;

export const ConditionModalHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid #334155;
  background: #131b2e;
`;

export const ConditionModalTitle = styled.h3`
  margin: 0;
  color: #dae2fd;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
`;

export const ConditionModalDescription = styled.p`
  margin: 4px 0 0;
  color: #869585;
  font-size: 12px;
  line-height: 16px;
`;

export const ConditionModalCloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #222a3d;
  color: #bccbb9;
  cursor: pointer;

  &:hover {
    border-color: #ff8a83;
    color: #ffb4ae;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ConditionModalBody = styled.div`
  overflow-y: auto;
  padding: 20px;
`;

export const ConditionFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

export const ConditionField = styled.div`
  display: grid;
  grid-column: ${({ $wide }) => ($wide ? '1 / -1' : 'auto')};
  gap: 6px;
`;

export const ConditionLabel = styled.label`
  color: #bccbb9;
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const ConditionSelect = styled.select`
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #dae2fd;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #4be277;
  }
`;

export const ConditionInput = styled.input`
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #dae2fd;
  font-size: 13px;
  outline: none;

  &::placeholder {
    color: #869585;
  }

  &:focus {
    border-color: #4be277;
  }
`;

export const DateRangeGroup = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 8px;

  span {
    color: #869585;
    font-size: 13px;
  }
`;

export const ConditionModalFooter = styled.footer`
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px 20px;
  border-top: 1px solid #222a3d;
`;

export const ConditionCancelButton = styled.button`
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

export const ConditionClearButton = styled.button`
  min-width: 88px;
  min-height: 40px;
  margin-right: auto;
  padding: 0 16px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #bccbb9;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: #ffb95f;
    color: #ffddb8;
  }
`;

export const ConditionApplyButton = styled.button`
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
