import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { materialApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { toKst } from "../../api/time";
import { useAuth } from "../../context/AuthContext";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import { Badge, Button, Card, FormGrid, Grid, Input, Select, Table, TableWrap, Toolbar, formatNumber, pageContent, toneForStatus } from "../../components/OperationalUi";
import useDebouncedValue from "../../hooks/useDebouncedValue";

export default function LotManagement() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [keywordDraft, setKeywordDraft] = useState("");
  const keyword = useDebouncedValue(keywordDraft.trim());
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const params = { keyword: keyword || undefined, page: 0, size: 100 };
  const lotsQuery = useQuery({ queryKey: queryKeys.productionLots(params), queryFn: () => materialApi.productionLots(params), refetchInterval: POLLING.INVENTORY, placeholderData: (previous) => previous });
  const detailQuery = useQuery({ queryKey: ["materials", "production-lot", selectedId], queryFn: () => materialApi.productionLot(selectedId), enabled: Boolean(selectedId), refetchInterval: POLLING.INVENTORY });
  const materialLotsQuery = useQuery({ queryKey: queryKeys.rawMaterialLots({ size: 100 }), queryFn: () => materialApi.rawMaterialLots({ size: 100 }) });
  const usageMutation = useMutation({ mutationFn: ({ id, body }) => materialApi.addUsage(id, body), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] }) });
  const lots = pageContent(lotsQuery.data);
  const detail = detailQuery.data;
  const registerUsage = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setMessage("");
    try {
      await usageMutation.mutateAsync({
        id: selectedId,
        body: {
          materialLotId: Number(data.get("materialLotId")),
          usedQty: Number(data.get("usedQty")),
          handledById: user.userId,
        },
      });
      form.reset();
      setMessage("사용 자재를 등록했습니다.");
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };
  return <>
    <Toolbar><Input value={keywordDraft} onChange={(event) => setKeywordDraft(event.target.value)} placeholder="LOT·작업지시·제품 검색" /></Toolbar>
    <ApiErrors queries={[materialLotsQuery, detailQuery]} />
    <QueryStatus query={lotsQuery} empty={lots.length === 0} />
    <TableWrap><Table><thead><tr><th>생산 LOT</th><th>작업지시</th><th>제품</th><th>생산/정상/불량</th><th>현재 공정</th><th>상태</th></tr></thead><tbody>{lots.map((lot) => <tr key={lot.productionLotId} onClick={() => setSelectedId(lot.productionLotId)} style={{ cursor: "pointer" }}><td>{lot.lotNo}</td><td>{lot.workOrderNo}</td><td>{lot.productName}</td><td>{formatNumber(lot.productionQty)} / {formatNumber(lot.goodQty)} / {formatNumber(lot.defectQty)}</td><td>{lot.currentProcess || "-"}</td><td><Badge $tone={toneForStatus(lot.status)}>{lot.statusLabel}</Badge></td></tr>)}</tbody></Table></TableWrap>
    {detail && <Card style={{ marginTop: 18 }}><h2>{detail.lotNo} 상세</h2><p>시작 {toKst(detail.startedAt)} · 완료 {toKst(detail.completedAt)}</p>
      <Grid>{detail.processes.map((process) => <Card key={process.processProgressId}><h3>{process.processName}</h3><p>{process.equipmentCode} {process.equipmentName}</p><Badge $tone={toneForStatus(process.status)}>{process.statusLabel}</Badge></Card>)}</Grid>
      <h3>사용 자재</h3>{detail.materials.length ? detail.materials.map((item) => <p key={item.productionLotMaterialId}>{item.materialLotNo} · {item.materialName}: {item.usedQty} {item.unit}</p>) : <p>등록된 사용 자재가 없습니다.</p>}
      <FormGrid onSubmit={registerUsage}><label>원자재 LOT<Select name="materialLotId" required><option value="">LOT 선택</option>{pageContent(materialLotsQuery.data).filter((lot) => Number(lot.currentQty) > 0).map((lot) => <option key={lot.materialLotId} value={lot.materialLotId}>{lot.materialLotNo} · {lot.materialName} ({lot.currentQty}{lot.unit})</option>)}</Select></label><label>사용 수량<input name="usedQty" type="number" step="0.001" min="0.001" required /></label><Button disabled={usageMutation.isPending}>사용 자재 등록</Button></FormGrid>
      {message && <p role="status">{message}</p>}
    </Card>}
  </>;
}
