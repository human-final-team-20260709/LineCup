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

export const ClickableCellButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;

  &:hover {
    color: #6bff8f;
    text-decoration: underline;
    text-underline-offset: 3px;
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
  padding: 32px;
  background: rgba(6, 14, 32, 0.78);
`;

export const ModalPanel = styled.section`
  display: flex;
  flex-direction: column;
  width: min(1000px, 90vw);
  max-height: 85vh;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
  color: #dae2fd;
  overflow: hidden;
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
  overflow-y: auto;
  padding: 18px 20px;
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
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #334155;
  background: #060e20;
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

export const MaterialEditOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1010;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: rgba(6, 14, 32, 0.78);
`;

export const MaterialEditModal = styled.section`
  display: flex;
  flex-direction: column;
  width: min(820px, 90vw);
  max-height: 85vh;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
  color: #dae2fd;
  overflow: hidden;
`;

export const MaterialEditHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid #334155;
  background: #131b2e;
`;

export const MaterialEditTitle = styled.h3`
  margin: 0;
  color: #dae2fd;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
`;

export const MaterialEditDescription = styled.p`
  margin: 4px 0 0;
  color: #869585;
  font-size: 12px;
  line-height: 16px;
`;

export const MaterialEditCloseButton = styled.button`
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

export const MaterialEditBody = styled.div`
  overflow-y: auto;
  padding: 18px 20px;
`;

export const MaterialEditSection = styled.section`
  border: 1px solid #334155;
  border-radius: 4px;
  background: #131b2e;

  & + & {
    margin-top: 16px;
  }
`;

export const MaterialEditSectionTitle = styled.h4`
  margin: 0;
  padding: 14px 16px;
  border-bottom: 1px solid #334155;
  background: #060e20;
  color: #dae2fd;
  font-size: 15px;
  font-weight: 700;
  line-height: 20px;
`;

export const MaterialInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 16px;
`;

export const ReadonlyInfoBox = styled.div`
  min-height: 72px;
  padding: 12px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #060e20;

  span {
    display: block;
    color: #869585;
    font-size: 11px;
    font-weight: 700;
    line-height: 16px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 8px;
    color: #dae2fd;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    line-height: 20px;
  }
`;

export const EditFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 16px;
`;

export const EditFormField = styled.div`
  display: grid;
  grid-column: ${({ $wide }) => ($wide ? '1 / -1' : 'auto')};
  gap: 6px;
`;

export const EditFormLabel = styled.label`
  color: #bccbb9;
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const EditTextInput = styled.input`
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

export const EditSelectInput = styled.select`
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

export const EditTextArea = styled.textarea`
  min-height: 88px;
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

export const MaterialEditNotice = styled.p`
  margin: 0 16px 16px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 185, 95, 0.3);
  border-radius: 4px;
  background: rgba(255, 185, 95, 0.08);
  color: #ffddb8;
  font-size: 12px;
  line-height: 18px;
`;

export const MaterialEditFooter = styled.footer`
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px 20px;
  border-top: 1px solid #222a3d;
`;

export const MaterialEditCancelButton = styled.button`
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

export const MaterialEditSaveButton = styled.button`
  min-width: 104px;
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
