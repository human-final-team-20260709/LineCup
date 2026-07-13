import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiAlertCircle,
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiTrendingDown,
} from 'react-icons/fi';
import {
  Page,
  PageHeader,
  TitleGroup,
  Eyebrow,
  HeaderActions,
  Button,
  StateSwitch,
  StateButton,
  MetricGrid,
  MetricCard,
  MetricHead,
  MetricValue,
  MetricFoot,
  DashboardGrid,
  Panel,
  PanelHeader,
  PanelLabel,
  PanelMeta,
  ProcessList,
  ProcessItem,
  ProgressTrack,
  ProgressFill,
  TableWrap,
  Table,
  Mono,
  StatusChip,
  EmptyState,
} from './DefectDashboardPageCss';

const processDefects = [
  { process: '포장', quantity: 38, ratio: 100, tone: 'alarm' },
  { process: '유탕', quantity: 27, ratio: 71, tone: 'warning' },
  { process: '제면', quantity: 18, ratio: 47, tone: 'primary' },
  { process: '증숙', quantity: 11, ratio: 29, tone: 'primary' },
  { process: '배합', quantity: 6, ratio: 16, tone: 'primary' },
];

const recentDefects = [
  {
    id: 'DF-260713-024',
    occurredAt: '2026-07-13 14:32',
    product: '매콤 볶음누들',
    process: '포장',
    type: '실링 불량',
    quantity: 12,
    status: '미처리',
    tone: 'alarm',
  },
  {
    id: 'DF-260713-023',
    occurredAt: '2026-07-13 13:18',
    product: '얼큰 컵누들',
    process: '유탕',
    type: '유탕 온도 편차',
    quantity: 8,
    status: '처리 중',
    tone: 'warning',
  },
  {
    id: 'DF-260713-022',
    occurredAt: '2026-07-13 11:46',
    product: '고소 크림누들',
    process: '제면',
    type: '면 중량 편차',
    quantity: 5,
    status: '처리 완료',
    tone: 'success',
  },
  {
    id: 'DF-260713-021',
    occurredAt: '2026-07-13 10:05',
    product: '얼큰 컵누들',
    process: '증숙',
    type: '수분 함량 초과',
    quantity: 3,
    status: '처리 완료',
    tone: 'success',
  },
];

function DefectDashboardPage() {
  const navigate = useNavigate();
  const [showEmpty, setShowEmpty] = useState(false);
  const dashboard = useMemo(
    () => ({
      processes: showEmpty ? [] : processDefects,
      recent: showEmpty ? [] : recentDefects,
    }),
    [showEmpty],
  );

  return (
    <Page>
      <PageHeader>
        <TitleGroup>
          <Eyebrow>Quality Control / Live</Eyebrow>
          <h1>불량 현황</h1>
          <p>오늘 발생한 불량 지표와 공정별 집중 관리 대상을 한눈에 확인합니다.</p>
        </TitleGroup>
        <HeaderActions>
          <Button type="button" onClick={() => navigate('/quality/defects')}>
            전체 목록 <FiArrowRight aria-hidden="true" />
          </Button>
          <Button $primary type="button" onClick={() => navigate('/quality/defects/new')}>
            <FiPlus aria-hidden="true" /> 불량 등록
          </Button>
        </HeaderActions>
      </PageHeader>

      <StateSwitch aria-label="데이터 상태 미리보기">
        <StateButton type="button" $active={!showEmpty} onClick={() => setShowEmpty(false)}>
          데이터 있음
        </StateButton>
        <StateButton type="button" $active={showEmpty} onClick={() => setShowEmpty(true)}>
          데이터 없음
        </StateButton>
      </StateSwitch>

      <MetricGrid>
        <MetricCard $tone="alarm">
          <MetricHead><FiAlertCircle /><span>오늘 불량 수량</span></MetricHead>
          <MetricValue>{showEmpty ? 0 : 100}<small>EA</small></MetricValue>
          <MetricFoot>전일 대비 <strong>12 EA 증가</strong></MetricFoot>
        </MetricCard>
        <MetricCard $tone="warning">
          <MetricHead><FiBarChart2 /><span>오늘 불량률</span></MetricHead>
          <MetricValue>{showEmpty ? '0.00' : '1.42'}<small>%</small></MetricValue>
          <MetricFoot><FiTrendingDown /> 목표 1.20% 대비 0.22%p 초과</MetricFoot>
        </MetricCard>
        <MetricCard $tone="alarm">
          <MetricHead><FiClock /><span>미처리 불량 건수</span></MetricHead>
          <MetricValue>{showEmpty ? 0 : 4}<small>건</small></MetricValue>
          <MetricFoot>긴급 확인 필요 <strong>1건</strong></MetricFoot>
        </MetricCard>
        <MetricCard $tone="success">
          <MetricHead><FiCheckCircle /><span>당일 처리율</span></MetricHead>
          <MetricValue>{showEmpty ? '0.0' : '84.6'}<small>%</small></MetricValue>
          <MetricFoot>처리 완료 {showEmpty ? 0 : 22}건</MetricFoot>
        </MetricCard>
      </MetricGrid>

      <DashboardGrid>
        <Panel>
          <PanelHeader>
            <div><PanelLabel>Process Breakdown</PanelLabel><h2>공정별 불량 수량</h2></div>
            <PanelMeta>Today · EA</PanelMeta>
          </PanelHeader>
          {dashboard.processes.length ? (
            <ProcessList>
              {dashboard.processes.map((item) => (
                <ProcessItem key={item.process}>
                  <div><strong>{item.process}</strong><Mono>{item.quantity} EA</Mono></div>
                  <ProgressTrack><ProgressFill $value={item.ratio} $tone={item.tone} /></ProgressTrack>
                </ProcessItem>
              ))}
            </ProcessList>
          ) : (
            <EmptyState><FiCheckCircle /><strong>공정별 불량 데이터가 없습니다.</strong><span>오늘 등록된 불량이 없습니다.</span></EmptyState>
          )}
        </Panel>

        <Panel $wide>
          <PanelHeader>
            <div><PanelLabel>Recent Defects</PanelLabel><h2>최근 발생 불량</h2></div>
            <PanelMeta>{dashboard.recent.length} records</PanelMeta>
          </PanelHeader>
          {dashboard.recent.length ? (
            <TableWrap>
              <Table>
                <thead><tr><th>발생 일시</th><th>제품명</th><th>공정</th><th>불량 유형</th><th>수량</th><th>처리 상태</th></tr></thead>
                <tbody>
                  {dashboard.recent.map((defect) => (
                    <tr key={defect.id} tabIndex="0" onClick={() => navigate(`/quality/defects/${defect.id}`)} onKeyDown={(event) => {
                      if (event.key === 'Enter') navigate(`/quality/defects/${defect.id}`);
                    }}>
                      <td><Mono>{defect.occurredAt}</Mono></td>
                      <td><strong>{defect.product}</strong><small>{defect.id}</small></td>
                      <td>{defect.process}</td><td>{defect.type}</td>
                      <td><Mono>{defect.quantity} EA</Mono></td>
                      <td><StatusChip $tone={defect.tone}>{defect.status}</StatusChip></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          ) : (
            <EmptyState><FiCheckCircle /><strong>최근 발생한 불량이 없습니다.</strong><span>신규 불량 등록 시 이 영역에 표시됩니다.</span></EmptyState>
          )}
        </Panel>
      </DashboardGrid>
    </Page>
  );
}

export default DefectDashboardPage;
