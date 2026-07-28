import { useEffect, useRef, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { materialApi } from "../../api/services";
import { queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { toUtcInstant } from "../../api/time";
import { useAuth } from "../../context/AuthContext";
import { ApiErrors } from "../../components/ApiState";
import { pageContent } from "../../components/OperationalUi";
import useDebouncedValue from "../../hooks/useDebouncedValue";
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
  TargetSearchEmpty,
  TargetSearchMore,
  TargetSearchOption,
  TargetSearchOptions,
  TargetSearchSelectBox,
  TargetSearchSelectDropdown,
  TargetSearchSelectTrigger,
  TextArea,
  TextInput,
} from "./StockMovementRegistrationCss";

const OPTION_PAGE_SIZE = 20;

function MovementTargetSearchSelect({ itemType, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const [keywordDraft, setKeywordDraft] = useState("");
  const selectRef = useRef(null);
  const keyword = useDebouncedValue(keywordDraft.trim());
  const params = {
    keyword: keyword || undefined,
    size: OPTION_PAGE_SIZE,
  };
  const rawMaterial = itemType === "RAW_MATERIAL";
  const query = useInfiniteQuery({
    queryKey: [
      ...(rawMaterial
        ? queryKeys.rawMaterialLots(params)
        : queryKeys.productInventories(params)),
      "movement-target-options",
    ],
    queryFn: ({ pageParam }) => {
      const requestParams = { ...params, page: pageParam };
      return rawMaterial
        ? materialApi.rawMaterialLots(requestParams)
        : materialApi.productInventories(requestParams);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (
      lastPage.last ? undefined : lastPage.number + 1
    ),
    enabled: open,
  });
  const options = query.data?.pages.flatMap(pageContent) || [];

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const closeOnOutsideClick = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick, true);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick, true);
  }, [open]);

  const optionInfo = (item) => ({
    id: rawMaterial ? item.materialLotId : item.inventoryId,
    lotNo: rawMaterial ? item.materialLotNo : item.lotNo,
    itemCode: rawMaterial ? item.materialCode : item.productCode,
    itemName: rawMaterial ? item.materialName : item.productName,
    currentQty: item.currentQty,
    unit: item.unit,
  });

  return (
    <TargetSearchSelectBox
      ref={selectRef}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
        }
      }}
    >
      <TargetSearchSelectTrigger
        id="movement-target"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        $placeholder={!selected}
        onClick={() => {
          setKeywordDraft("");
          setOpen((current) => !current);
        }}
      >
        {selected ? `${selected.lotNo} · ${selected.itemName}` : "대상 선택"}
      </TargetSearchSelectTrigger>
      {open && (
        <TargetSearchSelectDropdown>
          <input
            type="search"
            value={keywordDraft}
            placeholder={
              rawMaterial
                ? "원자재 LOT·원자재 검색"
                : "완제품 LOT·제품 검색"
            }
            aria-label="재고이동 대상 검색"
            autoFocus
            onChange={(event) => setKeywordDraft(event.target.value)}
          />
          <ApiErrors queries={[query]} />
          <TargetSearchOptions role="listbox" aria-label="재고이동 대상 검색 결과">
            {query.isPending && (
              <TargetSearchEmpty>대상을 불러오는 중입니다.</TargetSearchEmpty>
            )}
            {!query.isPending && !query.isError && options.length === 0 && (
              <TargetSearchEmpty>검색된 대상이 없습니다.</TargetSearchEmpty>
            )}
            {options.map((item) => {
              const info = optionInfo(item);
              const isSelected = String(info.id) === String(selected?.id);
              return (
                <TargetSearchOption
                  key={info.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  $selected={isSelected}
                  onClick={() => {
                    onSelect(info);
                    setOpen(false);
                  }}
                >
                  <strong>{info.lotNo} · {info.itemName}</strong>
                  <span>{info.itemCode}</span>
                  <small>현재 {info.currentQty}{info.unit}</small>
                </TargetSearchOption>
              );
            })}
            {query.hasNextPage && (
              <TargetSearchMore
                type="button"
                disabled={query.isFetchingNextPage}
                onClick={() => query.fetchNextPage()}
              >
                {query.isFetchingNextPage ? "불러오는 중..." : "대상 더 보기"}
              </TargetSearchMore>
            )}
          </TargetSearchOptions>
        </TargetSearchSelectDropdown>
      )}
    </TargetSearchSelectBox>
  );
}

export default function StockMovementRegistration({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [itemType, setItemType] = useState("RAW_MATERIAL");
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [message, setMessage] = useState("");
  const mutation = useMutation({
    mutationFn: materialApi.createMovement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] }),
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedTarget(null);
      setMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setMessage("");

    if (!selectedTarget) {
      setMessage("재고이동 대상을 선택해 주세요.");
      return;
    }

    try {
      await mutation.mutateAsync({
        itemType,
        movementType: data.get("movementType"),
        rawMaterialLotId: itemType === "RAW_MATERIAL"
          ? Number(selectedTarget.id)
          : null,
        productInventoryId: itemType === "FINISHED_PRODUCT"
          ? Number(selectedTarget.id)
          : null,
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
          {message && <ModalFeedback role="alert">{message}</ModalFeedback>}

          <FormGrid>
            <Field>
              <FieldLabel htmlFor="movement-item-type">품목 유형</FieldLabel>
              <Select
                id="movement-item-type"
                value={itemType}
                onChange={(event) => {
                  setItemType(event.target.value);
                  setSelectedTarget(null);
                }}
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
              <MovementTargetSearchSelect
                key={itemType}
                itemType={itemType}
                selected={selectedTarget}
                onSelect={setSelectedTarget}
              />
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
          <PrimaryButton disabled={mutation.isPending || !selectedTarget}>
            {mutation.isPending ? "저장 중..." : "저장"}
          </PrimaryButton>
        </ModalActions>
      </ModalPanel>
    </ModalOverlay>
  );
}
