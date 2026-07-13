import React, { useMemo, useState } from "react";
import {
  FiWifiOff,
  FiServer,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import {
  PageWrapper,
  PageHeader,
  TitleGroup,
  PageTitle,
  PageSubtitle,
  EmptyStateToggle,
  ToggleSwitch,
  TabRow,
  TabButton,
  CardGrid,
  DataCard,
  CardLabel,
  CardValue,
  CardMeta,
  Panel,
  Table,
  TableHead,
  Th,
  Tr,
  Td,
  StatusChip,
  StatusDot,
  EmptyState,
  EmptyTitle,
  EmptyDesc,
} from "./CommunicationStatusCss.js";

// 9단계 유탕면 생산라인 L1 설비 더미 데이터
const L1_DEVICES = [
  {
    id: "L1-01",
    name: "계량",
    ip: "192.168.10.11",
    port: 502,
    lastReceivedAt: "14:32:07",
    status: "connected",
  },
  {
    id: "L1-02",
    name: "배합",
    ip: "192.168.10.12",
    port: 502,
    lastReceivedAt: "14:32:05",
    status: "connected",
  },
  {
    id: "L1-03",
    name: "압연",
    ip: "192.168.10.13",
    port: 502,
    lastReceivedAt: "14:32:06",
    status: "connected",
  },
  {
    id: "L1-04",
    name: "숙성",
    ip: "192.168.10.14",
    port: 502,
    lastReceivedAt: "14:31:58",
    status: "connected",
  },
  {
    id: "L1-05",
    name: "절출",
    ip: "192.168.10.15",
    port: 502,
    lastReceivedAt: "14:32:04",
    status: "connected",
  },
  {
    id: "L1-06",
    name: "증숙",
    ip: "192.168.10.16",
    port: 502,
    lastReceivedAt: "14:22:41",
    status: "disconnected",
  },
  {
    id: "L1-07",
    name: "유탕",
    ip: "192.168.10.17",
    port: 502,
    lastReceivedAt: "14:32:02",
    status: "connected",
  },
  {
    id: "L1-08",
    name: "냉각",
    ip: "192.168.10.18",
    port: 502,
    lastReceivedAt: "14:32:03",
    status: "connected",
  },
  {
    id: "L1-09",
    name: "포장",
    ip: "192.168.10.19",
    port: 502,
    lastReceivedAt: "14:32:01",
    status: "connected",
  },
];

const L2_STATUS = {
  running: true,
  l1Connected: 8,
  l1Total: 9,
  backendConnected: true,
  lastSentAt: "14:32:07",
};

// 통신 로그 더미 데이터 (최신순)
const COMM_LOGS = [
  {
    id: 1,
    type: "RX",
    device: "L1-01 계량",
    success: true,
    failReason: "-",
    timestamp: "14:32:07",
  },
  {
    id: 2,
    type: "TX",
    device: "백엔드 서버",
    success: true,
    failReason: "-",
    timestamp: "14:32:07",
  },
  {
    id: 3,
    type: "RX",
    device: "L1-06 증숙",
    success: false,
    failReason: "응답 타임아웃",
    timestamp: "14:22:41",
  },
  {
    id: 4,
    type: "RX",
    device: "L1-07 유탕",
    success: true,
    failReason: "-",
    timestamp: "14:32:02",
  },
  {
    id: 5,
    type: "TX",
    device: "백엔드 서버",
    success: false,
    failReason: "연결 재시도 중",
    timestamp: "14:21:12",
  },
  {
    id: 6,
    type: "RX",
    device: "L1-09 포장",
    success: true,
    failReason: "-",
    timestamp: "14:32:01",
  },
];

const TABS = [
  { key: "l1", label: "L1 장비 연결 상태" },
  { key: "l2", label: "L2 수집기 상태" },
  { key: "log", label: "통신 로그" },
];

function L1DeviceTable({ devices }) {
  if (devices.length === 0) {
    return (
      <EmptyState>
        <FiWifiOff size={28} />
        <EmptyTitle>연결된 L1 장비가 없습니다</EmptyTitle>
        <EmptyDesc>
          L2 수집기와 장비 네트워크 연결 상태를 확인해 주세요.
        </EmptyDesc>
      </EmptyState>
    );
  }

  return (
    <Table>
      <TableHead>
        <tr>
          <Th>장비 ID</Th>
          <Th>장비명</Th>
          <Th>IP</Th>
          <Th>포트</Th>
          <Th>마지막 수신 시간</Th>
          <Th>상태</Th>
        </tr>
      </TableHead>
      <tbody>
        {devices.map((device, index) => (
          <Tr key={device.id} $odd={index % 2 === 1}>
            <Td>{device.id}</Td>
            <Td>{device.name}</Td>
            <Td>{device.ip}</Td>
            <Td>{device.port}</Td>
            <Td>{device.lastReceivedAt}</Td>
            <Td>
              {device.status === "connected" ? (
                <StatusChip $tone="success">
                  <StatusDot />
                  연결됨
                </StatusChip>
              ) : (
                <StatusChip $tone="error">
                  <StatusDot />
                  끊김
                </StatusChip>
              )}
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}

function L2StatusCards({ status }) {
  if (!status) {
    return (
      <EmptyState>
        <FiServer size={28} />
        <EmptyTitle>L2 수집기 상태를 불러올 수 없습니다</EmptyTitle>
        <EmptyDesc>수집기 프로세스가 실행 중인지 확인해 주세요.</EmptyDesc>
      </EmptyState>
    );
  }

  return (
    <CardGrid>
      <DataCard>
        <CardLabel>수집기 실행 상태</CardLabel>
        <CardValue>{status.running ? "RUNNING" : "STOPPED"}</CardValue>
        <StatusChip $tone={status.running ? "success" : "error"}>
          <StatusDot />
          {status.running ? "정상 가동" : "중지됨"}
        </StatusChip>
      </DataCard>

      <DataCard>
        <CardLabel>L1 장비 연결 개수</CardLabel>
        <CardValue>
          {status.l1Connected} / {status.l1Total}
        </CardValue>
        <CardMeta>연결됨 / 전체 장비</CardMeta>
      </DataCard>

      <DataCard>
        <CardLabel>백엔드 서버 연결</CardLabel>
        <CardValue>{status.backendConnected ? "ONLINE" : "OFFLINE"}</CardValue>
        <StatusChip $tone={status.backendConnected ? "success" : "error"}>
          <StatusDot />
          {status.backendConnected ? "연결됨" : "연결 끊김"}
        </StatusChip>
      </DataCard>

      <DataCard>
        <CardLabel>마지막 데이터 전송</CardLabel>
        <CardValue>{status.lastSentAt}</CardValue>
        <CardMeta>오늘</CardMeta>
      </DataCard>
    </CardGrid>
  );
}

function CommLogTable({ logs }) {
  if (logs.length === 0) {
    return (
      <EmptyState>
        <FiArrowUpRight size={28} />
        <EmptyTitle>표시할 통신 로그가 없습니다</EmptyTitle>
        <EmptyDesc>장비 통신이 발생하면 이곳에 기록됩니다.</EmptyDesc>
      </EmptyState>
    );
  }

  return (
    <Table>
      <TableHead>
        <tr>
          <Th>구분</Th>
          <Th>관련 장비</Th>
          <Th>성공 여부</Th>
          <Th>실패 원인</Th>
          <Th>발생 시간</Th>
        </tr>
      </TableHead>
      <tbody>
        {logs.map((log, index) => (
          <Tr key={log.id} $odd={index % 2 === 1}>
            <Td>
              {log.type === "TX" ? (
                <StatusChip $tone="warning">
                  <FiArrowUpRight size={12} />
                  송신
                </StatusChip>
              ) : (
                <StatusChip $tone="warning">
                  <FiArrowDownLeft size={12} />
                  수신
                </StatusChip>
              )}
            </Td>
            <Td>{log.device}</Td>
            <Td>
              {log.success ? (
                <StatusChip $tone="success">
                  <FiCheckCircle size={12} />
                  성공
                </StatusChip>
              ) : (
                <StatusChip $tone="error">
                  <FiXCircle size={12} />
                  실패
                </StatusChip>
              )}
            </Td>
            <Td>{log.failReason}</Td>
            <Td>{log.timestamp}</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}

export default function CommunicationStatus() {
  const [activeTab, setActiveTab] = useState("l1");
  const [showEmpty, setShowEmpty] = useState(false);

  const devices = useMemo(() => (showEmpty ? [] : L1_DEVICES), [showEmpty]);
  const l2Status = useMemo(() => (showEmpty ? null : L2_STATUS), [showEmpty]);
  const logs = useMemo(() => (showEmpty ? [] : COMM_LOGS), [showEmpty]);

  return (
    <PageWrapper>
      <PageHeader>
        <TitleGroup>
          <PageTitle>통신 상태</PageTitle>
          <PageSubtitle>
            L1 설비, L2 수집기, 백엔드 서버 간 통신 현황을 확인합니다.
          </PageSubtitle>
        </TitleGroup>

        <EmptyStateToggle>
          빈 상태 미리보기
          <ToggleSwitch
            type="button"
            role="switch"
            aria-checked={showEmpty}
            $active={showEmpty}
            onClick={() => setShowEmpty((prev) => !prev)}
          />
        </EmptyStateToggle>
      </PageHeader>

      <TabRow>
        {TABS.map((tab) => (
          <TabButton
            key={tab.key}
            type="button"
            $active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabRow>

      {activeTab === "l1" && (
        <Panel>
          <L1DeviceTable devices={devices} />
        </Panel>
      )}

      {activeTab === "l2" && <L2StatusCards status={l2Status} />}

      {activeTab === "log" && (
        <Panel>
          <CommLogTable logs={logs} />
        </Panel>
      )}
    </PageWrapper>
  );
}
