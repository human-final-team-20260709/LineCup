import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { defectApi, materialApi, referenceApi } from "../../api/services";
import { queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { Button, Card, FormGrid, Header, Page, Select, pageContent } from "../../components/OperationalUi";
import { ApiErrors } from "../../components/ApiState";

export default function DefectFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const lotsQuery = useQuery({ queryKey: queryKeys.productionLots({ size: 100 }), queryFn: () => materialApi.productionLots({ size: 100 }) });
  const equipmentsQuery = useQuery({ queryKey: queryKeys.equipments(), queryFn: () => referenceApi.equipments() });
  const typesQuery = useQuery({ queryKey: queryKeys.defectTypes(), queryFn: defectApi.types });
  const mutation = useMutation({
    mutationFn: defectApi.create,
    onSuccess: (detail) => {
      queryClient.invalidateQueries({ queryKey: ["defects"] });
      navigate(`/quality/defects/${detail.summary.defectId}`);
    },
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setMessage("");
    try {
      await mutation.mutateAsync({
        productionLotId: Number(data.get("productionLotId")),
        equipmentId: Number(data.get("equipmentId")),
        defectType: data.get("defectType"),
        quantity: Number(data.get("quantity")),
        cause: String(data.get("cause") || "").trim() || null,
        occurredAt: null,
      });
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };
  return <Page>
    <Header><div><h1>불량 등록</h1><p>활성 불량 유형과 실제 생산 LOT·설비를 선택합니다.</p></div><Button $secondary onClick={() => navigate("/quality/defects")}>취소</Button></Header>
    <Card><FormGrid onSubmit={handleSubmit}>
      <label>생산 LOT<Select name="productionLotId" required><option value="">LOT 선택</option>{pageContent(lotsQuery.data).map((lot) => <option key={lot.productionLotId} value={lot.productionLotId}>{lot.lotNo} · {lot.productName}</option>)}</Select></label>
      <label>설비<Select name="equipmentId" required><option value="">설비 선택</option>{pageContent(equipmentsQuery.data).map((equipment) => <option key={equipment.equipmentId} value={equipment.equipmentId}>{equipment.equipmentCode} {equipment.equipmentName}</option>)}</Select></label>
      <label>불량 유형<Select name="defectType" required><option value="">유형 선택</option>{(typesQuery.data || []).map((type) => <option key={type.code} value={type.code}>{type.name}</option>)}</Select></label>
      <label>불량 수량<input name="quantity" type="number" min="1" required /></label>
      <label>원인<textarea name="cause" rows="4" /></label>
      <Button disabled={mutation.isPending}>{mutation.isPending ? "등록 중..." : "불량 등록"}</Button>
    </FormGrid></Card>
    {message && <p role="alert">{message}</p>}
    <ApiErrors queries={[lotsQuery, equipmentsQuery, typesQuery]} />
  </Page>;
}
