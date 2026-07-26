import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { materialApi, referenceApi } from "../../api/services";
import { queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import CommonPagination from "../../components/CommonPagination";
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
  StatusMessage,
} from "./BomManagementCss";

const PAGE_SIZE = 10;
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

export default function BomManagement({ canManage = false }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [bomPage, setBomPage] = useState(0);
  const [form, setForm] = useState(null);
  const [materialDetailBom, setMaterialDetailBom] = useState(null);
  const [message, setMessage] = useState("");
  const bomParams = { page: bomPage, size: PAGE_SIZE };

  useEffect(() => {
    if (!form && !materialDetailBom) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key !== "Escape") {
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
  }, [form, materialDetailBom]);

  const bomsQuery = useQuery({
    queryKey: queryKeys.boms(bomParams),
    queryFn: () => materialApi.boms(bomParams),
    placeholderData: (previous) => previous,
  });
  const productsQuery = useQuery({
    queryKey: queryKeys.products({ size: 100 }),
    queryFn: () => referenceApi.products({ size: 100 }),
  });
  const materialsQuery = useQuery({
    queryKey: queryKeys.materials({ size: 100 }),
    queryFn: () => referenceApi.rawMaterials({ size: 100 }),
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

  const products = pageContent(productsQuery.data);
  const materials = pageContent(materialsQuery.data);
  const processes = Array.isArray(processesQuery.data) ? processesQuery.data : [];
  const activeProducts = products.filter((product) => product.status === "ACTIVE");
  const activeMaterials = materials.filter((material) => material.status === "ACTIVE");
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

  const selectableProducts = products.filter((product) => (
    product.status === "ACTIVE" || String(product.productId) === String(form?.productId)
  ));
  const selectableMaterials = (selectedMaterialId) => materials.filter((material) => (
    material.status === "ACTIVE" || String(material.materialId) === String(selectedMaterialId)
  ));
  const hasSelectedProduct = selectableProducts.some(
    (product) => String(product.productId) === String(form?.productId),
  );
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
            disabled={activeProducts.length === 0 || activeMaterials.length === 0}
            onClick={() => {
              setMessage("");
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
      <ApiErrors queries={[productsQuery, materialsQuery, processesQuery]} />

      {(activeProducts.length === 0 || activeMaterials.length === 0) && (
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
                    <Badge $tone={toneForStatus(form.status)}>
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
                    <BomField $span={3}>
                      기존 제품
                      <Select
                        value={form.productId}
                        disabled={Boolean(form.bomId)}
                        onChange={(event) => setForm({ ...form, productId: event.target.value })}
                        required
                      >
                        <option value="">제품 선택</option>
                        {form.bomId && !hasSelectedProduct && (
                          <option value={form.productId}>
                            {form.productCode} · {form.productName} (현재 선택)
                          </option>
                        )}
                        {selectableProducts.map((product) => (
                          <option
                            key={product.productId}
                            value={product.productId}
                            disabled={product.status !== "ACTIVE"}
                          >
                            {product.productCode} · {product.productName}
                            {product.status !== "ACTIVE" ? ` (${product.statusLabel})` : ""}
                          </option>
                        ))}
                      </Select>
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
                      const selectedMaterial = materials.find(
                        (material) => String(material.materialId) === String(item.materialId),
                      );
                      const materialOptions = selectableMaterials(item.materialId);
                      const hasSelectedMaterial = materialOptions.some(
                        (material) => String(material.materialId) === String(item.materialId),
                      );
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
                            <MaterialField>
                              원자재
                              <Select
                                value={item.materialId}
                                onChange={(event) => (
                                  updateItem(index, "materialId", event.target.value)
                                )}
                                required
                              >
                                <option value="">원자재 선택</option>
                                {!hasSelectedMaterial && item.materialId && (
                                  <option value={item.materialId}>
                                    {item.materialCode} · {item.materialName} (현재 선택)
                                  </option>
                                )}
                                {materialOptions.map((material) => (
                                  <option
                                    key={material.materialId}
                                    value={material.materialId}
                                    disabled={material.status !== "ACTIVE"}
                                  >
                                    {material.materialCode} · {material.materialName}
                                    {material.status !== "ACTIVE"
                                      ? ` (${material.statusLabel})`
                                      : ""}
                                  </option>
                                ))}
                              </Select>
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
                              {selectedMaterial ? ` (${selectedMaterial.unit})` : ""}
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
                <Button disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "저장 중..." : "저장"}
                </Button>
              </ModalActions>
            </BomForm>
          </ModalPanel>
        </ModalBackdrop>
      )}

      <BomListSection>
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
                        <Badge $tone={toneForStatus(bom.status)}>{bom.statusLabel}</Badge>
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
                  <Badge $tone={toneForStatus(materialDetailBom.status)}>
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
