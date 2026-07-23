import BomManagement from "./BomManagement";
import InventoryManagement from "./InventoryManagement";
import LotManagement from "./LotManagement";
import ReferenceDataManagement from "./ReferenceDataManagement";
import { Header, Page } from "../../components/OperationalUi";
import { useAuth } from "../../context/AuthContext";

export default function MaterialLotPage({ activeTab = "reference" }) {
  const { user } = useAuth();
  const role = String(user?.role || "").toUpperCase();
  const canManage = role === "ADMIN" || role === "SUPERVISOR";

  const content = {
    reference: <ReferenceDataManagement canManage={canManage} />,
    bom: <BomManagement canManage={canManage} />,
    lot: <LotManagement />,
    inventory: <InventoryManagement canManage={canManage} />,
  }[activeTab] || <ReferenceDataManagement canManage={canManage} />;

  return <Page>
    <Header>
      <div>
        <h1>재고 / BOM / LOT</h1>
        <p>제품·원자재 기준정보부터 생산 LOT와 현재고까지 관리합니다.</p>
      </div>
    </Header>
    {content}
  </Page>;
}
