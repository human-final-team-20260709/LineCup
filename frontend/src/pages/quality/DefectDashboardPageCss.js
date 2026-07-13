import styled, { css } from 'styled-components';

const c = {
  bg: '#0b1326', lowest: '#060e20', low: '#131b2e', card: '#171f33', high: '#222a3d',
  border: '#334155', text: '#dae2fd', muted: '#bccbb9', dim: '#869585', green: '#4be277',
  greenInk: '#003915', amber: '#ffb95f', red: '#ffb4ab', blue: '#8bd5ff',
};
const mono = css`font-family: 'JetBrains Mono', Consolas, monospace;`;
const focus = css`&:focus-visible { outline: 2px solid ${c.green}; outline-offset: 2px; }`;

export const Page = styled.main`
  min-height: 100vh; padding: 32px; background: ${c.bg}; color: ${c.text}; font-family: Inter, sans-serif;
  *, *::before, *::after { box-sizing: border-box; }
  button, input, select { font: inherit; }
  @media (max-width: 720px) { padding: 16px; }
`;
export const PageHeader = styled.header`
  display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 16px;
  @media (max-width: 720px) { flex-direction: column; }
`;
export const TitleGroup = styled.div`
  h1 { margin: 4px 0 8px; font-size: 24px; line-height: 32px; font-weight: 600; }
  p { margin: 0; color: ${c.muted}; font-size: 14px; line-height: 20px; }
`;
export const Eyebrow = styled.span`color: ${c.green}; font-size: 11px; font-weight: 700; line-height: 16px; letter-spacing: .1em; text-transform: uppercase;`;
export const HeaderActions = styled.div`display: flex; gap: 8px; @media (max-width: 480px) { width: 100%; > * { flex: 1; } }`;
export const Button = styled.button`
  ${focus} display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 38px; padding: 0 14px;
  border: 1px solid ${({ $primary }) => ($primary ? c.green : c.border)}; border-radius: 4px;
  background: ${({ $primary }) => ($primary ? c.green : c.low)}; color: ${({ $primary }) => ($primary ? c.greenInk : c.text)};
  font-size: 14px; font-weight: 700; cursor: pointer; &:hover { border-color: ${c.green}; }
`;
export const StateSwitch = styled.div`display: inline-flex; padding: 3px; margin-bottom: 16px; border: 1px solid ${c.border}; border-radius: 4px; background: ${c.lowest};`;
export const StateButton = styled.button`
  ${focus} min-width: 92px; min-height: 30px; border: 0; border-radius: 3px; background: ${({ $active }) => ($active ? c.green : 'transparent')};
  color: ${({ $active }) => ($active ? c.greenInk : c.muted)}; font-size: 12px; font-weight: 700; cursor: pointer;
`;
export const MetricGrid = styled.section`
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-bottom: 16px;
  @media (max-width: 1000px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;
const tone = { alarm: c.red, warning: c.amber, success: c.green, info: c.blue };
export const MetricCard = styled.article`
  min-height: 142px; padding: 16px; border: 1px solid ${({ $tone }) => `${tone[$tone] || c.border}55`}; border-radius: 4px; background: ${c.card};
`;
export const MetricHead = styled.div`
  display: flex; align-items: center; gap: 8px; color: ${c.muted}; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  svg { color: ${c.green}; }
`;
export const MetricValue = styled.strong`
  ${mono} display: flex; align-items: baseline; gap: 7px; margin-top: 18px; font-size: 28px; line-height: 32px;
  small { color: ${c.muted}; font-size: 12px; }
`;
export const MetricFoot = styled.div`display: flex; align-items: center; gap: 5px; margin-top: 8px; color: ${c.dim}; font-size: 12px; line-height: 16px; strong, svg { color: ${c.amber}; }`;
export const DashboardGrid = styled.section`
  display: grid; grid-template-columns: minmax(280px, 4fr) minmax(0, 8fr); gap: 16px;
  @media (max-width: 980px) { grid-template-columns: 1fr; }
`;
export const Panel = styled.article`min-width: 0; border: 1px solid ${c.border}; border-radius: 4px; background: ${c.card};`;
export const PanelHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 70px; padding: 16px; border-bottom: 1px solid ${c.border};
  h2 { margin: 4px 0 0; font-size: 18px; line-height: 24px; font-weight: 600; }
`;
export const PanelLabel = styled.span`color: ${c.green}; font-size: 11px; font-weight: 700; line-height: 16px; letter-spacing: .1em; text-transform: uppercase;`;
export const PanelMeta = styled.span`${mono} color: ${c.muted}; font-size: 12px; white-space: nowrap;`;
export const ProcessList = styled.div`display: grid; gap: 18px; padding: 20px 16px;`;
export const ProcessItem = styled.div`
  display: grid; gap: 8px; > div { display: flex; justify-content: space-between; gap: 12px; }
  strong { font-size: 14px; } 
`;
export const ProgressTrack = styled.div`height: 8px; overflow: hidden; border-radius: 999px; background: ${c.lowest};`;
export const ProgressFill = styled.div`
  width: ${({ $value }) => `${$value}%`}; height: 100%; border-radius: inherit; background: ${({ $tone }) => tone[$tone] || c.green};
`;
export const TableWrap = styled.div`overflow-x: auto;`;
export const Table = styled.table`
  width: 100%; min-width: 760px; border-collapse: collapse; table-layout: fixed;
  th, td { padding: 12px; border-bottom: 1px solid ${c.high}; text-align: left; vertical-align: middle; }
  th { color: ${c.muted}; font-size: 11px; line-height: 16px; letter-spacing: .08em; text-transform: uppercase; }
  td { font-size: 13px; line-height: 18px; }
  td:first-child { width: 150px; } td:nth-child(5) { width: 74px; }
  td strong, td small { display: block; } td small { margin-top: 2px; color: ${c.dim}; }
  tbody tr { cursor: pointer; } tbody tr:nth-child(even) { background: rgba(6, 14, 32, .42); }
  tbody tr:hover, tbody tr:focus { outline: none; background: rgba(75, 226, 119, .07); }
`;
export const Mono = styled.span`${mono} font-size: 12px; line-height: 16px;`;
export const StatusChip = styled.span`
  ${mono} display: inline-flex; padding: 4px 8px; border: 1px solid ${({ $tone }) => `${tone[$tone] || c.border}66`}; border-radius: 999px;
  background: ${({ $tone }) => `${tone[$tone] || c.text}18`}; color: ${({ $tone }) => tone[$tone] || c.text}; font-size: 11px; font-weight: 700; white-space: nowrap;
`;
export const EmptyState = styled.div`
  display: grid; justify-items: center; align-content: center; gap: 8px; min-height: 280px; padding: 32px; color: ${c.muted}; text-align: center;
  svg { width: 34px; height: 34px; color: ${c.green}; } strong { color: ${c.text}; font-size: 16px; } span { font-size: 13px; }
`;
