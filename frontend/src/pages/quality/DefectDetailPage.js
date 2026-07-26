import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiHash,
  FiLayers,
  FiPackage,
  FiSave,
  FiTool,
  FiUser,
} from "react-icons/fi";
import { defectApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { toKst } from "../../api/time";
import { useAuth } from "../../context/AuthContext";
import { QueryStatus } from "../../components/ApiState";
import { formatNumber } from "../../components/OperationalUi";
import {
  Button,
  Description,
  DetailGrid,
  EmptyState,
  Eyebrow,
  Field,
  FieldGrid,
  FormActions,
  HeaderActions,
  InfoGrid,
  InfoItem,
  Input,
  Label,
  MethodBadge,
  MetricCard,
  MetricGrid,
  MetricLabel,
  MetricValue,
  Mono,
  Notice,
  Page,
  PageHeader,
  Panel,
  PanelHeader,
  PanelLabel,
  Select,
  StatusChip,
  Textarea,
  Timeline,
  TimelineDot,
  TimelineItem,
  TitleGroup,
  TreatmentForm,
} from "./DefectDetailPageCss";

const statusTone = (status) => {
  if (status === "COMPLETED") {
    return "success";
  }
  if (status === "UNHANDLED") {
    return "alarm";
  }
  return "warning";
};

const statusLabel = {
  UNHANDLED: "미처리",
  IN_PROGRESS: "처리 중",
  ON_HOLD: "보류",
  COMPLETED: "처리 완료",
};

export default function DefectDetailPage() {
  const { defectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [feedback, setFeedback] = useState(() => ({
    kind: location.state?.notice?.includes("저장하지 못했습니다")
      ? "warning"
      : location.state?.notice
        ? "success"
        : "",
    text: location.state?.notice || "",
  }));

  const query = useQuery({
    queryKey: queryKeys.defect(defectId),
    queryFn: () => defectApi.detail(defectId),
    refetchInterval: (state) =>
      state.state.data?.summary?.status === "COMPLETED"
        ? false
        : POLLING.DEFECT,
  });
  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["defects"] });
  };
  const causeMutation = useMutation({
    mutationFn: (cause) => defectApi.cause(defectId, { cause }),
    onSuccess: invalidate,
  });
  const handleMutation = useMutation({
    mutationFn: (body) => defectApi.handle(defectId, body),
    onSuccess: invalidate,
  });

  const run = async (work, successMessage) => {
    setFeedback({ kind: "", text: "" });
    try {
      await work();
      setFeedback({ kind: "success", text: successMessage });
    } catch (error) {
      setFeedback({ kind: "error", text: extractApiError(error) });
    }
  };

  if (!query.data) {
    return (
      <Page>
        <PageHeader>
          <TitleGroup>
            <Eyebrow>Quality Control · Detail</Eyebrow>
            <h1>불량 상세</h1>
            <p>불량 정보와 처리 이력을 불러오고 있습니다.</p>
          </TitleGroup>
          <HeaderActions>
            <Button type="button" onClick={() => navigate("/quality/defects")}>
              <FiArrowLeft aria-hidden="true" />
              목록
            </Button>
          </HeaderActions>
        </PageHeader>
        <QueryStatus query={query} />
        {!query.isPending && !query.isError && (
          <EmptyState>
            <FiAlertCircle aria-hidden="true" />
            <strong>불량 정보를 찾을 수 없습니다.</strong>
            <span>목록으로 돌아가 다른 불량을 선택해 주세요.</span>
          </EmptyState>
        )}
      </Page>
    );
  }

  const detail = query.data;
  const defect = detail.summary;
  const histories = detail.handlingHistories || [];
  const nextDefaultStatus =
    defect.status === "UNHANDLED" ? "IN_PROGRESS" : defect.status;

  const handleCauseSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    run(
      () => causeMutation.mutateAsync(String(data.get("cause") || "").trim()),
      "불량 원인을 저장했습니다.",
    );
  };

  const handleTreatmentSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    run(
      () =>
        handleMutation.mutateAsync({
          handlerId: user.userId,
          handleMethod: data.get("handleMethod"),
          status: data.get("status"),
          handlingContent:
            String(data.get("handlingContent") || "").trim() || null,
        }),
      "처리 상태와 방법을 저장했습니다.",
    );
  };

  return (
    <Page>
      <PageHeader>
        <TitleGroup>
          <Eyebrow>Quality Control · Defect Record</Eyebrow>
          <div>
            <h1>{defect.defectNo}</h1>
            <StatusChip $tone={statusTone(defect.status)}>
              {defect.statusLabel || statusLabel[defect.status]}
            </StatusChip>
          </div>
          <p>
            {defect.productName} · {defect.lotNo} · 발생부터 최종 처리까지의
            품질 기록입니다.
          </p>
        </TitleGroup>
        <HeaderActions>
          <Button type="button" onClick={() => navigate("/quality/defects")}>
            <FiArrowLeft aria-hidden="true" />
            목록
          </Button>
          <Button
            type="button"
            $primary
            onClick={() => navigate("/quality/defects/new")}
          >
            불량 등록
          </Button>
        </HeaderActions>
      </PageHeader>

      {feedback.text && (
        <Notice
          $success={feedback.kind === "success"}
          $error={feedback.kind === "error"}
          role={feedback.kind === "error" ? "alert" : "status"}
        >
          {feedback.kind === "success" ? (
            <FiCheckCircle aria-hidden="true" />
          ) : (
            <FiAlertCircle aria-hidden="true" />
          )}
          <span>{feedback.text}</span>
        </Notice>
      )}
      <QueryStatus query={query} />

      <MetricGrid aria-label="불량 핵심 정보">
        <MetricCard>
          <MetricLabel>
            <FiHash aria-hidden="true" />
            불량 수량
          </MetricLabel>
          <MetricValue $alarm>
            {formatNumber(defect.quantity)}
            <small>EA</small>
          </MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>
            <FiPackage aria-hidden="true" />
            불량 유형
          </MetricLabel>
          <MetricValue $small>{defect.defectTypeLabel}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>
            <FiLayers aria-hidden="true" />
            발생 공정
          </MetricLabel>
          <MetricValue $small>{defect.processName}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>
            <FiClock aria-hidden="true" />
            발생 일시
          </MetricLabel>
          <MetricValue $small>{toKst(defect.occurredAt)}</MetricValue>
        </MetricCard>
      </MetricGrid>

      <DetailGrid>
        <div>
          <Panel>
            <PanelHeader>
              <div>
                <PanelLabel>Traceability</PanelLabel>
                <h2>생산 추적 정보</h2>
              </div>
              <Mono>{defect.defectNo}</Mono>
            </PanelHeader>
            <InfoGrid>
              <InfoItem>
                <span>제품명</span>
                <strong>{defect.productName}</strong>
                <small>{defect.productCode || "-"}</small>
              </InfoItem>
              <InfoItem>
                <span>작업지시 번호</span>
                <strong>{defect.workOrderNo}</strong>
                <small>WO ID · {defect.workOrderId}</small>
              </InfoItem>
              <InfoItem>
                <span>생산 LOT 번호</span>
                <strong>{defect.lotNo}</strong>
                <small>LOT ID · {defect.productionLotId}</small>
              </InfoItem>
              <InfoItem>
                <span>발생 공정</span>
                <strong>{defect.processName}</strong>
                <small>
                  {defect.equipmentCode} {defect.equipmentName}
                </small>
              </InfoItem>
              <InfoItem>
                <span>불량 유형</span>
                <strong>{defect.defectTypeLabel}</strong>
                <small>{defect.defectType}</small>
              </InfoItem>
              <InfoItem>
                <span>처리 상태</span>
                <StatusChip
                  $fitContent
                  $tone={statusTone(defect.status)}
                >
                  {defect.statusLabel}
                </StatusChip>
                <small>{toKst(defect.occurredAt)}</small>
              </InfoItem>
            </InfoGrid>
          </Panel>

          <Panel>
            <PanelHeader>
              <div>
                <PanelLabel>Root Cause</PanelLabel>
                <h2>불량 원인</h2>
              </div>
              <FiEdit3 aria-hidden="true" />
            </PanelHeader>
            <TreatmentForm onSubmit={handleCauseSubmit}>
              <Field>
                <Label htmlFor="defect-cause-detail">불량 원인</Label>
                <Textarea
                  id="defect-cause-detail"
                  name="cause"
                  defaultValue={detail.cause || ""}
                  placeholder="확인된 원인과 발생 조건을 입력해 주세요."
                />
              </Field>
              <FormActions>
                <Button
                  type="submit"
                  $primary
                  disabled={causeMutation.isPending}
                >
                  <FiSave aria-hidden="true" />
                  {causeMutation.isPending ? "저장 중..." : "원인 저장"}
                </Button>
              </FormActions>
            </TreatmentForm>
          </Panel>

          <Panel>
            <PanelHeader>
              <div>
                <PanelLabel>Handling History</PanelLabel>
                <h2>처리 이력</h2>
              </div>
              <Mono>{histories.length} Records</Mono>
            </PanelHeader>
            {histories.length > 0 ? (
              <Timeline role="list">
                {histories.map((history) => (
                  <TimelineItem
                    key={history.defectHandlingHistoryId}
                    role="listitem"
                  >
                    <TimelineDot $tone={statusTone(history.status)} />
                    <div>
                      <strong>
                        {history.statusLabel || statusLabel[history.status]}
                      </strong>
                      <Mono>{toKst(history.handledAt)}</Mono>
                      <span>
                        {history.handleMethodLabel || "처리 방법 미지정"} ·{" "}
                        {history.handledByName || "처리자 미확인"}
                      </span>
                      {history.content && <span>{history.content}</span>}
                    </div>
                  </TimelineItem>
                ))}
              </Timeline>
            ) : (
              <Description>
                아직 처리 이력이 없습니다. 우측 처리 패널에서 담당자와 처리
                상태를 기록해 주세요.
              </Description>
            )}
          </Panel>
        </div>

        <Panel $sticky>
          <PanelHeader>
            <div>
              <PanelLabel>Treatment</PanelLabel>
              <h2>불량 처리</h2>
            </div>
            <FiTool aria-hidden="true" />
          </PanelHeader>

          {defect.status === "COMPLETED" ? (
            <>
              <Description>
                최종 처리까지 완료된 불량입니다. 완료된 기록은 다시 열 수
                없습니다.
              </Description>
              {histories.length > 0 && (
                <MethodBadge>
                  {histories[histories.length - 1].handleMethodLabel ||
                    "처리 완료"}
                </MethodBadge>
              )}
            </>
          ) : (
            <TreatmentForm onSubmit={handleTreatmentSubmit}>
              <Field>
                <Label htmlFor="defect-handler-detail">처리 담당자</Label>
                <Input
                  id="defect-handler-detail"
                  value={`${user?.name || "로그인 사용자"}${user?.empNo ? ` · ${user.empNo}` : ""}`}
                  readOnly
                />
              </Field>

              <FieldGrid>
                <Field>
                  <Label htmlFor="defect-status-detail">처리 상태</Label>
                  <Select
                    id="defect-status-detail"
                    name="status"
                    defaultValue={nextDefaultStatus}
                  >
                    <option value="IN_PROGRESS">처리 중</option>
                    <option value="ON_HOLD">보류</option>
                    <option value="COMPLETED">처리 완료</option>
                  </Select>
                </Field>
                <Field>
                  <Label htmlFor="defect-method-detail">처리 방법</Label>
                  <Select
                    id="defect-method-detail"
                    name="handleMethod"
                    defaultValue="NORMAL_APPROVAL"
                  >
                    <option value="NORMAL_APPROVAL">정상 승인</option>
                    <option value="REWORK">재작업</option>
                    <option value="DISPOSAL">폐기</option>
                  </Select>
                </Field>
              </FieldGrid>

              <Field>
                <Label htmlFor="defect-content-detail">처리 내용</Label>
                <Textarea
                  id="defect-content-detail"
                  name="handlingContent"
                  placeholder="조치 내용과 판단 근거를 입력해 주세요."
                />
              </Field>

              <Notice>
                <FiUser aria-hidden="true" />
                <span>
                  저장 시 현재 로그인 사용자가 처리 담당자로 기록됩니다.
                </span>
              </Notice>

              <FormActions>
                <Button
                  type="submit"
                  $primary
                  disabled={handleMutation.isPending}
                >
                  <FiSave aria-hidden="true" />
                  {handleMutation.isPending ? "저장 중..." : "처리 저장"}
                </Button>
              </FormActions>
            </TreatmentForm>
          )}
        </Panel>
      </DetailGrid>
    </Page>
  );
}
