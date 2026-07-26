import styled from "styled-components";

export const SearchArea = styled.div`
  display: flex;
  align-items: center;
  margin: 18px 0;

  > input {
    width: min(100%, 420px);
  }
`;

export const ListShell = styled.section`
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
`;

export const ListHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 72px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-low);

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: 17px;
  font-weight: 700;
  line-height: 24px;
`;

export const SectionDescription = styled.p`
  margin: 3px 0 0;
  color: var(--color-text-dim);
  font-size: 13px;
  line-height: 20px;
`;

export const CountBadge = styled.span`
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  padding: 4px 10px;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas,
    monospace;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
`;

export const TableViewport = styled.div`
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-color: var(--color-border-soft) var(--color-surface-lowest);
`;

export const LotTable = styled.table`
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;

  th,
  td {
    padding: 13px 16px;
    border-bottom: 1px solid var(--color-surface-high);
    text-align: left;
    vertical-align: middle;
  }

  th {
    background: var(--color-surface-lowest);
    color: var(--color-text-muted);
    font-size: 12px;
    font-weight: 700;
    line-height: 18px;
    white-space: nowrap;
  }

  td {
    color: var(--color-text);
    font-size: 14px;
    line-height: 20px;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

export const LotRow = styled.tr`
  cursor: pointer;
  background: ${({ $selected }) =>
    $selected ? "rgba(75, 226, 119, 0.08)" : "transparent"};
  transition: background-color 140ms ease;

  td:first-child {
    box-shadow: inset 3px 0
      ${({ $selected }) => ($selected ? "var(--color-primary)" : "transparent")};
  }

  &:nth-child(even) {
    background: ${({ $selected }) =>
      $selected ? "rgba(75, 226, 119, 0.08)" : "rgba(6, 14, 32, 0.24)"};
  }

  &:hover {
    background: var(--color-surface-high);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }
`;

export const LotNumber = styled.strong`
  color: var(--color-text);
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas,
    monospace;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
`;

export const ProductName = styled.strong`
  display: block;
  color: var(--color-text);
  font-size: 13px;
  font-weight: 600;
  line-height: 19px;
`;

export const SecondaryText = styled.span`
  display: block;
  margin-top: 2px;
  color: var(--color-text-dim);
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas,
    monospace;
  font-size: 11px;
  line-height: 17px;
`;

export const QuantityGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas,
    monospace;
  font-size: 13px;
  font-variant-numeric: tabular-nums;

  > * + *::before {
    margin-right: 7px;
    color: var(--color-text-dim);
    content: "/";
  }
`;

export const GoodQuantity = styled.span`
  color: var(--color-primary);
`;

export const DefectQuantity = styled.span`
  color: var(--color-danger);
`;

export const DetailLoading = styled.div`
  display: grid;
  min-height: 160px;
  place-items: center;
  margin-top: 20px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: 14px;
`;

export const DetailPanel = styled.section`
  min-width: 0;
  margin-top: 20px;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface-low);

  @media (max-width: 720px) {
    padding: 16px;
  }
`;

export const DetailHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);

  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }
`;

export const DetailTitle = styled.div`
  min-width: 0;
`;

export const DetailEyebrow = styled.span`
  display: block;
  margin-bottom: 6px;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 18px;
`;

export const TitleLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;

  h2 {
    margin: 0;
    color: var(--color-text);
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas,
      monospace;
    font-size: clamp(21px, 2.4vw, 26px);
    line-height: 34px;
  }
`;

export const DetailContext = styled.p`
  margin: 6px 0 0;
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 21px;
`;

export const CloseButton = styled.button`
  min-height: 38px;
  flex: 0 0 auto;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.article`
  min-width: 0;
  min-height: 100px;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);

  span {
    display: block;
    color: var(--color-text-dim);
    font-size: 12px;
    font-weight: 700;
    line-height: 18px;
  }

  strong {
    display: block;
    margin-top: 10px;
    overflow-wrap: anywhere;
    color: ${({ $tone }) =>
      $tone === "success"
        ? "var(--color-primary)"
        : $tone === "danger"
          ? "var(--color-danger)"
          : "var(--color-text)"};
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas,
      monospace;
    font-size: clamp(18px, 2vw, 22px);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 28px;
  }
`;

export const InfoStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface-lowest);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  min-width: 0;
  padding: 13px 16px;
  border-right: 1px solid var(--color-border);

  &:last-child {
    border-right: 0;
  }

  span {
    display: block;
    color: var(--color-text-dim);
    font-size: 11px;
    font-weight: 700;
    line-height: 17px;
  }

  strong {
    display: block;
    margin-top: 4px;
    color: var(--color-text);
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas,
      monospace;
    font-size: 13px;
    font-weight: 600;
    line-height: 19px;
  }

  @media (max-width: 760px) {
    border-right: 0;
    border-bottom: 1px solid var(--color-border);

    &:last-child {
      border-bottom: 0;
    }
  }
`;

export const DetailSection = styled.section`
  min-width: 0;
  margin-top: 20px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
`;

export const SectionHeading = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 70px;
  padding: 13px 16px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-lowest);

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
`;

export const ProcessTableViewport = styled.div`
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
`;

export const ProcessTable = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 14px;
    border-bottom: 1px solid var(--color-surface-high);
    text-align: left;
    vertical-align: middle;
  }

  th {
    background: var(--color-surface-low);
    color: var(--color-text-muted);
    font-size: 11px;
    font-weight: 700;
    line-height: 17px;
    white-space: nowrap;
  }

  td {
    color: var(--color-text);
    font-size: 13px;
    line-height: 19px;
  }

  tbody tr:nth-child(even) {
    background: rgba(6, 14, 32, 0.24);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

export const ProcessIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  > span {
    display: inline-flex;
    width: 30px;
    height: 30px;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    border: 1px solid rgba(75, 226, 119, 0.34);
    border-radius: 50%;
    background: rgba(75, 226, 119, 0.1);
    color: var(--color-primary);
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas,
      monospace;
    font-size: 11px;
    font-weight: 700;
  }

  strong,
  small {
    display: block;
  }

  strong {
    color: var(--color-text);
    font-size: 13px;
    line-height: 19px;
  }

  small {
    margin-top: 1px;
    color: var(--color-text-dim);
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas,
      monospace;
    font-size: 10px;
    line-height: 16px;
  }
`;

export const UsageLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.55fr);
  gap: 16px;

  > ${DetailSection} {
    margin-top: 20px;
  }

  @media (max-width: 1050px) {
    grid-template-columns: 1fr;
  }
`;

export const MaterialTableViewport = styled.div`
  min-width: 0;
  overflow-x: auto;
`;

export const MaterialTable = styled.table`
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 14px;
    border-bottom: 1px solid var(--color-surface-high);
    text-align: left;
    vertical-align: middle;
  }

  th {
    background: var(--color-surface-low);
    color: var(--color-text-muted);
    font-size: 11px;
    font-weight: 700;
    line-height: 17px;
    white-space: nowrap;
  }

  td {
    color: var(--color-text);
    font-size: 13px;
    line-height: 19px;
  }

  tbody tr:nth-child(even) {
    background: rgba(6, 14, 32, 0.24);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

export const FormCard = styled.section`
  min-width: 0;
  align-self: start;
  margin-top: 20px;
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
`;

export const FormTitle = styled.h3`
  margin: 0;
  color: var(--color-text);
  font-size: 17px;
  line-height: 24px;
`;

export const FormDescription = styled.p`
  margin: 5px 0 0;
  color: var(--color-text-dim);
  font-size: 12px;
  line-height: 19px;
`;

export const UsageForm = styled.form`
  display: grid;
  gap: 14px;
  margin-top: 18px;

  > button {
    width: 100%;
    margin-top: 2px;
  }
`;

export const FormField = styled.label`
  display: grid;
  min-width: 0;
  gap: 7px;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;

  select,
  input {
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

  select:focus-visible,
  input:focus-visible {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(75, 226, 119, 0.14);
  }
`;

export const StatusMessage = styled.p`
  margin: 14px 0 0;
  padding: 10px 11px;
  border: 1px solid
    ${({ $error }) =>
      $error ? "rgba(255, 180, 171, 0.34)" : "rgba(75, 226, 119, 0.28)"};
  border-radius: 4px;
  background: ${({ $error }) =>
    $error ? "rgba(147, 0, 10, 0.16)" : "rgba(75, 226, 119, 0.08)"};
  color: ${({ $error }) =>
    $error ? "var(--color-danger)" : "var(--color-primary)"};
  font-size: 12px;
  line-height: 18px;
`;

export const EmptyContent = styled.p`
  margin: 0;
  padding: 28px 16px;
  color: var(--color-text-muted);
  font-size: 13px;
  line-height: 20px;
  text-align: center;
`;
