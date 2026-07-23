import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  padding: 112px 36px 48px 116px;
  background: #0b1326;
  color: #dae2fd;
  box-sizing: border-box;
  @media (max-width: 720px) {
    padding: 104px 18px 36px 74px;
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 24px;
  h1 { margin: 0 0 8px; font-size: 30px; }
  p { margin: 0; color: #bccbb9; }
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin: 16px 0;
`;

export const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
`;

export const Card = styled.article`
  background: #171f33;
  border: 1px solid #334155;
  border-radius: 4px;
  padding: 18px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  h2, h3 { margin: 0 0 12px; }
`;

export const Metric = styled(Card)`
  span { color: #bccbb9; font-size: 13px; }
  strong { display: block; margin-top: 8px; font-size: 28px; }
`;

export const TableWrap = styled(Card)`
  padding: 0;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
  th, td { padding: 13px 15px; text-align: left; border-bottom: 1px solid #222a3d; }
  th { background: #131b2e; color: #bccbb9; font-size: 13px; }
  tbody tr:hover { background: #222a3d; }
`;

export const Button = styled.button`
  border: 1px solid ${({ $secondary }) => ($secondary ? "#334155" : "#4be277")};
  background: ${({ $secondary }) => ($secondary ? "#131b2e" : "#4be277")};
  color: ${({ $secondary }) => ($secondary ? "#dae2fd" : "#003915")};
  border-radius: 4px;
  padding: 9px 13px;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: .55; cursor: not-allowed; }
`;

export const Input = styled.input`
  min-height: 38px;
  border: 1px solid #334155;
  border-radius: 4px;
  padding: 0 11px;
  background: #060e20;
  color: #dae2fd;
`;

export const Select = styled.select`
  min-height: 40px;
  border: 1px solid #334155;
  border-radius: 4px;
  padding: 0 11px;
  background: #060e20;
  color: #dae2fd;
`;

export const FormGrid = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;
  label { display: grid; gap: 6px; color: #bccbb9; font-size: 13px; }
  input, select, textarea {
    min-height: 40px; border: 1px solid #334155; border-radius: 4px; padding: 8px 10px;
    box-sizing: border-box; background: #060e20; color: #dae2fd;
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 9px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ $tone }) => ($tone === "danger" ? "#b91c1c" : $tone === "warn" ? "#92400e" : "#166534")};
  background: ${({ $tone }) => ($tone === "danger" ? "#fee2e2" : $tone === "warn" ? "#fef3c7" : "#dcfce7")};
`;

export const Notice = styled.p`
  padding: 14px;
  border-radius: 8px;
  background: ${({ $error }) => ($error ? "#3b1d26" : "#132a3d")};
  color: ${({ $error }) => ($error ? "#ffb4ab" : "#8bd5ff")};
`;

export const LinkButton = styled(Button)`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
`;

export const formatNumber = (value) => Number(value || 0).toLocaleString();
export const pageContent = (data) => Array.isArray(data) ? data : data?.content || [];
export const toneForStatus = (status) => {
  if (!status || ["ERROR", "CRITICAL", "REJECTED", "UNHANDLED", "DISCONNECTED"].includes(status)) return "danger";
  if (["HOLD", "WARNING", "PENDING", "PENDING_CONFIRMATION", "ON_HOLD", "STOPPED", "INACTIVE", "REVIEW"].includes(status)) return "warn";
  return "success";
};
