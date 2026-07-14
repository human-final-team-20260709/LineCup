import styled, { css } from "styled-components";

export const colors = {
  surfaceContainerLowest: "#060e20",
  surfaceContainerLow: "#131b2e",
  surfaceContainer: "#171f33",
  surfaceContainerHigh: "#222a3d",
  surfaceContainerHighest: "#2d3449",
  onSurface: "#dae2fd",
  onSurfaceVariant: "#bccbb9",
  outline: "#869585",
  outlineVariant: "#3d4a3d",
  primary: "#4be277",
  onPrimary: "#003915",
  secondary: "#ffb95f",
  onSecondary: "#472a00",
  error: "#ffb4ab",
  onError: "#690005",
};

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  background: #0b1326;
  color: ${colors.onSurface};
  min-height: 100%;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
`;

export const PageSubtitle = styled.p`
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${colors.onSurfaceVariant};
`;

export const EmptyStateToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${colors.onSurfaceVariant};
  cursor: pointer;
  user-select: none;
`;

export const ToggleSwitch = styled.button`
  position: relative;
  width: 36px;
  height: 20px;
  border-radius: 9999px;
  border: 1px solid ${colors.outlineVariant};
  background: ${({ $active }) =>
    $active ? colors.primary : colors.surfaceContainerHigh};
  transition: background 0.15s ease;
  cursor: pointer;
  padding: 0;

  &::after {
    content: "";
    position: absolute;
    top: 1px;
    left: ${({ $active }) => ($active ? "17px" : "1px")};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${colors.onSurface};
    transition: left 0.15s ease;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const DataCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${colors.surfaceContainer};
  border: 1px solid ${colors.outlineVariant};
  border-radius: 4px;
  padding: 16px;
`;

export const CardLabel = styled.span`
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${colors.onSurfaceVariant};
`;

export const CardValue = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${colors.onSurface};
`;

export const CardMeta = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  font-weight: 500;
  color: ${colors.onSurfaceVariant};
`;

export const Panel = styled.div`
  background: ${colors.surfaceContainer};
  border: 1px solid ${colors.outlineVariant};
  border-radius: 4px;
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: ${colors.surfaceContainerHigh};
`;

export const Th = styled.th`
  text-align: left;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${colors.onSurfaceVariant};
  white-space: nowrap;
`;

export const Tr = styled.tr`
  background: ${({ $odd }) =>
    $odd ? colors.surfaceContainerLow : "transparent"};
`;

export const Td = styled.td`
  padding: 8px 16px;
  font-family: "JetBrains Mono", monospace;
  font-size: 13px;
  color: ${colors.onSurface};
  border-top: 1px solid ${colors.outlineVariant};
  white-space: nowrap;
`;

const chipBase = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 9999px;
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.05em;
  line-height: 16px;
`;

export const StatusChip = styled.span`
  ${chipBase};
  background: ${({ $tone }) =>
    $tone === "success"
      ? "rgba(75, 226, 119, 0.16)"
      : $tone === "error"
        ? "rgba(255, 180, 171, 0.16)"
        : "rgba(255, 185, 95, 0.16)"};
  color: ${({ $tone }) =>
    $tone === "success"
      ? colors.primary
      : $tone === "error"
        ? colors.error
        : colors.secondary};
`;

export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 64px 16px;
  color: ${colors.onSurfaceVariant};
`;

export const EmptyTitle = styled.span`
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.onSurface};
`;

export const EmptyDesc = styled.span`
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: ${colors.onSurfaceVariant};
`;
