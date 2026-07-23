import styled from "styled-components";

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  min-height: calc(100dvh - 56px);
  padding: 48px 32px 48px 88px;
  overflow-x: clip;
  background: var(--color-bg);
  color: var(--color-text);

  @media (max-width: 720px) {
    min-height: calc(100dvh - 52px);
    padding: 32px 16px 32px 56px;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;

  h1 {
    margin: 0 0 6px;
    font-size: clamp(26px, 3vw, 32px);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  p {
    max-width: 760px;
    margin: 0;
    color: var(--color-text-muted);
    font-size: 14px;
    line-height: 22px;
  }

  @media (max-width: 720px) {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 22px;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 18px 0;

  @media (max-width: 560px) {
    align-items: stretch;
    gap: 10px;

    > input,
    > select {
      flex: 1 0 100%;
      width: 100%;
    }

    > button {
      flex: 0 0 auto;
    }
  }
`;

export const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const Card = styled.article`
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
  padding: 20px;

  h2,
  h3 {
    margin: 0 0 12px;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  h2 {
    font-size: 20px;
  }

  h3 {
    font-size: 17px;
  }

  p:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 560px) {
    padding: 16px;
  }
`;

export const Metric = styled(Card)`
  span {
    color: var(--color-text-muted);
    font-size: 13px;
    line-height: 20px;
  }

  strong {
    display: block;
    margin-top: 8px;
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas,
      monospace;
    font-size: clamp(24px, 3vw, 30px);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1.25;
  }
`;

export const TableWrap = styled(Card)`
  padding: 0;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-color: var(--color-border-soft) var(--color-surface-lowest);
`;

export const Table = styled.table`
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;

  th,
  td {
    padding: 11px 14px;
    border-bottom: 1px solid var(--color-surface-high);
    text-align: left;
    vertical-align: middle;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--color-surface-low);
    color: var(--color-text-muted);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.02em;
    line-height: 18px;
    white-space: nowrap;
  }

  td {
    font-size: 14px;
    line-height: 20px;
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

export const Button = styled.button`
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid
    ${({ $secondary }) =>
      $secondary ? "var(--color-border)" : "var(--color-primary)"};
  border-radius: 4px;
  background: ${({ $secondary }) =>
    $secondary ? "var(--color-surface-low)" : "var(--color-primary)"};
  color: ${({ $secondary }) =>
    $secondary ? "var(--color-text)" : "var(--color-primary-ink)"};
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    color 140ms ease,
    transform 100ms ease;

  &:hover:not(:disabled) {
    border-color: var(--color-primary);
    background: ${({ $secondary }) =>
      $secondary ? "var(--color-surface-high)" : "#6bff8f"};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const Input = styled.input`
  width: min(100%, 320px);
  min-height: 40px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  outline: 0;
  background: var(--color-surface-lowest);
  color: var(--color-text);
  padding: 8px 11px;
  font-size: 14px;

  &::placeholder {
    color: var(--color-text-dim);
  }

  &:hover {
    border-color: var(--color-border-soft);
  }

  &:focus-visible {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(75, 226, 119, 0.14);
  }
`;

export const Select = styled.select`
  max-width: 100%;
  min-height: 40px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  outline: 0;
  background: var(--color-surface-lowest);
  color: var(--color-text);
  padding: 0 34px 0 11px;
  font-size: 14px;

  &:hover {
    border-color: var(--color-border-soft);
  }

  &:focus-visible {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(75, 226, 119, 0.14);
  }
`;

export const FormGrid = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 210px), 1fr));
  gap: 16px;

  label {
    display: grid;
    min-width: 0;
    gap: 7px;
    color: var(--color-text-muted);
    font-size: 13px;
    font-weight: 600;
    line-height: 18px;
  }

  input,
  select,
  textarea {
    width: 100%;
    min-width: 0;
    min-height: 42px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    outline: 0;
    box-sizing: border-box;
    background: var(--color-surface-lowest);
    color: var(--color-text);
    padding: 9px 10px;
    font-size: 14px;
  }

  textarea {
    min-height: 104px;
    resize: vertical;
  }

  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(75, 226, 119, 0.14);
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  min-height: 24px;
  align-items: center;
  border: 1px solid
    ${({ $tone }) =>
      $tone === "danger"
        ? "rgba(255, 180, 171, 0.38)"
        : $tone === "warn"
          ? "rgba(255, 185, 95, 0.38)"
          : "rgba(75, 226, 119, 0.38)"};
  border-radius: 999px;
  background: ${({ $tone }) =>
    $tone === "danger"
      ? "rgba(147, 0, 10, 0.18)"
      : $tone === "warn"
        ? "rgba(238, 152, 0, 0.14)"
        : "rgba(75, 226, 119, 0.12)"};
  color: ${({ $tone }) =>
    $tone === "danger"
      ? "var(--color-danger)"
      : $tone === "warn"
        ? "var(--color-warning)"
        : "var(--color-primary)"};
  padding: 3px 9px;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas,
    monospace;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  white-space: nowrap;
`;

export const Notice = styled.p`
  margin: 16px 0;
  padding: 14px;
  border: 1px solid
    ${({ $error }) =>
      $error ? "rgba(255, 180, 171, 0.34)" : "rgba(139, 213, 255, 0.28)"};
  border-radius: 4px;
  background: ${({ $error }) => ($error ? "#3b1d26" : "#132a3d")};
  color: ${({ $error }) => ($error ? "#ffb4ab" : "#8bd5ff")};
  font-size: 14px;
  line-height: 21px;
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  overflow-y: auto;
  background: rgba(6, 14, 32, 0.72);
  padding: 20px;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);

  @media (max-width: 560px) {
    align-items: end;
    padding: 12px;
  }
`;

export const ModalPanel = styled(Card)`
  width: min(820px, 100%);
  max-height: min(90vh, 900px);
  max-height: min(90dvh, 900px);
  overflow-y: auto;
  box-shadow: 0 20px 64px rgba(0, 0, 0, 0.34);

  @media (max-width: 560px) {
    max-height: calc(100dvh - 24px);
  }
`;

export const LinkButton = styled(Button)`
  text-decoration: none;
`;

export const formatNumber = (value) => Number(value || 0).toLocaleString();
export const pageContent = (data) => Array.isArray(data) ? data : data?.content || [];
export const toneForStatus = (status) => {
  if (!status || ["ERROR", "CRITICAL", "REJECTED", "UNHANDLED", "DISCONNECTED"].includes(status)) return "danger";
  if (["HOLD", "WARNING", "PENDING", "PENDING_CONFIRMATION", "ON_HOLD", "STOPPED", "INACTIVE", "REVIEW"].includes(status)) return "warn";
  return "success";
};
