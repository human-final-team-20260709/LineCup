import styled, { css } from 'styled-components';

const c = { bg: '#0b1326', lowest: '#060e20', low: '#131b2e', card: '#171f33', high: '#222a3d', border: '#334155', text: '#dae2fd', muted: '#bccbb9', dim: '#869585', green: '#4be277', greenInk: '#003915', amber: '#ffb95f', red: '#ffb4ab' };
const mono = css`font-family: 'JetBrains Mono', Consolas, monospace;`;
const focus = css`&:focus-visible { outline: 2px solid ${c.green}; outline-offset: 2px; }`;
const tones = { alarm: c.red, warning: c.amber, success: c.green, neutral: c.muted };

export const Page = styled.main`min-height: 100vh; padding: 32px; background: ${c.bg}; color: ${c.text}; font-family: Inter, sans-serif; *, *::before, *::after { box-sizing: border-box; } button, input, select { font: inherit; } @media (max-width: 720px) { padding: 16px; }`;
export const PageHeader = styled.header`display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 16px; @media (max-width: 620px) { flex-direction: column; }`;
export const TitleGroup = styled.div`h1 { margin: 4px 0 8px; font-size: 24px; line-height: 32px; font-weight: 600; } p { margin: 0; color: ${c.muted}; font-size: 14px; line-height: 20px; }`;
export const Eyebrow = styled.span`color: ${c.green}; font-size: 11px; line-height: 16px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;`;
export const Button = styled.button`${focus} display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 38px; padding: 0 14px; border: 1px solid ${({ $primary }) => ($primary ? c.green : c.border)}; border-radius: 4px; background: ${({ $primary }) => ($primary ? c.green : c.low)}; color: ${({ $primary }) => ($primary ? c.greenInk : c.text)}; font-size: 14px; font-weight: 700; cursor: pointer; &:hover { border-color: ${c.green}; }`;
export const StateSwitch = styled.div`display: inline-flex; padding: 3px; margin-bottom: 16px; border: 1px solid ${c.border}; border-radius: 4px; background: ${c.lowest};`;
export const StateButton = styled.button`${focus} min-width: 92px; min-height: 30px; border: 0; border-radius: 3px; background: ${({ $active }) => ($active ? c.green : 'transparent')}; color: ${({ $active }) => ($active ? c.greenInk : c.muted)}; font-size: 12px; font-weight: 700; cursor: pointer;`;
export const Toolbar = styled.section`display: grid; grid-template-columns: minmax(280px, 1fr) 180px 180px; gap: 8px; margin-bottom: 16px; @media (max-width: 820px) { grid-template-columns: 1fr 1fr; > :first-child { grid-column: 1 / -1; } } @media (max-width: 480px) { grid-template-columns: 1fr; > :first-child { grid-column: auto; } }`;
const field = css`display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 10px; border: 1px solid ${c.border}; border-radius: 4px; background: ${c.lowest}; color: ${c.dim}; &:focus-within { border-color: ${c.green}; } input, select { width: 100%; min-width: 0; border: 0; outline: 0; background: transparent; color: ${c.text}; font-size: 13px; } option { background: ${c.low}; }`;
export const SearchField = styled.label`${field} input::placeholder { color: ${c.dim}; }`;
export const SelectField = styled.label`${field}`;
export const TableCard = styled.section`overflow: hidden; border: 1px solid ${c.border}; border-radius: 4px; background: ${c.card};`;
export const CardHeader = styled.div`display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px; border-bottom: 1px solid ${c.border}; h2 { margin: 4px 0 0; font-size: 18px; line-height: 24px; }`;
export const PanelLabel = styled.span`color: ${c.green}; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;`;
export const Count = styled.span`${mono} color: ${c.muted}; font-size: 12px;`;
export const TableWrap = styled.div`overflow-x: auto;`;
export const Table = styled.table`
  width: 100%; min-width: 1180px; border-collapse: collapse; table-layout: fixed;
  th, td { padding: 12px 10px; border-bottom: 1px solid ${c.high}; text-align: left; vertical-align: middle; }
  th { color: ${c.muted}; font-size: 11px; line-height: 16px; letter-spacing: .08em; text-transform: uppercase; }
  td { font-size: 13px; line-height: 18px; } th:first-child { width: 165px; } th:nth-child(2) { width: 150px; } th:nth-child(3), th:nth-child(4) { width: 160px; } th:nth-child(5) { width: 90px; } th:nth-child(7), th:nth-child(8) { width: 100px; }
  td small { display: block; margin-top: 2px; color: ${c.dim}; ${mono} font-size: 10px; }
  tbody tr { cursor: pointer; } tbody tr:nth-child(even) { background: rgba(6, 14, 32, .45); } tbody tr:hover, tbody tr:focus { outline: none; background: rgba(75, 226, 119, .07); }
`;
export const Mono = styled.span`${mono} font-size: 11px; line-height: 16px;`;
export const StatusChip = styled.span`${mono} display: inline-flex; justify-content: center; min-width: 70px; padding: 4px 8px; border: 1px solid ${({ $tone }) => `${tones[$tone] || c.border}66`}; border-radius: 999px; background: ${({ $tone }) => `${tones[$tone] || c.text}18`}; color: ${({ $tone }) => tones[$tone] || c.text}; font-size: 11px; font-weight: 700; white-space: nowrap;`;
export const EmptyState = styled.div`display: grid; justify-items: center; align-content: center; gap: 8px; min-height: 360px; padding: 40px 24px; color: ${c.muted}; text-align: center; svg { width: 36px; height: 36px; color: ${c.green}; } strong { color: ${c.text}; font-size: 17px; } span { margin-bottom: 8px; font-size: 13px; }`;
