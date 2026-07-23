import { useState } from "react";
import BomManagement from "./BomManagement";
import InventoryManagement from "./InventoryManagement";
import LotManagement from "./LotManagement";
import StockMovementRegistration from "./StockMovementRegistration";
import { Button, Header, Page } from "../../components/OperationalUi";

export default function MaterialLotPage({ activeTab = "bom" }) {
  const [movementOpen, setMovementOpen] = useState(false);
  const ActiveContent = activeTab === "lot" ? LotManagement : activeTab === "inventory" ? InventoryManagement : BomManagement;
  return <Page>
    <Header><div><h1>재고 / BOM / LOT</h1><p>실제 기준정보, 생산 LOT, 현재고와 이동 이력을 조회합니다.</p></div><Button onClick={() => setMovementOpen(true)}>재고 이동 등록</Button></Header>
    <ActiveContent />
    <StockMovementRegistration isOpen={movementOpen} onClose={() => setMovementOpen(false)} />
  </Page>;
}
