import styled from 'styled-components';

const badge = {
  success: { color: '#4be277', bg: 'rgba(75, 226, 119, 0.12)' },
  warning: { color: '#ffb95f', bg: 'rgba(255, 185, 95, 0.14)' },
  active: { color: '#dae2fd', bg: 'rgba(218, 226, 253, 0.12)' },
  danger: { color: '#ff8a83', bg: 'rgba(255, 138, 131, 0.14)' },
};

const processColor = {
  success: '#4be277',
  warning: '#ffb95f',
  active: '#dae2fd',
  danger: '#ff8a83',
};

export const PageSection = styled.div`
  padding: 16px;
`;

export const Toolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 1fr) auto auto;
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
`;

export const SearchInput = styled.input`
  width: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
  color: #dae2fd;
  font-size: 13px;
  outline: none;

  &::placeholder {
    color: #869585;
  }
`;

export const FilterButton = styled.button`
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid ${({ $active }) => ($active ? '#4be277' : '#334155')};
  border-radius: 4px;
  background: ${({ $active }) => ($active ? '#172f2b' : '#222a3d')};
  color: ${({ $active }) => ($active ? '#6bff8f' : '#dae2fd')};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: #4be277;
    color: #6bff8f;
  }
`;

export const LotGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(340px, 0.9fr) minmax(480px, 1.5fr);
  gap: 16px;
  margin-bottom: 16px;
`;

export const LotList = styled.section`
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
  overflow: hidden;
`;

export const SectionHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 0 16px;
  border-bottom: 1px solid #334155;
  color: #bccbb9;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: #dae2fd;
  font-size: 16px;
  font-weight: 700;
`;

export const LotListItem = styled.button`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  width: 100%;
  gap: 12px;
  padding: 14px 16px;
  border-top: 1px solid #222a3d;
  border-left: 3px solid ${({ $active }) => ($active ? '#4be277' : 'transparent')};
  background: ${({ $active }) => ($active ? '#222a3d' : 'transparent')};
  color: inherit;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #222a3d;
  }
`;

export const LotTitle = styled.strong`
  color: #dae2fd;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
`;

export const LotMeta = styled.span`
  display: block;
  margin-top: 4px;
  color: #869585;
  font-size: 12px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 9999px;
  background: ${({ $tone }) => (badge[$tone] || badge.active).bg};
  color: ${({ $tone }) => (badge[$tone] || badge.active).color};
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
`;

export const LotListEmpty = styled.div`
  display: grid;
  place-items: center;
  min-height: 240px;
  padding: 32px;
  text-align: center;

  strong {
    color: #dae2fd;
    font-size: 16px;
  }

  p {
    max-width: 280px;
    margin: 8px 0 0;
    color: #869585;
    font-size: 13px;
    line-height: 20px;
  }
`;

export const DetailColumn = styled.div`
  display: grid;
  gap: 16px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
`;

export const InfoCard = styled.article`
  padding: 14px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;

  span {
    display: block;
    color: #869585;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
  }

  strong {
    display: block;
    margin-top: 10px;
    color: #dae2fd;
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
  }
`;

export const Timeline = styled.section`
  border: 1px solid #334155;
  border-radius: 4px;
  background: #171f33;
  overflow: hidden;
`;

export const ProcessStep = styled.div`
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid #222a3d;

  span {
    color: ${({ $tone }) => processColor[$tone] || '#869585'};
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
  }

  strong {
    color: #dae2fd;
    font-size: 14px;
  }

  em {
    color: ${({ $tone }) => processColor[$tone] || '#ffb95f'};
    font-style: normal;
    font-size: 12px;
  }
`;

export const TraceTable = styled.table`
  width: 100%;
  border: 1px solid #334155;
  border-radius: 4px;
  border-collapse: separate;
  overflow: hidden;
  background: #171f33;

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid #222a3d;
    text-align: left;
    font-size: 13px;
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
    color: #bccbb9;
  }

  strong {
    color: #dae2fd;
    font-size: 18px;
  }

  p {
    max-width: 420px;
    margin: 8px 0 0;
    color: #869585;
    font-size: 14px;
    line-height: 20px;
  }
`;

export const DetailEmpty = styled.div`
  display: grid;
  place-items: center;
  min-height: 280px;
  padding: 40px;
  border: 1px dashed #3d4a3d;
  border-radius: 4px;
  background: #060e20;
  text-align: center;

  svg {
    width: 32px;
    height: 32px;
    margin-bottom: 14px;
    color: #bccbb9;
  }

  strong {
    color: #dae2fd;
    font-size: 16px;
  }

  p {
    max-width: 360px;
    margin: 8px 0 0;
    color: #869585;
    font-size: 13px;
    line-height: 20px;
  }
`;
