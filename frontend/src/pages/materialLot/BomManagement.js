import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { materialApi, referenceApi } from "../../api/services";
import { queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import {
  Badge,
  Button,
  Card,
  FormGrid,
  Notice,
  Select,
  Table,
  TableWrap,
  Toolbar,
  pageContent,
  toneForStatus,
} from "../../components/OperationalUi";

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
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");

  const bomsQuery = useQuery({
    queryKey: queryKeys.boms({ page: 0, size: 100 }),
    queryFn: () => materialApi.boms({ page: 0, size: 100 }),
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

  return (
    <>
      {canManage && (
        <Toolbar>
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
        </Toolbar>
      )}
      {message && <p role="status">{message}</p>}
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
        <Card>
          <h2>{form.bomId ? "BOM 수정" : "기존 제품에 BOM 등록"}</h2>
          <p>모든 소요량은 완제품 1개 생산 기준으로 입력합니다.</p>
          <FormGrid onSubmit={save}>
            <label>
              BOM 코드
              <input
                maxLength="30"
                value={form.bomCode}
                disabled={Boolean(form.bomId)}
                onChange={(event) => setForm({ ...form, bomCode: event.target.value })}
                required
              />
            </label>
            <label>
              버전
              <input
                maxLength="20"
                value={form.version}
                disabled={Boolean(form.bomId)}
                onChange={(event) => setForm({ ...form, version: event.target.value })}
                required
              />
            </label>
            <label>
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
            </label>
            <label>
              상태
              <Select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
              >
                <option value="ACTIVE">사용 중</option>
                <option value="REVIEW">검토</option>
                <option value="INACTIVE">사용 중지</option>
              </Select>
            </label>
            <label>
              BOM 메모
              <input
                value={form.note}
                onChange={(event) => setForm({ ...form, note: event.target.value })}
              />
            </label>

            <div style={{ gridColumn: "1 / -1" }}>
              <h3>자재 구성</h3>
              {form.items.map((item, index) => {
                const selectedMaterial = materials.find(
                  (material) => String(material.materialId) === String(item.materialId),
                );
                const materialOptions = selectableMaterials(item.materialId);
                const hasSelectedMaterial = materialOptions.some(
                  (material) => String(material.materialId) === String(item.materialId),
                );
                return (
                  <Card key={`${item.bomItemId || "new"}-${index}`} style={{ marginBottom: 12 }}>
                    <FormGrid as="div">
                      <label>
                        원자재
                        <Select
                          value={item.materialId}
                          onChange={(event) => updateItem(index, "materialId", event.target.value)}
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
                              {material.status !== "ACTIVE" ? ` (${material.statusLabel})` : ""}
                            </option>
                          ))}
                        </Select>
                      </label>
                      <label>
                        투입 공정
                        <Select
                          value={item.processId}
                          onChange={(event) => updateItem(index, "processId", event.target.value)}
                          required
                        >
                          <option value="">공정 선택</option>
                          {processes.map((process) => (
                            <option key={process.processId} value={process.processId}>
                              {process.processName}
                            </option>
                          ))}
                        </Select>
                      </label>
                      <label>
                        규격
                        <input
                          maxLength="50"
                          value={item.spec}
                          onChange={(event) => updateItem(index, "spec", event.target.value)}
                          required
                        />
                      </label>
                      <label>
                        제품 1개당 소요량 {selectedMaterial ? `(${selectedMaterial.unit})` : ""}
                        <input
                          type="number"
                          step="0.001"
                          min="0.001"
                          value={item.requiredQty}
                          onChange={(event) => updateItem(index, "requiredQty", event.target.value)}
                          required
                        />
                      </label>
                      <label>
                        손실률(%)
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.lossRate}
                          onChange={(event) => updateItem(index, "lossRate", event.target.value)}
                          required
                        />
                      </label>
                      <label>
                        비고
                        <input
                          value={item.note}
                          onChange={(event) => updateItem(index, "note", event.target.value)}
                        />
                      </label>
                    </FormGrid>
                    <Button
                      type="button"
                      $secondary
                      disabled={form.items.length === 1}
                      onClick={() => setForm({
                        ...form,
                        items: form.items.filter((_, itemIndex) => itemIndex !== index),
                      })}
                    >
                      자재 행 삭제
                    </Button>
                  </Card>
                );
              })}
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
            </div>

            <div>
              <Button disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "저장 중..." : "저장"}
              </Button>{" "}
              <Button type="button" $secondary onClick={() => setForm(null)}>
                취소
              </Button>
            </div>
          </FormGrid>
        </Card>
      )}

      <QueryStatus query={bomsQuery} empty={boms.length === 0} />
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>BOM</th>
              <th>제품</th>
              <th>버전</th>
              <th>상태</th>
              <th>자재</th>
              {canManage && <th>관리</th>}
            </tr>
          </thead>
          <tbody>
            {boms.map((bom) => (
              <tr key={bom.bomId}>
                <td>{bom.bomCode}</td>
                <td>{bom.productCode} {bom.productName}</td>
                <td>{bom.version}</td>
                <td><Badge $tone={toneForStatus(bom.status)}>{bom.statusLabel}</Badge></td>
                <td>
                  {bom.items.map((item) => (
                    `${item.materialName} ${item.requiredQty}${item.unit} / 손실 ${item.lossRate}%`
                  )).join(", ")}
                </td>
                {canManage && (
                  <td>
                    <Button type="button" $secondary onClick={() => edit(bom)}>수정</Button>{" "}
                    <Button
                      type="button"
                      $secondary
                      disabled={removeMutation.isPending}
                      onClick={() => removeBom(bom.bomId)}
                    >
                      삭제
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </>
  );
}
