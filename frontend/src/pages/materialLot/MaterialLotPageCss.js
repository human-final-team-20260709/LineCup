import styled from 'styled-components';

const toneColor = {
  success: '#4be277',
  warning: '#ffb95f',
  danger: '#ff8a83',
  neutral: '#bccbb9',
};

export const MaterialLotLayout = styled.main`
  min-height: 100vh;
  background: #0b1326;
  color: #dae2fd;
  padding: 32px;
`;

export const PageHeader = styled.section`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1180px) {
    flex-direction: column;
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  color: #dae2fd;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
`;

export const PageSubtitle = styled.p`
  max-width: 720px;
  margin: 8px 0 0;
  color: #bccbb9;
  font-size: 14px;
  line-height: 20px;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const SegmentControl = styled.div`
  display: inline-flex;
  padding: 3px;
  border: 1px solid #3d4a3d;
  border-radius: 4px;
  background: #060e20;
`;

export const SegmentButton = styled.button`
  min-height: 32px;
  padding: 0 12px;
  border-radius: 3px;
  color: ${({ $active }) => ($active ? '#003915' : '#bccbb9')};
  background: ${({ $active }) => ($active ? '#4be277' : 'transparent')};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

export const ActionButton = styled.button`
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #31394d;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: #4be277;
  }
`;

export const KpiGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const KpiCard = styled.article`
  min-height: 112px;
  padding: 16px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
`;

export const KpiLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #bccbb9;
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: ${({ $tone }) => toneColor[$tone] || toneColor.neutral};
`;

export const KpiValue = styled.strong`
  display: block;
  margin-top: 16px;
  color: #dae2fd;
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: 600;
  line-height: 28px;
`;

export const KpiMeta = styled.p`
  margin: 8px 0 0;
  color: #869585;
  font-size: 12px;
  line-height: 16px;
`;

export const ViewportPanel = styled.section`
  border: 1px solid #334155;
  border-radius: 4px;
  background: #131b2e;
  overflow: hidden;
`;
