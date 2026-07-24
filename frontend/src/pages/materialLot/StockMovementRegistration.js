import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { materialApi } from "../../api/services";
import { queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { toUtcInstant } from "../../api/time";
import { useAuth } from "../../context/AuthContext";
import { ApiErrors } from "../../components/ApiState";
import { pageContent } from "../../components/OperationalUi";
import {
  Field,
  FieldLabel,
  FormGrid,
  ModalActions,
  ModalBody,
  ModalDescription,
  ModalFeedback,
  ModalHeader,
  ModalOverlay,
  ModalPanel,
  ModalTitle,
  PrimaryButton,
  SecondaryButton,
  Select,
  TextArea,
  TextInput,
} from "./StockMovementRegistrationCss";

export default function StockMovementRegistration({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [itemType, setItemType] = useState("RAW_MATERIAL");
  const [message, setMessage] = useState("");
  const rawQuery = useQuery({
    queryKey: queryKeys.rawMaterialLots({ size: 100 }),
    queryFn: () => materialApi.rawMaterialLots({ size: 100 }),
    enabled: isOpen,
  });
  const productQuery = useQuery({
    queryKey: queryKeys.productInventories({ size: 100 }),
    queryFn: () => materialApi.productInventories({ size: 100 }),
    enabled: isOpen,
  });
  const mutation = useMutation({
    mutationFn: materialApi.createMovement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] }),
  });

  if (!isOpen) return null;

  const targetOptions = itemType === "RAW_MATERIAL"
    ? pageContent(rawQuery.data)
    : pageContent(productQuery.data);

  const submit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const targetId = Number(data.get("targetId"));
    setMessage("");

    try {
      await mutation.mutateAsync({
        itemType,
        movementType: data.get("movementType"),
        rawMaterialLotId: itemType === "RAW_MATERIAL" ? targetId : null,
        productInventoryId: itemType === "FINISHED_PRODUCT" ? targetId : null,
        quantity: Number(data.get("quantity")),
        handledById: user.userId,
        occurredAt: data.get("occurredAt") ? toUtcInstant(data.get("occurredAt")) : null,
        remarks: String(data.get("remarks") || "").trim() || null,
      });
      onClose();
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  return (
    <ModalOverlay role="presentation" onMouseDown={onClose}>
      <ModalPanel
        as="form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-movement-modal-title"
        onSubmit={submit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ModalHeader>
          <div>
            <ModalTitle id="stock-movement-modal-title">재고 이동 등록</ModalTitle>
            <ModalDescription>
              이미 생성된 원자재 LOT 또는 완제품 재고의 추가 입고·출고·조정만
              처리합니다. 신규 LOT는 원자재 LOT 입고 기능을 이용해주세요.
            </ModalDescription>
          </div>
        </ModalHeader>

        <ModalBody>
          <ApiErrors queries={[rawQuery, productQuery]} />
          {message && <ModalFeedback role="alert">{message}</ModalFeedback>}

          <FormGrid>
            <Field>
              <FieldLabel htmlFor="movement-item-type">품목 유형</FieldLabel>
              <Select
                id="movement-item-type"
                value={itemType}
                onChange={(event) => setItemType(event.target.value)}
              >
                <option value="RAW_MATERIAL">원자재</option>
                <option value="FINISHED_PRODUCT">완제품</option>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="movement-type">이동 유형</FieldLabel>
              <Select id="movement-type" name="movementType">
                <option value="INBOUND">입고</option>
                <option value="OUTBOUND">출고</option>
                <option value="ADJUSTMENT">조정</option>
              </Select>
            </Field>

            <Field $wide>
              <FieldLabel htmlFor="movement-target">대상 LOT/재고</FieldLabel>
              <Select id="movement-target" name="targetId" required>
                <option value="">대상 선택</option>
                {targetOptions.map((item) => {
                  const id = itemType === "RAW_MATERIAL"
                    ? item.materialLotId
                    : item.inventoryId;
                  const lotNo = itemType === "RAW_MATERIAL"
                    ? item.materialLotNo
                    : item.lotNo;
                  const itemName = itemType === "RAW_MATERIAL"
                    ? item.materialName
                    : item.productName;

                  return (
                    <option key={id} value={id}>
                      {lotNo} · {itemName}
                    </option>
                  );
                })}
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="movement-quantity">수량</FieldLabel>
              <TextInput
                id="movement-quantity"
                name="quantity"
                type="number"
                min="0.001"
                step="0.001"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="movement-occurred-at">처리 시각</FieldLabel>
              <TextInput
                id="movement-occurred-at"
                name="occurredAt"
                type="datetime-local"
              />
            </Field>

            <Field $wide>
              <FieldLabel htmlFor="movement-remarks">비고</FieldLabel>
              <TextArea id="movement-remarks" name="remarks" rows="3" />
            </Field>
          </FormGrid>
        </ModalBody>

        <ModalActions>
          <SecondaryButton type="button" onClick={onClose}>취소</SecondaryButton>
          <PrimaryButton disabled={mutation.isPending}>
            {mutation.isPending ? "저장 중..." : "저장"}
          </PrimaryButton>
        </ModalActions>
      </ModalPanel>
    </ModalOverlay>
  );
}
