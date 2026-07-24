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
  font-size: 13px;
  line-height: 20px;

  &:hover:not(:disabled) {
    border-color: var(--color-border-soft);
  }

  &:focus-visible {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(75, 226, 119, 0.14);
  }
`;

const toneColor = ($tone) => {
  if ($tone === "alarm") {
    return "var(--color-danger)";
  }
  if ($tone === "warning") {
    return "var(--color-warning)";
  }
  return "var(--color-primary)";
};

const toneBorder = ($tone) => {
  if ($tone === "alarm") {
    return "rgba(255, 180, 171, 0.38)";
  }
  if ($tone === "warning") {
    return "rgba(255, 185, 95, 0.38)";
  }
  return "rgba(75, 226, 119, 0.38)";
};

const toneBackground = ($tone) => {
  if ($tone === "alarm") {
    return "rgba(147, 0, 10, 0.18)";
  }
  if ($tone === "warning") {
    return "rgba(238, 152, 0, 0.14)";
  }
  return "rgba(75, 226, 119, 0.12)";
};

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

  > div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin: 4px 0 8px;
  }

  h1 {
    margin: 0;
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
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: 460px) {
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
    border-color 140ms ease;

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

export const StatusChip = styled.span`
  ${mono}
  display: inline-flex;
  min-height: 24px;
  align-items: center;
  ${({ $fitContent }) =>
    $fitContent &&
    css`
      width: fit-content;
      max-width: 100%;
      justify-self: start;
    `}
  border: 1px solid ${({ $tone }) => toneBorder($tone)};
  border-radius: 999px;
  background: ${({ $tone }) => toneBackground($tone)};
  color: ${({ $tone }) => toneColor($tone)};
  padding: 3px 9px;
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  white-space: nowrap;
`;

export const MetricGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin: 16px 0;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 500px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const MetricCard = styled.article`
  min-width: 0;
  min-height: 126px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
  padding: 16px;
`;

export const MetricLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  svg {
    width: 16px;
    height: 16px;
    color: var(--color-primary);
  }
`;

export const MetricValue = styled.strong`
  ${mono}
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin-top: 18px;
  overflow-wrap: anywhere;
  color: ${({ $alarm }) =>
    $alarm ? "var(--color-danger)" : "var(--color-text)"};
  font-size: ${({ $small }) => ($small ? "15px" : "28px")};
  font-weight: 600;
  line-height: ${({ $small }) => ($small ? "22px" : "32px")};

  small {
    color: var(--color-text-muted);
    font-size: 11px;
  }
`;

export const DetailGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 8fr) minmax(300px, 4fr);
  gap: 16px;
  align-items: start;

  > div {
    display: grid;
    min-width: 0;
    gap: 16px;
  }

  @media (max-width: 980px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Panel = styled.section`
  position: ${({ $sticky }) => ($sticky ? "sticky" : "static")};
  top: 72px;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);

  @media (max-width: 980px) {
    position: static;
  }
`;

export const PanelHeader = styled.div`
  display: flex;
  min-height: 70px;
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
    width: 20px;
    height: 20px;
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

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 680px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 440px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const InfoItem = styled.div`
  display: grid;
  min-width: 0;
  min-height: 108px;
  align-content: start;
  gap: 5px;
  border-right: 1px solid var(--color-surface-high);
  border-bottom: 1px solid var(--color-surface-high);
  padding: 16px;

  > span:first-child {
    color: var(--color-text-muted);
    font-size: 11px;
    line-height: 16px;
  }

  strong {
    overflow-wrap: anywhere;
    font-size: 13px;
    line-height: 19px;
  }

  small {
    ${mono}
    overflow-wrap: anywhere;
    color: var(--color-text-dim);
    font-size: 10px;
    line-height: 15px;
  }
`;

export const Mono = styled.span`
  ${mono}
  color: var(--color-text-muted);
  font-size: 11px;
  line-height: 16px;
`;

export const Description = styled.p`
  margin: 0;
  padding: 20px 16px;
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 23px;
`;

export const MethodBadge = styled.span`
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  margin: 0 16px 16px;
  border: 1px solid rgba(75, 226, 119, 0.36);
  border-radius: 4px;
  background: rgba(75, 226, 119, 0.1);
  color: var(--color-primary);
  padding: 5px 9px;
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
`;

export const Timeline = styled.div`
  display: grid;
  padding: 20px 16px 4px;
`;

export const TimelineItem = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr);
  gap: 10px;
  min-height: 96px;

  &:not(:last-child)::before {
    position: absolute;
    top: 15px;
    bottom: -4px;
    left: 7px;
    width: 1px;
    background: var(--color-border);
    content: "";
  }

  > div {
    display: grid;
    align-content: start;
    gap: 4px;
    padding-bottom: 18px;
  }

  strong {
    font-size: 13px;
    line-height: 18px;
  }

  div > span:not(:first-child) {
    color: var(--color-text-muted);
    font-size: 12px;
    line-height: 18px;
  }
`;

export const TimelineDot = styled.span`
  position: relative;
  z-index: 1;
  width: 15px;
  height: 15px;
  margin-top: 1px;
  border: 3px solid var(--color-surface);
  border-radius: 999px;
  background: ${({ $tone }) => toneColor($tone)};
`;

export const TreatmentForm = styled.form`
  display: grid;
  gap: 16px;
  padding: 16px;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 440px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Field = styled.div`
  display: grid;
  min-width: 0;
  gap: 7px;
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
`;

export const Input = styled.input`
  ${control}
  padding: 9px 10px;

  &[readonly] {
    background: var(--color-surface-low);
    color: var(--color-text-muted);
  }
`;

export const Select = styled.select`
  ${control}
  padding: 0 32px 0 10px;

  option {
    background: var(--color-surface-low);
  }
`;

export const Textarea = styled.textarea`
  ${control}
  min-height: 104px;
  padding: 10px;
  resize: vertical;

  &::placeholder {
    color: var(--color-text-dim);
  }
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const Notice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  border: 1px solid
    ${({ $success, $error }) =>
      $success
        ? "rgba(75, 226, 119, 0.36)"
        : $error
          ? "rgba(255, 180, 171, 0.36)"
          : "var(--color-border)"};
  border-radius: 4px;
  background: ${({ $success, $error }) =>
    $success
      ? "rgba(75, 226, 119, 0.08)"
      : $error
        ? "rgba(147, 0, 10, 0.16)"
        : "var(--color-surface-low)"};
  color: ${({ $success, $error }) =>
    $success
      ? "var(--color-primary)"
      : $error
        ? "var(--color-danger)"
        : "var(--color-text-muted)"};
  padding: 11px 12px;
  font-size: 12px;
  line-height: 18px;

  svg {
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
    margin-top: 1px;
  }
`;

export const EmptyState = styled.section`
  display: grid;
  min-height: 420px;
  justify-items: center;
  align-content: center;
  gap: 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  padding: 32px;
  text-align: center;

  svg {
    width: 38px;
    height: 38px;
    color: var(--color-primary);
  }

  strong {
    color: var(--color-text);
    font-size: 18px;
    line-height: 24px;
  }

  span {
    font-size: 13px;
    line-height: 20px;
  }
`;
