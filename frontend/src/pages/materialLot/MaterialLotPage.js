import { useMemo, useState } from 'react';
import { FiBox, FiLayers, FiPackage } from 'react-icons/fi';
import BomManagement from './BomManagement';
import InventoryManagement from './InventoryManagement';
import LotManagement from './LotManagement';
import {
  ActionButton,
  HeaderActions,
  KpiCard,
  KpiGrid,
  KpiLabel,
  KpiMeta,
  KpiValue,
  MaterialLotLayout,
  PageHeader,
  PageSubtitle,
  PageTitle,
  SegmentButton,
  SegmentControl,
  StatusDot,
  TabButton,
  TabList,
  ViewportPanel,
} from './MaterialLotPageCss';

const tabs = [
  { id: 'bom', label: 'BOM 관리', icon: FiLayers },
  { id: 'lot', label: 'LOT 관리', icon: FiBox },
  { id: 'inventory', label: '재고 관리', icon: FiPackage },
];

const kpiItems = [
  { label: '부족 자재', value: '4', meta: '작업지시 WO-2407 기준', tone: 'warning' },
  { label: 'LOT 추적률', value: '98.7%', meta: '최근 24시간 생산 LOT', tone: 'success' },
  { label: '안전 재고 미달', value: '3', meta: '면, 스프, 포장재', tone: 'danger' },
  { label: '입출고 대기', value: '12', meta: '승인 필요 건수', tone: 'neutral' },
];

function MaterialLotPage() {
  const [activeTab, setActiveTab] = useState('bom');
  const [showEmptyState, setShowEmptyState] = useState(false);

  const ActiveContent = useMemo(() => {
    if (activeTab === 'lot') {
      return LotManagement;
    }

    if (activeTab === 'inventory') {
      return InventoryManagement;
    }

    return BomManagement;
  }, [activeTab]);

  return (
    <MaterialLotLayout>
      <PageHeader>
        <div>
          <PageTitle>자재 / LOT</PageTitle>
          <PageSubtitle>
            컵라면 생산 라인의 BOM 소요량, 생산 LOT 추적, 자재 및 완제품 재고를
            통합 모니터링합니다.
          </PageSubtitle>
        </div>
        <HeaderActions>
          <SegmentControl aria-label="데이터 표시 상태">
            <SegmentButton
              type="button"
              $active={!showEmptyState}
              onClick={() => setShowEmptyState(false)}
            >
              데이터 있음
            </SegmentButton>
            <SegmentButton
              type="button"
              $active={showEmptyState}
              onClick={() => setShowEmptyState(true)}
            >
              데이터 없음
            </SegmentButton>
          </SegmentControl>
          <ActionButton type="button">입출고 등록</ActionButton>
        </HeaderActions>
      </PageHeader>

      <KpiGrid>
        {kpiItems.map((item) => (
          <KpiCard key={item.label}>
            <KpiLabel>
              <StatusDot $tone={item.tone} />
              {item.label}
            </KpiLabel>
            <KpiValue>{item.value}</KpiValue>
            <KpiMeta>{item.meta}</KpiMeta>
          </KpiCard>
        ))}
      </KpiGrid>

      <ViewportPanel>
        <TabList role="tablist" aria-label="자재 LOT 화면">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabButton
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                $active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon aria-hidden="true" />
                {tab.label}
              </TabButton>
            );
          })}
        </TabList>
        <ActiveContent showEmptyState={showEmptyState} />
      </ViewportPanel>
    </MaterialLotLayout>
  );
}

export default MaterialLotPage;
