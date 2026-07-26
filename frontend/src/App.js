import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import CommonTabs from "./components/CommonTabs";
import SideNavigation from "./components/SideNavigation";
import Login from "./pages/account/Login";
import Signup from "./pages/account/Signup";
import FindAccount from "./pages/account/FindAccount";
import PasswordReset from "./pages/account/PasswordReset";
import Dashboard from "./pages/dashboard/Dashboard";
import WorkOrderList from "./pages/workorder/WorkOrderList";
import WorkOrderDetail from "./pages/workorder/WorkOrderDetail";
import ProductionOverviewPage from "./pages/production/ProductionOverviewPage";
import ProductionAnalysisPage from "./pages/production/ProductionAnalysisPage";
import MaterialLotPage from "./pages/materialLot/MaterialLotPage";
import CurrentAlarmPage from "./pages/alarm/CurrentAlarmPage";
import AlarmHistoryPage from "./pages/alarm/AlarmHistoryPage";
import EquipmentAlarmPage from "./pages/alarm/EquipmentAlarmPage";
import AlarmSeverityPage from "./pages/alarm/AlarmSeverityPage";
import AlarmDetailPage from "./pages/alarm/AlarmDetailPage";
import AlarmStatisticsPage from "./pages/alarm/AlarmStatisticsPage";
import CommunicationStatus from "./pages/communication/CommunicationStatus";
import DefectDashboardPage from "./pages/quality/DefectDashboardPage";
import DefectListPage from "./pages/quality/DefectListPage";
import DefectFormPage from "./pages/quality/DefectFormPage";
import DefectDetailPage from "./pages/quality/DefectDetailPage";
import DefectStatisticsPage from "./pages/quality/DefectStatisticsPage";
import Setting from "./pages/setting/Setting";
import { useAuth } from "./context/AuthContext";

const accountRecoveryNavItems = [
  { to: "/account/find/employee-number", label: "사원 번호 찾기" },
  { to: "/account/find/password", label: "비밀번호 찾기" },
];

const workOrderNavItems = [
  { to: "/work-orders/list", label: "목록 보기" },
  { to: "/work-orders/chart", label: "차트 보기" },
];

const productionNavItems = [
  { to: "/production-results", label: "생산 실적 현황", end: true },
  { to: "/production-results/analysis", label: "생산 실적 분석" },
];

const materialNavItems = [
  { to: "/materials/reference", label: "기준정보" },
  { to: "/materials/bom", label: "BOM 관리" },
  { to: "/materials/lots", label: "LOT 관리" },
  { to: "/materials/inventory", label: "재고 관리" },
];

const communicationNavItems = [
  { to: "/communications/l1", label: "L1 장비 연결 상태" },
  { to: "/communications/l2", label: "L2 수집기 상태" },
  { to: "/communications/log", label: "통신 로그" },
];

const settingNavItems = [
  { to: "/settings/users", label: "사용자 목록" },
  { to: "/settings/approvals", label: "가입 승인 대기" },
  { to: "/settings/workers", label: "작업자 관리" },
];

const alarmNavItems = [
  { to: "/alarms/current", label: "현재 알람" },
  { to: "/alarms/history", label: "알람 이력" },
  { to: "/alarms/equipment", label: "설비별 알람" },
  { to: "/alarms/severity", label: "심각도별 알람" },
  { to: "/alarms/statistics", label: "알람 통계" },
];

const qualityNavItems = [
  { to: "/quality", label: "불량 현황", end: true },
  { to: "/quality/defects", label: "불량 목록" },
  { to: "/quality/statistics", label: "불량 통계" },
];

function MainPage({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/account/login" replace />;
  }
  return (
    <>
      <SideNavigation />
      {children}
    </>
  );
}

function SectionPage({ children, label, navItems }) {
  return (
    <MainPage>
      <CommonTabs ariaLabel={label} items={navItems} />
      {children}
    </MainPage>
  );
}

function AccountSectionPage({ children }) {
  return (
    <>
      <CommonTabs ariaLabel="계정 찾기 유형" items={accountRecoveryNavItems} />
      {children}
    </>
  );
}

function AccountFindRedirect() {
  const { search } = useLocation();
  const type = new URLSearchParams(search).get("type");
  const target = type === "password"
    ? "/account/find/password"
    : "/account/find/employee-number";

  return <Navigate to={target} replace />;
}

function AlarmPage({ children }) {
  return (
    <SectionPage label="알람 화면 이동" navItems={alarmNavItems}>
      {children}
    </SectionPage>
  );
}

function QualityPage({ children }) {
  const { pathname } = useLocation();
  const isDefectDetail =
    pathname.startsWith("/quality/defects/") &&
    pathname !== "/quality/defects/new";
  const navItems = isDefectDetail
    ? qualityNavItems.map((item) =>
        item.to === "/quality/defects"
          ? { ...item, end: true }
          : item,
      )
    : qualityNavItems;

  return (
    <SectionPage label="품질 관리 화면 이동" navItems={navItems}>
      {children}
    </SectionPage>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/account/login" replace />} />
          <Route path="/account" element={<Navigate to="/account/login" replace />} />
          <Route path="/account/login" element={<Login />} />
          <Route path="/account/signup" element={<Signup />} />
          <Route path="/account/find" element={<AccountFindRedirect />} />
          <Route
            path="/account/find/employee-number"
            element={
              <AccountSectionPage>
                <FindAccount key="employee-number" mode="id" />
              </AccountSectionPage>
            }
          />
          <Route
            path="/account/find/password"
            element={
              <AccountSectionPage>
                <FindAccount key="password" mode="password" />
              </AccountSectionPage>
            }
          />
          <Route path="/account/reset-password" element={<PasswordReset />} />

          <Route
            path="/dashboard"
            element={
              <MainPage>
                <Dashboard />
              </MainPage>
            }
          />
          <Route path="/work-orders" element={<Navigate to="/work-orders/list" replace />} />
          <Route
            path="/work-orders/list"
            element={
              <SectionPage label="작업지시 화면 이동" navItems={workOrderNavItems}>
                <WorkOrderList view="table" />
              </SectionPage>
            }
          />
          <Route
            path="/work-orders/chart"
            element={
              <SectionPage label="작업지시 화면 이동" navItems={workOrderNavItems}>
                <WorkOrderList view="chart" />
              </SectionPage>
            }
          />
          <Route
            path="/work-orders/:id"
            element={
              <MainPage>
                <WorkOrderDetail />
              </MainPage>
            }
          />
          <Route
            path="/production-results"
            element={
              <SectionPage label="생산 실적 화면 이동" navItems={productionNavItems}>
                <ProductionOverviewPage />
              </SectionPage>
            }
          />
          <Route
            path="/production-results/analysis"
            element={
              <SectionPage label="생산 실적 화면 이동" navItems={productionNavItems}>
                <ProductionAnalysisPage />
              </SectionPage>
            }
          />
          <Route path="/materials" element={<Navigate to="/materials/reference" replace />} />
          <Route
            path="/materials/reference"
            element={
              <SectionPage label="자재 관리 화면 이동" navItems={materialNavItems}>
                <MaterialLotPage activeTab="reference" />
              </SectionPage>
            }
          />
          <Route
            path="/materials/bom"
            element={
              <SectionPage label="자재 관리 화면 이동" navItems={materialNavItems}>
                <MaterialLotPage activeTab="bom" />
              </SectionPage>
            }
          />
          <Route
            path="/materials/lots"
            element={
              <SectionPage label="자재 관리 화면 이동" navItems={materialNavItems}>
                <MaterialLotPage activeTab="lot" />
              </SectionPage>
            }
          />
          <Route
            path="/materials/inventory"
            element={
              <SectionPage label="자재 관리 화면 이동" navItems={materialNavItems}>
                <MaterialLotPage activeTab="inventory" />
              </SectionPage>
            }
          />
          <Route path="/alarms" element={<Navigate to="/alarms/current" replace />} />
          <Route
            path="/alarms/current"
            element={
              <AlarmPage>
                <CurrentAlarmPage />
              </AlarmPage>
            }
          />
          <Route
            path="/alarms/history"
            element={
              <AlarmPage>
                <AlarmHistoryPage />
              </AlarmPage>
            }
          />
          <Route
            path="/alarms/equipment"
            element={
              <AlarmPage>
                <EquipmentAlarmPage />
              </AlarmPage>
            }
          />
          <Route
            path="/alarms/severity"
            element={
              <AlarmPage>
                <AlarmSeverityPage />
              </AlarmPage>
            }
          />
          <Route
            path="/alarms/statistics"
            element={
              <AlarmPage>
                <AlarmStatisticsPage />
              </AlarmPage>
            }
          />
          <Route
            path="/alarm/detail/:alarmId"
            element={
              <AlarmPage>
                <AlarmDetailPage />
              </AlarmPage>
            }
          />
          <Route path="/alarm" element={<Navigate to="/alarms/current" replace />} />
          <Route path="/alarm/current" element={<Navigate to="/alarms/current" replace />} />
          <Route path="/alarm/history" element={<Navigate to="/alarms/history" replace />} />
          <Route path="/alarm/equipment" element={<Navigate to="/alarms/equipment" replace />} />
          <Route path="/alarm/severity" element={<Navigate to="/alarms/severity" replace />} />
          <Route path="/alarm/statistics" element={<Navigate to="/alarms/statistics" replace />} />
          <Route path="/communications" element={<Navigate to="/communications/l1" replace />} />
          <Route
            path="/communications/l1"
            element={
              <SectionPage label="통신 상태 화면 이동" navItems={communicationNavItems}>
                <CommunicationStatus activeTab="l1" />
              </SectionPage>
            }
          />
          <Route
            path="/communications/l2"
            element={
              <SectionPage label="통신 상태 화면 이동" navItems={communicationNavItems}>
                <CommunicationStatus activeTab="l2" />
              </SectionPage>
            }
          />
          <Route
            path="/communications/log"
            element={
              <SectionPage label="통신 상태 화면 이동" navItems={communicationNavItems}>
                <CommunicationStatus activeTab="log" />
              </SectionPage>
            }
          />
          <Route
            path="/quality"
            element={
              <QualityPage>
                <DefectDashboardPage />
              </QualityPage>
            }
          />
          <Route
            path="/quality/defects"
            element={
              <QualityPage>
                <DefectListPage />
              </QualityPage>
            }
          />
          <Route
            path="/quality/defects/new"
            element={
              <QualityPage>
                <DefectFormPage />
              </QualityPage>
            }
          />
          <Route
            path="/quality/defects/:defectId"
            element={
              <QualityPage>
                <DefectDetailPage />
              </QualityPage>
            }
          />
          <Route
            path="/quality/statistics"
            element={
              <QualityPage>
                <DefectStatisticsPage />
              </QualityPage>
            }
          />
          <Route path="/settings" element={<Navigate to="/settings/users" replace />} />
          <Route
            path="/settings/users"
            element={
              <SectionPage label="설정 화면 이동" navItems={settingNavItems}>
                <Setting activeTab="users" />
              </SectionPage>
            }
          />
          <Route
            path="/settings/approvals"
            element={
              <SectionPage label="설정 화면 이동" navItems={settingNavItems}>
                <Setting activeTab="approvals" />
              </SectionPage>
            }
          />
          <Route
            path="/settings/workers"
            element={
              <SectionPage label="설정 화면 이동" navItems={settingNavItems}>
                <Setting activeTab="workers" />
              </SectionPage>
            }
          />
          <Route path="*" element={<Navigate to="/account/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
