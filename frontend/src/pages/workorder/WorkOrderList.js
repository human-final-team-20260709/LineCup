import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiActivity,
  FiClipboard,
  FiPauseCircle,
  FiPlayCircle,
  FiPlus,
  FiSearch,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import { referenceApi, usersApi, workOrderApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import CommonPagination from "../../components/CommonPagination";
import { formatNumber, pageContent } from "../../components/OperationalUi";
import {
  Badge,
  ChartCard,
  ChartFrame,
  ChartHeaderRow,
  ChartLegendItem,
  ChartLegendRow,
  ChartLegendSwatch,
  ChartTitle,
  ChartTooltipBox,
  ChartTooltipDot,
  ChartTooltipLabel,
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipValue,
  CountChip,
  EmptyActionBtn,
  EmptyDesc,
  EmptyIconCircle,
  EmptyTitle,
  EmptyWrap,
  ErrorText,
  Field,
  FieldGrid,
  FilterChip,
  FilterGroup,
  HeaderActions,
  HeaderRow,
  Input,
  KpiCard,
  KpiFootRow,
  KpiGrid,
  KpiHeaderRow,
  KpiIcon,
  KpiLabel,
  KpiTrendText,
  KpiUnit,
  KpiValue,
  KpiValueRow,
  Label,
  LiveDot,
  ModalBody,
  ModalCloseBtn,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalPanel,
  ModalTitle,
  Page,
  ProgressFill,
  ProgressRate,
  ProgressRow,
  ProgressTrack,
  QtyCell,
  QtySub,
  SearchBox,
  SearchInput,
  Select,
  StyledButton,
  Subtitle,
  Table,
  TableCard,
  TableHeaderRow,
  Td,
  Textarea,
  Th,
  Title,
  TitleGroup,
  TitleLine,
  ToolBar,
  Toast,
  ToastText,
  tokens,
  Tr,
} from "./WorkOrderListCss";

const statusOptions = [
  ["", "전체"],
  ["PENDING", "대기"],
  ["IN_PROGRESS", "진행 중"],
  ["HOLD", "보류"],
  ["DONE", "완료"],
];

const statusAccent = {
  "": tokens.colors.primary,
  PENDING: tokens.colors.onSurfaceVariant,
  IN_PROGRESS: tokens.colors.primary,
  HOLD: tokens.colors.secondary,
  DONE: tokens.colors.onSurfaceVariant,
};

const statusColor = (status) => {
  if (status === "HOLD") return tokens.colors.secondary;
  if (status === "IN_PROGRESS") return tokens.colors.primary;
  if (status === "DONE") return tokens.colors.onSurfaceVariant;
  return tokens.colors.outline;
};

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }
  return (
    <ChartTooltipBox>
      <ChartTooltipTitle>{payload[0].payload.fullLabel}</ChartTooltipTitle>
      {payload.map((entry) => (
        <ChartTooltipRow key={entry.dataKey}>
          <ChartTooltipDot $color={entry.color} />
          <ChartTooltipLabel>{entry.dataKey}</ChartTooltipLabel>
          <ChartTooltipValue>{formatNumber(entry.value)} EA</ChartTooltipValue>
        </ChartTooltipRow>
      ))}
    </ChartTooltipBox>
  );
}

export default function WorkOrderList({ view = "table" }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setKeyword(draft.trim());
      setPage(0);
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [draft]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const params = {
    status: status || undefined,
    keyword: keyword || undefined,
    page,
    size: 20,
  };
  const workOrdersQuery = useQuery({
    queryKey: queryKeys.workOrders(params),
    queryFn: () => workOrderApi.list(params),
    refetchInterval: POLLING.WORK_ORDER,
    placeholderData: (previous) => previous,
  });
  const summaryQuery = useQuery({
    queryKey: queryKeys.workOrderSummary(),
    queryFn: workOrderApi.summary,
    refetchInterval: POLLING.WORK_ORDER,
  });
  const productsQuery = useQuery({
    queryKey: queryKeys.products({ status: "ACTIVE", size: 100 }),
    queryFn: () => referenceApi.products({ status: "ACTIVE", size: 100 }),
  });
  const supervisorsQuery = useQuery({
    queryKey: queryKeys.users({ role: "SUPERVISOR", size: 100 }),
    queryFn: () => usersApi.list({ role: "SUPERVISOR", size: 100 }),
  });
  const createMutation = useMutation({
    mutationFn: workOrderApi.create,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      setToast(`${created.workOrderNo} 작업지시를 등록했습니다.`);
      setShowForm(false);
    },
  });

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage("");
    const data = new FormData(event.currentTarget);
    try {
      await createMutation.mutateAsync({
        productId: Number(data.get("productId")),
        targetQty: Number(data.get("targetQty")),
        hourlyTargetQty: Number(data.get("hourlyTargetQty")),
        plannedStartDate: data.get("plannedStartDate"),
        supervisorUserId: Number(data.get("supervisorUserId")),
        remarks: String(data.get("remarks") || "").trim() || null,
        workerUserIds: [],
        equipmentIds: [],
      });
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  const rows = pageContent(workOrdersQuery.data);
  const summary = summaryQuery.data || {};
  const totalElements = workOrdersQuery.data?.totalElements ?? rows.length;
  const totalPages = workOrdersQuery.data?.totalPages || 1;
  const isEmpty = !workOrdersQuery.isPending && rows.length === 0;

  const chartData = rows.slice(0, 10).map((order) => {
    const shortCode = order.workOrderNo.split("-").pop();
    const shortProduct =
      order.productName.length > 5 ? `${order.productName.slice(0, 5)}…` : order.productName;
    return {
      name: `${shortCode} ${shortProduct}`,
      fullLabel: `${order.workOrderNo} · ${order.productName}`,
      목표: order.targetQty,
      실적: order.currentQty,
    };
  });

  return (
    <Page>
      <HeaderRow>
        <TitleGroup>
          <TitleLine>
            <Title>작업지시</Title>
            <LiveDot />
          </TitleLine>
          <Subtitle>서버 검색 결과를 5초마다 갱신합니다.</Subtitle>
        </TitleGroup>
        <HeaderActions>
          <StyledButton type="button" $variant="primary" onClick={() => setShowForm(true)}>
            <FiPlus /> 작업지시 등록
          </StyledButton>
        </HeaderActions>
      </HeaderRow>

      <KpiGrid>
        <KpiCard $accent={tokens.colors.primary} $delay={0}>
          <KpiHeaderRow>
            <KpiLabel>진행 중</KpiLabel>
            <KpiIcon $color={tokens.colors.primary}>
              <FiPlayCircle />
            </KpiIcon>
          </KpiHeaderRow>
          <KpiValueRow>
            <KpiValue>{summary.inProgressCount ?? 0}</KpiValue>
            <KpiUnit>건</KpiUnit>
          </KpiValueRow>
          <KpiFootRow>
            <KpiTrendText>대기 {summary.pendingCount ?? 0}건</KpiTrendText>
          </KpiFootRow>
        </KpiCard>

        <KpiCard $accent={tokens.colors.secondary} $delay={70}>
          <KpiHeaderRow>
            <KpiLabel>보류</KpiLabel>
            <KpiIcon $color={tokens.colors.secondary}>
              <FiPauseCircle />
            </KpiIcon>
          </KpiHeaderRow>
          <KpiValueRow>
            <KpiValue $color={(summary.holdCount ?? 0) > 0 ? tokens.colors.secondary : undefined}>
              {summary.holdCount ?? 0}
            </KpiValue>
            <KpiUnit>건</KpiUnit>
          </KpiValueRow>
          <KpiFootRow>
            <KpiTrendText>전체 {summary.totalCount ?? totalElements}건 중</KpiTrendText>
          </KpiFootRow>
        </KpiCard>

        <KpiCard $accent={tokens.colors.primary} $delay={140}>
          <KpiHeaderRow>
            <KpiLabel>평균 달성률</KpiLabel>
            <KpiIcon $color={tokens.colors.primary}>
              <FiTrendingUp />
            </KpiIcon>
          </KpiHeaderRow>
          <KpiValueRow>
            <KpiValue>{Math.round(summary.averageProgressRate ?? 0)}</KpiValue>
            <KpiUnit>%</KpiUnit>
          </KpiValueRow>
          <KpiFootRow>
            <KpiTrendText>완료 {summary.doneCount ?? 0}건</KpiTrendText>
          </KpiFootRow>
        </KpiCard>
      </KpiGrid>

      <ToolBar>
        <FilterGroup>
          {statusOptions.map(([value, label]) => (
            <FilterChip
              key={value}
              type="button"
              $active={status === value}
              $accent={statusAccent[value]}
              onClick={() => {
                setStatus(value);
                setPage(0);
              }}
            >
              {label}
            </FilterChip>
          ))}
        </FilterGroup>
        <SearchBox>
          <FiSearch />
          <SearchInput
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="작업번호 또는 제품명 검색"
          />
        </SearchBox>
      </ToolBar>

      <ApiErrors queries={[productsQuery, supervisorsQuery, summaryQuery]} />
      <QueryStatus query={workOrdersQuery} />

      {isEmpty ? (
        <TableCard>
          <EmptyWrap>
            <EmptyIconCircle>
              <FiClipboard size={22} />
            </EmptyIconCircle>
            <EmptyTitle>조건에 맞는 작업지시가 없습니다</EmptyTitle>
            <EmptyDesc>검색어나 상태 필터를 변경하거나 새 작업지시를 등록해보세요.</EmptyDesc>
            <EmptyActionBtn type="button" onClick={() => setShowForm(true)}>
              작업지시 등록
            </EmptyActionBtn>
          </EmptyWrap>
        </TableCard>
      ) : view === "chart" ? (
        <ChartCard>
          <ChartHeaderRow>
            <ChartTitle>작업지시별 목표 대비 실적</ChartTitle>
            <ChartLegendRow>
              <ChartLegendItem>
                <ChartLegendSwatch $color={tokens.colors.outlineVariant} />
                목표
              </ChartLegendItem>
              <ChartLegendItem>
                <ChartLegendSwatch $color={tokens.colors.primary} />
                실적
              </ChartLegendItem>
              <CountChip>최근 {chartData.length}건</CountChip>
            </ChartLegendRow>
          </ChartHeaderRow>
          <ChartFrame>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={tokens.colors.outlineVariant} vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: tokens.colors.onSurfaceVariant, fontSize: 11 }}
                  axisLine={{ stroke: tokens.colors.outlineVariant }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: tokens.colors.onSurfaceVariant, fontSize: 11 }}
                  axisLine={{ stroke: tokens.colors.outlineVariant }}
                  tickLine={false}
                  width={44}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: tokens.hexToRgba(tokens.colors.onSurface, 0.05) }} />
                <Bar dataKey="목표" fill={tokens.colors.outlineVariant} radius={[3, 3, 0, 0]} maxBarSize={26} />
                <Bar dataKey="실적" radius={[3, 3, 0, 0]} maxBarSize={26}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.fullLabel}
                      fill={entry.실적 < entry.목표 ? tokens.colors.secondary : tokens.colors.primary}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </ChartCard>
      ) : (
        <TableCard>
          <TableHeaderRow>
            <CountChip>총 {formatNumber(totalElements)}건</CountChip>
          </TableHeaderRow>
          <Table>
            <thead>
              <tr>
                <Th>작업지시</Th>
                <Th>제품</Th>
                <Th>상태</Th>
                <Th $wide>목표 / 실적</Th>
                <Th>시간 목표</Th>
                <Th>지시자</Th>
                <Th>예정일</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order, index) => (
                <Tr
                  key={order.workOrderId}
                  $delay={Math.min(index, 12) * 35}
                  onClick={() => navigate(`/work-orders/${order.workOrderId}`)}
                >
                  <Td $mono>{order.workOrderNo}</Td>
                  <Td>{order.productName}</Td>
                  <Td>
                    <Badge $color={statusColor(order.status)}>{order.statusLabel}</Badge>
                  </Td>
                  <Td>
                    <QtyCell>
                      <ProgressRow>
                        <ProgressTrack>
                          <ProgressFill $rate={order.progressRate} $color={statusColor(order.status)} />
                        </ProgressTrack>
                        <ProgressRate>{order.progressRate}%</ProgressRate>
                      </ProgressRow>
                      <QtySub>
                        {formatNumber(order.currentQty)} / {formatNumber(order.targetQty)} EA
                      </QtySub>
                    </QtyCell>
                  </Td>
                  <Td $mono>{formatNumber(order.hourlyTargetQty)}</Td>
                  <Td>{order.supervisorName}</Td>
                  <Td $mono>{order.plannedStartDate}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableCard>
      )}

      <CommonPagination
        ariaLabel="작업지시 페이지 이동"
        currentPage={page + 1}
        onPageChange={(nextPage) => setPage(nextPage - 1)}
        pageSize={20}
        totalItems={totalElements}
        totalPages={totalPages}
      />

      {showForm && (
        <ModalOverlay onClick={() => setShowForm(false)}>
          <ModalPanel onClick={(event) => event.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>새 작업지시 등록</ModalTitle>
              <ModalCloseBtn type="button" onClick={() => setShowForm(false)} aria-label="닫기">
                <FiX />
              </ModalCloseBtn>
            </ModalHeader>
            <form onSubmit={handleCreate}>
              <ModalBody>
                <FieldGrid>
                  <Field $span2>
                    <Label>제품</Label>
                    <Select name="productId" required defaultValue="">
                      <option value="" disabled>
                        제품 선택
                      </option>
                      {pageContent(productsQuery.data).map((product) => (
                        <option key={product.productId} value={product.productId}>
                          {product.productName}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field>
                    <Label>목표 수량</Label>
                    <Input name="targetQty" type="number" min="1" required />
                  </Field>
                  <Field>
                    <Label>시간 목표 수량</Label>
                    <Input name="hourlyTargetQty" type="number" min="1" required />
                  </Field>
                  <Field>
                    <Label>작업 시작 예정일</Label>
                    <Input name="plannedStartDate" type="date" required />
                  </Field>
                  <Field>
                    <Label>지시자</Label>
                    <Select name="supervisorUserId" required defaultValue="">
                      <option value="" disabled>
                        지시자 선택
                      </option>
                      {pageContent(supervisorsQuery.data)
                        .filter((user) => user.active && user.approvalStatus === "approved")
                        .map((user) => (
                          <option key={user.userId} value={user.userId}>
                            {user.name} ({user.empNo})
                          </option>
                        ))}
                    </Select>
                  </Field>
                  <Field $span2>
                    <Label>비고</Label>
                    <Textarea name="remarks" rows={3} placeholder="선택 입력" />
                  </Field>
                </FieldGrid>
                {message && <ErrorText style={{ display: "block", marginTop: 12 }}>{message}</ErrorText>}
              </ModalBody>
              <ModalFooter>
                <StyledButton type="button" $variant="outline" onClick={() => setShowForm(false)}>
                  취소
                </StyledButton>
                <StyledButton type="submit" $variant="primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "등록 중..." : "등록"}
                </StyledButton>
              </ModalFooter>
            </form>
          </ModalPanel>
        </ModalOverlay>
      )}

      {toast && (
        <Toast>
          <FiActivity color={tokens.colors.primary} />
          <ToastText>{toast}</ToastText>
        </Toast>
      )}
    </Page>
  );
}
