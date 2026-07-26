import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  FiFilter,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import { defectApi } from "../../api/services";
import { POLLING, queryKeys } from "../../api/config";
import { QueryStatus } from "../../components/ApiState";
import CommonPagination from "../../components/CommonPagination";
import { pageContent } from "../../components/OperationalUi";
import DefectDataTable from "./DefectDataTable";
import {
  Button,
  CardHeader,
  Count,
  Eyebrow,
  FilterPanel,
  Mono,
  Page,
  PageHeader,
  PanelLabel,
  SearchField,
  SelectField,
  StatusChip,
  Table,
  TableCard,
  TableWrap,
  TitleGroup,
} from "./DefectListPageCss";

const PAGE_SIZE = 20;
const tableComponents = {
  Mono,
  StatusChip,
  Table,
  TableWrap,
};

export default function DefectListPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setKeyword(draft.trim());
      setPage(0);
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [draft]);

  const params = {
    keyword: keyword || undefined,
    status: status || undefined,
    page,
    size: PAGE_SIZE,
  };
  const query = useQuery({
    queryKey: queryKeys.defects(params),
    queryFn: () => defectApi.list(params),
    refetchInterval: POLLING.DEFECT,
    placeholderData: (previous) => previous,
  });
  const rows = pageContent(query.data);
  const totalItems = Array.isArray(query.data)
    ? rows.length
    : query.data?.totalElements || 0;
  const totalPages = Array.isArray(query.data)
    ? 1
    : query.data?.totalPages || 0;

  useEffect(() => {
    if (totalPages > 0 && page >= totalPages) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  return (
    <Page>
      <PageHeader>
        <TitleGroup>
          <Eyebrow>Defect Registry</Eyebrow>
          <h1>불량 목록</h1>
          <p>
            발생 일시부터 처리 상태까지 전체 불량 이력을 조회하고 상세
            조치 화면으로 이동합니다.
          </p>
        </TitleGroup>
        <Button
          type="button"
          $primary
          onClick={() => navigate("/quality/defects/new")}
        >
          <FiPlus aria-hidden="true" />
          불량 등록
        </Button>
      </PageHeader>

      <FilterPanel aria-label="불량 목록 검색 조건">
        <SearchField>
          <FiSearch aria-hidden="true" />
          <input
            type="search"
            aria-label="불량 목록 검색"
            placeholder="제품, 작업지시 번호, 생산 LOT 번호 검색"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </SearchField>
        <SelectField>
          <FiFilter aria-hidden="true" />
          <select
            aria-label="처리 상태 필터"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(0);
            }}
          >
            <option value="">전체 처리 상태</option>
            <option value="UNHANDLED">미처리</option>
            <option value="IN_PROGRESS">처리 중</option>
            <option value="ON_HOLD">보류</option>
            <option value="COMPLETED">처리 완료</option>
          </select>
        </SelectField>
      </FilterPanel>

      <TableCard aria-busy={query.isFetching}>
        <CardHeader>
          <div>
            <PanelLabel>Defect Table</PanelLabel>
            <h2>전체 불량 이력</h2>
          </div>
          <Count aria-live="polite">
            {query.isFetching ? "갱신 중 · " : ""}
            총 {totalItems.toLocaleString("ko-KR")}건
          </Count>
        </CardHeader>

        <QueryStatus query={query} empty={rows.length === 0} />

        {rows.length > 0 && (
          <>
            <DefectDataTable
              components={tableComponents}
              defects={rows}
            />
            <CommonPagination
              ariaLabel="불량 목록 페이지 이동"
              currentPage={page + 1}
              onPageChange={(nextPage) => setPage(nextPage - 1)}
              pageSize={PAGE_SIZE}
              totalItems={totalItems}
              totalPages={totalPages}
            />
          </>
        )}
      </TableCard>
    </Page>
  );
}
