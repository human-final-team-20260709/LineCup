import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiFilter, FiPlus, FiSearch } from 'react-icons/fi';
import CommonPagination from '../../components/CommonPagination';
import {
  Page, PageHeader, TitleGroup, Eyebrow, Button, StateSwitch, StateButton, Toolbar, SearchField,
  SelectField, TableCard, CardHeader, PanelLabel, Count, TableWrap, Table, Mono, StatusChip,
  EmptyState,
} from './DefectListPageCss';

const defects = [
  { id: 'DF-260713-024', occurredAt: '2026-07-13 14:32', product: '매콤 볶음누들', order: 'WO-20260713-003', lot: 'LOT-P-260713-031', process: '포장', type: '실링 불량', quantity: 12, status: '미처리', tone: 'alarm' },
  { id: 'DF-260713-023', occurredAt: '2026-07-13 13:18', product: '얼큰 컵누들', order: 'WO-20260713-001', lot: 'LOT-P-260713-028', process: '유탕', type: '유탕 온도 편차', quantity: 8, status: '처리 중', tone: 'warning' },
  { id: 'DF-260713-022', occurredAt: '2026-07-13 11:46', product: '고소 크림누들', order: 'WO-20260713-002', lot: 'LOT-P-260713-025', process: '제면', type: '면 중량 편차', quantity: 5, status: '처리 완료', tone: 'success' },
  { id: 'DF-260713-021', occurredAt: '2026-07-13 10:05', product: '얼큰 컵누들', order: 'WO-20260713-001', lot: 'LOT-P-260713-023', process: '증숙', type: '수분 함량 초과', quantity: 3, status: '처리 완료', tone: 'success' },
  { id: 'DF-260713-020', occurredAt: '2026-07-13 09:24', product: '담백 쌀국수', order: 'WO-20260713-004', lot: 'LOT-P-260713-019', process: '포장', type: '인쇄 위치 편차', quantity: 16, status: '처리 중', tone: 'warning' },
  { id: 'DF-260712-019', occurredAt: '2026-07-12 17:52', product: '매콤 볶음누들', order: 'WO-20260712-006', lot: 'LOT-P-260712-044', process: '검사', type: '중량 미달', quantity: 7, status: '처리 완료', tone: 'success' },
  { id: 'DF-260712-018', occurredAt: '2026-07-12 16:30', product: '얼큰 컵누들', order: 'WO-20260712-004', lot: 'LOT-P-260712-041', process: '배합', type: '배합비 편차', quantity: 4, status: '보류', tone: 'neutral' },
  { id: 'DF-260712-017', occurredAt: '2026-07-12 15:11', product: '고소 크림누들', order: 'WO-20260712-005', lot: 'LOT-P-260712-038', process: '포장', type: '용기 변형', quantity: 10, status: '처리 완료', tone: 'success' },
  { id: 'DF-260712-016', occurredAt: '2026-07-12 13:46', product: '담백 쌀국수', order: 'WO-20260712-003', lot: 'LOT-P-260712-033', process: '건조', type: '수분율 편차', quantity: 6, status: '처리 완료', tone: 'success' },
];

const PAGE_SIZE = 6;

function DefectListPage() {
  const navigate = useNavigate();
  const [showEmpty, setShowEmpty] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [process, setProcess] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (showEmpty) return [];
    const keyword = query.trim().toLowerCase();
    return defects.filter((item) => {
      const matchesQuery = !keyword || [item.id, item.product, item.order, item.lot, item.type].some((value) => value.toLowerCase().includes(keyword));
      return matchesQuery && (status === 'all' || item.status === status) && (process === 'all' || item.process === process);
    });
  }, [process, query, showEmpty, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const resetPage = (setter) => (event) => { setter(event.target.value); setPage(1); };

  return (
    <Page>
      <PageHeader>
        <TitleGroup><Eyebrow>Quality Control / Records</Eyebrow><h1>불량 목록</h1><p>생산 중 발생한 불량 이력과 처리 상태를 조건별로 조회합니다.</p></TitleGroup>
        <Button $primary type="button" onClick={() => navigate('/quality/defects/new')}><FiPlus /> 불량 등록</Button>
      </PageHeader>

      <StateSwitch aria-label="데이터 상태 미리보기">
        <StateButton type="button" $active={!showEmpty} onClick={() => { setShowEmpty(false); setPage(1); }}>데이터 있음</StateButton>
        <StateButton type="button" $active={showEmpty} onClick={() => { setShowEmpty(true); setPage(1); }}>데이터 없음</StateButton>
      </StateSwitch>

      <Toolbar>
        <SearchField><FiSearch /><input value={query} onChange={resetPage(setQuery)} placeholder="제품명, 작업지시, LOT, 불량 유형 검색" aria-label="불량 검색" /></SearchField>
        <SelectField><FiFilter /><select value={process} onChange={resetPage(setProcess)} aria-label="발생 공정"><option value="all">전체 공정</option><option>배합</option><option>제면</option><option>증숙</option><option>건조</option><option>유탕</option><option>포장</option><option>검사</option></select></SelectField>
        <SelectField><select value={status} onChange={resetPage(setStatus)} aria-label="처리 상태"><option value="all">전체 처리 상태</option><option>미처리</option><option>처리 중</option><option>처리 완료</option><option>보류</option></select></SelectField>
      </Toolbar>

      <TableCard>
        <CardHeader><div><PanelLabel>Defect Records</PanelLabel><h2>불량 발생 이력</h2></div><Count>{filtered.length} records</Count></CardHeader>
        {rows.length ? (
          <>
            <TableWrap>
              <Table>
                <thead><tr><th>발생 일시</th><th>제품명</th><th>작업지시 번호</th><th>생산 LOT 번호</th><th>발생 공정</th><th>불량 유형</th><th>불량 수량</th><th>처리 상태</th></tr></thead>
                <tbody>{rows.map((item) => (
                  <tr key={item.id} tabIndex="0" onClick={() => navigate(`/quality/defects/${item.id}`)} onKeyDown={(event) => {
                    if (event.key === 'Enter') navigate(`/quality/defects/${item.id}`);
                  }}>
                    <td><Mono>{item.occurredAt}</Mono><small>{item.id}</small></td><td><strong>{item.product}</strong></td>
                    <td><Mono>{item.order}</Mono></td><td><Mono>{item.lot}</Mono></td><td>{item.process}</td><td>{item.type}</td>
                    <td><Mono>{item.quantity} EA</Mono></td><td><StatusChip $tone={item.tone}>{item.status}</StatusChip></td>
                  </tr>
                ))}</tbody>
              </Table>
            </TableWrap>
            <CommonPagination
              ariaLabel="불량 목록 페이지 이동"
              currentPage={safePage}
              onPageChange={setPage}
              pageSize={PAGE_SIZE}
              totalItems={filtered.length}
              totalPages={totalPages}
            />
          </>
        ) : (
          <EmptyState><FiCheckCircle /><strong>조건에 맞는 불량 이력이 없습니다.</strong><span>검색어나 필터를 변경하거나 새 불량을 등록해 주세요.</span><Button type="button" onClick={() => { setQuery(''); setStatus('all'); setProcess('all'); setShowEmpty(false); }}>필터 초기화</Button></EmptyState>
        )}
      </TableCard>
    </Page>
  );
}

export default DefectListPage;
