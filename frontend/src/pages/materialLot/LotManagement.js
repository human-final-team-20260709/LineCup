import { useEffect, useMemo, useState } from 'react';
import { FiArchive, FiClock, FiSearch } from 'react-icons/fi';
import {
  Badge,
  DetailColumn,
  DetailEmpty,
  EmptyState,
  FilterButton,
  InfoCard,
  InfoGrid,
  LotGrid,
  LotList,
  LotListEmpty,
  LotListItem,
  LotMeta,
  LotTitle,
  PageSection,
  ProcessStep,
  SearchBox,
  SearchInput,
  SectionHeader,
  SectionTitle,
  Timeline,
  Toolbar,
  TraceTable,
} from './LotManagementCss';

const lotData = [
  {
    lotNo: 'LOT-240712-001',
    type: 'progress',
    workOrderNo: 'WO-2407-118',
    productName: '매운 컵라면 110g',
    quantity: '12,000 EA',
    startTime: '08:30',
    endTime: '14:10',
    productionTime: '08:30 - 14:10',
    status: '진행중',
    currentProcess: '충진',
    processHistory: [
      { step: '01', process: '배합', result: '정상 완료' },
      { step: '02', process: '증숙', result: '정상 완료' },
      { step: '03', process: '건조', result: '정상 완료' },
      { step: '04', process: '충진', result: '진행중' },
      { step: '05', process: '포장', result: '대기 중' },
    ],
    materialLots: [
      {
        materialLotNo: 'ML-NDL-240712-001',
        materialName: '면 블록',
        inboundDate: '2026-07-10',
        expireDate: '2026-08-10',
        usedQty: '12,000 EA',
        status: '사용중',
      },
      {
        materialLotNo: 'ML-SUP-240712-014',
        materialName: '분말 스프',
        inboundDate: '2026-07-09',
        expireDate: '2026-10-07',
        usedQty: '150,000 g',
        status: '사용중',
      },
      {
        materialLotNo: 'ML-CUP-240712-110',
        materialName: '컵 용기',
        inboundDate: '2026-07-08',
        expireDate: '-',
        usedQty: '12,000 EA',
        status: '사용중',
      },
    ],
  },
  {
    lotNo: 'LOT-240712-002',
    type: 'progress',
    workOrderNo: 'WO-2407-119',
    productName: '해물 컵라면 105g',
    quantity: '8,000 EA',
    startTime: '-',
    endTime: '-',
    productionTime: '작업 대기',
    status: '대기',
    currentProcess: '작업 대기',
    processHistory: [
      { step: '01', process: '배합', result: '대기 중' },
      { step: '02', process: '증숙', result: '대기 중' },
      { step: '03', process: '건조', result: '대기 중' },
      { step: '04', process: '충진', result: '대기 중' },
      { step: '05', process: '포장', result: '대기 중' },
    ],
    materialLots: [
      {
        materialLotNo: 'ML-NDL-240712-002',
        materialName: '면 블록',
        inboundDate: '2026-07-11',
        expireDate: '2026-08-11',
        usedQty: '8,000 EA',
        status: '대기',
      },
      {
        materialLotNo: 'ML-VEG-240712-011',
        materialName: '건더기',
        inboundDate: '2026-07-10',
        expireDate: '2026-10-10',
        usedQty: '20,800 g',
        status: '대기',
      },
    ],
  },
  {
    lotNo: 'LOT-240711-014',
    type: 'completed',
    workOrderNo: 'WO-2407-092',
    productName: '왕컵 우동 120g',
    quantity: '9,500 EA',
    startTime: '09:00',
    endTime: '13:40',
    productionTime: '09:00 - 13:40',
    status: '완료',
    currentProcess: '포장 완료',
    processHistory: [
      { step: '01', process: '배합', result: '정상 완료' },
      { step: '02', process: '증숙', result: '정상 완료' },
      { step: '03', process: '건조', result: '정상 완료' },
      { step: '04', process: '충진', result: '정상 완료' },
      { step: '05', process: '포장', result: '정상 완료' },
    ],
    materialLots: [
      {
        materialLotNo: 'ML-NDL-240711-014',
        materialName: '우동 면 블록',
        inboundDate: '2026-07-09',
        expireDate: '2026-08-09',
        usedQty: '9,500 EA',
        status: '사용완료',
      },
      {
        materialLotNo: 'ML-SUP-240711-032',
        materialName: '액상 스프',
        inboundDate: '2026-07-08',
        expireDate: '2026-10-08',
        usedQty: '171,000 g',
        status: '사용완료',
      },
    ],
  },
  {
    lotNo: 'LOT-240710-009',
    type: 'completed',
    workOrderNo: 'WO-2407-081',
    productName: '매운 컵라면 110g',
    quantity: '10,000 EA',
    startTime: '10:00',
    endTime: '15:20',
    productionTime: '10:00 - 15:20',
    status: '완료',
    currentProcess: '출하 대기',
    processHistory: [
      { step: '01', process: '배합', result: '정상 완료' },
      { step: '02', process: '증숙', result: '정상 완료' },
      { step: '03', process: '건조', result: '정상 완료' },
      { step: '04', process: '충진', result: '정상 완료' },
      { step: '05', process: '포장', result: '정상 완료' },
    ],
    materialLots: [
      {
        materialLotNo: 'ML-NDL-240710-009',
        materialName: '면 블록',
        inboundDate: '2026-07-07',
        expireDate: '2026-08-07',
        usedQty: '10,000 EA',
        status: '사용완료',
      },
      {
        materialLotNo: 'ML-LID-240710-110',
        materialName: '뚜껑 필름',
        inboundDate: '2026-07-06',
        expireDate: '-',
        usedQty: '10,000 EA',
        status: '사용완료',
      },
    ],
  },
];

const getStatusTone = (status) => {
  if (status === '완료' || status === '정상 완료' || status === '사용완료') {
    return 'success';
  }

  if (status === '대기' || status === '대기 중' || status === '보류') {
    return 'warning';
  }

  if (status === '이상' || status === '부족') {
    return 'danger';
  }

  return 'active';
};

function LotManagement({ showEmptyState = false }) {
  const [lotViewType, setLotViewType] = useState('progress');
  const [selectedLotNo, setSelectedLotNo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLots = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return lotData.filter((lot) => {
      const matchesType = lot.type === lotViewType;
      const matchesSearch =
        !keyword ||
        lot.lotNo.toLowerCase().includes(keyword) ||
        lot.workOrderNo.toLowerCase().includes(keyword) ||
        lot.productName.toLowerCase().includes(keyword);

      return matchesType && matchesSearch;
    });
  }, [lotViewType, searchTerm]);

  const selectedLot = useMemo(
    () => filteredLots.find((lot) => lot.lotNo === selectedLotNo) || null,
    [filteredLots, selectedLotNo]
  );

  useEffect(() => {
    setSelectedLotNo(filteredLots[0]?.lotNo || '');
  }, [lotViewType, searchTerm, filteredLots]);

  if (showEmptyState) {
    return (
      <PageSection>
        <Toolbar>
          <SearchBox>
            <FiSearch aria-hidden="true" />
            <SearchInput placeholder="LOT 번호, 작업지시 번호 검색" />
          </SearchBox>
          <FilterButton type="button" $active>
            진행 LOT
          </FilterButton>
          <FilterButton type="button">완료 LOT</FilterButton>
        </Toolbar>
        <EmptyState>
          <FiArchive aria-hidden="true" />
          <strong>생산 LOT 이력이 없습니다.</strong>
          <p>생산 시작 후 LOT 번호가 발행되면 원자재 투입부터 완제품까지 추적됩니다.</p>
        </EmptyState>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <Toolbar>
        <SearchBox>
          <FiSearch aria-hidden="true" />
          <SearchInput
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="LOT 번호, 작업지시 번호, 제품명 검색"
          />
        </SearchBox>
        <FilterButton
          type="button"
          $active={lotViewType === 'progress'}
          onClick={() => setLotViewType('progress')}
        >
          진행 LOT
        </FilterButton>
        <FilterButton
          type="button"
          $active={lotViewType === 'completed'}
          onClick={() => setLotViewType('completed')}
        >
          완료 LOT
        </FilterButton>
      </Toolbar>

      <LotGrid>
        <LotList>
          <SectionHeader>
            <SectionTitle>
              {lotViewType === 'progress' ? '진행 LOT 목록' : '완료 LOT 목록'}
            </SectionTitle>
          </SectionHeader>
          {filteredLots.length > 0 ? (
            filteredLots.map((lot) => (
              <LotListItem
                key={lot.lotNo}
                type="button"
                $active={selectedLot?.lotNo === lot.lotNo}
                onClick={() => setSelectedLotNo(lot.lotNo)}
              >
                <div>
                  <LotTitle>{lot.lotNo}</LotTitle>
                  <LotMeta>
                    {lot.workOrderNo} · {lot.productName}
                  </LotMeta>
                  <LotMeta>{lot.currentProcess}</LotMeta>
                </div>
                <Badge $tone={getStatusTone(lot.status)}>{lot.status}</Badge>
              </LotListItem>
            ))
          ) : (
            <LotListEmpty>
              <strong>
                {lotViewType === 'progress'
                  ? '진행 중인 LOT가 없습니다.'
                  : '완료된 LOT가 없습니다.'}
              </strong>
              <p>
                {lotViewType === 'progress'
                  ? '현재 진행 또는 대기 중인 생산 LOT가 없습니다.'
                  : '완료 처리된 생산 LOT가 없습니다.'}
              </p>
            </LotListEmpty>
          )}
        </LotList>

        <DetailColumn>
          {selectedLot ? (
            <>
              <InfoGrid>
                <InfoCard>
                  <span>LOT 번호</span>
                  <strong>{selectedLot.lotNo}</strong>
                </InfoCard>
                <InfoCard>
                  <span>생산 수량</span>
                  <strong>{selectedLot.quantity}</strong>
                </InfoCard>
                <InfoCard>
                  <span>생산 시간</span>
                  <strong>{selectedLot.productionTime}</strong>
                </InfoCard>
                <InfoCard>
                  <span>상태</span>
                  <strong>{selectedLot.status}</strong>
                </InfoCard>
              </InfoGrid>

              <Timeline>
                <SectionHeader>
                  <SectionTitle>공정 진행 이력</SectionTitle>
                  <FiClock aria-hidden="true" />
                </SectionHeader>
                {selectedLot.processHistory.map((step) => (
                  <ProcessStep key={step.step} $tone={getStatusTone(step.result)}>
                    <span>{step.step}</span>
                    <strong>{step.process}</strong>
                    <em>{step.result}</em>
                  </ProcessStep>
                ))}
              </Timeline>
            </>
          ) : (
            <DetailEmpty>
              <FiArchive aria-hidden="true" />
              <strong>
                {lotViewType === 'progress'
                  ? '진행 중인 LOT가 없습니다.'
                  : '완료된 LOT가 없습니다.'}
              </strong>
              <p>
                {lotViewType === 'progress'
                  ? '현재 진행 또는 대기 중인 생산 LOT가 없습니다.'
                  : '완료 처리된 생산 LOT가 없습니다.'}
              </p>
            </DetailEmpty>
          )}
        </DetailColumn>
      </LotGrid>

      {selectedLot ? (
        <TraceTable>
          <thead>
            <tr>
              <th>자재 LOT</th>
              <th>자재명</th>
              <th>입고일</th>
              <th>유통기한</th>
              <th>사용량</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {selectedLot.materialLots.map((lot) => (
              <tr key={lot.materialLotNo}>
                <td>{lot.materialLotNo}</td>
                <td>{lot.materialName}</td>
                <td>{lot.inboundDate}</td>
                <td>{lot.expireDate}</td>
                <td>{lot.usedQty}</td>
                <td>
                  <Badge $tone={getStatusTone(lot.status)}>{lot.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </TraceTable>
      ) : (
        <DetailEmpty>
          <strong>표시할 자재 LOT가 없습니다.</strong>
          <p>LOT를 선택하면 투입된 자재 LOT 이력이 표시됩니다.</p>
        </DetailEmpty>
      )}
    </PageSection>
  );
}

export default LotManagement;
