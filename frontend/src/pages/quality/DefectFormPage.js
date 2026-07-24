import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiCheck,
  FiCheckCircle,
  FiClipboard,
  FiInfo,
  FiPackage,
  FiRotateCcw,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { defectApi, materialApi, referenceApi } from "../../api/services";
import { queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { ApiErrors } from "../../components/ApiState";
import { pageContent } from "../../components/OperationalUi";
import {
  Button,
  CardHeader,
  Eyebrow,
  Field,
  FieldGrid,
  FormActions,
  FormCard,
  FormLayout,
  HeaderActions,
  HelpText,
  Input,
  Label,
  MethodGrid,
  MethodOption,
  Notice,
  Page,
  PageHeader,
  PanelLabel,
  RadioMark,
  Required,
  Section,
  SectionTitle,
  Select,
  StatusChip,
  SummaryCard,
  SummaryList,
  SummaryRow,
  Textarea,
  TitleGroup,
} from "./DefectFormPageCss";

const methodOptions = [
  {
    value: "NORMAL_APPROVAL",
    label: "정상 승인",
    description: "품질 기준에 적합한 수량으로 승인합니다.",
    icon: FiCheckCircle,
  },
  {
    value: "REWORK",
    label: "재작업",
    description: "재투입 또는 보완 작업 대상으로 지정합니다.",
    icon: FiRotateCcw,
  },
  {
    value: "DISPOSAL",
    label: "폐기",
    description: "사용 불가 수량으로 확정하고 폐기합니다.",
    icon: FiTrash2,
  },
];

const statusLabels = {
  UNHANDLED: "미처리",
  IN_PROGRESS: "처리 중",
  ON_HOLD: "보류",
  COMPLETED: "처리 완료",
};

const emptyForm = {
  workOrderId: "",
  productionLotId: "",
  equipmentId: "",
  defectType: "",
  quantity: "",
  cause: "",
  handleMethod: "NORMAL_APPROVAL",
  status: "UNHANDLED",
  handlingContent: "",
};

export default function DefectFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lotsQuery = useQuery({
    queryKey: queryKeys.productionLots({ size: 100 }),
    queryFn: () => materialApi.productionLots({ size: 100 }),
  });
  const equipmentsQuery = useQuery({
    queryKey: queryKeys.equipments(),
    queryFn: () => referenceApi.equipments(),
  });
  const typesQuery = useQuery({
    queryKey: queryKeys.defectTypes(),
    queryFn: defectApi.types,
  });
  const createMutation = useMutation({ mutationFn: defectApi.create });

  const lots = useMemo(() => pageContent(lotsQuery.data), [lotsQuery.data]);
  const equipments = useMemo(
    () => pageContent(equipmentsQuery.data),
    [equipmentsQuery.data],
  );
  const workOrders = useMemo(() => {
    const uniqueOrders = new Map();
    lots.forEach((lot) => {
      if (lot.workOrderId && !uniqueOrders.has(lot.workOrderId)) {
        uniqueOrders.set(lot.workOrderId, {
          workOrderId: lot.workOrderId,
          workOrderNo: lot.workOrderNo,
          productName: lot.productName,
        });
      }
    });
    return [...uniqueOrders.values()];
  }, [lots]);
  const availableLots = useMemo(
    () =>
      lots.filter(
        (lot) => String(lot.workOrderId) === String(form.workOrderId),
      ),
    [form.workOrderId, lots],
  );
  const selectedLot = useMemo(
    () =>
      lots.find(
        (lot) =>
          String(lot.productionLotId) === String(form.productionLotId),
      ),
    [form.productionLotId, lots],
  );
  const selectedWorkOrder = workOrders.find(
    (order) => String(order.workOrderId) === String(form.workOrderId),
  );

  const processOptions = useMemo(() => {
    const assignedProcesses = (selectedLot?.processes || []).filter(
      (process) => process.equipmentId,
    );
    if (assignedProcesses.length) {
      return assignedProcesses.map((process) => ({
        equipmentId: process.equipmentId,
        equipmentCode: process.equipmentCode,
        equipmentName: process.equipmentName,
        processName: process.processName,
      }));
    }
    return equipments.map((equipment) => ({
      equipmentId: equipment.equipmentId,
      equipmentCode: equipment.equipmentCode,
      equipmentName: equipment.equipmentName,
      processName: equipment.processName,
    }));
  }, [equipments, selectedLot]);
  const selectedProcess = processOptions.find(
    (process) => String(process.equipmentId) === String(form.equipmentId),
  );
  const selectedType = (typesQuery.data || []).find(
    (type) => type.code === form.defectType,
  );
  const selectedMethod = methodOptions.find(
    (method) => method.value === form.handleMethod,
  );

  const updateForm = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleWorkOrderChange = (event) => {
    setForm((current) => ({
      ...current,
      workOrderId: event.target.value,
      productionLotId: "",
      equipmentId: "",
    }));
  };

  const handleLotChange = (event) => {
    setForm((current) => ({
      ...current,
      productionLotId: event.target.value,
      equipmentId: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const detail = await createMutation.mutateAsync({
        productionLotId: Number(form.productionLotId),
        equipmentId: Number(form.equipmentId),
        defectType: form.defectType,
        quantity: Number(form.quantity),
        cause: form.cause.trim() || null,
        occurredAt: null,
      });
      const defectId = detail.summary.defectId;
      let notice = "불량을 등록했습니다.";

      if (form.status !== "UNHANDLED") {
        try {
          await defectApi.handle(defectId, {
            handlerId: user.userId,
            handleMethod: form.handleMethod,
            status: form.status,
            handlingContent: form.handlingContent.trim() || null,
          });
          notice = "불량 등록과 초기 처리 내용을 저장했습니다.";
        } catch (handlingError) {
          notice = `불량은 등록되었지만 초기 처리는 저장하지 못했습니다. 상세 화면에서 다시 처리해 주세요. (${extractApiError(handlingError)})`;
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["defects"] });
      navigate(`/quality/defects/${defectId}`, {
        state: { notice },
      });
    } catch (error) {
      setMessage(extractApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page>
      <PageHeader>
        <TitleGroup>
          <Eyebrow>Quality Control · Registration</Eyebrow>
          <h1>불량 등록 및 처리</h1>
          <p>
            작업지시와 생산 LOT의 실제 공정을 연결해 불량을 등록하고,
            필요하면 초기 처리 상태까지 함께 지정합니다.
          </p>
        </TitleGroup>
        <HeaderActions>
          <Button type="button" onClick={() => navigate("/quality/defects")}>
            <FiX aria-hidden="true" />
            취소
          </Button>
        </HeaderActions>
      </PageHeader>

      <ApiErrors queries={[lotsQuery, equipmentsQuery, typesQuery]} />

      <FormLayout>
        <FormCard as="form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
          <CardHeader>
            <div>
              <PanelLabel>Defect Information</PanelLabel>
              <h2>발생 정보</h2>
            </div>
            <FiClipboard aria-hidden="true" />
          </CardHeader>

          <Section>
            <SectionTitle>생산 대상</SectionTitle>
            <FieldGrid>
              <Field>
                <Label htmlFor="defect-work-order">
                  작업지시 <Required aria-hidden="true">*</Required>
                </Label>
                <Select
                  id="defect-work-order"
                  value={form.workOrderId}
                  onChange={handleWorkOrderChange}
                  required
                >
                  <option value="">작업지시 선택</option>
                  {workOrders.map((order) => (
                    <option
                      key={order.workOrderId}
                      value={order.workOrderId}
                    >
                      {order.workOrderNo} · {order.productName}
                    </option>
                  ))}
                </Select>
                <HelpText>생산 LOT 기준으로 작업지시를 연결합니다.</HelpText>
              </Field>

              <Field>
                <Label htmlFor="defect-production-lot">
                  생산 LOT <Required aria-hidden="true">*</Required>
                </Label>
                <Select
                  id="defect-production-lot"
                  value={form.productionLotId}
                  onChange={handleLotChange}
                  disabled={!form.workOrderId}
                  required
                >
                  <option value="">생산 LOT 선택</option>
                  {availableLots.map((lot) => (
                    <option
                      key={lot.productionLotId}
                      value={lot.productionLotId}
                    >
                      {lot.lotNo} · {lot.productName}
                    </option>
                  ))}
                </Select>
                <HelpText>
                  작업지시를 선택하면 연결된 LOT만 표시됩니다.
                </HelpText>
              </Field>

              <Field>
                <Label htmlFor="defect-process">
                  발생 공정 <Required aria-hidden="true">*</Required>
                </Label>
                <Select
                  id="defect-process"
                  value={form.equipmentId}
                  onChange={(event) =>
                    updateForm("equipmentId", event.target.value)
                  }
                  disabled={!form.productionLotId}
                  required
                >
                  <option value="">공정 선택</option>
                  {processOptions.map((process) => (
                    <option
                      key={process.equipmentId}
                      value={process.equipmentId}
                    >
                      {process.processName} · {process.equipmentCode}{" "}
                      {process.equipmentName}
                    </option>
                  ))}
                </Select>
                <HelpText>
                  공정 선택 시 연결 설비가 함께 기록됩니다.
                </HelpText>
              </Field>

              <Field>
                <Label htmlFor="defect-type">
                  불량 유형 <Required aria-hidden="true">*</Required>
                </Label>
                <Select
                  id="defect-type"
                  value={form.defectType}
                  onChange={(event) =>
                    updateForm("defectType", event.target.value)
                  }
                  required
                >
                  <option value="">불량 유형 선택</option>
                  {(typesQuery.data || []).map((type) => (
                    <option key={type.code} value={type.code}>
                      {type.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                <Label htmlFor="defect-quantity">
                  불량 수량 <Required aria-hidden="true">*</Required>
                </Label>
                <Input
                  id="defect-quantity"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={form.quantity}
                  onChange={(event) =>
                    updateForm("quantity", event.target.value)
                  }
                  placeholder="0"
                  required
                />
                <HelpText>실제 확인된 불량 수량을 EA 단위로 입력합니다.</HelpText>
              </Field>
            </FieldGrid>
          </Section>

          <Section>
            <SectionTitle>원인 기록</SectionTitle>
            <Field $full>
              <Label htmlFor="defect-cause">불량 원인</Label>
              <Textarea
                id="defect-cause"
                value={form.cause}
                onChange={(event) => updateForm("cause", event.target.value)}
                placeholder="관찰된 원인, 설비 상태 또는 작업 조건을 입력해 주세요."
              />
              <HelpText>
                원인이 확정되지 않았다면 등록 후 상세 화면에서 보완할 수
                있습니다.
              </HelpText>
            </Field>
          </Section>

          <Section>
            <SectionTitle>초기 처리</SectionTitle>
            <MethodGrid role="radiogroup" aria-label="처리 방법">
              {methodOptions.map((method) => {
                const Icon = method.icon;
                const isActive = form.handleMethod === method.value;
                return (
                  <MethodOption key={method.value} $active={isActive}>
                    <input
                      type="radio"
                      name="handleMethod"
                      value={method.value}
                      checked={isActive}
                      onChange={(event) =>
                        updateForm("handleMethod", event.target.value)
                      }
                    />
                    <RadioMark $active={isActive}>
                      {isActive ? (
                        <FiCheck aria-hidden="true" />
                      ) : (
                        <Icon aria-hidden="true" />
                      )}
                    </RadioMark>
                    <span>
                      <strong>{method.label}</strong>
                      <small>{method.description}</small>
                    </span>
                  </MethodOption>
                );
              })}
            </MethodGrid>

            <FieldGrid>
              <Field>
                <Label htmlFor="defect-handler">처리 담당자</Label>
                <Input
                  id="defect-handler"
                  value={`${user?.name || "로그인 사용자"}${user?.empNo ? ` · ${user.empNo}` : ""}`}
                  readOnly
                />
                <HelpText>현재 로그인한 사용자가 처리자로 기록됩니다.</HelpText>
              </Field>

              <Field>
                <Label htmlFor="defect-status">처리 상태</Label>
                <Select
                  id="defect-status"
                  value={form.status}
                  onChange={(event) =>
                    updateForm("status", event.target.value)
                  }
                >
                  <option value="UNHANDLED">미처리</option>
                  <option value="IN_PROGRESS">처리 중</option>
                  <option value="ON_HOLD">보류</option>
                  <option value="COMPLETED">처리 완료</option>
                </Select>
                <HelpText>
                  미처리 선택 시 처리 방법은 저장하지 않고 등록만 합니다.
                </HelpText>
              </Field>
            </FieldGrid>

            <Field $full>
              <Label htmlFor="defect-handling-content">처리 내용</Label>
              <Textarea
                id="defect-handling-content"
                value={form.handlingContent}
                onChange={(event) =>
                  updateForm("handlingContent", event.target.value)
                }
                disabled={form.status === "UNHANDLED"}
                placeholder="재작업 범위, 폐기 사유, 승인 근거 등을 입력해 주세요."
              />
            </Field>

            {message && (
              <Notice $warning role="alert">
                <FiAlertCircle aria-hidden="true" />
                <span>{message}</span>
              </Notice>
            )}

            <FormActions>
              <Button
                type="button"
                onClick={() => navigate("/quality/defects")}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button type="submit" $primary disabled={isSubmitting}>
                <FiCheck aria-hidden="true" />
                {isSubmitting ? "저장 중..." : "불량 등록"}
              </Button>
            </FormActions>
          </Section>
        </FormCard>

        <SummaryCard aria-label="등록 내용 요약">
          <PanelLabel>Registration Summary</PanelLabel>
          <h2>등록 내용 요약</h2>
          <SummaryList>
            <SummaryRow>
              <span>작업지시</span>
              <strong>{selectedWorkOrder?.workOrderNo || "미선택"}</strong>
            </SummaryRow>
            <SummaryRow>
              <span>제품</span>
              <strong>{selectedLot?.productName || "미선택"}</strong>
            </SummaryRow>
            <SummaryRow>
              <span>생산 LOT</span>
              <strong>{selectedLot?.lotNo || "미선택"}</strong>
            </SummaryRow>
            <SummaryRow>
              <span>발생 공정</span>
              <strong>{selectedProcess?.processName || "미선택"}</strong>
            </SummaryRow>
            <SummaryRow>
              <span>불량 유형</span>
              <strong>{selectedType?.name || "미선택"}</strong>
            </SummaryRow>
            <SummaryRow>
              <span>불량 수량</span>
              <strong>{form.quantity ? `${form.quantity} EA` : "미입력"}</strong>
            </SummaryRow>
            <SummaryRow>
              <span>처리 방법</span>
              <strong>{selectedMethod?.label || "미선택"}</strong>
            </SummaryRow>
            <SummaryRow>
              <span>처리 상태</span>
              <StatusChip $status={form.status}>
                {statusLabels[form.status]}
              </StatusChip>
            </SummaryRow>
          </SummaryList>
          <Notice>
            <FiInfo aria-hidden="true" />
            <span>
              등록 후 상세 화면에서 원인과 처리 이력을 계속 보완할 수
              있습니다.
            </span>
          </Notice>
          {form.status === "COMPLETED" && (
            <Notice $warning>
              <FiPackage aria-hidden="true" />
              <span>
                처리 완료로 저장하면 해당 불량은 다시 미처리 상태로 되돌릴
                수 없습니다.
              </span>
            </Notice>
          )}
        </SummaryCard>
      </FormLayout>
    </Page>
  );
}
