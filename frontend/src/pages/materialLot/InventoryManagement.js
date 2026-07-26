import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  toneForStatus,
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
  InventoryModalTitle,
  InventoryTableShell,
  InventoryTableViewport,
} from "./InventoryManagementCss";

const PAGE_SIZE = 10;

const localDateValue = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

const emptyRawLotForm = () => ({
  materialId: "",
  materialLotNo: "",
  supplierName: "",
  supplierLotNo: "",
  manufactureDate: "",
  expiryDate: "",
  receivedQty: "",
  receivedDate: localDateValue(),
});

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
  const [productInventoryForm, setProductInventoryForm] = useState({
    productionLotId: "",
    safetyStockQty: "0",
    expiryDate: "",
  });
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
    queryKey: queryKeys.materials({ status: "ACTIVE", page: 0, size: 100 }),
    queryFn: () => referenceApi.rawMaterials({ status: "ACTIVE", page: 0, size: 100 }),
    enabled: dialog === "raw-lot",
  });
  const completedLotsQuery = useQuery({
    queryKey: queryKeys.productionLots({ statuses: "COMPLETED", page: 0, size: 100 }),
    queryFn: () => materialApi.productionLots({ statuses: "COMPLETED", page: 0, size: 100 }),
    enabled: dialog === "product-inventory",
  });
  const registeredProductInventoriesQuery = useQuery({
    queryKey: queryKeys.productInventories({ page: 0, size: 100, purpose: "candidate-filter" }),
    queryFn: () => materialApi.productInventories({ page: 0, size: 100 }),
    enabled: dialog === "product-inventory",
  });

  const invalidateInventory = () => queryClient.invalidateQueries({ queryKey: ["materials"] });
  const receiveRawLotMutation = useMutation({
    mutationFn: materialApi.receiveRawMaterialLot,
    onSuccess: invalidateInventory,
  });
  const createProductInventoryMutation = useMutation({
    mutationFn: materialApi.createProductInventory,
    onSuccess: invalidateInventory,
  });

  const eligibleProductionLots = useMemo(() => {
    const registeredLotIds = new Set(
      pageContent(registeredProductInventoriesQuery.data)
        .map((inventory) => Number(inventory.productionLotId)),
    );
    return pageContent(completedLotsQuery.data).filter((lot) => (
      lot.status === "COMPLETED"
      && Number(lot.goodQty) > 0
      && !registeredLotIds.has(Number(lot.productionLotId))
    ));
  }, [completedLotsQuery.data, registeredProductInventoriesQuery.data]);

  const openRawLotDialog = () => {
    setRawLotForm(emptyRawLotForm());
    setMessage("");
    setDialog("raw-lot");
  };
  const openProductInventoryDialog = () => {
    setProductInventoryForm({
      productionLotId: "",
      safetyStockQty: "0",
      expiryDate: "",
    });
    setMessage("");
    setDialog("product-inventory");
  };

  const receiveRawLot = async (event) => {
    event.preventDefault();
    setMessage("");
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

  const createProductInventory = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await createProductInventoryMutation.mutateAsync({
        productionLotId: Number(productInventoryForm.productionLotId),
        safetyStockQty: Number(productInventoryForm.safetyStockQty),
        expiryDate: productInventoryForm.expiryDate || null,
        handledById: user.userId,
      });
      setDialog(null);
      setMessage("완제품 입고를 등록했습니다.");
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  const rawRows = pageContent(rawQuery.data);
  const productRows = pageContent(productQuery.data);
  const movementRows = pageContent(movementQuery.data);
  const activeMaterials = pageContent(activeMaterialsQuery.data);
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
          <Button type="button" onClick={openProductInventoryDialog}>완제품 입고</Button>
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
                      <td><Badge $tone={toneForStatus(lot.status)}>{lot.statusLabel}</Badge></td>
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
                      <td><Badge $tone={toneForStatus(item.status)}>{item.statusLabel}</Badge></td>
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
              {activeMaterialsQuery.isSuccess && activeMaterials.length === 0 && (
                <EmptyState>사용 중인 원자재가 없습니다. 기준정보에서 먼저 등록해주세요.</EmptyState>
              )}
              <InventoryModalFields>
                <InventoryModalField>
                  원자재
                  <select
                    value={rawLotForm.materialId}
                    onChange={(event) => setRawLotForm({ ...rawLotForm, materialId: event.target.value })}
                    required
                  >
                    <option value="">원자재 선택</option>
                    {activeMaterials.map((material) => (
                      <option key={material.materialId} value={material.materialId}>
                        {material.materialCode} · {material.materialName} ({material.unit})
                      </option>
                    ))}
                  </select>
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
              <Button disabled={receiveRawLotMutation.isPending || activeMaterials.length === 0}>
                {receiveRawLotMutation.isPending ? "저장 중..." : "입고 등록"}
              </Button>
            </InventoryModalActions>
          </InventoryModalForm>
        </Modal>
      )}

      {dialog === "product-inventory" && (
        <Modal
          labelledBy="product-inventory-modal-title"
          onClose={() => setDialog(null)}
        >
          <InventoryModalHeader>
            <InventoryModalTitle id="product-inventory-modal-title">
              완제품 최초 입고
            </InventoryModalTitle>
            <InventoryModalDescription>
              완료된 생산 LOT의 정상 생산수량을 완제품 현재고로 등록합니다.
            </InventoryModalDescription>
          </InventoryModalHeader>
          <InventoryModalForm onSubmit={createProductInventory}>
            <InventoryModalBody>
              <ApiErrors queries={[completedLotsQuery, registeredProductInventoriesQuery]} />
              {completedLotsQuery.isSuccess
                && registeredProductInventoriesQuery.isSuccess
                && eligibleProductionLots.length === 0
                && <EmptyState>입고할 수 있는 완료 생산 LOT가 없습니다.</EmptyState>}
              <InventoryModalFields>
                <InventoryModalField $wide>
                  완료 생산 LOT
                  <select
                    value={productInventoryForm.productionLotId}
                    onChange={(event) => setProductInventoryForm({
                      ...productInventoryForm,
                      productionLotId: event.target.value,
                    })}
                    required
                  >
                    <option value="">생산 LOT 선택</option>
                    {eligibleProductionLots.map((lot) => (
                      <option key={lot.productionLotId} value={lot.productionLotId}>
                        {lot.lotNo} · {lot.productName} · 정상 {lot.goodQty}
                      </option>
                    ))}
                  </select>
                </InventoryModalField>
                <InventoryModalField>
                  안전재고
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={productInventoryForm.safetyStockQty}
                    onChange={(event) => setProductInventoryForm({
                      ...productInventoryForm,
                      safetyStockQty: event.target.value,
                    })}
                    required
                  />
                </InventoryModalField>
                <InventoryModalField>
                  유통기한
                  <input
                    type="date"
                    value={productInventoryForm.expiryDate}
                    onChange={(event) => setProductInventoryForm({
                      ...productInventoryForm,
                      expiryDate: event.target.value,
                    })}
                  />
                </InventoryModalField>
              </InventoryModalFields>
              {message && <p role="alert">{message}</p>}
            </InventoryModalBody>
            <InventoryModalActions>
              <Button type="button" $secondary onClick={() => setDialog(null)}>취소</Button>
              <Button
                disabled={
                  createProductInventoryMutation.isPending
                  || eligibleProductionLots.length === 0
                }
              >
                {createProductInventoryMutation.isPending ? "저장 중..." : "완제품 입고"}
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
