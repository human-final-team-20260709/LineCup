import { useEffect, useRef, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { materialApi, referenceApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { toKst } from "../../api/time";
import { useAuth } from "../../context/AuthContext";
import { ApiErrors, EmptyState, QueryStatus } from "../../components/ApiState";
import CommonPagination from "../../components/CommonPagination";
import {
  Badge,
  Button,
  Input,
  ModalBackdrop,
  Select,
  Table,
  Toolbar,
  formatNumber,
  pageContent,
} from "../../components/OperationalUi";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import StockMovementRegistration from "./StockMovementRegistration";
import {
  InventoryModalActions,
  InventoryModalBody,
  InventoryModalDescription,
  InventoryModalField,
  InventoryModalFields,
  InventoryModalForm,
  InventoryModalHeader,
  InventoryModalPanel,
  InventorySearchEmpty,
  InventorySearchMore,
  InventorySearchOption,
  InventorySearchOptions,
  InventorySearchSelectBox,
  InventorySearchSelectDropdown,
  InventorySearchSelectTrigger,
  InventoryModalTitle,
  InventoryTableShell,
  InventoryTableViewport,
} from "./InventoryManagementCss";

const PAGE_SIZE = 10;
const OPTION_PAGE_SIZE = 20;

const inventoryToneForStatus = (status) => ({
  NORMAL: "success",
  LOW: "warn",
  EXPIRED: "danger",
  OUT_OF_STOCK: "neutral",
}[status] || "neutral");

const localDateValue = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

const emptyRawLotForm = () => ({
  materialId: "",
  materialCode: "",
  materialName: "",
  unit: "",
  materialLotNo: "",
  supplierName: "",
  supplierLotNo: "",
  manufactureDate: "",
  expiryDate: "",
  receivedQty: "",
  receivedDate: localDateValue(),
});

function RawMaterialSearchSelect({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const [keywordDraft, setKeywordDraft] = useState("");
  const selectRef = useRef(null);
  const keyword = useDebouncedValue(keywordDraft.trim());
  const params = {
    keyword: keyword || undefined,
    status: "ACTIVE",
    size: OPTION_PAGE_SIZE,
  };
  const query = useInfiniteQuery({
    queryKey: [...queryKeys.materials(params), "raw-lot-receipt-options"],
    queryFn: ({ pageParam }) => referenceApi.rawMaterials({
      ...params,
      page: pageParam,
    }),
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

  return (
    <InventorySearchSelectBox
      ref={selectRef}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
        }
      }}
    >
      <InventorySearchSelectTrigger
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        $placeholder={!selected.materialId}
        onClick={() => {
          setKeywordDraft("");
          setOpen((current) => !current);
        }}
      >
        {selected.materialId
          ? `${selected.materialCode} · ${selected.materialName}`
          : "원자재 선택"}
      </InventorySearchSelectTrigger>
      {open && (
        <InventorySearchSelectDropdown>
          <input
            type="search"
            value={keywordDraft}
            placeholder="원자재 코드·원자재명 검색"
            aria-label="입고 원자재 검색"
            autoFocus
            onChange={(event) => setKeywordDraft(event.target.value)}
          />
          <InventorySearchOptions role="listbox" aria-label="입고 원자재 검색 결과">
            {query.isPending && (
              <InventorySearchEmpty>원자재를 불러오는 중입니다.</InventorySearchEmpty>
            )}
            {query.isError && (
              <InventorySearchEmpty>원자재를 불러오지 못했습니다.</InventorySearchEmpty>
            )}
            {!query.isPending && !query.isError && options.length === 0 && (
              <InventorySearchEmpty>검색된 사용 중 원자재가 없습니다.</InventorySearchEmpty>
            )}
            {options.map((material) => {
              const isSelected = String(material.materialId)
                === String(selected.materialId);
              return (
                <InventorySearchOption
                  key={material.materialId}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  $selected={isSelected}
                  onClick={() => {
                    onSelect(material);
                    setOpen(false);
                  }}
                >
                  <strong>{material.materialName}</strong>
                  <span>{material.materialCode} · {material.unit}</span>
                </InventorySearchOption>
              );
            })}
            {query.hasNextPage && (
              <InventorySearchMore
                type="button"
                disabled={query.isFetchingNextPage}
                onClick={() => query.fetchNextPage()}
              >
                {query.isFetchingNextPage ? "불러오는 중..." : "원자재 더 보기"}
              </InventorySearchMore>
            )}
          </InventorySearchOptions>
        </InventorySearchSelectDropdown>
      )}
    </InventorySearchSelectBox>
  );
}

function Modal({ children, labelledBy, onClose }) {
  return (
    <ModalBackdrop
      role="presentation"
      onMouseDown={onClose}
    >
      <InventoryModalPanel
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </InventoryModalPanel>
    </ModalBackdrop>
  );
}

export default function InventoryManagement({ canManage = false }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [type, setType] = useState("ALL");
  const [keywordDraft, setKeywordDraft] = useState("");
  const [rawPage, setRawPage] = useState(0);
  const [productPage, setProductPage] = useState(0);
  const [movementPage, setMovementPage] = useState(0);
  const [dialog, setDialog] = useState(null);
  const [rawLotForm, setRawLotForm] = useState(emptyRawLotForm);
  const [message, setMessage] = useState("");
  const keyword = useDebouncedValue(keywordDraft.trim());
  const rawParams = {
    keyword: keyword || undefined,
    page: rawPage,
    size: PAGE_SIZE,
  };
  const productParams = {
    keyword: keyword || undefined,
    page: productPage,
    size: PAGE_SIZE,
  };
  const movementParams = {
    keyword: keyword || undefined,
    page: movementPage,
    size: PAGE_SIZE,
  };

  const rawQuery = useQuery({
    queryKey: queryKeys.rawMaterialLots(rawParams),
    queryFn: () => materialApi.rawMaterialLots(rawParams),
    refetchInterval: POLLING.INVENTORY,
    placeholderData: (previous) => previous,
  });
  const productQuery = useQuery({
    queryKey: queryKeys.productInventories(productParams),
    queryFn: () => materialApi.productInventories(productParams),
    refetchInterval: POLLING.INVENTORY,
    placeholderData: (previous) => previous,
  });
  const movementQuery = useQuery({
    queryKey: queryKeys.inventoryMovements(movementParams),
    queryFn: () => materialApi.inventoryMovements(movementParams),
    refetchInterval: POLLING.INVENTORY,
    placeholderData: (previous) => previous,
  });
  const activeMaterialsQuery = useQuery({
    queryKey: queryKeys.materials({ status: "ACTIVE", page: 0, size: 1 }),
    queryFn: () => referenceApi.rawMaterials({ status: "ACTIVE", page: 0, size: 1 }),
    enabled: dialog === "raw-lot",
  });

  const invalidateInventory = () => queryClient.invalidateQueries({ queryKey: ["materials"] });
  const receiveRawLotMutation = useMutation({
    mutationFn: materialApi.receiveRawMaterialLot,
    onSuccess: invalidateInventory,
  });

  const openRawLotDialog = () => {
    setRawLotForm(emptyRawLotForm());
    setMessage("");
    setDialog("raw-lot");
  };

  const receiveRawLot = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!rawLotForm.materialId) {
      setMessage("입고할 원자재를 선택해 주세요.");
      return;
    }
    try {
      await receiveRawLotMutation.mutateAsync({
        materialLotNo: rawLotForm.materialLotNo.trim(),
        materialId: Number(rawLotForm.materialId),
        supplierName: rawLotForm.supplierName.trim(),
        supplierLotNo: rawLotForm.supplierLotNo.trim(),
        manufactureDate: rawLotForm.manufactureDate,
        expiryDate: rawLotForm.expiryDate,
        receivedQty: Number(rawLotForm.receivedQty),
        receivedDate: rawLotForm.receivedDate,
        handledById: user.userId,
      });
      setDialog(null);
      setMessage("원자재 LOT 입고를 등록했습니다.");
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  const rawRows = pageContent(rawQuery.data);
  const productRows = pageContent(productQuery.data);
  const movementRows = pageContent(movementQuery.data);
  const hasActiveMaterials = (activeMaterialsQuery.data?.totalElements ?? 0) > 0;
  const rawTotalItems = rawQuery.data?.totalElements ?? rawRows.length;
  const productTotalItems = productQuery.data?.totalElements ?? productRows.length;
  const movementTotalItems = movementQuery.data?.totalElements ?? movementRows.length;

  const changeType = (event) => {
    setType(event.target.value);
    setRawPage(0);
    setProductPage(0);
    setMovementPage(0);
  };

  const changeKeyword = (event) => {
    setKeywordDraft(event.target.value);
    setRawPage(0);
    setProductPage(0);
    setMovementPage(0);
  };

  return (
    <>
      {canManage && (
        <Toolbar>
          <Button type="button" onClick={openRawLotDialog}>원자재 LOT 입고</Button>
          <Button
            type="button"
            $secondary
            onClick={() => {
              setMessage("");
              setDialog("movement");
            }}
          >
            재고 이동 등록
          </Button>
        </Toolbar>
      )}
      {message && !dialog && <p role="status">{message}</p>}
      <ApiErrors queries={[rawQuery, productQuery, movementQuery]} />

      <Toolbar>
        <Select value={type} onChange={changeType}>
          <option value="ALL">전체</option>
          <option value="RAW_MATERIAL">원자재</option>
          <option value="FINISHED_PRODUCT">완제품</option>
        </Select>
        <Input
          value={keywordDraft}
          onChange={changeKeyword}
          placeholder="품목·LOT 검색"
        />
      </Toolbar>

      {(type === "ALL" || type === "RAW_MATERIAL") && (
        <>
          <h2>원자재 LOT 현재고</h2>
          <QueryStatus query={rawQuery} empty={rawRows.length === 0} />
          <InventoryTableShell>
            <InventoryTableViewport>
              <Table>
                <thead>
                  <tr>
                    <th>LOT</th>
                    <th>원자재</th>
                    <th>현재/안전 재고</th>
                    <th>단위</th>
                    <th>유효기한</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {rawRows.map((lot) => (
                    <tr key={lot.materialLotId}>
                      <td>{lot.materialLotNo}</td>
                      <td>{lot.materialCode} {lot.materialName}</td>
                      <td>{lot.currentQty} / {lot.safetyStockQty}</td>
                      <td>{lot.unit}</td>
                      <td>{lot.expiryDate}</td>
                      <td><Badge $tone={inventoryToneForStatus(lot.status)}>{lot.statusLabel}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </InventoryTableViewport>
            {rawTotalItems > 0 && (
              <CommonPagination
                ariaLabel="원자재 LOT 현재고 페이지 이동"
                currentPage={(rawQuery.data?.number ?? rawPage) + 1}
                pageSize={rawQuery.data?.size ?? PAGE_SIZE}
                totalItems={rawTotalItems}
                totalPages={rawQuery.data?.totalPages ?? 0}
                onPageChange={(page) => setRawPage(page - 1)}
              />
            )}
          </InventoryTableShell>
        </>
      )}

      {(type === "ALL" || type === "FINISHED_PRODUCT") && (
        <>
          <h2>완제품 현재고</h2>
          <QueryStatus query={productQuery} empty={productRows.length === 0} />
          <InventoryTableShell>
            <InventoryTableViewport>
              <Table>
                <thead>
                  <tr>
                    <th>LOT</th>
                    <th>제품</th>
                    <th>현재/안전 재고</th>
                    <th>단위</th>
                    <th>유효기한</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {productRows.map((item) => (
                    <tr key={item.inventoryId}>
                      <td>{item.lotNo}</td>
                      <td>{item.productCode} {item.productName}</td>
                      <td>{formatNumber(item.currentQty)} / {formatNumber(item.safetyStockQty)}</td>
                      <td>{item.unit}</td>
                      <td>{item.expiryDate || "-"}</td>
                      <td><Badge $tone={inventoryToneForStatus(item.status)}>{item.statusLabel}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </InventoryTableViewport>
            {productTotalItems > 0 && (
              <CommonPagination
                ariaLabel="완제품 현재고 페이지 이동"
                currentPage={(productQuery.data?.number ?? productPage) + 1}
                pageSize={productQuery.data?.size ?? PAGE_SIZE}
                totalItems={productTotalItems}
                totalPages={productQuery.data?.totalPages ?? 0}
                onPageChange={(page) => setProductPage(page - 1)}
              />
            )}
          </InventoryTableShell>
        </>
      )}

      <h2>최근 이동 이력</h2>
      <QueryStatus query={movementQuery} empty={movementRows.length === 0} />
      <InventoryTableShell>
        <InventoryTableViewport>
          <Table>
            <thead>
              <tr>
                <th>이동 번호</th>
                <th>품목</th>
                <th>유형</th>
                <th>수량</th>
                <th>처리자</th>
                <th>시각</th>
              </tr>
            </thead>
            <tbody>
              {movementRows.map((item) => (
                <tr key={item.movementId}>
                  <td>{item.movementNo}</td>
                  <td>{item.itemName} · {item.lotNo}</td>
                  <td>{item.movementTypeLabel}</td>
                  <td>{item.quantity}</td>
                  <td>{item.handledByName}</td>
                  <td>{toKst(item.occurredAt)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </InventoryTableViewport>
        {movementTotalItems > 0 && (
          <CommonPagination
            ariaLabel="최근 이동 이력 페이지 이동"
            currentPage={(movementQuery.data?.number ?? movementPage) + 1}
            pageSize={movementQuery.data?.size ?? PAGE_SIZE}
            totalItems={movementTotalItems}
            totalPages={movementQuery.data?.totalPages ?? 0}
            onPageChange={(page) => setMovementPage(page - 1)}
          />
        )}
      </InventoryTableShell>

      {dialog === "raw-lot" && (
        <Modal
          labelledBy="raw-lot-modal-title"
          onClose={() => setDialog(null)}
        >
          <InventoryModalHeader>
            <InventoryModalTitle id="raw-lot-modal-title">
              원자재 LOT 최초 입고
            </InventoryModalTitle>
            <InventoryModalDescription>
              새 원자재 LOT와 최초 입고 이동을 동시에 생성합니다.
            </InventoryModalDescription>
          </InventoryModalHeader>
          <InventoryModalForm onSubmit={receiveRawLot}>
            <InventoryModalBody>
              <ApiErrors queries={[activeMaterialsQuery]} />
              {activeMaterialsQuery.isSuccess && !hasActiveMaterials && (
                <EmptyState>사용 중인 원자재가 없습니다. 기준정보에서 먼저 등록해주세요.</EmptyState>
              )}
              <InventoryModalFields>
                <InventoryModalField as="div">
                  <span>원자재</span>
                  <RawMaterialSearchSelect
                    selected={rawLotForm}
                    onSelect={(material) => setRawLotForm({
                      ...rawLotForm,
                      materialId: String(material.materialId),
                      materialCode: material.materialCode,
                      materialName: material.materialName,
                      unit: material.unit,
                    })}
                  />
                </InventoryModalField>
                <InventoryModalField>
                  내부 LOT 번호
                  <input
                    maxLength="50"
                    value={rawLotForm.materialLotNo}
                    onChange={(event) => setRawLotForm({ ...rawLotForm, materialLotNo: event.target.value })}
                    required
                  />
                </InventoryModalField>
                <InventoryModalField>
                  공급사
                  <input
                    maxLength="100"
                    value={rawLotForm.supplierName}
                    onChange={(event) => setRawLotForm({ ...rawLotForm, supplierName: event.target.value })}
                    required
                  />
                </InventoryModalField>
                <InventoryModalField>
                  공급사 LOT 번호
                  <input
                    maxLength="50"
                    value={rawLotForm.supplierLotNo}
                    onChange={(event) => setRawLotForm({ ...rawLotForm, supplierLotNo: event.target.value })}
                    required
                  />
                </InventoryModalField>
                <InventoryModalField>
                  제조일
                  <input
                    type="date"
                    value={rawLotForm.manufactureDate}
                    max={rawLotForm.expiryDate || undefined}
                    onChange={(event) => setRawLotForm({ ...rawLotForm, manufactureDate: event.target.value })}
                    required
                  />
                </InventoryModalField>
                <InventoryModalField>
                  유통기한
                  <input
                    type="date"
                    value={rawLotForm.expiryDate}
                    min={rawLotForm.manufactureDate || undefined}
                    onChange={(event) => setRawLotForm({ ...rawLotForm, expiryDate: event.target.value })}
                    required
                  />
                </InventoryModalField>
                <InventoryModalField>
                  입고일
                  <input
                    type="date"
                    value={rawLotForm.receivedDate}
                    onChange={(event) => setRawLotForm({ ...rawLotForm, receivedDate: event.target.value })}
                    required
                  />
                </InventoryModalField>
                <InventoryModalField>
                  입고수량
                  <input
                    type="number"
                    min="0.001"
                    step="0.001"
                    value={rawLotForm.receivedQty}
                    onChange={(event) => setRawLotForm({ ...rawLotForm, receivedQty: event.target.value })}
                    required
                  />
                </InventoryModalField>
              </InventoryModalFields>
              {message && <p role="alert">{message}</p>}
            </InventoryModalBody>
            <InventoryModalActions>
              <Button type="button" $secondary onClick={() => setDialog(null)}>취소</Button>
              <Button
                disabled={
                  receiveRawLotMutation.isPending
                  || !hasActiveMaterials
                  || !rawLotForm.materialId
                }
              >
                {receiveRawLotMutation.isPending ? "저장 중..." : "입고 등록"}
              </Button>
            </InventoryModalActions>
          </InventoryModalForm>
        </Modal>
      )}

      <StockMovementRegistration
        isOpen={dialog === "movement"}
        onClose={() => setDialog(null)}
      />
    </>
  );
}
