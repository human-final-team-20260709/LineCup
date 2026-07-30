import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { materialApi, referenceApi } from "../../api/services";
import { queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import CommonPagination from "../../components/CommonPagination";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import {
  Badge,
  Button,
  Notice,
  Select,
  pageContent,
  toneForStatus,
} from "../../components/OperationalUi";
import {
  BomActionBar,
  BomActionCopy,
  BomDetailSummary,
  BomDetailSummaryItem,
  BomDetailTable,
  BomDetailTableWrap,
  BomField,
  BomForm,
  BomInfoGrid,
  BomListCount,
  BomListHeader,
  BomListSection,
  BomSearchArea,
  BomSearchInput,
  BomOverviewTable,
  BomPageContent,
  BomTableShell,
  BomTableViewport,
  CellPrimary,
  CellSecondary,
  MaterialField,
  MaterialFields,
  MaterialIndex,
  MaterialPreviewButton,
  MaterialRow,
  MaterialRowHeader,
  MaterialRows,
  ModalActions,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalErrorMessage,
  ModalHeader,
  ModalPanel,
  ModalSection,
  ModalSectionDescription,
  ModalSectionHeader,
  ModalSectionTitle,
  ModalTitle,
  RowActions,
  RowDeleteButton,
  SearchOption,
  SearchOptionEmpty,
  SearchOptionList,
  SearchOptionMore,
  SearchSelectBox,
  SearchSelectDropdown,
  SearchSelectTrigger,
  StatusMessage,
} from "./BomManagementCss";

const PAGE_SIZE = 10;
const OPTION_PAGE_SIZE = 20;
const toneForBomStatus = (status) => (
  status === "INACTIVE" ? "danger" : toneForStatus(status)
);
const emptyItem = {
  materialId: "",
  processId: "",
  spec: "",
  requiredQty: "",
  lossRate: "0",
  note: "",
};
const emptyForm = {
  bomId: null,
  bomCode: "",
  version: "1.0",
  productId: "",
  status: "ACTIVE",
  note: "",
  items: [{ ...emptyItem }],
};

function MaterialSearchSelect({ item, onSelect }) {
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
    queryKey: [...queryKeys.materials(params), "bom-material-options"],
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
    <SearchSelectBox
      ref={selectRef}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
        }
      }}
    >
      <SearchSelectTrigger
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        $placeholder={!item.materialId}
        onClick={() => {
          setKeywordDraft("");
          setOpen((current) => !current);
        }}
      >
        {item.materialId
          ? `${item.materialCode} · ${item.materialName}`
          : "원자재 선택"}
      </SearchSelectTrigger>
      {open && (
        <SearchSelectDropdown>
          <input
            type="search"
            value={keywordDraft}
            placeholder="원자재 코드·원자재명 검색"
            aria-label="BOM 원자재 검색"
            autoFocus
            onChange={(event) => setKeywordDraft(event.target.value)}
          />
          <SearchOptionList role="listbox" aria-label="BOM 원자재 검색 결과">
            {query.isPending && (
              <SearchOptionEmpty>원자재를 불러오는 중입니다.</SearchOptionEmpty>
            )}
            {query.isError && (
              <SearchOptionEmpty>원자재를 불러오지 못했습니다.</SearchOptionEmpty>
            )}
            {!query.isPending && !query.isError && options.length === 0 && (
              <SearchOptionEmpty>검색된 사용 중 원자재가 없습니다.</SearchOptionEmpty>
            )}
            {options.map((material) => {
              const selected = String(material.materialId)
                === String(item.materialId);
              return (
                <SearchOption
                  key={material.materialId}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  $selected={selected}
                  onClick={() => {
                    onSelect(material);
                    setOpen(false);
                  }}
                >
                  <strong>{material.materialName}</strong>
                  <span>{material.materialCode} · {material.unit}</span>
                </SearchOption>
              );
            })}
            {query.hasNextPage && (
              <SearchOptionMore
                type="button"
                disabled={query.isFetchingNextPage}
                onClick={() => query.fetchNextPage()}
              >
                {query.isFetchingNextPage ? "불러오는 중..." : "원자재 더 보기"}
              </SearchOptionMore>
            )}
          </SearchOptionList>
        </SearchSelectDropdown>
      )}
    </SearchSelectBox>
  );
}

export default function BomManagement({ canManage = false }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [bomPage, setBomPage] = useState(0);
  const [bomKeywordDraft, setBomKeywordDraft] = useState("");
  const [productKeywordDraft, setProductKeywordDraft] = useState("");
  const [productOptionsOpen, setProductOptionsOpen] = useState(false);
  const [form, setForm] = useState(null);
  const [materialDetailBom, setMaterialDetailBom] = useState(null);
  const [message, setMessage] = useState("");
  const productSelectRef = useRef(null);
  const bomKeyword = useDebouncedValue(bomKeywordDraft.trim());
  const productKeyword = useDebouncedValue(productKeywordDraft.trim());
  const bomParams = {
    keyword: bomKeyword || undefined,
    page: bomPage,
    size: PAGE_SIZE,
  };
  const productOptionParams = {
    keyword: productKeyword || undefined,
    status: "ACTIVE",
    size: OPTION_PAGE_SIZE,
  };

  useEffect(() => {
    if (!form && !materialDetailBom) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key !== "Escape") {
        return;
      }
      if (productOptionsOpen) {
        setProductOptionsOpen(false);
        return;
      }
      if (form) {
        setForm(null);
      } else {
        setMaterialDetailBom(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [form, materialDetailBom, productOptionsOpen]);

  useEffect(() => {
    if (!productOptionsOpen) {
      return undefined;
    }

    const closeOnOutsideClick = (event) => {
      if (
        productSelectRef.current
        && !productSelectRef.current.contains(event.target)
      ) {
        setProductOptionsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick, true);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick, true);
  }, [productOptionsOpen]);

  const bomsQuery = useQuery({
    queryKey: queryKeys.boms(bomParams),
    queryFn: () => materialApi.boms(bomParams),
    placeholderData: (previous) => previous,
  });
  const productAvailabilityQuery = useQuery({
    queryKey: queryKeys.products({ status: "ACTIVE", size: 1 }),
    queryFn: () => referenceApi.products({ status: "ACTIVE", size: 1 }),
  });
  const productOptionsQuery = useInfiniteQuery({
    queryKey: [...queryKeys.products(productOptionParams), "bom-product-options"],
    queryFn: ({ pageParam }) => referenceApi.products({
      ...productOptionParams,
      page: pageParam,
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (
      lastPage.last ? undefined : lastPage.number + 1
    ),
    enabled: Boolean(form && !form.bomId && productOptionsOpen),
  });
  const materialAvailabilityQuery = useQuery({
    queryKey: queryKeys.materials({ status: "ACTIVE", size: 1 }),
    queryFn: () => referenceApi.rawMaterials({ status: "ACTIVE", size: 1 }),
  });
  const processesQuery = useQuery({
    queryKey: queryKeys.processes(),
    queryFn: referenceApi.processes,
  });

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["materials"] }),
      queryClient.invalidateQueries({ queryKey: ["products"] }),
    ]);
  };
  const saveMutation = useMutation({
    mutationFn: ({ bomId, payload }) => bomId
      ? materialApi.updateBom(bomId, payload)
      : materialApi.createBom(payload),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({
    mutationFn: materialApi.removeBom,
    onSuccess: invalidate,
  });

  const products = productOptionsQuery.data?.pages.flatMap(pageContent) || [];
  const processes = Array.isArray(processesQuery.data) ? processesQuery.data : [];
  const hasActiveProducts = (productAvailabilityQuery.data?.totalElements ?? 0) > 0;
  const hasActiveMaterials = (materialAvailabilityQuery.data?.totalElements ?? 0) > 0;
  const boms = pageContent(bomsQuery.data);

  const updateItem = (index, key, value) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (
        itemIndex === index ? { ...item, [key]: value } : item
      )),
    }));
  };

  const edit = (bom) => {
    setMessage("");
    setMaterialDetailBom(null);
    setProductOptionsOpen(false);
    setForm({
      ...bom,
      items: bom.items.map((item) => ({
        ...item,
        materialId: String(item.materialId),
        processId: String(item.processId),
        requiredQty: String(item.requiredQty),
        lossRate: String(item.lossRate),
        note: item.note || "",
      })),
      productId: String(bom.productId),
      note: bom.note || "",
    });
  };

  const save = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!form.productId || form.items.some((item) => !item.materialId)) {
      setMessage("제품과 모든 원자재를 선택해 주세요.");
      return;
    }
    const payload = {
      bomCode: form.bomCode.trim(),
      version: form.version.trim(),
      productId: Number(form.productId),
      status: form.status,
      note: form.note.trim() || null,
      items: form.items.map((item) => ({
        materialId: Number(item.materialId),
        processId: Number(item.processId),
        spec: item.spec.trim(),
        requiredQty: Number(item.requiredQty),
        lossRate: Number(item.lossRate),
        note: item.note.trim() || null,
      })),
    };
    try {
      await saveMutation.mutateAsync({ bomId: form.bomId, payload });
      setForm(null);
      setBomPage(0);
      setMessage("BOM을 저장했습니다.");
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  const removeBom = async (bomId) => {
    if (!window.confirm("BOM을 삭제하시겠습니까?")) {
      return;
    }
    setMessage("");
    try {
      await removeMutation.mutateAsync(bomId);
      if (boms.length === 1 && bomPage > 0) {
        setBomPage((current) => current - 1);
      }
      setMessage("BOM을 삭제했습니다.");
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  const totalBoms = bomsQuery.data?.totalElements ?? boms.length;

  return (
    <BomPageContent>
      <BomActionBar>
        <BomActionCopy>
          <strong>BOM 구성표</strong>
          <span>제품별 버전과 투입 자재를 한눈에 확인합니다.</span>
        </BomActionCopy>
        {canManage && (
          <Button
            type="button"
            disabled={!hasActiveProducts || !hasActiveMaterials}
            onClick={() => {
              setMessage("");
              setProductKeywordDraft("");
              setProductOptionsOpen(false);
              setForm({
                ...emptyForm,
                items: [{ ...emptyItem }],
              });
            }}
          >
            BOM 등록
          </Button>
        )}
      </BomActionBar>

      {message && <StatusMessage role="status">{message}</StatusMessage>}
      <ApiErrors
        queries={[
          productAvailabilityQuery,
          productOptionsQuery,
          materialAvailabilityQuery,
          processesQuery,
        ]}
      />

      {(!hasActiveProducts || !hasActiveMaterials) && (
        <Notice>
          BOM 등록에 필요한 사용 중 제품 또는 원자재가 없습니다.{" "}
          <Button type="button" $secondary onClick={() => navigate("/materials/reference")}>
            기준정보에서 등록
          </Button>
        </Notice>
      )}

      {form && canManage && (
        <ModalBackdrop
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setForm(null);
            }
          }}
        >
          <ModalPanel
            role="dialog"
            aria-modal="true"
            aria-labelledby="bom-form-title"
          >
            <BomForm onSubmit={save}>
              <ModalHeader>
                <div>
                  <ModalTitle id="bom-form-title">
                    {form.bomId ? "BOM 수정" : "BOM 등록"}
                  </ModalTitle>
                  <ModalSectionDescription>
                    기본 정보와 완제품 1개 기준의 자재 소요량을 입력합니다.
                  </ModalSectionDescription>
                </div>
                <ModalCloseButton
                  type="button"
                  aria-label="BOM 등록 창 닫기"
                  onClick={() => setForm(null)}
                >
                  ×
                </ModalCloseButton>
              </ModalHeader>

              <ModalBody>
                {message && <ModalErrorMessage role="status">{message}</ModalErrorMessage>}

                <ModalSection>
                  <ModalSectionHeader>
                    <div>
                      <ModalSectionTitle>기본 정보</ModalSectionTitle>
                      <ModalSectionDescription>
                        BOM 식별 정보와 적용 제품, 상태를 설정합니다.
                      </ModalSectionDescription>
                    </div>
                    <Badge $tone={toneForBomStatus(form.status)}>
                      {form.status === "ACTIVE"
                        ? "사용 중"
                        : form.status === "REVIEW"
                          ? "검토"
                          : "사용 중지"}
                    </Badge>
                  </ModalSectionHeader>

                  <BomInfoGrid>
                    <BomField $span={3}>
                      BOM 코드
                      <input
                        maxLength="30"
                        value={form.bomCode}
                        disabled={Boolean(form.bomId)}
                        onChange={(event) => setForm({ ...form, bomCode: event.target.value })}
                        required
                      />
                    </BomField>
                    <BomField $span={2}>
                      버전
                      <input
                        maxLength="20"
                        value={form.version}
                        disabled={Boolean(form.bomId)}
                        onChange={(event) => setForm({ ...form, version: event.target.value })}
                        required
                      />
                    </BomField>
                    <BomField as="div" $span={3}>
                      <span>기존 제품</span>
                      {form.bomId ? (
                        <input
                          value={`${form.productCode} · ${form.productName}`}
                          disabled
                          readOnly
                        />
                      ) : (
                        <SearchSelectBox ref={productSelectRef}>
                          <SearchSelectTrigger
                            type="button"
                            aria-haspopup="listbox"
                            aria-expanded={productOptionsOpen}
                            $placeholder={!form.productId}
                            onClick={() => {
                              setProductKeywordDraft("");
                              setProductOptionsOpen((current) => !current);
                            }}
                          >
                            {form.productId
                              ? `${form.productCode} · ${form.productName}`
                              : "제품 선택"}
                          </SearchSelectTrigger>
                          {productOptionsOpen && (
                            <SearchSelectDropdown>
                              <input
                                type="search"
                                value={productKeywordDraft}
                                placeholder="제품 코드·제품명 검색"
                                aria-label="BOM 적용 제품 검색"
                                autoFocus
                                onChange={(event) => setProductKeywordDraft(event.target.value)}
                              />
                              <SearchOptionList
                                role="listbox"
                                aria-label="BOM 적용 제품 검색 결과"
                              >
                                {productOptionsQuery.isPending && (
                                  <SearchOptionEmpty>제품을 불러오는 중입니다.</SearchOptionEmpty>
                                )}
                                {!productOptionsQuery.isPending && products.length === 0 && (
                                  <SearchOptionEmpty>검색된 사용 중 제품이 없습니다.</SearchOptionEmpty>
                                )}
                                {products.map((product) => {
                                  const selected = String(product.productId)
                                    === String(form.productId);
                                  return (
                                    <SearchOption
                                      key={product.productId}
                                      type="button"
                                      role="option"
                                      aria-selected={selected}
                                      $selected={selected}
                                      onClick={() => {
                                        setForm({
                                          ...form,
                                          productId: String(product.productId),
                                          productCode: product.productCode,
                                          productName: product.productName,
                                        });
                                        setProductOptionsOpen(false);
                                      }}
                                    >
                                      <strong>{product.productName}</strong>
                                      <span>{product.productCode}</span>
                                    </SearchOption>
                                  );
                                })}
                                {productOptionsQuery.hasNextPage && (
                                  <SearchOptionMore
                                    type="button"
                                    disabled={productOptionsQuery.isFetchingNextPage}
                                    onClick={() => productOptionsQuery.fetchNextPage()}
                                  >
                                    {productOptionsQuery.isFetchingNextPage
                                      ? "불러오는 중..."
                                      : "제품 더 보기"}
                                  </SearchOptionMore>
                                )}
                              </SearchOptionList>
                            </SearchSelectDropdown>
                          )}
                        </SearchSelectBox>
                      )}
                    </BomField>
                    <BomField $span={2}>
                      상태
                      <Select
                        value={form.status}
                        onChange={(event) => setForm({ ...form, status: event.target.value })}
                      >
                        <option value="ACTIVE">사용 중</option>
                        <option value="REVIEW">검토</option>
                        <option value="INACTIVE">사용 중지</option>
                      </Select>
                    </BomField>
                    <BomField $span={2}>
                      BOM 메모
                      <input
                        value={form.note}
                        onChange={(event) => setForm({ ...form, note: event.target.value })}
                      />
                    </BomField>
                  </BomInfoGrid>
                </ModalSection>

                <ModalSection>
                  <ModalSectionHeader>
                    <div>
                      <ModalSectionTitle>자재 구성</ModalSectionTitle>
                      <ModalSectionDescription>
                        투입 공정, 규격, 소요량과 손실률을 자재별로 입력합니다.
                      </ModalSectionDescription>
                    </div>
                    <Button
                      type="button"
                      $secondary
                      onClick={() => setForm({
                        ...form,
                        items: [...form.items, { ...emptyItem }],
                      })}
                    >
                      자재 행 추가
                    </Button>
                  </ModalSectionHeader>

                  <MaterialRows $modal>
                    {form.items.map((item, index) => {
                      return (
                        <MaterialRow key={`${item.bomItemId || "new"}-${index}`}>
                          <MaterialRowHeader>
                            <MaterialIndex>자재 {index + 1}</MaterialIndex>
                            <RowDeleteButton
                              type="button"
                              disabled={form.items.length === 1}
                              onClick={() => setForm({
                                ...form,
                                items: form.items.filter((_, itemIndex) => itemIndex !== index),
                              })}
                            >
                              자재 행 삭제
                            </RowDeleteButton>
                          </MaterialRowHeader>

                          <MaterialFields>
                            <MaterialField as="div">
                              원자재
                              <MaterialSearchSelect
                                item={item}
                                onSelect={(material) => setForm((current) => ({
                                  ...current,
                                  items: current.items.map((currentItem, itemIndex) => (
                                    itemIndex === index
                                      ? {
                                        ...currentItem,
                                        materialId: String(material.materialId),
                                        materialCode: material.materialCode,
                                        materialName: material.materialName,
                                        unit: material.unit,
                                      }
                                      : currentItem
                                  )),
                                }))}
                              />
                            </MaterialField>
                            <MaterialField>
                              투입 공정
                              <Select
                                value={item.processId}
                                onChange={(event) => (
                                  updateItem(index, "processId", event.target.value)
                                )}
                                required
                              >
                                <option value="">공정 선택</option>
                                {processes.map((process) => (
                                  <option key={process.processId} value={process.processId}>
                                    {process.processName}
                                  </option>
                                ))}
                              </Select>
                            </MaterialField>
                            <MaterialField>
                              규격
                              <input
                                maxLength="50"
                                value={item.spec}
                                onChange={(event) => (
                                  updateItem(index, "spec", event.target.value)
                                )}
                                required
                              />
                            </MaterialField>
                            <MaterialField>
                              제품 1개당 소요량
                              {item.unit ? ` (${item.unit})` : ""}
                              <input
                                type="number"
                                step="0.001"
                                min="0.001"
                                value={item.requiredQty}
                                onChange={(event) => (
                                  updateItem(index, "requiredQty", event.target.value)
                                )}
                                required
                              />
                            </MaterialField>
                            <MaterialField>
                              손실률(%)
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.lossRate}
                                onChange={(event) => (
                                  updateItem(index, "lossRate", event.target.value)
                                )}
                                required
                              />
                            </MaterialField>
                            <MaterialField>
                              비고
                              <input
                                value={item.note}
                                onChange={(event) => (
                                  updateItem(index, "note", event.target.value)
                                )}
                              />
                            </MaterialField>
                          </MaterialFields>
                        </MaterialRow>
                      );
                    })}
                  </MaterialRows>
                </ModalSection>
              </ModalBody>

              <ModalActions>
                <Button type="button" $secondary onClick={() => setForm(null)}>
                  취소
                </Button>
                <Button
                  disabled={
                    saveMutation.isPending
                    || !form.productId
                    || form.items.some((item) => !item.materialId)
                  }
                >
                  {saveMutation.isPending ? "저장 중..." : "저장"}
                </Button>
              </ModalActions>
            </BomForm>
          </ModalPanel>
        </ModalBackdrop>
      )}

      <BomListSection>
        <BomSearchArea>
          <BomSearchInput
            type="search"
            value={bomKeywordDraft}
            placeholder="BOM 코드·버전·제품 검색"
            aria-label="BOM 검색"
            onChange={(event) => {
              setBomKeywordDraft(event.target.value);
              setBomPage(0);
            }}
          />
        </BomSearchArea>
        <BomListHeader>
          <div>
            <h2>등록된 BOM</h2>
            <p>버전별 상태와 자재 투입 정보를 확인하고 관리합니다.</p>
          </div>
          <BomListCount>총 {totalBoms.toLocaleString()}건</BomListCount>
        </BomListHeader>

        <QueryStatus query={bomsQuery} empty={boms.length === 0} />
        {boms.length > 0 && (
          <BomTableShell>
            <BomTableViewport>
              <BomOverviewTable>
                <thead>
                  <tr>
                    <th>BOM 정보</th>
                    <th>제품</th>
                    <th className="status-column">상태</th>
                    <th className="material-column">자재 구성</th>
                    {canManage && <th className="action-column">관리</th>}
                  </tr>
                </thead>
                <tbody>
                  {boms.map((bom) => (
                    <tr key={bom.bomId}>
                      <td>
                        <CellPrimary>{bom.bomCode}</CellPrimary>
                        <CellSecondary>
                          v{bom.version}{bom.note ? ` · ${bom.note}` : ""}
                        </CellSecondary>
                      </td>
                      <td>
                        <CellPrimary>{bom.productName}</CellPrimary>
                        <CellSecondary>{bom.productCode}</CellSecondary>
                      </td>
                      <td>
                        <Badge $tone={toneForBomStatus(bom.status)}>{bom.statusLabel}</Badge>
                      </td>
                      <td>
                        <MaterialPreviewButton
                          type="button"
                          onClick={() => setMaterialDetailBom(bom)}
                        >
                          <strong>자재 {bom.items.length}개</strong>
                          <span>상세 보기</span>
                        </MaterialPreviewButton>
                      </td>
                      {canManage && (
                        <td>
                          <RowActions>
                            <Button type="button" $secondary onClick={() => edit(bom)}>
                              수정
                            </Button>
                            <Button
                              type="button"
                              $secondary
                              disabled={removeMutation.isPending}
                              onClick={() => removeBom(bom.bomId)}
                            >
                              삭제
                            </Button>
                          </RowActions>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </BomOverviewTable>
            </BomTableViewport>
            <CommonPagination
              ariaLabel="BOM 페이지 이동"
              currentPage={(bomsQuery.data?.number ?? bomPage) + 1}
              pageSize={bomsQuery.data?.size ?? PAGE_SIZE}
              totalItems={totalBoms}
              totalPages={bomsQuery.data?.totalPages ?? 0}
              onPageChange={(page) => setBomPage(page - 1)}
            />
          </BomTableShell>
        )}
      </BomListSection>

      {materialDetailBom && (
        <ModalBackdrop
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setMaterialDetailBom(null);
            }
          }}
        >
          <ModalPanel
            role="dialog"
            aria-modal="true"
            aria-labelledby="bom-material-detail-title"
          >
            <ModalHeader>
              <div>
                <ModalTitle id="bom-material-detail-title">자재 구성 상세</ModalTitle>
                <ModalSectionDescription>
                  {materialDetailBom.bomCode} · v{materialDetailBom.version}
                </ModalSectionDescription>
              </div>
              <ModalCloseButton
                type="button"
                aria-label="자재 구성 상세 창 닫기"
                onClick={() => setMaterialDetailBom(null)}
              >
                ×
              </ModalCloseButton>
            </ModalHeader>

            <ModalBody>
              <BomDetailSummary>
                <BomDetailSummaryItem>
                  <span>제품</span>
                  <strong>{materialDetailBom.productName}</strong>
                  <small>{materialDetailBom.productCode}</small>
                </BomDetailSummaryItem>
                <BomDetailSummaryItem>
                  <span>상태</span>
                  <Badge $tone={toneForBomStatus(materialDetailBom.status)}>
                    {materialDetailBom.statusLabel}
                  </Badge>
                </BomDetailSummaryItem>
                <BomDetailSummaryItem>
                  <span>구성 자재</span>
                  <strong>{materialDetailBom.items.length}개</strong>
                  <small>완제품 1개 생산 기준</small>
                </BomDetailSummaryItem>
              </BomDetailSummary>

              <BomDetailTableWrap>
                <BomDetailTable>
                  <thead>
                    <tr>
                      <th>원자재</th>
                      <th>투입 공정</th>
                      <th>규격</th>
                      <th>소요량</th>
                      <th>손실률</th>
                      <th>비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialDetailBom.items.map((item) => (
                      <tr key={item.bomItemId}>
                        <td>
                          <CellPrimary>{item.materialName}</CellPrimary>
                          <CellSecondary>{item.materialCode}</CellSecondary>
                        </td>
                        <td>{item.processName}</td>
                        <td>{item.spec || "-"}</td>
                        <td>
                          <CellPrimary>{item.requiredQty}{item.unit}</CellPrimary>
                        </td>
                        <td>{item.lossRate}%</td>
                        <td>{item.note || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </BomDetailTable>
              </BomDetailTableWrap>
            </ModalBody>

            <ModalActions>
              <Button type="button" $secondary onClick={() => setMaterialDetailBom(null)}>
                닫기
              </Button>
            </ModalActions>
          </ModalPanel>
        </ModalBackdrop>
      )}
    </BomPageContent>
  );
}
