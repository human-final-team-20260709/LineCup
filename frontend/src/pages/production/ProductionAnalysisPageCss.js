import styled, { css } from 'styled-components';

const c = {
  alarm: '#ffb4ab',
  amber: '#ffb95f',
  bg: '#0b1326',
  border: '#334155',
  card: '#171f33',
  dim: '#869585',
  green: '#4be277',
  greenInk: '#003915',
  high: '#222a3d',
  low: '#131b2e',
  lowest: '#060e20',
  muted: '#bccbb9',
  text: '#dae2fd',
};

const tone = { alarm: c.alarm, success: c.green, warning: c.amber };
const mono = css`font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;`;
const label = css`font-size: 11px; font-weight: 700; line-height: 16px; letter-spacing: .1em; text-transform: uppercase;`;

export const Page = styled.main`
  min-height: 100vh;
  padding: 32px;
  background: ${c.bg};
  color: ${c.text};
  font-family: Inter, system-ui, sans-serif;

  *, *::before, *::after { box-sizing: border-box; }
  button, select { font: inherit; }

  @media (max-width: 720px) { padding: 16px; }
`;

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 700px) { flex-direction: column; }
`;

export const TitleGroup = styled.div`
  h1 { margin: 4px 0 8px; font-size: 26px; font-weight: 650; line-height: 34px; letter-spacing: -.02em; }
  p { margin: 0; color: ${c.muted}; font-size: 14px; line-height: 20px; }
`;

export const Eyebrow = styled.span`${label} color: ${c.green};`;

export const PeriodField = styled.label`
  display: grid;
  grid-template-columns: auto auto minmax(110px, auto);
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 8px 0 12px;
  border: 1px solid ${c.border};
  border-radius: 4px;
  background: ${c.lowest};
  color: ${c.dim};

  &:focus-within { border-color: ${c.green}; }
  > span { ${label}; }
  svg { color: ${c.green}; }
  select { height: 32px; border: 0; outline: 0; background: ${c.low}; color: ${c.text}; padding: 0 8px; border-radius: 3px; font-size: 12px; }
  option { background: ${c.low}; }
`;

export const MetricGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1000px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

export const MetricCard = styled.article`
  min-width: 0;
  min-height: 128px;
  padding: 16px;
  border: 1px solid ${c.border};
  border-radius: 4px;
  background: ${c.card};

  > span:last-child { display: block; margin-top: 7px; overflow: hidden; color: ${c.dim}; font-size: 11px; line-height: 16px; text-overflow: ellipsis; white-space: nowrap; }
`;

export const MetricLabel = styled.div`
  ${label};
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${c.muted};
  svg { color: ${c.green}; }
`;

export const MetricValue = styled.strong`
  ${mono};
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
  margin-top: 17px;
  overflow: hidden;
  color: ${({ $tone }) => tone[$tone] || c.text};
  font-family: ${({ $compact }) => ($compact ? 'Inter, system-ui, sans-serif' : undefined)};
  font-size: ${({ $compact }) => ($compact ? '19px' : '27px')};
  line-height: 32px;
  text-overflow: ellipsis;
  white-space: nowrap;
  small { color: ${c.muted}; font-size: 11px; }
`;

export const AnalysisGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1020px) { grid-template-columns: 1fr; }
`;

export const Panel = styled.article`
  grid-column: span ${({ $span = 12 }) => $span};
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${c.border};
  border-radius: 4px;
  background: ${c.card};

  @media (max-width: 1020px) { grid-column: 1; }
`;

export const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 72px;
  padding: 16px;
  border-bottom: 1px solid ${c.border};

  h2 { margin: 4px 0 0; font-size: 18px; font-weight: 600; line-height: 24px; }
`;

export const PanelLabel = styled.span`${label} color: ${c.green};`;
export const PanelMeta = styled.span`${mono} color: ${c.muted}; font-size: 11px; white-space: nowrap;`;

export const ChartBody = styled.div`
  width: 100%;
  height: 310px;
  padding: 16px 10px 10px 2px;

  .recharts-cartesian-axis-tick-value { ${mono}; font-size: 10px; }
  .recharts-legend-item-text { color: ${c.muted} !important; font-size: 11px; }
  .recharts-default-legend { padding-top: 4px !important; }
`;

export const TooltipCard = styled.div`
  min-width: 142px;
  padding: 10px 12px;
  border: 1px solid ${c.border};
  border-radius: 4px;
  background: ${c.lowest};
  box-shadow: 0 8px 24px rgba(0, 0, 0, .3);

  > strong { ${mono}; display: block; margin-bottom: 7px; font-size: 12px; }
`;

export const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 5px;
  color: ${c.muted};
  font-size: 11px;

  > span:first-child { display: inline-flex; align-items: center; gap: 6px; }
  > span:first-child::before { content: ''; width: 7px; height: 7px; border-radius: 2px; background: ${({ $color }) => $color || c.green}; }
`;

export const Mono = styled.span`
  ${mono};
  color: ${({ $tone }) => tone[$tone] || c.muted};
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
`;

export const AchievementList = styled.div`
  display: grid;
  gap: 17px;
  padding: 20px 16px;
`;

export const AchievementItem = styled.div`display: grid; gap: 8px;`;

export const AchievementHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;

  strong { display: block; font-size: 13px; line-height: 18px; }
  div > span { ${mono}; display: block; margin-top: 2px; color: ${c.dim}; font-size: 10px; }
`;

export const AchievementTrack = styled.div`
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: ${c.lowest};
`;

export const AchievementFill = styled.div`
  width: ${({ $value }) => `${Math.max(0, Math.min(100, $value || 0))}%`};
  height: 100%;
  border-radius: inherit;
  background: ${({ $complete }) => ($complete ? c.green : c.amber)};
`;

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
