import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiInbox,
  FiMapPin,
  FiSave,
  FiTool,
  FiUser,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { alarmApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { currentKstDate, kstPeriod, toKst } from "../../api/time";
import { useAuth } from "../../context/AuthContext";
import { QueryStatus } from "../../components/ApiState";
import { pageContent } from "../../components/OperationalUi";
import {
  ActionPanel,
  ButtonRow,
  DetailLayout,
  EmptyState,
  Eyebrow,
  Field,
  FormGrid,
  HeroDescription,
  HeroHeader,
  HeroMetaGrid,
  HeroPanel,
  InfoGrid,
  InfoItem,
  InfoPanel,
  Message,
  MetaItem,
  MonoText,
  PageHeader,
  PageShell,
  PanelHeader,
  PanelLabel,
  PanelMeta,
  PrimaryButton,
  RelatedPanel,
  RelatedTable,
  ResolutionGrid,
  ResolutionItem,
  SecondaryButton,
  SeverityChip,
  StatusPill,
  TableFrame,
  TextAreaField,
  TimeCell,
  Timeline,
  TimelineItem,
  TimelinePanel,
  TitleBlock,
} from "./AlarmDetailPageCss";

const severityKey = (severity) => String(severity || "INFO").toLowerCase();

const statusKey = (status) => {
  if (status === "RESOLVED") return "resolved";
  if (status === "PENDING_CONFIRMATION") return "pending";
  return "active";
};

const byLatest = (left, right) =>
  new Date(right.occurredAt || 0).getTime() -
  new Date(left.occurredAt || 0).getTime();

export default function AlarmDetailPage() {
  const { alarmId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [message, setMessage] = useState(null);

  const query = useQuery({
    queryKey: queryKeys.alarm(alarmId),
    queryFn: () => alarmApi.detail(alarmId),
    refetchInterval: (state) =>
      state.state.data?.summary?.status === "RESOLVED"
        ? false
        : POLLING.CURRENT_ALARM,
  });

  const equipmentId = query.data?.summary?.equipmentId;
  const relatedParams = {
    equipmentId,
    period: { days: 30, through: currentKstDate() },
    page: 0,
    size: 10,
  };
  const relatedQuery = useQuery({
    queryKey: queryKeys.alarms("detail-related", relatedParams),
    queryFn: () => {
      const period = kstPeriod(30);
      return alarmApi.list({
        equipmentId,
        page: 0,
        size: 10,
        startAt: period.from,
        endAt: period.to,
      });
    },
    enabled: Boolean(equipmentId),
    refetchInterval: POLLING.HISTORY,
    placeholderData: (previous) => previous,
  });

  const mutation = useMutation({
    mutationFn: (body) => alarmApi.handle(alarmId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["alarms"] });
    },
  });

  const detail = query.data;
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const status = String(data.get("status") || "");
    const handlingContent = String(
      data.get("handlingContent") || "",
    ).trim();

    if (status === "RESOLVED" && !handlingContent) {
      setMessage({
        tone: "error",
        text: "처리 완료 시 조치 내용을 입력해 주세요.",
      });
      return;
    }

    setMessage(null);
    try {
      await mutation.mutateAsync({
        handlerId: user?.userId || null,
        handlingContent: handlingContent || null,
        status,
        resolvedAt: null,
      });
      setMessage({
        tone: "success",
        text: "알람 처리 상태를 저장했습니다.",
      });
    } catch (error) {
      setMessage({ tone: "error", text: extractApiError(error) });
    }
  };

  if (!detail) {
    return (
      <PageShell>
        <PageHeader>
          <TitleBlock>
            <Eyebrow>Alarm detail</Eyebrow>
            <h1>알람 상세 정보</h1>
            <p>알람 정보를 불러오고 있습니다.</p>
          </TitleBlock>
          <SecondaryButton
            type="button"
            onClick={() => navigate("/alarms/history")}
          >
            <FiArrowLeft aria-hidden="true" />
            목록으로
          </SecondaryButton>
        </PageHeader>
        <QueryStatus query={query} />
      </PageShell>
    );
  }

  const alarm = detail.summary;
  const relatedAlarms = pageContent(relatedQuery.data)
    .filter((item) => item.alarmId !== alarm.alarmId)
    .sort(byLatest)
    .slice(0, 5);
  const resolved = alarm.status === "RESOLVED";
  const initialStatus =
    alarm.status === "PENDING_CONFIRMATION" ? "IN_PROGRESS" : alarm.status;

  const openAlarm = (id) => navigate(`/alarm/detail/${id}`);
  const handleRowKeyDown = (event, id) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openAlarm(id);
    }
  };

  return (
    <PageShell>
      <PageHeader>
        <TitleBlock>
          <Eyebrow>Alarm detail</Eyebrow>
          <h1>알람 상세 정보</h1>
          <p>
            발생 위치와 시간, 처리자 및 조치 내용을 확인하고 현재 처리
            상태를 관리합니다.
          </p>
        </TitleBlock>
        <SecondaryButton
          type="button"
          onClick={() => navigate("/alarms/history")}
        >
          <FiArrowLeft aria-hidden="true" />
          알람 이력
        </SecondaryButton>
      </PageHeader>

      <DetailLayout>
        <HeroPanel $severity={severityKey(alarm.severity)}>
          <HeroHeader>
            <div>
              <PanelLabel>Alarm message</PanelLabel>
              <h2>{alarm.message}</h2>
            </div>
            <SeverityChip $severity={severityKey(alarm.severity)}>
              {alarm.severityLabel}
            </SeverityChip>
          </HeroHeader>
          <HeroDescription>
            {detail.description || "등록된 상세 설명이 없습니다."}
          </HeroDescription>
          <HeroMetaGrid>
            <MetaItem>
              <span>알람 번호</span>
              <strong>
                <MonoText>{alarm.alarmNo}</MonoText>
              </strong>
            </MetaItem>
            <MetaItem>
              <span>심각도</span>
              <strong>{alarm.severityLabel}</strong>
            </MetaItem>
            <MetaItem>
              <span>처리 상태</span>
              <strong>
                <StatusPill $status={statusKey(alarm.status)}>
                  {alarm.statusLabel}
                </StatusPill>
              </strong>
            </MetaItem>
          </HeroMetaGrid>
        </HeroPanel>

        <TimelinePanel>
          <PanelLabel>Event timeline</PanelLabel>
          <h2>처리 타임라인</h2>
          <Timeline>
            <TimelineItem $active>
              <MonoText>{toKst(alarm.occurredAt)}</MonoText>
              <strong>알람 발생</strong>
              <span>{alarm.location || "발생 위치 미등록"}</span>
            </TimelineItem>
            <TimelineItem $active={!resolved}>
              <MonoText>
                {resolved ? toKst(alarm.resolvedAt) : "현재"}
              </MonoText>
              <strong>{alarm.statusLabel}</strong>
              <span>
                {detail.handlerName
                  ? `${detail.handlerName} 담당`
                  : "담당자 지정 전"}
              </span>
            </TimelineItem>
            <TimelineItem $active={resolved}>
              <MonoText>{toKst(alarm.resolvedAt)}</MonoText>
              <strong>{resolved ? "알람 해제" : "해제 대기"}</strong>
              <span>
                {resolved
                  ? "조치 내용 기록 완료"
                  : "조치 완료 후 해제 시간이 기록됩니다."}
              </span>
            </TimelineItem>
          </Timeline>
        </TimelinePanel>

        <InfoPanel>
          <PanelLabel>Occurrence information</PanelLabel>
          <h2>발생 정보</h2>
          <InfoGrid>
            <InfoItem>
              <FiCpu aria-hidden="true" />
              <div>
                <dt>설비명</dt>
                <dd>
                  {alarm.equipmentName}{" "}
                  <MonoText>{alarm.equipmentCode}</MonoText>
                </dd>
              </div>
            </InfoItem>
            <InfoItem>
              <FiMapPin aria-hidden="true" />
              <div>
                <dt>발생 위치</dt>
                <dd>
                  {alarm.processName || "공정 미등록"} ·{" "}
                  {alarm.location || "위치 미등록"}
                </dd>
              </div>
            </InfoItem>
            <InfoItem>
              <FiClock aria-hidden="true" />
              <div>
                <dt>발생 시간</dt>
                <dd>
                  <MonoText>{toKst(alarm.occurredAt)}</MonoText>
                </dd>
              </div>
            </InfoItem>
            <InfoItem>
              <FiCheckCircle aria-hidden="true" />
              <div>
                <dt>해제 시간</dt>
                <dd>
                  <MonoText>{toKst(alarm.resolvedAt)}</MonoText>
                </dd>
              </div>
            </InfoItem>
          </InfoGrid>
        </InfoPanel>

        <ActionPanel>
          <PanelHeader>
            <div>
              <PanelLabel>Handling record</PanelLabel>
              <h2>{resolved ? "처리 결과" : "처리 등록"}</h2>
            </div>
            <StatusPill $status={statusKey(alarm.status)}>
              {alarm.statusLabel}
            </StatusPill>
          </PanelHeader>

          {resolved ? (
            <ResolutionGrid>
              <ResolutionItem>
                <FiUser aria-hidden="true" />
                <div>
                  <span>처리자</span>
                  <strong>{detail.handlerName || "-"}</strong>
                  <MonoText>{detail.handlerEmpNo || "-"}</MonoText>
                </div>
              </ResolutionItem>
              <ResolutionItem>
                <FiTool aria-hidden="true" />
                <div>
                  <span>처리 내용</span>
                  <strong>{detail.handlingContent || "-"}</strong>
                </div>
              </ResolutionItem>
            </ResolutionGrid>
          ) : (
            <FormGrid
              as="form"
              key={`${alarm.status}-${detail.handlingContent || ""}`}
              onSubmit={handleSubmit}
            >
              <Field>
                <span>처리자</span>
                <input
                  value={`${user?.name || user?.userName || "현재 사용자"}${
                    user?.empNo ? ` · ${user.empNo}` : ""
                  }`}
                  readOnly
                  aria-label="처리자"
                />
              </Field>
              <Field className="alarm-status-field">
                <span>처리 상태 변경</span>
                <select
                  name="status"
                  defaultValue={initialStatus}
                  aria-label="처리 상태"
                  aria-describedby="alarm-status-help"
                >
                  <option value="IN_PROGRESS">조치 중</option>
                  <option value="INSPECTION_RESERVED">점검 예약</option>
                  <option value="MONITORING">모니터링</option>
                  <option value="RESOLVED">처리 완료</option>
                </select>
                <small id="alarm-status-help">
                  알람의 현재 진행 단계를 선택해 주세요.
                </small>
              </Field>
              <TextAreaField>
                <span>조치 내용</span>
                <textarea
                  name="handlingContent"
                  defaultValue={detail.handlingContent || ""}
                  placeholder="확인한 원인과 조치 내용을 입력해 주세요."
                  aria-label="조치 내용"
                />
              </TextAreaField>
              <ButtonRow>
                <PrimaryButton type="submit" disabled={mutation.isPending}>
                  <FiSave aria-hidden="true" />
                  {mutation.isPending ? "저장 중..." : "처리 상태 저장"}
                </PrimaryButton>
              </ButtonRow>
            </FormGrid>
          )}
          {message && (
            <Message role="status" $error={message.tone === "error"}>
              {message.text}
            </Message>
          )}
        </ActionPanel>

        <RelatedPanel>
          <PanelHeader>
            <div>
              <PanelLabel>Related alarms</PanelLabel>
              <h2>동일 설비 최근 알람</h2>
            </div>
            <PanelMeta>최근 30일 · 최대 5건</PanelMeta>
          </PanelHeader>
          <QueryStatus query={relatedQuery} />
          {!relatedQuery.isPending &&
            (relatedAlarms.length > 0 ? (
              <TableFrame>
                <RelatedTable>
                  <thead>
                    <tr>
                      <th>발생 일시</th>
                      <th>알람 번호</th>
                      <th>알람 내용</th>
                      <th>심각도</th>
                      <th>처리 상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatedAlarms.map((item) => (
                      <tr
                        key={item.alarmId}
                        className="alarm-clickable-row"
                        tabIndex={0}
                        aria-label={`${item.alarmNo} 상세 보기`}
                        onClick={() => openAlarm(item.alarmId)}
                        onKeyDown={(event) =>
                          handleRowKeyDown(event, item.alarmId)
                        }
                      >
                        <td>
                          <TimeCell>
                            <MonoText>
                              {toKst(item.occurredAt, "YYYY-MM-DD")}
                            </MonoText>
                            <span>{toKst(item.occurredAt, "HH:mm:ss")}</span>
                          </TimeCell>
                        </td>
                        <td>
                          <MonoText>{item.alarmNo}</MonoText>
                        </td>
                        <td>{item.message}</td>
                        <td>
                          <SeverityChip
                            $severity={severityKey(item.severity)}
                          >
                            {item.severityLabel}
                          </SeverityChip>
                        </td>
                        <td>
                          <StatusPill $status={statusKey(item.status)}>
                            {item.statusLabel}
                          </StatusPill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </RelatedTable>
              </TableFrame>
            ) : (
              <EmptyState>
                <FiInbox aria-hidden="true" />
                <strong>동일 설비의 다른 알람이 없습니다.</strong>
                <span>
                  최근 30일 범위에서 관련 알람이 발견되지 않았습니다.
                </span>
              </EmptyState>
            ))}
        </RelatedPanel>
      </DetailLayout>
    </PageShell>
  );
}
