import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { materialApi, referenceApi } from "../../api/services";
import { queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import { Badge, Button, Card, FormGrid, Select, Table, TableWrap, Toolbar, pageContent, toneForStatus } from "../../components/OperationalUi";

const emptyForm = { bomId: null, bomCode: "", version: "1.0", productId: "", status: "ACTIVE", note: "", items: [{ materialId: "", processId: "", spec: "", requiredQty: "", lossRate: "0", note: "" }] };

export default function BomManagement() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const bomsQuery = useQuery({ queryKey: queryKeys.boms({ page: 0, size: 100 }), queryFn: () => materialApi.boms({ page: 0, size: 100 }) });
  const productsQuery = useQuery({ queryKey: queryKeys.products({ status: "ACTIVE", size: 100 }), queryFn: () => referenceApi.products({ status: "ACTIVE", size: 100 }) });
  const materialsQuery = useQuery({ queryKey: queryKeys.materials({ status: "ACTIVE", size: 100 }), queryFn: () => referenceApi.rawMaterials({ status: "ACTIVE", size: 100 }) });
  const processesQuery = useQuery({ queryKey: queryKeys.processes(), queryFn: referenceApi.processes });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["materials"] });
  const saveMutation = useMutation({ mutationFn: (body) => body.bomId ? materialApi.updateBom(body.bomId, body.payload) : materialApi.createBom(body.payload), onSuccess: invalidate });
  const removeMutation = useMutation({ mutationFn: materialApi.removeBom, onSuccess: invalidate });
  const updateItem = (index, key, value) => setForm((current) => ({ ...current, items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) }));
  const edit = (bom) => setForm({ ...bom, items: bom.items.map((item) => ({ ...item })) });
  const save = async (event) => {
    event.preventDefault(); setMessage("");
    const payload = { bomCode: form.bomCode, version: form.version, productId: Number(form.productId), status: form.status, note: form.note || null, items: form.items.map((item) => ({ materialId: Number(item.materialId), processId: Number(item.processId), spec: item.spec, requiredQty: Number(item.requiredQty), lossRate: Number(item.lossRate), note: item.note || null })) };
    try { await saveMutation.mutateAsync({ bomId: form.bomId, payload }); setForm(null); setMessage("BOM을 저장했습니다."); } catch (error) { setMessage(extractApiError(error)); }
  };
  const boms = pageContent(bomsQuery.data);
  return <>
    <Toolbar><Button onClick={() => setForm(emptyForm)}>BOM 등록</Button></Toolbar>{message && <p role="status">{message}</p>}
    <ApiErrors queries={[productsQuery, materialsQuery, processesQuery]} />
    {form && <Card><h2>{form.bomId ? "BOM 수정" : "기존 제품에 BOM 등록"}</h2><FormGrid onSubmit={save}>
      <label>BOM 코드<input value={form.bomCode} onChange={(event) => setForm({ ...form, bomCode: event.target.value })} required /></label>
      <label>버전<input value={form.version} onChange={(event) => setForm({ ...form, version: event.target.value })} required /></label>
      <label>기존 제품<Select value={form.productId} onChange={(event) => setForm({ ...form, productId: event.target.value })} required><option value="">제품 선택</option>{pageContent(productsQuery.data).map((item) => <option key={item.productId} value={item.productId}>{item.productName}</option>)}</Select></label>
      <label>상태<Select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="ACTIVE">사용 중</option><option value="REVIEW">검토</option><option value="INACTIVE">사용 중지</option></Select></label>
      <label>메모<input value={form.note || ""} onChange={(event) => setForm({ ...form, note: event.target.value })} /></label>
      <div style={{ gridColumn: "1/-1" }}><h3>자재 구성</h3>{form.items.map((item, index) => <div key={index} style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        <Select value={item.materialId} onChange={(event) => updateItem(index, "materialId", event.target.value)} required><option value="">원자재</option>{pageContent(materialsQuery.data).map((material) => <option key={material.materialId} value={material.materialId}>{material.materialName}</option>)}</Select>
        <Select value={item.processId} onChange={(event) => updateItem(index, "processId", event.target.value)} required><option value="">공정</option>{pageContent(processesQuery.data).map((process) => <option key={process.processId} value={process.processId}>{process.processName}</option>)}</Select>
        <input placeholder="규격" value={item.spec} onChange={(event) => updateItem(index, "spec", event.target.value)} required />
        <input type="number" step="0.001" min="0.001" placeholder="소요량" value={item.requiredQty} onChange={(event) => updateItem(index, "requiredQty", event.target.value)} required />
        <input type="number" step="0.01" min="0" placeholder="손실률" value={item.lossRate} onChange={(event) => updateItem(index, "lossRate", event.target.value)} required />
        <Button type="button" $secondary disabled={form.items.length === 1} onClick={() => setForm({ ...form, items: form.items.filter((_, itemIndex) => itemIndex !== index) })}>삭제</Button>
      </div>)}<Button type="button" $secondary onClick={() => setForm({ ...form, items: [...form.items, { ...emptyForm.items[0] }] })}>자재 행 추가</Button></div>
      <div><Button disabled={saveMutation.isPending}>저장</Button> <Button type="button" $secondary onClick={() => setForm(null)}>취소</Button></div>
    </FormGrid></Card>}
    <QueryStatus query={bomsQuery} empty={boms.length === 0} />
    <TableWrap><Table><thead><tr><th>BOM</th><th>제품</th><th>버전</th><th>상태</th><th>자재</th><th>관리</th></tr></thead><tbody>{boms.map((bom) => <tr key={bom.bomId}><td>{bom.bomCode}</td><td>{bom.productCode} {bom.productName}</td><td>{bom.version}</td><td><Badge $tone={toneForStatus(bom.status)}>{bom.statusLabel}</Badge></td><td>{bom.items.map((item) => `${item.materialName} ${item.requiredQty}${item.unit}`).join(", ")}</td><td><Button $secondary onClick={() => edit(bom)}>수정</Button>{" "}<Button $secondary disabled={removeMutation.isPending} onClick={() => window.confirm("BOM을 삭제하시겠습니까?") && removeMutation.mutate(bom.bomId)}>삭제</Button></td></tr>)}</tbody></Table></TableWrap>
  </>;
}
