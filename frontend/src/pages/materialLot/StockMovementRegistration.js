import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { materialApi } from "../../api/services";
import { queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { toUtcInstant } from "../../api/time";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, FormGrid, Select, pageContent } from "../../components/OperationalUi";
import { ApiErrors } from "../../components/ApiState";

export default function StockMovementRegistration({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [itemType, setItemType] = useState("RAW_MATERIAL");
  const [message, setMessage] = useState("");
  const rawQuery = useQuery({ queryKey: queryKeys.rawMaterialLots({ size: 100 }), queryFn: () => materialApi.rawMaterialLots({ size: 100 }), enabled: isOpen });
  const productQuery = useQuery({ queryKey: queryKeys.productInventories({ size: 100 }), queryFn: () => materialApi.productInventories({ size: 100 }), enabled: isOpen });
  const mutation = useMutation({
    mutationFn: materialApi.createMovement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] }),
  });
  if (!isOpen) return null;
  const submit = async (event) => {
    event.preventDefault(); const data = new FormData(event.currentTarget); setMessage("");
    const targetId = Number(data.get("targetId"));
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
    } catch (error) { setMessage(extractApiError(error)); }
  };
  return <div role="presentation" onMouseDown={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.55)", zIndex: 1000, display: "grid", placeItems: "center", padding: 20 }}>
    <Card role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()} style={{ width: "min(760px, 100%)", maxHeight: "90vh", overflow: "auto" }}>
      <h2>재고 이동 등록</h2>
      <FormGrid onSubmit={submit}>
        <label>품목 유형<Select value={itemType} onChange={(event) => setItemType(event.target.value)}><option value="RAW_MATERIAL">원자재</option><option value="FINISHED_PRODUCT">완제품</option></Select></label>
        <label>이동 유형<Select name="movementType"><option value="INBOUND">입고</option><option value="OUTBOUND">출고</option><option value="ADJUSTMENT">조정</option></Select></label>
        <label>대상 LOT/재고<Select name="targetId" required><option value="">대상 선택</option>{(itemType === "RAW_MATERIAL" ? pageContent(rawQuery.data) : pageContent(productQuery.data)).map((item) => <option key={itemType === "RAW_MATERIAL" ? item.materialLotId : item.inventoryId} value={itemType === "RAW_MATERIAL" ? item.materialLotId : item.inventoryId}>{itemType === "RAW_MATERIAL" ? item.materialLotNo : item.lotNo} · {itemType === "RAW_MATERIAL" ? item.materialName : item.productName}</option>)}</Select></label>
        <label>수량<input name="quantity" type="number" min="0.001" step="0.001" required /></label>
        <label>처리 시각<input name="occurredAt" type="datetime-local" /></label>
        <label>비고<textarea name="remarks" rows="3" /></label>
        <div><Button disabled={mutation.isPending}>{mutation.isPending ? "저장 중..." : "저장"}</Button> <Button type="button" $secondary onClick={onClose}>취소</Button></div>
      </FormGrid>
      {message && <p role="alert">{message}</p>}
      <ApiErrors queries={[rawQuery, productQuery]} />
    </Card>
  </div>;
}
