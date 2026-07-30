import styled from "styled-components";

export const colors = {
  surfaceContainerLow: "#131b2e",
  surfaceContainer: "#171f33",
  surfaceContainerHigh: "#222a3d",
  onSurface: "#dae2fd",
  onSurfaceVariant: "#bccbb9",
  outlineVariant: "#3d4a3d",
  primary: "#4be277",
  secondary: "#ffb95f",
  error: "#ffb4ab",
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
  flex-direction: column;
  gap: 8px;
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
`;

export const PageSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${colors.onSurfaceVariant};
`;

export const Panel = styled.div`
  background: ${colors.surfaceContainer};
  border: 1px solid ${colors.outlineVariant};
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const TableHead = styled.thead`
  background: ${colors.surfaceContainerHigh};
`;

export const Th = styled.th`
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 700;
  color: ${colors.onSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid ${colors.outlineVariant};
`;

export const Tr = styled.tr`
  background-color: ${({ $odd }) => ($odd ? colors.surfaceContainerLow : "transparent")};
  &:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
`;

export const Td = styled.td`
  padding: 12px 16px;
  font-size: 13px;
  font-family: "JetBrains Mono", monospace;
  color: ${colors.onSurface};
  border-bottom: 1px solid ${colors.outlineVariant};
`;

export const StatusChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $tone }) =>
    $tone === "success"
      ? "rgba(75, 226, 119, 0.15)"
      : $tone === "warning"
      ? "rgba(255, 185, 95, 0.15)"
      : "rgba(255, 180, 171, 0.15)"};
  color: ${({ $tone }) =>
    $tone === "success" ? colors.primary : $tone === "warning" ? colors.secondary : colors.error};
`;