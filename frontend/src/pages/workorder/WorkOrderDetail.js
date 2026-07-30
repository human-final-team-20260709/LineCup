import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiActivity,
  FiArrowLeft,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiPauseCircle,
  FiPlayCircle,
  FiSearch,
  FiShield,
  FiTarget,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { usersApi, workOrderApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { toKst } from "../../api/time";
import { useAuth } from "../../context/AuthContext";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import { formatNumber, pageContent } from "../../components/OperationalUi";
import {
  ActionRow,
  AssignedWorkerCard,
  AssignedWorkerGrid,
  BackLink,
  Badge,
  Card,
  CardDescription,
  CardHeaderRow,
  CardTitle,
  ConfirmSub,
  ConfirmText,
  ControlForm,
  ContentGrid,
  EmptyCard,
  Field,
  HeaderMeta,
  HeaderRow,
  InfoGrid,
  InfoLabel,
  InfoRow,
  InfoValue,
  Input,
  ModalBody,
  ModalCloseBtn,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalPanel,
  ModalSelectionCount,
  ModalTitle,
  ModalFieldMeta,
  OrderCode,
  OverallProgressCard,
  OverallProgressLabel,
  OverallProgressValue,
  Page,
  PickerCheck,
  PickerInfo,
  PickerList,
  PickerMeta,
  PickerName,
  PickerRow,
  PickerSearchBox,
  PickerSearchInput,
  ProcessCard,
  ProcessCardHeader,
  ProcessEquipLabel,
  ProcessGrid,
  ProcessIdentity,
  ProcessName,
  ProgressFill,
  ProgressRate,
  ProgressRow,
  ProgressTrack,
  RemarkBox,
  SectionCard,
  SectionHeader,
  SectionTitle,
  Select,
  StatusMessage,
  StyledButton,
  SummaryCaption,
  SummaryCard,
  SummaryCardTop,
  SummaryGrid,
  SummaryIcon,
  SummaryLabel,
  SummaryUnit,
  SummaryValue,
  Table,
  TableWrap,
  Textarea,
  Title,
  TitleRow,
  WorkerFooter,
  WorkerMeta,
  tokens,
} from "./WorkOrderDetailCss";

const actionForStatus = {
  PENDING: ["START"],
  HOLD: ["RESUME"],
  IN_PROGRESS: ["HOLD", "COMPLETE"],
};
const actionLabel = {
  START: "시작",
  RESUME: "재개",
  HOLD: "보류",
  COMPLETE: "완료",
};
const actionIcon = {
  START: FiPlayCircle,
  RESUME: FiPlayCircle,
  HOLD: FiPauseCircle,
  COMPLETE: FiCheckCircle,
};
const actionVariant = {
  START: "primary",
  RESUME: "primary",
  HOLD: "warning",
  COMPLETE: "ghost",
};
const actionDefaultNote = {
  START: "작업 시작",
  RESUME: "작업 재개",
  COMPLETE: "작업 완료",
};
const actionConfirmText = {
  START: "작업을 시작하시겠습니까?",
  RESUME: "보류된 작업을 재개하시겠습니까?",
  HOLD: "진행 중인 작업을 보류하시겠습니까?",
  COMPLETE: "작업을 완료 처리하시겠습니까?",
};
const actionNotePlaceholder = {
  START: "작업 시작 시 전달할 내용을 입력하세요.",
  RESUME: "점검 결과나 재개 조건을 입력하세요.",
  HOLD: "보류 원인과 필요한 조치를 입력하세요.",
  COMPLETE: "완료 시 전달할 내용을 입력하세요.",
};
const historyActionLabel = {
  CREATED: "생성",
  REGISTERED: "등록",
  ...actionLabel,
};

const colorForStatus = (status) => {
  if (["IN_PROGRESS", "RUNNING", "AVAILABLE", "ACTIVE", "DONE"].includes(status)) {
    return tokens.colors.primary;
  }
  if (["HOLD", "MAINTENANCE", "WARNING"].includes(status)) {
    return tokens.colors.secondary;
  }
  if (["ERROR", "STOPPED", "FAILED"].includes(status)) {
    return tokens.colors.tertiary;
  }
  return tokens.colors.onSurfaceVariant;
};

const progressRate = (current, target) => {
  if (!target) {
    return 0;
  }
  return Math.min(100, Math.max(0, (current / target) * 100));
};

export default function WorkOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [statusAction, setStatusAction] = useState(null);
  const [statusNote, setStatusNote] = useState("");
  const [statusModalError, setStatusModalError] = useState("");
  const [workerModalOpen, setWorkerModalOpen] = useState(false);
  const [workerSearch, setWorkerSearch] = useState("");
  const [workerDraftIds, setWorkerDraftIds] = useState([]);

  useEffect(() => {
    if (!workerModalOpen && !statusAction) {
      return undefined;
    }
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setWorkerModalOpen(false);
        setStatusAction(null);
        setStatusNote("");
        setStatusModalError("");
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [workerModalOpen, statusAction]);

  const detailQuery = useQuery({
    queryKey: queryKeys.workOrder(id),
    queryFn: () => workOrderApi.detail(id),
    refetchInterval: POLLING.WORK_ORDER,
  });
  const supervisorsQuery = useQuery({
    queryKey: queryKeys.users({ role: "SUPERVISOR", size: 100 }),
    queryFn: () => usersApi.list({ role: "SUPERVISOR", size: 100 }),
  });
  const operatorsQuery = useQuery({
    queryKey: queryKeys.users({ role: "OPERATOR", size: 100 }),
    queryFn: () => usersApi.list({ role: "OPERATOR", size: 100 }),
  });
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["work-orders"] });
    queryClient.invalidateQueries({ queryKey: ["production"] });
  };
  const statusMutation = useMutation({
    mutationFn: ({ action, note }) =>
      workOrderApi.status(id, {
        action,
        changedByUserId: user.userId,
        note,
      }),
    onSuccess: invalidate,
  });
  const targetsMutation = useMutation({
    mutationFn: (body) => workOrderApi.targets(id, body),
    onSuccess: invalidate,
  });
  const supervisorMutation = useMutation({
    mutationFn: (supervisorUserId) =>
      workOrderApi.supervisor(id, { supervisorUserId }),
    onSuccess: invalidate,
  });
  const workersMutation = useMutation({
    mutationFn: (ids) => workOrderApi.workers(id, { ids }),
    onSuccess: invalidate,
  });
  const mutationPending =
    statusMutation.isPending ||
    targetsMutation.isPending ||
    supervisorMutation.isPending ||
    workersMutation.isPending;

  const run = async (work) => {
    setMessage("");
    try {
      await work();
      setMessage("변경사항을 저장했습니다.");
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  const openStatusModal = (action) => {
    setMessage("");
    setStatusAction(action);
    setStatusNote("");
    setStatusModalError("");
  };
  const closeStatusModal = () => {
    if (statusMutation.isPending) {
      return;
    }
    setStatusAction(null);
    setStatusNote("");
    setStatusModalError("");
  };
  const saveStatusChange = async (event) => {
    event.preventDefault();
    const trimmedNote = statusNote.trim();
    if (statusAction === "HOLD" && !trimmedNote) {
      setStatusModalError("작업을 보류하려면 보류 사유를 입력해주세요.");
      return;
    }

    setStatusModalError("");
    try {
      await statusMutation.mutateAsync({
        action: statusAction,
        note: trimmedNote || actionDefaultNote[statusAction] || null,
      });
      setMessage(`${actionLabel[statusAction]} 상태로 변경했습니다.`);
      setStatusAction(null);
      setStatusNote("");
    } catch (error) {
      setStatusModalError(extractApiError(error));
    }
  };

  const detail = detailQuery.data;
  const order = detail?.summary;
  if (!order) {
    return (
      <Page>
        <BackLink type="button" onClick={() => navigate("/work-orders/list")}>
          <FiArrowLeft /> 작업지시 목록
        </BackLink>
        <HeaderRow>
          <Title>작업지시 상세</Title>
        </HeaderRow>
        <QueryStatus query={detailQuery} />
      </Page>
    );
  }

  const unit = detail.productUnit || "EA";
  const totalProgressRate = progressRate(order.currentQty, order.targetQty);
  const completionBlocked =
    order.status === "IN_PROGRESS" &&
    Number(order.currentQty) < Number(order.targetQty);
  const approvedSupervisors = pageContent(supervisorsQuery.data).filter(
    (entry) => entry.active && entry.approvalStatus === "approved",
  );
  const approvedOperators = pageContent(operatorsQuery.data).filter(
    (entry) => entry.active && entry.approvalStatus === "approved",
  );
  const normalizedWorkerSearch = workerSearch.trim().toLowerCase();
  const filteredOperators = approvedOperators.filter((entry) =>
    [entry.name, entry.empNo, entry.roleLabel]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedWorkerSearch)),
  );
  const openWorkerModal = () => {
    setWorkerDraftIds(detail.workers.map((worker) => worker.userId));
    setWorkerSearch("");
    setWorkerModalOpen(true);
  };
  const toggleWorker = (userId) => {
    setWorkerDraftIds((current) =>
      current.includes(userId)
        ? current.filter((idValue) => idValue !== userId)
        : [...current, userId],
    );
  };
  const saveWorkers = async () => {
    setMessage("");
    try {
      await workersMutation.mutateAsync(workerDraftIds);
      setMessage("변경사항을 저장했습니다.");
      setWorkerModalOpen(false);
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  return (
    <Page>
      <BackLink type="button" onClick={() => navigate("/work-orders/list")}>
        <FiArrowLeft /> 작업지시 목록
      </BackLink>

      <HeaderRow>
        <div>
          <TitleRow>
            <Title>작업지시 상세</Title>
            <Badge $color={colorForStatus(order.status)}>
              <FiActivity /> {order.statusLabel}
            </Badge>
          </TitleRow>
          <OrderCode>{order.workOrderNo}</OrderCode>
          <HeaderMeta>
            {order.productName}
          </HeaderMeta>
        </div>
        <ActionRow>
          {(actionForStatus[order.status] || []).map((action) => {
            const ActionIcon = actionIcon[action];
            const actionDisabled = action === "COMPLETE" && completionBlocked;
            return (
              <StyledButton
                key={action}
                type="button"
                $variant={actionVariant[action]}
                disabled={mutationPending || actionDisabled}
                title={
                  actionDisabled
                    ? `목표 수량 도달 후 완료할 수 있습니다. 현재 ${order.currentQty} / 목표 ${order.targetQty}`
                    : undefined
                }
                onClick={() => openStatusModal(action)}
              >
                <ActionIcon />
                {actionLabel[action]}
              </StyledButton>
            );
          })}
        </ActionRow>
      </HeaderRow>

      {completionBlocked && (
        <StatusMessage role="status">
          완료 대기: 목표 수량 도달 후 완료할 수 있습니다. 현재 {order.currentQty}
          {" / "}목표 {order.targetQty} {unit}
        </StatusMessage>
      )}
      {message && <StatusMessage role="status">{message}</StatusMessage>}
      <ApiErrors queries={[supervisorsQuery, operatorsQuery]} />

      <Card $delay={30}>
        <CardHeaderRow>
          <div>
            <CardTitle>작업지시 정보</CardTitle>
            <CardDescription>제품과 작업 일정, 담당 정보를 확인합니다.</CardDescription>
          </div>
          <Badge $color={colorForStatus(order.status)}>{order.statusLabel}</Badge>
        </CardHeaderRow>
        <InfoGrid>
          <InfoRow>
            <InfoLabel>제품명</InfoLabel>
            <InfoValue>{order.productName}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>제품 코드</InfoLabel>
            <InfoValue $mono>{order.productCode}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>담당 지시자</InfoLabel>
            <InfoValue>
              <FiUser /> {order.supervisorName} ({order.supervisorEmpNo})
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>작업 시작 예정일</InfoLabel>
            <InfoValue $mono>{order.plannedStartDate}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>실제 시작</InfoLabel>
            <InfoValue $mono>{toKst(order.startedAt)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>완료 시각</InfoLabel>
            <InfoValue $mono>{toKst(order.completedAt)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>등록일</InfoLabel>
            <InfoValue $mono>{toKst(order.registeredAt)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>생산 단위</InfoLabel>
            <InfoValue $mono>{unit}</InfoValue>
          </InfoRow>
        </InfoGrid>
        <RemarkBox>
          <strong>비고</strong>
          <span>{detail.remarks || "등록된 비고가 없습니다."}</span>
        </RemarkBox>
      </Card>

      <SummaryGrid>
        <SummaryCard $accent={tokens.colors.primary} $delay={60}>
          <SummaryCardTop>
            <SummaryLabel>목표 수량</SummaryLabel>
            <SummaryIcon $color={tokens.colors.primary}>
              <FiTarget />
            </SummaryIcon>
          </SummaryCardTop>
          <SummaryValue>
            {formatNumber(order.targetQty)}
            <SummaryUnit>{unit}</SummaryUnit>
          </SummaryValue>
          <SummaryCaption>
            시간당 목표 {formatNumber(order.hourlyTargetQty)} {unit}
          </SummaryCaption>
        </SummaryCard>

        <SummaryCard $accent={tokens.colors.primary} $delay={100}>
          <SummaryCardTop>
            <SummaryLabel>현재 생산</SummaryLabel>
            <SummaryIcon $color={tokens.colors.primary}>
              <FiPackage />
            </SummaryIcon>
          </SummaryCardTop>
          <SummaryValue>
            {formatNumber(order.currentQty)}
            <SummaryUnit>{unit}</SummaryUnit>
          </SummaryValue>
          <SummaryCaption>누적 생산 수량</SummaryCaption>
        </SummaryCard>

        <SummaryCard $accent={tokens.colors.primary} $delay={140}>
          <SummaryCardTop>
            <SummaryLabel>정상 / 불량</SummaryLabel>
            <SummaryIcon $color={tokens.colors.primary}>
              <FiShield />
            </SummaryIcon>
          </SummaryCardTop>
          <SummaryValue>
            {formatNumber(order.goodQty)}
            <SummaryUnit>/</SummaryUnit>
            {formatNumber(order.defectQty)}
            <SummaryUnit>{unit}</SummaryUnit>
          </SummaryValue>
          <SummaryCaption>품질 검사 누적 결과</SummaryCaption>
        </SummaryCard>

        <SummaryCard $accent={tokens.colors.primary} $delay={180}>
          <SummaryCardTop>
            <SummaryLabel>달성률</SummaryLabel>
            <SummaryIcon $color={tokens.colors.primary}>
              <FiActivity />
            </SummaryIcon>
          </SummaryCardTop>
          <SummaryValue>{totalProgressRate.toFixed(1)}%</SummaryValue>
          <ProgressRow>
            <ProgressTrack>
              <ProgressFill $rate={totalProgressRate} />
            </ProgressTrack>
            <ProgressRate>{Math.round(totalProgressRate)}%</ProgressRate>
          </ProgressRow>
        </SummaryCard>
      </SummaryGrid>

      <ContentGrid>
        <Card $delay={80}>
          <CardHeaderRow>
            <div>
              <CardTitle>목표 수량 변경</CardTitle>
              <CardDescription>
                {order.status !== "PENDING"
                  ? "대기 상태에서만 목표 수량을 변경할 수 있습니다."
                  : "전체 목표와 시간당 생산 목표를 조정합니다."}
              </CardDescription>
            </div>
            <FiTarget />
          </CardHeaderRow>
          <ControlForm
            $columns="minmax(0, 1fr) minmax(0, 1fr) auto"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              run(() =>
                targetsMutation.mutateAsync({
                  targetQty: Number(data.get("targetQty")),
                  hourlyTargetQty: Number(data.get("hourlyTargetQty")),
                }),
              );
            }}
          >
            <Field>
              <span>총 목표 수량</span>
              <Input
                name="targetQty"
                type="number"
                min={Math.max(1, order.currentQty)}
                defaultValue={order.targetQty}
                disabled={order.status !== "PENDING"}
                required
              />
            </Field>
            <Field>
              <span>시간당 목표 생산량</span>
              <Input
                name="hourlyTargetQty"
                type="number"
                min="1"
                defaultValue={order.hourlyTargetQty}
                disabled={order.status !== "PENDING"}
                required
              />
            </Field>
            <StyledButton
              type="submit"
              $variant="primary"
              disabled={mutationPending || order.status !== "PENDING"}
            >
              저장
            </StyledButton>
          </ControlForm>
        </Card>

        <Card $delay={120}>
          <CardHeaderRow>
            <div>
              <CardTitle>지시자 변경</CardTitle>
              <CardDescription>이 작업지시를 담당할 지시자를 선택합니다.</CardDescription>
            </div>
            <FiUser />
          </CardHeaderRow>
          <ControlForm
            $columns="minmax(0, 1fr) auto"
            onSubmit={(event) => {
              event.preventDefault();
              run(() =>
                supervisorMutation.mutateAsync(
                  Number(
                    new FormData(event.currentTarget).get("supervisorUserId"),
                  ),
                ),
              );
            }}
          >
            <Select name="supervisorUserId" defaultValue={order.supervisorId}>
              {approvedSupervisors.map((entry) => (
                <option key={entry.userId} value={entry.userId}>
                  {entry.name} ({entry.empNo})
                </option>
              ))}
            </Select>
            <StyledButton type="submit" $variant="primary" disabled={mutationPending}>
              변경
            </StyledButton>
          </ControlForm>
        </Card>
      </ContentGrid>

      <Card $delay={150}>
        <CardHeaderRow>
          <div>
            <CardTitle>작업자 배정</CardTitle>
            <CardDescription>현재 이 작업지시에 배정된 작업자입니다.</CardDescription>
          </div>
          <StyledButton type="button" $variant="outline" onClick={openWorkerModal}>
            <FiUsers /> 작업자 선택
          </StyledButton>
        </CardHeaderRow>
        {detail.workers.length ? (
          <AssignedWorkerGrid>
            {detail.workers.map((worker) => (
              <AssignedWorkerCard key={worker.userId}>
                <FiUser />
                <span>
                  <strong>{worker.name}</strong>
                  <WorkerMeta>{worker.empNo} · {worker.roleLabel}</WorkerMeta>
                </span>
              </AssignedWorkerCard>
            ))}
          </AssignedWorkerGrid>
        ) : (
          <EmptyCard>현재 배정된 작업자가 없습니다.</EmptyCard>
        )}
        <WorkerFooter>
          <span>현재 {detail.workers.length}명 배정</span>
        </WorkerFooter>
      </Card>

      <SectionCard $delay={180}>
        <SectionHeader>
          <div>
            <SectionTitle>공정·설비 진행 상태</SectionTitle>
            <CardDescription>각 설비는 독립적으로 생산 진행 상태를 표시합니다.</CardDescription>
          </div>
          <Badge $color={tokens.colors.onSurfaceVariant}>
            {detail.processes.length}개 공정
          </Badge>
        </SectionHeader>
        {detail.processes.length ? (
          <>
            <ProcessGrid>
              {detail.processes.map((process, index) => {
                const equipment = detail.equipments.find(
                  (entry) => entry.equipmentId === process.equipmentId,
                );
                const processRate = totalProgressRate;
                return (
                  <ProcessCard
                    key={process.processProgressId}
                    $active={process.status === "IN_PROGRESS"}
                    $delay={Math.min(index, 8) * 45}
                  >
                    <ProcessCardHeader>
                      <ProcessIdentity>
                        <ProcessName>{process.processName}</ProcessName>
                        <ProcessEquipLabel>
                          {process.equipmentCode} · {process.equipmentName}
                        </ProcessEquipLabel>
                      </ProcessIdentity>
                      <Badge $color={colorForStatus(equipment?.status)}>
                        {equipment?.statusLabel || "상태 미확인"}
                      </Badge>
                    </ProcessCardHeader>

                    <ProcessEquipLabel>생산 진행률</ProcessEquipLabel>
                    <ProgressRow>
                      <ProgressTrack>
                        <ProgressFill $rate={processRate} />
                      </ProgressTrack>
                      <ProgressRate>{Math.round(processRate)}%</ProgressRate>
                    </ProgressRow>
                  </ProcessCard>
                );
              })}
            </ProcessGrid>
            <OverallProgressCard>
              <OverallProgressLabel>전체 배정 달성률</OverallProgressLabel>
              <ProgressRow>
                <ProgressTrack>
                  <ProgressFill $rate={totalProgressRate} />
                </ProgressTrack>
              </ProgressRow>
              <OverallProgressValue>
                <strong>{totalProgressRate.toFixed(1)}%</strong>
                <span>
                  {formatNumber(order.currentQty)} {unit} / {formatNumber(order.targetQty)} {unit}
                </span>
              </OverallProgressValue>
            </OverallProgressCard>
          </>
        ) : (
          <EmptyCard>배정된 공정·설비 정보가 없습니다.</EmptyCard>
        )}
      </SectionCard>

      <SectionCard $delay={210}>
        <SectionHeader>
          <div>
            <SectionTitle>상태 변경 이력</SectionTitle>
            <CardDescription>작업지시의 등록 및 상태 변경 기록입니다.</CardDescription>
          </div>
          <FiClock />
        </SectionHeader>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>시각</th>
                <th>액션</th>
                <th>상태</th>
                <th>처리자</th>
                <th>변경 사유 / 메모</th>
              </tr>
            </thead>
            <tbody>
              {detail.statusHistories.map((history) => (
                <tr key={history.historyId}>
                  <td>{toKst(history.changedAt)}</td>
                  <td>
                    <Badge $color={colorForStatus(history.newStatus)}>
                      {historyActionLabel[history.action] || history.action}
                    </Badge>
                  </td>
                  <td>{history.newStatusLabel}</td>
                  <td>
                    {history.changedByName} ({history.changedByEmpNo})
                  </td>
                  <td>{history.note || "입력된 메모 없음"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </SectionCard>

      {statusAction &&
        createPortal(
          <ModalOverlay onClick={closeStatusModal}>
            <ModalPanel
              as="form"
              role="dialog"
              aria-modal="true"
              aria-labelledby="status-change-title"
              onSubmit={saveStatusChange}
              onClick={(event) => event.stopPropagation()}
            >
              <ModalHeader>
                <div>
                  <ModalTitle id="status-change-title">
                    작업 {actionLabel[statusAction]} 확인
                  </ModalTitle>
                  <CardDescription>
                    입력한 내용은 상태 변경 이력에 저장됩니다.
                  </CardDescription>
                </div>
                <ModalCloseBtn
                  type="button"
                  aria-label="닫기"
                  disabled={statusMutation.isPending}
                  onClick={closeStatusModal}
                >
                  <FiX />
                </ModalCloseBtn>
              </ModalHeader>
              <ModalBody>
                <ConfirmText>{actionConfirmText[statusAction]}</ConfirmText>
                <ConfirmSub>
                  {statusAction === "HOLD"
                    ? "보류 사유는 필수입니다."
                    : `메모를 입력하지 않으면 '${actionDefaultNote[statusAction]}'으로 저장됩니다.`}
                </ConfirmSub>
                <Field>
                  <span>
                    {statusAction === "HOLD" ? "보류 사유 (필수)" : "변경 메모 (선택)"}
                  </span>
                  <Textarea
                    autoFocus
                    required={statusAction === "HOLD"}
                    aria-invalid={Boolean(statusModalError)}
                    aria-describedby="status-note-meta"
                    maxLength={500}
                    rows={4}
                    value={statusNote}
                    placeholder={actionNotePlaceholder[statusAction]}
                    onInvalid={(event) => {
                      event.preventDefault();
                      setStatusModalError("작업을 보류하려면 보류 사유를 입력해주세요.");
                    }}
                    onChange={(event) => {
                      setStatusNote(event.target.value);
                      if (statusModalError) {
                        setStatusModalError("");
                      }
                    }}
                  />
                  <ModalFieldMeta id="status-note-meta" $error={Boolean(statusModalError)}>
                    {statusModalError || `${statusNote.length} / 500자`}
                  </ModalFieldMeta>
                </Field>
              </ModalBody>
              <ModalFooter>
                <ModalSelectionCount>
                  {statusAction === "HOLD" ? "사유 입력 필수" : "메모 선택 입력"}
                </ModalSelectionCount>
                <ActionRow>
                  <StyledButton
                    type="button"
                    $variant="ghost"
                    disabled={statusMutation.isPending}
                    onClick={closeStatusModal}
                  >
                    취소
                  </StyledButton>
                  <StyledButton
                    type="submit"
                    $variant={actionVariant[statusAction]}
                    disabled={statusMutation.isPending}
                  >
                    {statusMutation.isPending
                      ? "변경 중..."
                      : `${actionLabel[statusAction]} 적용`}
                  </StyledButton>
                </ActionRow>
              </ModalFooter>
            </ModalPanel>
          </ModalOverlay>,
          document.body,
        )}

      {workerModalOpen &&
        createPortal(
          <ModalOverlay onClick={() => setWorkerModalOpen(false)}>
            <ModalPanel
              $width="760px"
              role="dialog"
              aria-modal="true"
              aria-labelledby="worker-picker-title"
              onClick={(event) => event.stopPropagation()}
            >
              <ModalHeader>
                <div>
                  <ModalTitle id="worker-picker-title">작업자 선택</ModalTitle>
                  <CardDescription>이름 또는 사번으로 검색해 배정할 작업자를 선택합니다.</CardDescription>
                </div>
                <ModalCloseBtn
                  type="button"
                  aria-label="닫기"
                  onClick={() => setWorkerModalOpen(false)}
                >
                  <FiX />
                </ModalCloseBtn>
              </ModalHeader>
              <ModalBody>
                <PickerSearchBox>
                  <FiSearch />
                  <PickerSearchInput
                    autoFocus
                    value={workerSearch}
                    onChange={(event) => setWorkerSearch(event.target.value)}
                    placeholder="작업자 이름 또는 사번 검색"
                  />
                </PickerSearchBox>
                {filteredOperators.length ? (
                  <PickerList>
                    {filteredOperators.map((operator) => {
                      const selected = workerDraftIds.includes(operator.userId);
                      return (
                        <PickerRow
                          key={operator.userId}
                          type="button"
                          $active={selected}
                          aria-pressed={selected}
                          onClick={() => toggleWorker(operator.userId)}
                        >
                          <PickerCheck $active={selected}>
                            {selected && <FiCheck />}
                          </PickerCheck>
                          <PickerInfo>
                            <PickerName>{operator.name}</PickerName>
                            <PickerMeta>
                              {operator.empNo} · {operator.roleLabel}
                            </PickerMeta>
                          </PickerInfo>
                        </PickerRow>
                      );
                    })}
                  </PickerList>
                ) : (
                  <EmptyCard>검색 조건에 맞는 작업자가 없습니다.</EmptyCard>
                )}
              </ModalBody>
              <ModalFooter>
                <ModalSelectionCount>{workerDraftIds.length}명 선택</ModalSelectionCount>
                <ActionRow>
                  <StyledButton
                    type="button"
                    $variant="ghost"
                    onClick={() => setWorkerModalOpen(false)}
                  >
                    취소
                  </StyledButton>
                  <StyledButton
                    type="button"
                    $variant="primary"
                    disabled={workersMutation.isPending}
                    onClick={saveWorkers}
                  >
                    {workersMutation.isPending ? "저장 중..." : "배정 저장"}
                  </StyledButton>
                </ActionRow>
              </ModalFooter>
            </ModalPanel>
          </ModalOverlay>,
          document.body,
        )}
    </Page>
  );
}
