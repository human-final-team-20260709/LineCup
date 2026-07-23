import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { communicationApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { toKst } from "../../api/time";
import { QueryStatus } from "../../components/ApiState";
import {
  Badge,
  Card,
  Grid,
  Header,
  Page,
  Table,
  TableWrap,
  Toolbar,
  Button,
  pageContent,
  toneForStatus,
} from "../../components/OperationalUi";

export default function CommunicationStatus({ activeTab = "l1" }) {
  const [page, setPage] = useState(0);
  const params = { page, size: 20, sort: "occurredAt,desc" };
  const l1Query = useQuery({
    queryKey: queryKeys.l1Devices(),
    queryFn: communicationApi.l1,
    refetchInterval: POLLING.COMMUNICATION,
    enabled: activeTab === "l1",
  });
  const l2Query = useQuery({
    queryKey: queryKeys.l2Collectors(),
    queryFn: communicationApi.l2,
    refetchInterval: POLLING.COMMUNICATION,
    enabled: activeTab === "l2",
  });
  const logQuery = useQuery({
    queryKey: queryKeys.communicationLogs(params),
    queryFn: () => communicationApi.logs(params),
    refetchInterval: POLLING.COMMUNICATION,
    placeholderData: (previous) => previous,
    enabled: activeTab === "log",
  });

  return (
    <Page>
      <Header>
        <div>
          <h1>통신 상태</h1>
          <p>L1 설비, L2 수집기, 백엔드 통신 상태를 5초마다 갱신합니다.</p>
        </div>
      </Header>

      {activeTab === "l1" && (
        <>
          <QueryStatus query={l1Query} empty={l1Query.data?.length === 0} />
          <TableWrap>
            <Table>
              <thead><tr><th>장비 코드</th><th>장비명</th><th>IP</th><th>포트</th><th>마지막 수신</th><th>상태</th></tr></thead>
              <tbody>
                {(l1Query.data || []).map((device) => (
                  <tr key={device.deviceId}>
                    <td>{device.equipmentCode}</td><td>{device.equipmentName}</td>
                    <td>{device.ipAddress}</td><td>{device.port}</td>
                    <td>{toKst(device.lastReceivedAt)}</td>
                    <td><Badge $tone={device.connectionStatus === "CONNECTED" ? "success" : "danger"}>{device.connectionStatusLabel}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        </>
      )}

      {activeTab === "l2" && (
        <>
          <QueryStatus query={l2Query} empty={l2Query.data?.length === 0} />
          <Grid>
            {(l2Query.data || []).map((collector) => (
              <Card key={collector.collectorId}>
                <h2>{collector.name}</h2>
                <p>{collector.collectorCode}</p>
                <p><Badge $tone={toneForStatus(collector.status)}>{collector.statusLabel}</Badge></p>
                <p>L1 연결: {collector.connectedL1Count} / {collector.l1Total}</p>
                <p>백엔드: {collector.backendConnectionStatusLabel}</p>
                <p>마지막 전송: {toKst(collector.lastSentAt)}</p>
              </Card>
            ))}
          </Grid>
        </>
      )}

      {activeTab === "log" && (
        <>
          <QueryStatus query={logQuery} empty={pageContent(logQuery.data).length === 0} />
          <TableWrap>
            <Table>
              <thead><tr><th>방향</th><th>출처</th><th>성공</th><th>실패 원인</th><th>발생 시각</th></tr></thead>
              <tbody>
                {pageContent(logQuery.data).map((log) => (
                  <tr key={log.logId}>
                    <td>{log.directionLabel}</td>
                    <td>{log.sourceCode} {log.sourceName}</td>
                    <td><Badge $tone={log.success ? "success" : "danger"}>{log.success ? "성공" : "실패"}</Badge></td>
                    <td>{log.failReason || "-"}</td><td>{toKst(log.occurredAt)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
          <Toolbar>
            <Button $secondary disabled={page === 0} onClick={() => setPage((value) => value - 1)}>이전</Button>
            <span>{page + 1} / {logQuery.data?.totalPages || 1}</span>
            <Button $secondary disabled={page + 1 >= (logQuery.data?.totalPages || 1)} onClick={() => setPage((value) => value + 1)}>다음</Button>
          </Toolbar>
        </>
      )}
    </Page>
  );
}
