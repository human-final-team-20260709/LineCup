import styled from 'styled-components';

const badge = {
  success: { color: '#4be277', bg: 'rgba(75, 226, 119, 0.12)', border: 'rgba(75, 226, 119, 0.32)' },
  warning: { color: '#ffb95f', bg: 'rgba(255, 185, 95, 0.14)', border: 'rgba(255, 185, 95, 0.34)' },
  danger: { color: '#ff8a83', bg: 'rgba(255, 138, 131, 0.14)', border: 'rgba(255, 138, 131, 0.34)' },
};

export const PageSection = styled.div`
  padding: 16px;
`;

export const Toolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 1fr) auto auto;
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

  svg {
    width: 16px;
    height: 16px;
    color: #bccbb9;
  }
`;

export const FilterButton = styled.button`
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #222a3d;
  color: #dae2fd;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: #4be277;
    color: #6bff8f;
  }
`;

export const BomContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 0.82fr) minmax(620px, 1.5fr);
  gap: 16px;
  align-items: start;
`;

export const Panel = styled.section`
  min-height: 560px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
  overflow: hidden;
`;

export const PanelHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  min-height: 72px;
  padding: 14px 16px;
  border-bottom: 1px solid #334155;
  background: #131b2e;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  color: #dae2fd;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
`;

export const SectionCaption = styled.p`
  margin: 4px 0 0;
  color: #869585;
  font-size: 12px;
  line-height: 16px;
`;

export const HeaderMeta = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  padding: 0 8px;
  border: 1px solid #3d4a3d;
  border-radius: 9999px;
  color: #bccbb9;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
`;

export const ProductEditButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid #3d4a3d;
  border-radius: 4px;
  background: #222a3d;
  color: #dae2fd;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    border-color: #4be277;
    color: #6bff8f;
  }

  &:focus-visible {
    outline: 2px solid #4be277;
    outline-offset: 2px;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const ProductList = styled.div`
  display: grid;
`;

export const ProductItem = styled.button`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  width: 100%;
  gap: 12px;
  min-height: 92px;
  padding: 14px 16px;
  border-top: 1px solid #222a3d;
  border-left: 3px solid ${({ $active }) => ($active ? '#4be277' : 'transparent')};
  background: ${({ $active }) => ($active ? '#222a3d' : 'transparent')};
  color: inherit;
  text-align: left;
  cursor: pointer;

  &:first-child {
    border-top: 0;
  }

  &:hover {
    background: #222a3d;
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${({ $active }) => ($active ? '#4be277' : '#869585')};
  }
`;

export const ProductName = styled.strong`
  display: block;
  color: #dae2fd;
  font-size: 14px;
  line-height: 20px;
`;

export const ProductMeta = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  color: #869585;
  font-size: 12px;
  line-height: 16px;
`;

export const ProductCode = styled.span`
  color: #bccbb9;
  font-family: 'JetBrains Mono', monospace;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 22px;
  padding: 0 8px;
  border: 1px solid ${({ $tone }) => (badge[$tone] || badge.success).border};
  border-radius: 9999px;
  background: ${({ $tone }) => (badge[$tone] || badge.success).bg};
  color: ${({ $tone }) => (badge[$tone] || badge.success).color};
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`;

export const PanelBody = styled.div`
  padding: 16px;
`;

export const MaterialSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 16px;
`;

export const SummaryCard = styled.article`
  padding: 12px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
`;

export const SummaryLabel = styled.span`
  display: block;
  color: #869585;
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const SummaryValue = styled.strong`
  display: block;
  margin-top: 8px;
  color: #dae2fd;
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
`;

export const TableWrap = styled.div`
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
  overflow: hidden;
`;

export const BomTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid #222a3d;
    text-align: left;
    font-size: 13px;
    line-height: 18px;
    white-space: nowrap;
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

  tbody tr:hover {
    background: #222a3d;
  }

  td:first-child,
  td:nth-child(4),
  td:nth-child(6) {
    color: #dae2fd;
    font-family: 'JetBrains Mono', monospace;
  }

  td:nth-child(3) {
    color: #bccbb9;
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
    color: #ffb95f;
  }

  strong {
    color: #dae2fd;
    font-size: 18px;
  }

  p {
    max-width: 440px;
    margin: 8px 0 0;
    color: #869585;
    font-size: 14px;
    line-height: 20px;
  }
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 24px;
  background: rgba(6, 14, 32, 0.78);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);

  @media (max-width: 640px) {
    align-items: flex-end;
    padding: 12px;
  }
`;

export const ModalPanel = styled.section`
  display: flex;
  flex-direction: column;
  width: min(1120px, calc(100vw - 48px));
  max-height: min(90vh, 920px);
  max-height: min(90dvh, 920px);
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
  color: #dae2fd;
  overflow: hidden;
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.42);

  @media (max-width: 640px) {
    width: 100%;
    max-height: calc(100dvh - 24px);
  }
`;

export const ModalHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid #334155;
  background: #131b2e;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  color: #dae2fd;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
`;

export const ModalBody = styled.div`
  min-height: 0;
  overflow-y: auto;
  padding: 18px 20px;
  overscroll-behavior: contain;

  @media (max-width: 640px) {
    padding: 14px;
  }
`;

export const ModalSection = styled.section`
  border: 1px solid #334155;
  border-radius: 4px;
  background: #131b2e;

  & + & {
    margin-top: 16px;
  }
`;

export const ModalSectionHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #334155;
  background: #060e20;

  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column;

    > button {
      width: 100%;
    }
  }
`;

export const ModalSectionTitle = styled.h4`
  margin: 0;
  color: #dae2fd;
  font-size: 15px;
  font-weight: 700;
  line-height: 20px;
`;

export const ModalSectionDescription = styled.p`
  margin: 4px 0 0;
  color: #869585;
  font-size: 12px;
  line-height: 16px;
`;

export const ModalCloseButton = styled.button`
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

export const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 16px;
`;

export const ModalField = styled.div`
  display: grid;
  grid-column: ${({ $wide }) => ($wide ? '1 / -1' : 'auto')};
  gap: 6px;

  label {
    color: #bccbb9;
    font-size: 11px;
    font-weight: 700;
    line-height: 16px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
`;

export const ModalInput = styled.input`
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

  &:read-only {
    background: #131b2e;
    color: #869585;
    cursor: not-allowed;
  }
`;

export const ModalSelect = styled.select`
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

export const ModalTextarea = styled.textarea`
  min-height: 72px;
  resize: vertical;
  padding: 10px 12px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #dae2fd;
  font-size: 13px;
  line-height: 20px;
  outline: none;

  &::placeholder {
    color: #869585;
  }

  &:focus {
    border-color: #4be277;
  }
`;

export const MaterialTableWrap = styled.div`
  margin: 16px 16px 0;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
  overflow-x: auto;
`;

export const MaterialInputTable = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;

  th,
  td {
    padding: 8px;
    border-bottom: 1px solid #222a3d;
    text-align: left;
  }

  th {
    background: #060e20;
    color: #bccbb9;
    font-size: 11px;
    font-weight: 700;
    line-height: 16px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  tbody tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.025);
  }
`;

export const TableInput = styled.input`
  width: 100%;
  min-height: 32px;
  padding: 0 8px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #dae2fd;
  font-size: 12px;
  outline: none;

  &::placeholder {
    color: #869585;
  }

  &:focus {
    border-color: #4be277;
  }
`;

export const TableSelect = styled.select`
  width: 100%;
  min-height: 32px;
  padding: 0 8px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;
  color: #dae2fd;
  font-size: 12px;
  outline: none;

  &:focus {
    border-color: #4be277;
  }
`;

export const TableRowActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 32px;
  padding: 0 8px;
  border: 1px solid rgba(255, 138, 131, 0.34);
  border-radius: 4px;
  background: rgba(255, 138, 131, 0.1);
  color: #ffb4ae;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    border-color: #ff8a83;
    background: rgba(255, 138, 131, 0.18);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const MaterialTableActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 16px 0;
`;

export const AddRowButton = styled.button`
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid #3d4a3d;
  border-radius: 4px;
  background: #222a3d;
  color: #dae2fd;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: #4be277;
    color: #6bff8f;
  }
`;

export const ResetRowsButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 12px;
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

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const ModalNotice = styled.p`
  margin: 12px 16px 16px;
  padding: 12px;
  border: 1px solid rgba(255, 185, 95, 0.3);
  border-radius: 4px;
  background: rgba(255, 185, 95, 0.08);
  color: #ffddb8;
  font-size: 12px;
  line-height: 18px;
`;

export const ModalActions = styled.footer`
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px 20px;
  border-top: 1px solid #222a3d;
`;

export const ModalButton = styled.button`
  min-width: 88px;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid ${({ $primary }) => ($primary ? '#4be277' : '#334155')};
  border-radius: 4px;
  background: ${({ $primary }) => ($primary ? '#4be277' : '#222a3d')};
  color: ${({ $primary }) => ($primary ? '#003915' : '#dae2fd')};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: ${({ $primary }) => ($primary ? '#6bff8f' : '#4be277')};
  }
`;

export const BomPageContent = styled.div`
  display: grid;
  gap: 24px;
`;

export const BomActionBar = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 20px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);

  @media (max-width: 640px) {
    align-items: stretch;
    flex-direction: column;

    > button {
      width: 100%;
    }
  }
`;

export const BomActionCopy = styled.div`
  display: grid;
  gap: 4px;

  strong {
    color: var(--color-text);
    font-size: 16px;
    line-height: 22px;
  }

  span {
    color: var(--color-text-muted);
    font-size: 13px;
    line-height: 20px;
  }
`;

export const StatusMessage = styled.p`
  margin: -8px 0 0;
  padding: 12px 14px;
  border: 1px solid rgba(75, 226, 119, 0.3);
  border-radius: 4px;
  background: rgba(75, 226, 119, 0.08);
  color: var(--color-primary);
  font-size: 13px;
  line-height: 20px;
`;

export const BomForm = styled.form`
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;

  input,
  select {
    width: 100%;
    min-width: 0;
    min-height: 42px;
    box-sizing: border-box;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    outline: 0;
    background: var(--color-surface-lowest);
    color: var(--color-text);
    padding: 9px 10px;
    font-size: 14px;
  }

  select {
    padding-right: 34px;
  }

  input:hover,
  select:hover {
    border-color: var(--color-border-soft);
  }

  input:focus-visible,
  select:focus-visible {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(75, 226, 119, 0.14);
  }

  input:disabled,
  select:disabled {
    cursor: not-allowed;
    opacity: 0.62;
  }
`;

export const BomInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;
  padding: 16px;
`;

export const BomField = styled.label`
  display: grid;
  grid-column: span ${({ $span }) => $span || 3};
  min-width: 0;
  align-content: start;
  gap: 7px;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 700;
  line-height: 18px;

  @media (max-width: 1180px) {
    grid-column: span 6;
  }

  @media (max-width: 720px) {
    grid-column: 1 / -1;
  }
`;

export const MaterialRows = styled.div`
  display: grid;
  gap: 14px;
  padding: ${({ $modal }) => ($modal ? '16px' : '0')};

  @media (max-width: 640px) {
    padding: ${({ $modal }) => ($modal ? '12px' : '0')};
  }
`;

export const MaterialRow = styled.article`
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface-low);
`;

export const MaterialRowHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-surface-high);
`;

export const MaterialIndex = styled.strong`
  color: var(--color-text);
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 13px;
  line-height: 20px;
`;

export const RowDeleteButton = styled.button`
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  padding: 7px 12px;
  border: 1px solid rgba(255, 138, 131, 0.34);
  border-radius: 4px;
  background: rgba(255, 138, 131, 0.08);
  color: #ffb4ae;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  white-space: nowrap;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: #ff8a83;
    background: rgba(255, 138, 131, 0.16);
  }

  &:focus-visible {
    outline: 2px solid #ff8a83;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.42;
  }
`;

export const MaterialFields = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px 16px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const MaterialField = styled.label`
  display: grid;
  min-width: 0;
  align-content: start;
  gap: 7px;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
`;

export const BomListSection = styled.section`
  display: grid;
  gap: 14px;
`;

export const BomListHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;

  h2 {
    margin: 0;
    color: var(--color-text);
    font-size: 20px;
    line-height: 28px;
  }

  p {
    margin: 4px 0 0;
    color: var(--color-text-muted);
    font-size: 13px;
    line-height: 20px;
  }
`;

export const BomListCount = styled.span`
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 12px;
  line-height: 18px;
`;

export const BomTableShell = styled.div`
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
`;

export const BomTableViewport = styled.div`
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-color: var(--color-border-soft) var(--color-surface-lowest);
`;

export const BomOverviewTable = styled.table`
  width: 100%;
  min-width: 780px;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 16px;
    border-bottom: 1px solid var(--color-surface-high);
    text-align: left;
    vertical-align: middle;
  }

  th {
    background: var(--color-surface-low);
    color: var(--color-text-muted);
    font-size: 12px;
    font-weight: 700;
    line-height: 18px;
    white-space: nowrap;
  }

  th:first-child {
    width: 26%;
  }

  th:nth-child(2) {
    width: 26%;
  }

  th.status-column {
    width: 120px;
  }

  th.material-column {
    width: 170px;
  }

  th.action-column {
    width: 142px;
  }

  tbody tr {
    transition: background-color 140ms ease;
  }

  tbody tr:nth-child(even) {
    background: rgba(6, 14, 32, 0.24);
  }

  tbody tr:hover {
    background: var(--color-surface-high);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

export const CellPrimary = styled.strong`
  display: block;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
`;

export const CellSecondary = styled.span`
  display: block;
  margin-top: 4px;
  color: var(--color-text-muted);
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 11px;
  line-height: 17px;
`;

export const MaterialPreviewButton = styled.button`
  display: inline-flex;
  min-width: 126px;
  min-height: 40px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 11px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface-lowest);
  color: var(--color-text);
  cursor: pointer;

  strong {
    font-size: 12px;
    line-height: 18px;
    white-space: nowrap;
  }

  span {
    color: var(--color-primary);
    font-size: 11px;
    font-weight: 700;
    line-height: 16px;
    white-space: nowrap;
  }

  &:hover {
    border-color: var(--color-primary);
    background: rgba(75, 226, 119, 0.08);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: max-content;
  white-space: nowrap;

  button {
    min-width: 56px;
    min-height: 36px;
    padding: 7px 11px;
    font-size: 12px;
    white-space: nowrap;
  }
`;

export const ModalErrorMessage = styled.p`
  margin: 0 0 14px;
  padding: 11px 12px;
  border: 1px solid rgba(255, 138, 131, 0.34);
  border-radius: 4px;
  background: rgba(255, 138, 131, 0.1);
  color: #ffb4ae;
  font-size: 12px;
  line-height: 18px;
`;

export const BomDetailSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const BomDetailSummaryItem = styled.article`
  display: grid;
  min-width: 0;
  align-content: start;
  gap: 5px;
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface-low);

  > span:first-child {
    color: var(--color-text-muted);
    font-size: 11px;
    font-weight: 700;
    line-height: 16px;
  }

  > strong {
    overflow: hidden;
    color: var(--color-text);
    font-size: 14px;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  > small {
    overflow: hidden;
    color: var(--color-text-muted);
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
    font-size: 11px;
    line-height: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  > span:not(:first-child) {
    justify-self: start;
  }
`;

export const BomDetailTableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
`;

export const BomDetailTable = styled.table`
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;

  th,
  td {
    padding: 11px 12px;
    border-bottom: 1px solid var(--color-surface-high);
    text-align: left;
    vertical-align: middle;
  }

  th {
    background: var(--color-surface-lowest);
    color: var(--color-text-muted);
    font-size: 11px;
    font-weight: 700;
    line-height: 17px;
    white-space: nowrap;
  }

  td {
    color: var(--color-text);
    font-size: 12px;
    line-height: 18px;
  }

  th:first-child {
    width: 22%;
  }

  th:nth-child(2) {
    width: 17%;
  }

  th:nth-child(3) {
    width: 17%;
  }

  th:nth-child(4),
  th:nth-child(5) {
    width: 12%;
  }

  tbody tr:nth-child(even) {
    background: rgba(6, 14, 32, 0.24);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;
