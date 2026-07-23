import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { materialApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { toKst } from "../../api/time";
import { QueryStatus } from "../../components/ApiState";
import { Badge, Input, Select, Table, TableWrap, Toolbar, formatNumber, pageContent, toneForStatus } from "../../components/OperationalUi";
import useDebouncedValue from "../../hooks/useDebouncedValue";

export default function InventoryManagement() {
  const [type, setType] = useState("ALL");
  const [keywordDraft, setKeywordDraft] = useState("");
  const keyword = useDebouncedValue(keywordDraft.trim());
  const params = { keyword: keyword || undefined, page: 0, size: 100 };
  const rawQuery = useQuery({ queryKey: queryKeys.rawMaterialLots(params), queryFn: () => materialApi.rawMaterialLots(params), refetchInterval: POLLING.INVENTORY, placeholderData: (previous) => previous });
  const productQuery = useQuery({ queryKey: queryKeys.productInventories(params), queryFn: () => materialApi.productInventories(params), refetchInterval: POLLING.INVENTORY, placeholderData: (previous) => previous });
  const movementQuery = useQuery({ queryKey: queryKeys.inventoryMovements({ recent: true }), queryFn: () => materialApi.recentMovements({ size: 20 }), refetchInterval: POLLING.INVENTORY });
  const rawRows = pageContent(rawQuery.data);
  const productRows = pageContent(productQuery.data);
  return <>
    <Toolbar><Select value={type} onChange={(event) => setType(event.target.value)}><option value="ALL">전체</option><option value="RAW_MATERIAL">원자재</option><option value="FINISHED_PRODUCT">완제품</option></Select><Input value={keywordDraft} onChange={(event) => setKeywordDraft(event.target.value)} placeholder="품목·LOT 검색" /></Toolbar>
    {(type === "ALL" || type === "RAW_MATERIAL") && <><h2>원자재 LOT 현재고</h2><QueryStatus query={rawQuery} empty={rawRows.length === 0} /><TableWrap><Table><thead><tr><th>LOT</th><th>원자재</th><th>현재/안전 재고</th><th>단위</th><th>유효기한</th><th>상태</th></tr></thead><tbody>{rawRows.map((lot) => <tr key={lot.materialLotId}><td>{lot.materialLotNo}</td><td>{lot.materialCode} {lot.materialName}</td><td>{lot.currentQty} / {lot.safetyStockQty}</td><td>{lot.unit}</td><td>{lot.expiryDate}</td><td><Badge $tone={toneForStatus(lot.status)}>{lot.statusLabel}</Badge></td></tr>)}</tbody></Table></TableWrap></>}
    {(type === "ALL" || type === "FINISHED_PRODUCT") && <><h2>완제품 현재고</h2><QueryStatus query={productQuery} empty={productRows.length === 0} /><TableWrap><Table><thead><tr><th>LOT</th><th>제품</th><th>현재/안전 재고</th><th>단위</th><th>유효기한</th><th>상태</th></tr></thead><tbody>{productRows.map((item) => <tr key={item.inventoryId}><td>{item.lotNo}</td><td>{item.productCode} {item.productName}</td><td>{formatNumber(item.currentQty)} / {formatNumber(item.safetyStockQty)}</td><td>{item.unit}</td><td>{item.expiryDate}</td><td><Badge $tone={toneForStatus(item.status)}>{item.statusLabel}</Badge></td></tr>)}</tbody></Table></TableWrap></>}
    <h2>최근 이동 이력</h2><QueryStatus query={movementQuery} empty={movementQuery.data?.length === 0} /><TableWrap><Table><thead><tr><th>이동 번호</th><th>품목</th><th>유형</th><th>수량</th><th>처리자</th><th>시각</th></tr></thead><tbody>{(movementQuery.data || []).map((item) => <tr key={item.movementId}><td>{item.movementNo}</td><td>{item.itemName} · {item.lotNo}</td><td>{item.movementTypeLabel}</td><td>{item.quantity}</td><td>{item.handledByName}</td><td>{toKst(item.occurredAt)}</td></tr>)}</tbody></Table></TableWrap>
  </>;
}
