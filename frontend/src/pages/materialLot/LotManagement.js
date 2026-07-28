import { useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { materialApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import { toKst } from "../../api/time";
import { useAuth } from "../../context/AuthContext";
import { ApiErrors, QueryStatus } from "../../components/ApiState";
import CommonPagination from "../../components/CommonPagination";
import {
  Badge,
  Button,
  Input,
  formatNumber,
  pageContent,
  toneForStatus,
} from "../../components/OperationalUi";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import {
  CloseButton,
  CountBadge,
  DefectQuantity,
  DetailContext,
  DetailEyebrow,
  DetailHeader,
  DetailLoading,
  DetailPanel,
  DetailSection,
  DetailTitle,
  EmptyContent,
  FormCard,
  FormDescription,
  FormField,
  FormTitle,
  GoodQuantity,
  InfoItem,
  InfoStrip,
  ListHeader,
  ListShell,
  LotNumber,
  LotRow,
  LotTable,
  MaterialTable,
  MaterialTableViewport,
  MaterialLotEmpty,
  MaterialLotMore,
  MaterialLotOption,
  MaterialLotOptions,
  MaterialLotSearchBox,
  SelectedMaterialLot,
  ProcessIdentity,
  ProcessTable,
  ProcessTableViewport,
  ProductName,
  QuantityGroup,
  SearchArea,
  SecondaryText,
  SectionDescription,
  SectionHeading,
  SectionTitle,
  StatusMessage,
  SummaryCard,
  SummaryGrid,
  TableViewport,
  TitleLine,
  UsageForm,
  UsageLayout,
} from "./LotManagementCss";

const PAGE_SIZE = 10;
const OPTION_PAGE_SIZE = 20;
const toneForProductionLotStatus = (status) => (
  status === "IN_PROGRESS" ? "warn" : toneForStatus(status)
);

export default function LotManagement() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [keywordDraft, setKeywordDraft] = useState("");
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [materialLotKeywordDraft, setMaterialLotKeywordDraft] = useState("");
  const [selectedMaterialLot, setSelectedMaterialLot] = useState(null);
  const [message, setMessage] = useState("");
  const keyword = useDebouncedValue(keywordDraft.trim());
  const materialLotKeyword = useDebouncedValue(materialLotKeywordDraft.trim());
  const params = {
    keyword: keyword || undefined,
    page,
    size: PAGE_SIZE,
  };

  const lotsQuery = useQuery({
    queryKey: queryKeys.productionLots(params),
    queryFn: () => materialApi.productionLots(params),
    refetchInterval: POLLING.INVENTORY,
    placeholderData: (previous) => previous,
  });
  const detailQuery = useQuery({
    queryKey: ["materials", "production-lot", selectedId],
    queryFn: () => materialApi.productionLot(selectedId),
    enabled: Boolean(selectedId),
    refetchInterval: POLLING.INVENTORY,
  });
  const materialLotParams = {
    keyword: materialLotKeyword || undefined,
    size: OPTION_PAGE_SIZE,
  };
  const materialLotsQuery = useInfiniteQuery({
    queryKey: [...queryKeys.rawMaterialLots(materialLotParams), "usage-options"],
    queryFn: ({ pageParam }) => materialApi.rawMaterialLots({
      ...materialLotParams,
      page: pageParam,
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (
      lastPage.last ? undefined : lastPage.number + 1
    ),
    enabled: Boolean(detailQuery.data),
  });
  const usageMutation = useMutation({
    mutationFn: ({ id, body }) => materialApi.addUsage(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] }),
  });

  const lots = pageContent(lotsQuery.data);
  const detail = detailQuery.data;
  const processes = detail?.processes || [];
  const materials = detail?.materials || [];
  const availableMaterialLots = (materialLotsQuery.data?.pages.flatMap(pageContent) || [])
    .filter((lot) => Number(lot.currentQty) > 0);
  const totalItems = lotsQuery.data?.totalElements ?? lots.length;
  const totalPages = lotsQuery.data?.totalPages ?? (lots.length > 0 ? 1 : 0);
  const currentPage = (lotsQuery.data?.number ?? page) + 1;

  const closeDetail = () => {
    setSelectedId(null);
    setMaterialLotKeywordDraft("");
    setSelectedMaterialLot(null);
    setMessage("");
  };

  const selectLot = (productionLotId) => {
    setSelectedId(productionLotId);
    setMaterialLotKeywordDraft("");
    setSelectedMaterialLot(null);
    setMessage("");
  };

  const handleRowKeyDown = (event, productionLotId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectLot(productionLotId);
    }
  };

  const changePage = (nextPage) => {
    setPage(nextPage - 1);
    closeDetail();
  };

  const changeKeyword = (event) => {
    setKeywordDraft(event.target.value);
    setPage(0);
    closeDetail();
  };

  const registerUsage = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setMessage("");

    if (!selectedMaterialLot) {
      setMessage("사용할 원자재 LOT을 선택해 주세요.");
      return;
    }

    try {
      await usageMutation.mutateAsync({
        id: selectedId,
        body: {
          materialLotId: Number(selectedMaterialLot.materialLotId),
          usedQty: Number(data.get("usedQty")),
          handledById: user.userId,
        },
      });
      form.reset();
      setMaterialLotKeywordDraft("");
      setSelectedMaterialLot(null);
      setMessage("사용 자재를 등록했습니다.");
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  return (
    <>
      <SearchArea>
        <Input
          value={keywordDraft}
          onChange={changeKeyword}
          placeholder="LOT·작업지시·제품 검색"
          aria-label="LOT 검색"
        />
      </SearchArea>

      <ApiErrors queries={[materialLotsQuery, detailQuery]} />

      <ListShell>
        <ListHeader>
          <div>
            <SectionTitle>생산 LOT 목록</SectionTitle>
            <SectionDescription>
              LOT를 선택하면 공정 진행과 투입 자재를 확인할 수 있습니다.
            </SectionDescription>
          </div>
          <CountBadge>총 {formatNumber(totalItems)}건</CountBadge>
        </ListHeader>

        <QueryStatus query={lotsQuery} empty={lots.length === 0} />

        {lots.length > 0 && (
          <>
            <TableViewport>
              <LotTable>
                <thead>
                  <tr>
                    <th>생산 LOT</th>
                    <th>작업지시</th>
                    <th>제품</th>
                    <th>생산 / 정상 / 불량</th>
                    <th>현재 공정</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {lots.map((lot) => {
                    const isSelected = selectedId === lot.productionLotId;
                    return (
                      <LotRow
                        key={lot.productionLotId}
                        $selected={isSelected}
                        role="button"
                        tabIndex={0}
                        aria-label={`${lot.lotNo} 상세 보기`}
                        aria-pressed={isSelected}
                        onClick={() => selectLot(lot.productionLotId)}
                        onKeyDown={(event) => handleRowKeyDown(event, lot.productionLotId)}
                      >
                        <td><LotNumber>{lot.lotNo}</LotNumber></td>
                        <td>{lot.workOrderNo}</td>
                        <td>
                          <ProductName>{lot.productName}</ProductName>
                          <SecondaryText>{lot.productCode}</SecondaryText>
                        </td>
                        <td>
                          <QuantityGroup>
                            <span>{formatNumber(lot.productionQty)}</span>
                            <GoodQuantity>{formatNumber(lot.goodQty)}</GoodQuantity>
                            <DefectQuantity>{formatNumber(lot.defectQty)}</DefectQuantity>
                          </QuantityGroup>
                        </td>
                        <td>{lot.currentProcess || "-"}</td>
                        <td>
                          <Badge $tone={toneForProductionLotStatus(lot.status)}>
                            {lot.statusLabel}
                          </Badge>
                        </td>
                      </LotRow>
                    );
                  })}
                </tbody>
              </LotTable>
            </TableViewport>

            <CommonPagination
              ariaLabel="생산 LOT 페이지 이동"
              currentPage={currentPage}
              pageSize={lotsQuery.data?.size ?? PAGE_SIZE}
              totalItems={totalItems}
              totalPages={totalPages}
              onPageChange={changePage}
            />
          </>
        )}
      </ListShell>

      {selectedId && detailQuery.isPending && !detail && (
        <DetailLoading role="status">LOT 상세 정보를 불러오는 중입니다.</DetailLoading>
      )}

      {detail && (
        <DetailPanel aria-labelledby="lot-detail-title">
          <DetailHeader>
            <DetailTitle>
              <DetailEyebrow>생산 LOT 상세</DetailEyebrow>
              <TitleLine>
                <h2 id="lot-detail-title">{detail.lotNo}</h2>
                <Badge $tone={toneForProductionLotStatus(detail.status)}>
                  {detail.statusLabel}
                </Badge>
              </TitleLine>
              <DetailContext>
                {detail.workOrderNo} · {detail.productName}
                {detail.productCode ? ` (${detail.productCode})` : ""}
              </DetailContext>
            </DetailTitle>
            <CloseButton type="button" onClick={closeDetail}>
              상세 닫기
            </CloseButton>
          </DetailHeader>

          <SummaryGrid>
            <SummaryCard>
              <span>생산 수량</span>
              <strong>{formatNumber(detail.productionQty)}</strong>
            </SummaryCard>
            <SummaryCard $tone="success">
              <span>정상 수량</span>
              <strong>{formatNumber(detail.goodQty)}</strong>
            </SummaryCard>
            <SummaryCard $tone="danger">
              <span>불량 수량</span>
              <strong>{formatNumber(detail.defectQty)}</strong>
            </SummaryCard>
            <SummaryCard>
              <span>현재 공정</span>
              <strong>{detail.currentProcess || "-"}</strong>
            </SummaryCard>
          </SummaryGrid>

          <InfoStrip>
            <InfoItem>
              <span>작업지시</span>
              <strong>{detail.workOrderNo || "-"}</strong>
            </InfoItem>
            <InfoItem>
              <span>시작 일시</span>
              <strong>{toKst(detail.startedAt)}</strong>
            </InfoItem>
            <InfoItem>
              <span>완료 일시</span>
              <strong>{toKst(detail.completedAt)}</strong>
            </InfoItem>
          </InfoStrip>

          <DetailSection>
            <SectionHeading>
              <div>
                <SectionTitle as="h3">공정 진행 현황</SectionTitle>
                <SectionDescription>
                  공정별 설비, 생산 실적과 진행 상태입니다.
                </SectionDescription>
              </div>
              <CountBadge>{processes.length}개 공정</CountBadge>
            </SectionHeading>

            {processes.length > 0 ? (
              <ProcessTableViewport>
                <ProcessTable>
                  <thead>
                    <tr>
                      <th>순서 / 공정</th>
                      <th>설비</th>
                      <th>생산 / 정상 / 불량</th>
                      <th>시작 / 완료</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processes.map((process, index) => (
                      <tr key={process.processProgressId}>
                        <td>
                          <ProcessIdentity>
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <div>
                              <strong>{process.processName}</strong>
                              <small>{process.processCode}</small>
                            </div>
                          </ProcessIdentity>
                        </td>
                        <td>
                          <ProductName>{process.equipmentName || "설비 미배정"}</ProductName>
                          <SecondaryText>{process.equipmentCode || "-"}</SecondaryText>
                        </td>
                        <td>
                          <QuantityGroup>
                            <span>{formatNumber(process.productionQty)}</span>
                            <GoodQuantity>{formatNumber(process.goodQty)}</GoodQuantity>
                            <DefectQuantity>{formatNumber(process.defectQty)}</DefectQuantity>
                          </QuantityGroup>
                        </td>
                        <td>
                          <ProductName>{toKst(process.startedAt, "MM-DD HH:mm")}</ProductName>
                          <SecondaryText>{toKst(process.completedAt, "MM-DD HH:mm")}</SecondaryText>
                        </td>
                        <td>
                          <Badge $tone={toneForStatus(process.status)}>
                            {process.statusLabel}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ProcessTable>
              </ProcessTableViewport>
            ) : (
              <EmptyContent>등록된 공정 진행 정보가 없습니다.</EmptyContent>
            )}
          </DetailSection>

          <UsageLayout>
            <DetailSection>
              <SectionHeading>
                <div>
                  <SectionTitle as="h3">사용 자재</SectionTitle>
                  <SectionDescription>
                    이 생산 LOT에 실제 투입된 원자재 LOT입니다.
                  </SectionDescription>
                </div>
                <CountBadge>{materials.length}건</CountBadge>
              </SectionHeading>

              {materials.length > 0 ? (
                <MaterialTableViewport>
                  <MaterialTable>
                    <thead>
                      <tr>
                        <th>원자재 LOT</th>
                        <th>자재</th>
                        <th>사용 수량</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials.map((item) => (
                        <tr key={item.productionLotMaterialId}>
                          <td><LotNumber>{item.materialLotNo}</LotNumber></td>
                          <td>
                            <ProductName>{item.materialName}</ProductName>
                            <SecondaryText>{item.materialCode}</SecondaryText>
                          </td>
                          <td>
                            {formatNumber(item.usedQty)} {item.unit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </MaterialTable>
                </MaterialTableViewport>
              ) : (
                <EmptyContent>등록된 사용 자재가 없습니다.</EmptyContent>
              )}
            </DetailSection>

            <FormCard>
              <FormTitle>사용 자재 등록</FormTitle>
              <FormDescription>
                재고가 남아 있는 원자재 LOT와 실제 사용 수량을 입력합니다.
              </FormDescription>
              <UsageForm onSubmit={registerUsage}>
                <FormField as="div">
                  <span>원자재 LOT</span>
                  <MaterialLotSearchBox>
                    <input
                      type="search"
                      value={materialLotKeywordDraft}
                      placeholder="LOT 번호·원자재·공급사 검색"
                      aria-label="사용할 원자재 LOT 검색"
                      onChange={(event) => setMaterialLotKeywordDraft(event.target.value)}
                    />
                    {selectedMaterialLot && (
                      <SelectedMaterialLot>
                        <span>선택됨</span>
                        <strong>{selectedMaterialLot.materialLotNo}</strong>
                        <small>
                          {selectedMaterialLot.materialName}
                          {" · "}
                          {selectedMaterialLot.currentQty}{selectedMaterialLot.unit}
                        </small>
                      </SelectedMaterialLot>
                    )}
                    <MaterialLotOptions
                      role="listbox"
                      aria-label="사용할 원자재 LOT 검색 결과"
                    >
                      {materialLotsQuery.isPending && (
                        <MaterialLotEmpty>원자재 LOT을 불러오는 중입니다.</MaterialLotEmpty>
                      )}
                      {!materialLotsQuery.isPending
                        && availableMaterialLots.length === 0 && (
                          <MaterialLotEmpty>
                            재고가 남은 원자재 LOT이 없습니다.
                          </MaterialLotEmpty>
                        )}
                      {availableMaterialLots.map((lot) => {
                        const selected = String(lot.materialLotId)
                          === String(selectedMaterialLot?.materialLotId);
                        return (
                          <MaterialLotOption
                            key={lot.materialLotId}
                            type="button"
                            role="option"
                            aria-selected={selected}
                            $selected={selected}
                            onClick={() => setSelectedMaterialLot(lot)}
                          >
                            <strong>{lot.materialLotNo}</strong>
                            <span>{lot.materialName} · {lot.materialCode}</span>
                            <small>
                              가용 {lot.currentQty}{lot.unit} · {lot.supplierName}
                            </small>
                          </MaterialLotOption>
                        );
                      })}
                      {materialLotsQuery.hasNextPage && (
                        <MaterialLotMore
                          type="button"
                          disabled={materialLotsQuery.isFetchingNextPage}
                          onClick={() => materialLotsQuery.fetchNextPage()}
                        >
                          {materialLotsQuery.isFetchingNextPage
                            ? "불러오는 중..."
                            : "원자재 LOT 더 보기"}
                        </MaterialLotMore>
                      )}
                    </MaterialLotOptions>
                  </MaterialLotSearchBox>
                </FormField>
                <FormField>
                  사용 수량
                  <input
                    name="usedQty"
                    type="number"
                    step="0.001"
                    min="0.001"
                    placeholder="0"
                    required
                  />
                </FormField>
                <Button
                  type="submit"
                  disabled={usageMutation.isPending || !selectedMaterialLot}
                >
                  {usageMutation.isPending ? "등록 중..." : "사용 자재 등록"}
                </Button>
              </UsageForm>
              {message && (
                <StatusMessage $error={usageMutation.isError} role="status">
                  {message}
                </StatusMessage>
              )}
            </FormCard>
          </UsageLayout>
        </DetailPanel>
      )}
    </>
  );
}
