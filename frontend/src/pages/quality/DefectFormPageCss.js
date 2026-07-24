import styled, { css } from "styled-components";

const mono = css`
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Consolas,
    monospace;
  font-variant-numeric: tabular-nums;
`;

const focusRing = css`
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

const control = css`
  width: 100%;
  min-width: 0;
  min-height: 42px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  outline: 0;
  background: var(--color-surface-lowest);
  color: var(--color-text);
  font-size: 14px;
  line-height: 20px;
  transition:
    border-color 140ms ease,
    box-shadow 140ms ease;

  &:hover:not(:disabled) {
    border-color: var(--color-border-soft);
  }

  &:focus-visible {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(75, 226, 119, 0.14);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }
`;

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  min-height: calc(100dvh - 56px);
  padding: 40px 32px 48px 88px;
  overflow-x: clip;
  background: var(--color-bg);
  color: var(--color-text);

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  @media (max-width: 720px) {
    min-height: calc(100dvh - 52px);
    padding: 32px 16px 32px 56px;
  }
`;

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 680px) {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }
`;

export const TitleGroup = styled.div`
  max-width: 760px;

  h1 {
    margin: 4px 0 8px;
    font-size: clamp(26px, 3vw, 32px);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 14px;
    line-height: 22px;
  }
`;

export const Eyebrow = styled.span`
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 480px) {
    > * {
      flex: 1;
    }
  }
`;

export const Button = styled.button`
  ${focusRing}
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid
    ${({ $primary }) =>
      $primary ? "var(--color-primary)" : "var(--color-border)"};
  border-radius: 4px;
  background: ${({ $primary }) =>
    $primary ? "var(--color-primary)" : "var(--color-surface-low)"};
  color: ${({ $primary }) =>
    $primary ? "var(--color-primary-ink)" : "var(--color-text)"};
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    color 140ms ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover:not(:disabled) {
    border-color: var(--color-primary);
    background: ${({ $primary }) =>
      $primary ? "#6bff8f" : "var(--color-surface-high)"};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.46;
  }
`;

export const FormLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 8fr) minmax(280px, 4fr);
  gap: 16px;
  align-items: start;

  @media (max-width: 980px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const FormCard = styled.section`
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
`;

export const CardHeader = styled.div`
  display: flex;
  min-height: 72px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid var(--color-border);

  h2 {
    margin: 4px 0 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }

  > svg {
    width: 22px;
    height: 22px;
    color: var(--color-primary);
  }
`;

export const PanelLabel = styled.span`
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const Section = styled.section`
  display: grid;
  gap: 16px;
  padding: 20px 16px;

  & + & {
    border-top: 1px solid var(--color-border);
  }
`;

export const SectionTitle = styled.h3`
  margin: 0;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: 0.04em;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 620px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Field = styled.div`
  display: grid;
  grid-column: ${({ $full }) => ($full ? "1 / -1" : "auto")};
  align-content: start;
  gap: 7px;
  min-width: 0;
`;

export const Label = styled.label`
  color: var(--color-text);
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
`;

export const Required = styled.span`
  color: var(--color-danger);
`;

export const Select = styled.select`
  ${control}
  padding: 0 34px 0 11px;

  option {
    background: var(--color-surface-low);
  }
`;

export const Input = styled.input`
  ${control}
  padding: 9px 11px;

  &[readonly] {
    background: var(--color-surface-low);
    color: var(--color-text-muted);
  }

  &::placeholder {
    color: var(--color-text-dim);
  }
`;

export const Textarea = styled.textarea`
  ${control}
  min-height: 108px;
  padding: 10px 11px;
  resize: vertical;

  &::placeholder {
    color: var(--color-text-dim);
  }
`;

export const HelpText = styled.span`
  color: ${({ $warning }) =>
    $warning ? "var(--color-warning)" : "var(--color-text-dim)"};
  font-size: 11px;
  line-height: 16px;
`;

export const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const MethodOption = styled.label`
  position: relative;
  display: flex;
  min-height: 92px;
  align-items: flex-start;
  gap: 10px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "var(--color-primary)" : "var(--color-border)"};
  border-radius: 4px;
  background: ${({ $active }) =>
    $active ? "rgba(75, 226, 119, 0.07)" : "var(--color-surface-low)"};
  padding: 12px;
  cursor: pointer;
  transition:
    background-color 140ms ease,
    border-color 140ms ease;

  &:hover {
    border-color: var(--color-primary);
  }

  &:focus-within {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }

  > span:last-child {
    display: grid;
    gap: 4px;
    min-width: 0;
  }

  strong {
    font-size: 13px;
    line-height: 18px;
  }

  small {
    color: var(--color-text-dim);
    font-size: 11px;
    line-height: 16px;
  }
`;

export const RadioMark = styled.span`
  display: grid;
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  place-items: center;
  margin-top: 1px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "var(--color-primary)" : "var(--color-border-soft)"};
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? "rgba(75, 226, 119, 0.14)" : "transparent"};
  color: ${({ $active }) =>
    $active ? "var(--color-primary)" : "var(--color-text-dim)"};

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const SummaryCard = styled.aside`
  position: sticky;
  top: 72px;
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
  padding: 16px;

  h2 {
    margin: 4px 0 16px;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }

  @media (max-width: 980px) {
    position: static;
  }
`;

export const SummaryList = styled.div`
  display: grid;
  border-top: 1px solid var(--color-border);
`;

export const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: minmax(84px, auto) minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  padding: 11px 0;
  border-bottom: 1px solid var(--color-surface-high);
  font-size: 12px;
  line-height: 17px;

  > span:first-child {
    color: var(--color-text-muted);
  }

  strong {
    ${mono}
    overflow-wrap: anywhere;
    font-size: 11px;
    text-align: right;
  }

  > :last-child {
    justify-self: end;
  }
`;

export const StatusChip = styled.span`
  ${mono}
  display: inline-flex;
  min-height: 24px;
  align-items: center;
  border: 1px solid
    ${({ $status }) =>
      $status === "COMPLETED"
        ? "rgba(75, 226, 119, 0.38)"
        : $status === "UNHANDLED"
          ? "rgba(255, 180, 171, 0.38)"
          : "rgba(255, 185, 95, 0.38)"};
  border-radius: 999px;
  background: ${({ $status }) =>
    $status === "COMPLETED"
      ? "rgba(75, 226, 119, 0.12)"
      : $status === "UNHANDLED"
        ? "rgba(147, 0, 10, 0.18)"
        : "rgba(238, 152, 0, 0.14)"};
  color: ${({ $status }) =>
    $status === "COMPLETED"
      ? "var(--color-primary)"
      : $status === "UNHANDLED"
        ? "var(--color-danger)"
        : "var(--color-warning)"};
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
`;

export const Notice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 16px;
  border: 1px solid
    ${({ $warning }) =>
      $warning ? "rgba(255, 185, 95, 0.34)" : "var(--color-border)"};
  border-radius: 4px;
  background: var(--color-surface-low);
  color: ${({ $warning }) =>
    $warning ? "var(--color-warning)" : "var(--color-text-muted)"};
  padding: 10px;
  font-size: 11px;
  line-height: 16px;

  svg {
    width: 15px;
    height: 15px;
    flex: 0 0 15px;
    margin-top: 1px;
  }
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;

  @media (max-width: 420px) {
    > * {
      flex: 1;
    }
  }
`;
