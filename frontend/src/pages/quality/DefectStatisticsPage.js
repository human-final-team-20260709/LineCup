import { useMemo, useState } from 'react';
import { FiBarChart2, FiCalendar, FiCheckCircle, FiTarget, FiTrendingDown } from 'react-icons/fi';
import {
  Page, PageHeader, TitleGroup, Eyebrow, ControlRow, StateSwitch, StateButton, SelectField,
  MetricGrid, MetricCard, MetricLabel, MetricValue, StatsGrid, Panel, PanelHeader, PanelLabel, Mono,
  DailyChart, DailyColumn, BarTrack, BarFill, HorizontalList, HorizontalItem, ProgressTrack, ProgressFill,
  TypeGrid, TypeCard, TypeIcon, TableWrap, Table, Rank, Trend, EmptyState,
} from './DefectStatisticsPageCss';

const dailyRates = [
  { day: '07-07', rate: 1.18 }, { day: '07-08', rate: 1.35 }, { day: '07-09', rate: 1.12 },
  { day: '07-10', rate: 1.56 }, { day: '07-11', rate: 1.31 }, { day: '07-12', rate: 1.47 }, { day: '07-13', rate: 1.42 },
];
const productRates = [
  { name: '매콤 볶음누들', rate: 1.82 }, { name: '얼큰 컵누들', rate: 1.47 }, { name: '담백 쌀국수', rate: 1.23 }, { name: '고소 크림누들', rate: 0.94 },
];
const processRates = [
  { name: '포장', rate: 2.14 }, { name: '유탕', rate: 1.68 }, { name: '제면', rate: 1.22 }, { name: '증숙', rate: 0.88 }, { name: '배합', rate: 0.42 },
];
const typeCounts = [
  { type: '실링 불량', count: 38, percent: 31 }, { type: '중량 편차', count: 27, percent: 22 }, { type: '수분율 편차', count: 21, percent: 17 }, { type: '용기 변형', count: 18, percent: 15 },
];
const ranking = [
  { rank: 1, type: '실링 불량', process: '포장', count: 38, trend: '+12.4%', up: true },
  { rank: 2, type: '중량 편차', process: '검사', count: 27, trend: '-4.2%', up: false },
  { rank: 3, type: '수분율 편차', process: '건조', count: 21, trend: '+2.8%', up: true },
  { rank: 4, type: '유탕 온도 편차', process: '유탕', count: 17, trend: '-6.1%', up: false },
  { rank: 5, type: '용기 변형', process: '포장', count: 15, trend: '+1.5%', up: true },
];

function DefectStatisticsPage() {
  const [showEmpty, setShowEmpty] = useState(false);
  const [period, setPeriod] = useState('7days');
  const stats = useMemo(() => showEmpty ? { daily: [], products: [], processes: [], types: [], ranking: [] } : { daily: dailyRates, products: productRates, processes: processRates, types: typeCounts, ranking }, [showEmpty]);
  const average = stats.daily.length ? stats.daily.reduce((sum, item) => sum + item.rate, 0) / stats.daily.length : 0;
  const maxDaily = Math.max(...stats.daily.map((item) => item.rate), 1);
  const maxProduct = Math.max(...stats.products.map((item) => item.rate), 1);
  const maxProcess = Math.max(...stats.processes.map((item) => item.rate), 1);
  const totalTypes = stats.types.reduce((sum, item) => sum + item.count, 0);

  return (
    <Page>
      <PageHeader>
        <TitleGroup><Eyebrow>Quality Control / Analytics</Eyebrow><h1>불량 통계</h1><p>기간별 불량률과 제품·공정·유형별 품질 추이를 비교 분석합니다.</p></TitleGroup>
      </PageHeader>

      <ControlRow>
        <StateSwitch aria-label="통계 데이터 상태 미리보기">
          <StateButton type="button" $active={!showEmpty} onClick={() => setShowEmpty(false)}>데이터 있음</StateButton>
          <StateButton type="button" $active={showEmpty} onClick={() => setShowEmpty(true)}>데이터 없음</StateButton>
        </StateSwitch>
        <SelectField><FiCalendar /><select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="통계 기간"><option value="7days">최근 7일</option><option value="30days">최근 30일</option><option value="quarter">최근 3개월</option></select></SelectField>
      </ControlRow>

      <MetricGrid>
        <MetricCard><MetricLabel><FiBarChart2 /> 평균 불량률</MetricLabel><MetricValue>{average.toFixed(2)}<small>%</small></MetricValue><span>목표 기준 1.20%</span></MetricCard>
        <MetricCard><MetricLabel><FiTarget /> 최고 불량률</MetricLabel><MetricValue $warning>{stats.daily.length ? Math.max(...stats.daily.map((item) => item.rate)).toFixed(2) : '0.00'}<small>%</small></MetricValue><span>{stats.daily.length ? '07-10 발생' : '집계 데이터 없음'}</span></MetricCard>
        <MetricCard><MetricLabel><FiTrendingDown /> 전주 대비</MetricLabel><MetricValue $success>{showEmpty ? '0.0' : '-0.18'}<small>%p</small></MetricValue><span>품질 지표 개선</span></MetricCard>
        <MetricCard><MetricLabel><FiCheckCircle /> 유형별 발생</MetricLabel><MetricValue>{totalTypes}<small>건</small></MetricValue><span>상위 4개 유형 합계</span></MetricCard>
      </MetricGrid>

      {stats.daily.length ? (
        <StatsGrid>
          <Panel $span="7">
            <PanelHeader><div><PanelLabel>Daily Defect Rate</PanelLabel><h2>일별 불량률</h2></div><Mono>Target 1.20%</Mono></PanelHeader>
            <DailyChart>
              {stats.daily.map((item) => <DailyColumn key={item.day}><Mono>{item.rate.toFixed(2)}%</Mono><BarTrack><BarFill $value={(item.rate / maxDaily) * 100} $over={item.rate > 1.2} /></BarTrack><span>{item.day}</span></DailyColumn>)}
            </DailyChart>
          </Panel>
          <Panel $span="5">
            <PanelHeader><div><PanelLabel>Product Rate</PanelLabel><h2>제품별 불량률</h2></div><Mono>Top 4</Mono></PanelHeader>
            <HorizontalList>{stats.products.map((item) => <HorizontalItem key={item.name}><div><strong>{item.name}</strong><Mono>{item.rate.toFixed(2)}%</Mono></div><ProgressTrack><ProgressFill $value={(item.rate / maxProduct) * 100} $warning={item.rate > 1.2} /></ProgressTrack></HorizontalItem>)}</HorizontalList>
          </Panel>
          <Panel $span="5">
            <PanelHeader><div><PanelLabel>Process Rate</PanelLabel><h2>공정별 불량률</h2></div><Mono>All Lines</Mono></PanelHeader>
            <HorizontalList>{stats.processes.map((item) => <HorizontalItem key={item.name}><div><strong>{item.name}</strong><Mono>{item.rate.toFixed(2)}%</Mono></div><ProgressTrack><ProgressFill $value={(item.rate / maxProcess) * 100} $warning={item.rate > 1.2} /></ProgressTrack></HorizontalItem>)}</HorizontalList>
          </Panel>
          <Panel $span="7">
            <PanelHeader><div><PanelLabel>Defect Type Count</PanelLabel><h2>불량 유형별 발생 건수</h2></div><Mono>{totalTypes} cases</Mono></PanelHeader>
            <TypeGrid>{stats.types.map((item, index) => <TypeCard key={item.type}><TypeIcon>{String(index + 1).padStart(2, '0')}</TypeIcon><div><strong>{item.type}</strong><span>전체의 {item.percent}%</span></div><Mono>{item.count}건</Mono></TypeCard>)}</TypeGrid>
          </Panel>
          <Panel $span="12">
            <PanelHeader><div><PanelLabel>Frequent Defect Ranking</PanelLabel><h2>자주 발생하는 불량 순위</h2></div><Mono>{period === '7days' ? 'Last 7 Days' : period === '30days' ? 'Last 30 Days' : 'Last Quarter'}</Mono></PanelHeader>
            <TableWrap><Table><thead><tr><th>순위</th><th>불량 유형</th><th>주요 발생 공정</th><th>발생 건수</th><th>이전 기간 대비</th></tr></thead><tbody>{stats.ranking.map((item) => <tr key={item.rank}><td><Rank>{item.rank}</Rank></td><td><strong>{item.type}</strong></td><td>{item.process}</td><td><Mono>{item.count}건</Mono></td><td><Trend $up={item.up}>{item.trend}</Trend></td></tr>)}</tbody></Table></TableWrap>
          </Panel>
        </StatsGrid>
      ) : (
        <EmptyState><FiCheckCircle /><strong>선택 기간의 불량 통계가 없습니다.</strong><span>불량 이력이 누적되면 차트와 순위가 이 영역에 표시됩니다.</span></EmptyState>
      )}
    </Page>
  );
}

export default DefectStatisticsPage;
