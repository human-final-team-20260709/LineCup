import { useMemo, useState } from 'react';
import { FiInbox, FiSearch, FiSliders, FiX } from 'react-icons/fi';
import {
  Badge,
  ConditionApplyButton,
  ConditionCancelButton,
  ConditionChip,
  ConditionClearButton,
  ConditionField,
  ConditionFormGrid,
  ConditionInput,
  ConditionLabel,
  ConditionModal,
  ConditionModalBody,
  ConditionModalCloseButton,
  ConditionModalDescription,
  ConditionModalFooter,
  ConditionModalHeader,
  ConditionModalOverlay,
  ConditionModalTitle,
  ConditionResetButton,
  ConditionSelect,
  ConditionSummaryBar,
  DateRangeGroup,
  EmptyState,
  FilterButton,
  InventoryEmptyState,
  InventoryGrid,
  Ledger,
  LedgerItem,
  MetricCard,
  MetricGrid,
  PageSection,
  SearchBox,
  StockCard,
  StockHeader,
  StockMeta,
  StockName,
  StockProgress,
  StockProgressFill,
  StockTable,
  Toolbar,
} from './InventoryManagementCss';

const defaultCondition = {
  itemType: '전체',
  stockStatus: '전체',
  safetyStock: '전체',
  lotNo: '',
  expireStartDate: '',
  expireEndDate: '',
};

const stockItems = [
  {
    name: '면 블록',
    lot: 'MAT-L-8831',
    current: 13420,
    safe: 9000,
    unit: 'EA',
    type: '자재',
    status: '정상',
    expireDate: '2026-08-09',
  },
  {
    name: '분말 스프',
    lot: 'MAT-L-7742',
    current: 146200,
    safe: 150000,
    unit: 'g',
    type: '자재',
    status: '부족',
    expireDate: '2026-10-07',
  },
  {
    name: '컵 용기',
    lot: 'MAT-L-9107',
    current: 11680,
    safe: 12000,
    unit: 'EA',
    type: '자재',
    status: '주의',
    expireDate: '',
  },
  {
    name: '매운 컵라면 110g',
    lot: 'LOT-240711-014',
    current: 9200,
    safe: 5000,
    unit: 'EA',
    type: '완제품',
    status: '정상',
    expireDate: '2026-09-15',
  },
];

const ledger = [
  { time: '14:20', type: '입고', item: '컵 용기', qty: '+2,000 EA', owner: '김민준' },
  { time: '13:45', type: '출고', item: '분말 스프', qty: '-150,000 g', owner: '이서연' },
  { time: '12:10', type: '입고', item: '완제품', qty: '+9,200 EA', owner: '박지훈' },
];

const isDefaultCondition = (condition) =>
  condition.itemType === defaultCondition.itemType &&
  condition.stockStatus === defaultCondition.stockStatus &&
  condition.safetyStock === defaultCondition.safetyStock &&
  condition.lotNo === defaultCondition.lotNo &&
  condition.expireStartDate === defaultCondition.expireStartDate &&
  condition.expireEndDate === defaultCondition.expireEndDate;

function InventoryManagement({ showEmptyState = false }) {
  const [activeType, setActiveType] = useState('전체');
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [conditionForm, setConditionForm] = useState(defaultCondition);
  const [appliedCondition, setAppliedCondition] = useState(defaultCondition);

  const handleOpenConditionModal = () => {
    setConditionForm(appliedCondition);
    setIsConditionModalOpen(true);
  };

  const handleCloseConditionModal = () => {
    setIsConditionModalOpen(false);
  };

  const handleConditionChange = (field, value) => {
    setConditionForm((currentCondition) => ({
      ...currentCondition,
      [field]: value,
    }));
  };

  const handleResetCondition = () => {
    setConditionForm(defaultCondition);
  };

  const handleApplyCondition = () => {
    setAppliedCondition(conditionForm);
    setActiveType(conditionForm.itemType);
    setIsConditionModalOpen(false);
  };

  const handleClearAppliedCondition = () => {
    setAppliedCondition(defaultCondition);
    setConditionForm(defaultCondition);
    setActiveType('전체');
  };

  const filteredItems = useMemo(() => {
    const lotKeyword = appliedCondition.lotNo.trim().toLowerCase();

    return stockItems.filter((item) => {
      const typeFilter = appliedCondition.itemType !== '전체' ? appliedCondition.itemType : activeType;
      const matchesType = typeFilter === '전체' || item.type === typeFilter;
      const matchesStatus =
        appliedCondition.stockStatus === '전체' || item.status === appliedCondition.stockStatus;
      const matchesSafety =
        appliedCondition.safetyStock === '전체' ||
        (appliedCondition.safetyStock === '미달만 보기' && item.current < item.safe) ||
        (appliedCondition.safetyStock === '정상만 보기' && item.current >= item.safe);
      const matchesLot = !lotKeyword || item.lot.toLowerCase().includes(lotKeyword);
      const matchesExpireStart =
        !appliedCondition.expireStartDate ||
        !item.expireDate ||
        item.expireDate >= appliedCondition.expireStartDate;
      const matchesExpireEnd =
        !appliedCondition.expireEndDate ||
        !item.expireDate ||
        item.expireDate <= appliedCondition.expireEndDate;

      return (
        matchesType &&
        matchesStatus &&
        matchesSafety &&
        matchesLot &&
        matchesExpireStart &&
        matchesExpireEnd
      );
    });
  }, [activeType, appliedCondition]);

  const conditionChips = useMemo(() => {
    if (isDefaultCondition(appliedCondition)) {
      return [];
    }

    return [
      appliedCondition.itemType !== '전체' ? appliedCondition.itemType : null,
      appliedCondition.stockStatus !== '전체' ? appliedCondition.stockStatus : null,
      appliedCondition.safetyStock !== '전체' ? appliedCondition.safetyStock : null,
      appliedCondition.lotNo ? appliedCondition.lotNo : null,
      appliedCondition.expireStartDate || appliedCondition.expireEndDate
        ? `${appliedCondition.expireStartDate || '시작일'} ~ ${
            appliedCondition.expireEndDate || '종료일'
          }`
        : null,
    ].filter(Boolean);
  }, [appliedCondition]);

  if (showEmptyState) {
    return (
      <PageSection>
        <Toolbar>
          <SearchBox>
            <FiSearch aria-hidden="true" />
            <span>자재명, 제품명, LOT 번호 검색</span>
          </SearchBox>
          <FilterButton type="button">안전 재고 미달</FilterButton>
        </Toolbar>
        <EmptyState>
          <FiInbox aria-hidden="true" />
          <strong>표시할 재고 데이터가 없습니다.</strong>
          <p>입고 또는 생산 완료 데이터가 등록되면 현재 재고와 입출고 이력이 표시됩니다.</p>
        </EmptyState>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <Toolbar>
        <SearchBox>
          <FiSearch aria-hidden="true" />
          <span>자재명, 제품명, LOT 번호 검색</span>
        </SearchBox>
        {['전체', '자재', '완제품'].map((type) => (
          <FilterButton
            key={type}
            type="button"
            $active={activeType === type && appliedCondition.itemType === '전체'}
            onClick={() => {
              setActiveType(type);
              setAppliedCondition((currentCondition) => ({
                ...currentCondition,
                itemType: '전체',
              }));
            }}
          >
            {type}
          </FilterButton>
        ))}
        <FilterButton type="button" onClick={handleOpenConditionModal}>
          <FiSliders aria-hidden="true" />
          조건
        </FilterButton>
      </Toolbar>

      {conditionChips.length > 0 && (
        <ConditionSummaryBar>
          <span>적용 조건</span>
          {conditionChips.map((chip) => (
            <ConditionChip key={chip}>{chip}</ConditionChip>
          ))}
          <ConditionResetButton type="button" onClick={handleClearAppliedCondition}>
            조건 초기화
          </ConditionResetButton>
        </ConditionSummaryBar>
      )}

      <MetricGrid>
        <MetricCard>
          <span>자재 재고 SKU</span>
          <strong>128</strong>
        </MetricCard>
        <MetricCard>
          <span>완제품 LOT</span>
          <strong>34</strong>
        </MetricCard>
        <MetricCard>
          <span>안전 재고 미달</span>
          <strong>{stockItems.filter((item) => item.current < item.safe).length}</strong>
        </MetricCard>
      </MetricGrid>

      {filteredItems.length > 0 ? (
        <>
          <InventoryGrid>
            {filteredItems.map((item) => {
              const percent = Math.min(Math.round((item.current / item.safe) * 100), 140);
              return (
                <StockCard key={`${item.name}-${item.lot}`}>
                  <StockHeader>
                    <div>
                      <StockName>{item.name}</StockName>
                      <StockMeta>
                        {item.lot} · {item.type}
                      </StockMeta>
                    </div>
                    <Badge
                      $tone={
                        item.status === '정상'
                          ? 'success'
                          : item.status === '주의'
                            ? 'warning'
                            : 'danger'
                      }
                    >
                      {item.status}
                    </Badge>
                  </StockHeader>
                  <strong>
                    {item.current.toLocaleString()} {item.unit}
                  </strong>
                  <StockProgress>
                    <StockProgressFill $tone={item.status} $value={Math.min(percent, 100)} />
                  </StockProgress>
                  <StockMeta>
                    안전 재고 {item.safe.toLocaleString()} {item.unit}
                  </StockMeta>
                </StockCard>
              );
            })}
          </InventoryGrid>

          <StockTable>
            <thead>
              <tr>
                <th>품목</th>
                <th>LOT 번호</th>
                <th>현재 재고</th>
                <th>안전 재고</th>
                <th>단위</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.lot}>
                  <td>{item.name}</td>
                  <td>{item.lot}</td>
                  <td>{item.current.toLocaleString()}</td>
                  <td>{item.safe.toLocaleString()}</td>
                  <td>{item.unit}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </StockTable>
        </>
      ) : (
        <InventoryEmptyState>
          <FiInbox aria-hidden="true" />
          <strong>조건에 맞는 재고 데이터가 없습니다.</strong>
          <p>조회 조건을 변경하거나 초기화해 주세요.</p>
        </InventoryEmptyState>
      )}

      <Ledger>
        {ledger.map((item) => (
          <LedgerItem key={`${item.time}-${item.item}`}>
            <span>{item.time}</span>
            <strong>{item.type}</strong>
            <em>{item.item}</em>
            <b>{item.qty}</b>
            <small>{item.owner}</small>
          </LedgerItem>
        ))}
      </Ledger>

      {isConditionModalOpen && (
        <ConditionModalOverlay onClick={handleCloseConditionModal}>
          <ConditionModal
            role="dialog"
            aria-modal="true"
            aria-labelledby="inventory-condition-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <ConditionModalHeader>
              <div>
                <ConditionModalTitle id="inventory-condition-modal-title">
                  재고 조회 조건
                </ConditionModalTitle>
                <ConditionModalDescription>
                  품목 구분, 재고 상태, LOT 번호, 유통기한 조건으로 재고를 상세 조회합니다.
                </ConditionModalDescription>
              </div>
              <ConditionModalCloseButton
                type="button"
                aria-label="재고 조회 조건 모달 닫기"
                onClick={handleCloseConditionModal}
              >
                <FiX aria-hidden="true" />
              </ConditionModalCloseButton>
            </ConditionModalHeader>

            <ConditionModalBody>
              <ConditionFormGrid>
                <ConditionField>
                  <ConditionLabel htmlFor="condition-item-type">품목 구분</ConditionLabel>
                  <ConditionSelect
                    id="condition-item-type"
                    value={conditionForm.itemType}
                    onChange={(event) => handleConditionChange('itemType', event.target.value)}
                  >
                    <option>전체</option>
                    <option>자재</option>
                    <option>완제품</option>
                  </ConditionSelect>
                </ConditionField>
                <ConditionField>
                  <ConditionLabel htmlFor="condition-stock-status">재고 상태</ConditionLabel>
                  <ConditionSelect
                    id="condition-stock-status"
                    value={conditionForm.stockStatus}
                    onChange={(event) => handleConditionChange('stockStatus', event.target.value)}
                  >
                    <option>전체</option>
                    <option>정상</option>
                    <option>주의</option>
                    <option>부족</option>
                  </ConditionSelect>
                </ConditionField>
                <ConditionField>
                  <ConditionLabel htmlFor="condition-safety-stock">안전재고 미달</ConditionLabel>
                  <ConditionSelect
                    id="condition-safety-stock"
                    value={conditionForm.safetyStock}
                    onChange={(event) => handleConditionChange('safetyStock', event.target.value)}
                  >
                    <option>전체</option>
                    <option>미달만 보기</option>
                    <option>정상만 보기</option>
                  </ConditionSelect>
                </ConditionField>
                <ConditionField>
                  <ConditionLabel htmlFor="condition-lot-no">LOT 번호</ConditionLabel>
                  <ConditionInput
                    id="condition-lot-no"
                    value={conditionForm.lotNo}
                    onChange={(event) => handleConditionChange('lotNo', event.target.value)}
                    placeholder="예: MAT-L-7742 또는 LOT-240711-014"
                  />
                </ConditionField>
                <ConditionField $wide>
                  <ConditionLabel>유통기한</ConditionLabel>
                  <DateRangeGroup>
                    <ConditionInput
                      type="date"
                      aria-label="유통기한 시작일"
                      value={conditionForm.expireStartDate}
                      onChange={(event) =>
                        handleConditionChange('expireStartDate', event.target.value)
                      }
                    />
                    <span>~</span>
                    <ConditionInput
                      type="date"
                      aria-label="유통기한 종료일"
                      value={conditionForm.expireEndDate}
                      onChange={(event) =>
                        handleConditionChange('expireEndDate', event.target.value)
                      }
                    />
                  </DateRangeGroup>
                </ConditionField>
              </ConditionFormGrid>
            </ConditionModalBody>

            <ConditionModalFooter>
              <ConditionClearButton type="button" onClick={handleResetCondition}>
                초기화
              </ConditionClearButton>
              <ConditionCancelButton type="button" onClick={handleCloseConditionModal}>
                취소
              </ConditionCancelButton>
              <ConditionApplyButton type="button" onClick={handleApplyCondition}>
                조회
              </ConditionApplyButton>
            </ConditionModalFooter>
          </ConditionModal>
        </ConditionModalOverlay>
      )}
    </PageSection>
  );
}

export default InventoryManagement;
