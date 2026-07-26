import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

// API 및 유틸리티
import { communicationApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { toKst } from "../../api/time";

// 공통 컴포넌트
import { QueryStatus } from "../../components/ApiState";
import CommonPagination from "../../components/CommonPagination";

// 스타일
import * as S from "./CommunicationStatusCss";

const LOG_PAGE_SIZE = 10;

/**
 * 유틸리티: 데이터 형식에 상관없이 리스트 반환
 */
const getPageContent = (data) => (Array.isArray(data) ? data : data?.content ?? []);

/**
 * 유틸리티: 상태값에 따른 디자인 톤 결정
 */
const getToneForStatus = (status) => {
  const errorStates = ["ERROR", "CRITICAL", "REJECTED", "UNHANDLED", "DISCONNECTED"];
  const warningStates = ["HOLD", "WARNING", "PENDING", "ON_HOLD", "STOPPED", "INACTIVE", "REVIEW"];

  if (!status || errorStates.includes(status)) return "error";
  if (warningStates.includes(status)) return "warning";
  return "success";
};

export default function CommunicationStatus({ activeTab = "l1" }) {
  const [logPage, setLogPage] = useState(0);

  // 탭 변경 시 페이지 초기화
  useEffect(() => {
    setLogPage(0);
  }, [activeTab]);

  // --- Queries ---

  const l1Query = useQuery({
    queryKey: queryKeys.l1Devices(),
    queryFn: () => communicationApi.l1(),
    refetchInterval: POLLING.COMMUNICATION,
    placeholderData: (prev) => prev,
    enabled: activeTab === "l1",
  });

  const l2Query = useQuery({
    queryKey: queryKeys.l2Collectors(),
    queryFn: () => communicationApi.l2(),
    refetchInterval: POLLING.COMMUNICATION,
    placeholderData: (prev) => prev,
    enabled: activeTab === "l2",
  });

  const logParams = useMemo(() => ({
    page: logPage,
    size: LOG_PAGE_SIZE,
    sort: "occurredAt,desc",
  }), [logPage]);

  const logQuery = useQuery({
    queryKey: queryKeys.communicationLogs(logParams),
    queryFn: () => communicationApi.logs(logParams),
    refetchInterval: POLLING.COMMUNICATION,
    placeholderData: (prev) => prev,
    enabled: activeTab === "log",
  });

  // --- 데이터 가공 ---
  const l1Devices = getPageContent(l1Query.data);
  const l2Collectors = getPageContent(l2Query.data);
  const logs = getPageContent(logQuery.data);

  const logPagination = {
    totalItems: logQuery.data?.totalElements ?? 0,
    totalPages: logQuery.data?.totalPages ?? 1,
  };

  return (
    <S.PageWrapper>
      <S.PageHeader>
        <S.TitleGroup>
          <S.PageTitle>통신 상태</S.PageTitle>
          <S.PageSubtitle>L1 설비, L2 수집기, 백엔드 통신 상태를 5초마다 갱신합니다.</S.PageSubtitle>
        </S.TitleGroup>
      </S.PageHeader>

      {/* L1 설비 탭 */}
      {activeTab === "l1" && (
        <S.Panel>
          <QueryStatus query={l1Query} empty={l1Devices.length === 0} />
          <S.Table>
            <S.TableHead>
              <tr>
                <S.Th>장비 코드</S.Th>
                <S.Th>장비명</S.Th>
                <S.Th>IP</S.Th>
                <S.Th>포트</S.Th>
                <S.Th>마지막 수신</S.Th>
                <S.Th>상태</S.Th>
              </tr>
            </S.TableHead>
            <tbody>
              {l1Devices.map((device, index) => (
                <S.Tr key={device.deviceId || index} $odd={index % 2 === 1}>
                  <S.Td>{device.equipmentCode}</S.Td>
                  <S.Td>{device.equipmentName}</S.Td>
                  <S.Td>{device.ipAddress}</S.Td>
                  <S.Td>{device.port}</S.Td>
                  <S.Td>{toKst(device.lastReceivedAt)}</S.Td>
                  <S.Td>
                    <S.StatusChip $tone={device.connectionStatus === "CONNECTED" ? "success" : "error"}>
                      {device.connectionStatusLabel}
                    </S.StatusChip>
                  </S.Td>
                </S.Tr>
              ))}
            </tbody>
          </S.Table>
        </S.Panel>
      )}

      {/* L2 수집기 탭 */}
      {activeTab === "l2" && (
        <S.Panel>
          <QueryStatus query={l2Query} empty={l2Collectors.length === 0} />
          <S.Table>
            <S.TableHead>
              <tr>
                <S.Th>수집기 코드</S.Th>
                <S.Th>수집기명</S.Th>
                <S.Th>상태</S.Th>
                <S.Th>L1 연결</S.Th>
                <S.Th>백엔드</S.Th>
                <S.Th>마지막 전송</S.Th>
              </tr>
            </S.TableHead>
            <tbody>
              {l2Collectors.map((collector, index) => (
                <S.Tr key={collector.collectorId || index} $odd={index % 2 === 1}>
                  <S.Td>{collector.collectorCode}</S.Td>
                  <S.Td>{collector.name}</S.Td>
                  <S.Td>
                    <S.StatusChip $tone={getToneForStatus(collector.status)}>
                      {collector.statusLabel}
                    </S.StatusChip>
                  </S.Td>
                  <S.Td>{collector.connectedL1Count} / {collector.l1Total}</S.Td>
                  <S.Td>{collector.backendConnectionStatusLabel}</S.Td>
                  <S.Td>{toKst(collector.lastSentAt)}</S.Td>
                </S.Tr>
              ))}
            </tbody>
          </S.Table>
        </S.Panel>
      )}

      {/* 통신 로그 탭 */}
      {activeTab === "log" && (
        <S.Panel>
          <QueryStatus query={logQuery} empty={logs.length === 0} />
          <S.Table>
            <S.TableHead>
              <tr>
                <S.Th>방향</S.Th>
                <S.Th>출처</S.Th>
                <S.Th>성공</S.Th>
                <S.Th>실패 원인</S.Th>
                <S.Th>발생 시각</S.Th>
              </tr>
            </S.TableHead>
            <tbody>
              {logs.map((log, index) => (
                <S.Tr key={log.logId || index} $odd={index % 2 === 1}>
                  <S.Td>{log.directionLabel}</S.Td>
                  <S.Td>{log.sourceCode} {log.sourceName}</S.Td>
                  <S.Td>
                    <S.StatusChip $tone={log.success ? "success" : "error"}>
                      {log.success ? "성공" : "실패"}
                    </S.StatusChip>
                  </S.Td>
                  <S.Td>{log.failReason || "-"}</S.Td>
                  <S.Td>{toKst(log.occurredAt)}</S.Td>
                </S.Tr>
              ))}
            </tbody>
          </S.Table>

          <CommonPagination
            currentPage={logPage + 1}
            onPageChange={(page) => setLogPage(page - 1)}
            pageSize={LOG_PAGE_SIZE}
            totalItems={logPagination.totalItems}
            totalPages={logPagination.totalPages}
          />
        </S.Panel>
      )}
    </S.PageWrapper>
  );
}