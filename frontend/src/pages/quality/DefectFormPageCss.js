import styled, { css } from 'styled-components';

const c = { bg: '#0b1326', lowest: '#060e20', low: '#131b2e', card: '#171f33', high: '#222a3d', border: '#334155', text: '#dae2fd', muted: '#bccbb9', dim: '#869585', green: '#4be277', greenInk: '#003915', amber: '#ffb95f', red: '#ffb4ab' };
const mono = css`font-family: 'JetBrains Mono', Consolas, monospace;`;
const focus = css`&:focus-visible { outline: 2px solid ${c.green}; outline-offset: 2px; }`;

export const Page = styled.main`min-height: 100vh; padding: 32px; background: ${c.bg}; color: ${c.text}; font-family: Inter, sans-serif; *, *::before, *::after { box-sizing: border-box; } button, input, select, textarea { font: inherit; } @media (max-width: 720px) { padding: 16px; }`;
export const PageHeader = styled.header`display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 16px; @media (max-width: 680px) { flex-direction: column; }`;
export const TitleGroup = styled.div`h1 { margin: 4px 0 8px; font-size: 24px; line-height: 32px; font-weight: 600; } p { margin: 0; color: ${c.muted}; font-size: 14px; line-height: 20px; }`;
export const Eyebrow = styled.span`color: ${c.green}; font-size: 11px; font-weight: 700; line-height: 16px; letter-spacing: .1em; text-transform: uppercase;`;
export const HeaderActions = styled.div`display: flex; gap: 8px;`;
export const Button = styled.button`${focus} display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 38px; padding: 0 14px; border: 1px solid ${({ $primary }) => ($primary ? c.green : c.border)}; border-radius: 4px; background: ${({ $primary }) => ($primary ? c.green : c.low)}; color: ${({ $primary }) => ($primary ? c.greenInk : c.text)}; font-size: 14px; font-weight: 700; cursor: pointer; &:hover:not(:disabled) { border-color: ${c.green}; } &:disabled { opacity: .4; cursor: not-allowed; }`;
export const StateSwitch = styled.div`display: inline-flex; padding: 3px; margin-bottom: 16px; border: 1px solid ${c.border}; border-radius: 4px; background: ${c.lowest};`;
export const StateButton = styled.button`${focus} min-width: 112px; min-height: 30px; border: 0; border-radius: 3px; background: ${({ $active }) => ($active ? c.green : 'transparent')}; color: ${({ $active }) => ($active ? c.greenInk : c.muted)}; font-size: 12px; font-weight: 700; cursor: pointer;`;
export const FormLayout = styled.div`display: grid; grid-template-columns: minmax(0, 8fr) minmax(260px, 4fr); gap: 16px; align-items: start; @media (max-width: 940px) { grid-template-columns: 1fr; }`;
export const FormCard = styled.section`border: 1px solid ${c.border}; border-radius: 4px; background: ${c.card};`;
export const CardHeader = styled.div`display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid ${c.border}; h2 { margin: 4px 0 0; font-size: 18px; } > svg { width: 22px; height: 22px; color: ${c.green}; }`;
export const PanelLabel = styled.span`color: ${c.green}; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;`;
export const Section = styled.section`display: grid; gap: 16px; padding: 20px 16px; & + & { border-top: 1px solid ${c.border}; }`;
export const SectionTitle = styled.h3`margin: 0; color: ${c.muted}; font-size: 13px; font-weight: 700; letter-spacing: .04em;`;
export const FieldGrid = styled.div`display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; @media (max-width: 620px) { grid-template-columns: 1fr; }`;
export const Field = styled.div`display: grid; align-content: start; gap: 7px;`;
export const Label = styled.label`font-size: 13px; line-height: 18px; font-weight: 600;`;
export const Required = styled.span`color: ${c.red};`;
const control = css`width: 100%; min-height: 42px; border: 1px solid ${c.border}; border-radius: 4px; outline: 0; background: ${c.lowest}; color: ${c.text}; font-size: 14px; &:focus { border-color: ${c.green}; } &:disabled { opacity: .5; cursor: not-allowed; }`;
export const Select = styled.select`${control} padding: 0 11px; option { background: ${c.low}; }`;
export const Input = styled.input`${control} padding: 0 11px;`;
export const Textarea = styled.textarea`${control} min-height: 104px; padding: 10px 11px; resize: vertical; line-height: 20px;`;
export const HelpText = styled.span`color: ${({ $warning }) => ($warning ? c.amber : c.dim)}; font-size: 11px; line-height: 16px;`;
export const MethodGrid = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; @media (max-width: 680px) { grid-template-columns: 1fr; }`;
export const MethodOption = styled.label`
  display: flex; align-items: flex-start; gap: 10px; min-height: 84px; padding: 12px; border: 1px solid ${({ $active }) => ($active ? c.green : c.border)}; border-radius: 4px; background: ${({ $active }) => ($active ? 'rgba(75, 226, 119, .07)' : c.low)}; cursor: pointer;
  input { position: absolute; opacity: 0; pointer-events: none; } > span:last-child { display: grid; gap: 4px; } strong { font-size: 13px; } small { color: ${c.dim}; font-size: 11px; line-height: 16px; }
`;
export const RadioMark = styled.span`display: grid; place-items: center; flex: 0 0 18px; width: 18px; height: 18px; margin-top: 1px; border: 1px solid ${c.green}; border-radius: 999px; color: ${c.green}; svg { width: 12px; }`;
export const SummaryCard = styled.aside`position: sticky; top: 16px; padding: 16px; border: 1px solid ${c.border}; border-radius: 4px; background: ${c.card}; h2 { margin: 4px 0 16px; font-size: 18px; } @media (max-width: 940px) { position: static; }`;
export const SummaryList = styled.div`display: grid; border-top: 1px solid ${c.border};`;
export const SummaryRow = styled.div`display: grid; grid-template-columns: 92px minmax(0, 1fr); gap: 10px; padding: 11px 0; border-bottom: 1px solid ${c.high}; font-size: 12px; span:first-child { color: ${c.muted}; } strong { ${mono} overflow-wrap: anywhere; font-size: 11px; text-align: right; } > :last-child { justify-self: end; }`;
export const StatusChip = styled.span`${mono} display: inline-flex; padding: 4px 8px; border: 1px solid ${({ $status }) => ($status === '처리 완료' ? `${c.green}66` : `${c.amber}66`)}; border-radius: 999px; background: ${({ $status }) => ($status === '처리 완료' ? `${c.green}18` : `${c.amber}18`)}; color: ${({ $status }) => ($status === '처리 완료' ? c.green : c.amber)}; font-size: 10px; font-weight: 700;`;
export const Notice = styled.div`display: flex; align-items: flex-start; gap: 8px; margin-top: 16px; padding: 10px; border: 1px solid ${({ $warning }) => ($warning ? `${c.amber}55` : c.border)}; border-radius: 4px; background: ${c.low}; color: ${({ $warning }) => ($warning ? c.amber : c.muted)}; font-size: 11px; line-height: 16px; svg { flex: 0 0 auto; margin-top: 1px; }`;
export const FormActions = styled.div`display: flex; justify-content: flex-end; gap: 8px; padding-top: 16px;`;
export const Toast = styled.div`position: fixed; right: 24px; bottom: 24px; display: flex; gap: 10px; max-width: 360px; padding: 14px 16px; border: 1px solid ${c.green}; border-radius: 4px; background: ${c.low}; color: ${c.muted}; font-size: 12px; line-height: 17px; svg, strong { color: ${c.green}; } span { display: grid; gap: 2px; }`;
