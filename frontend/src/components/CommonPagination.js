import {
  PageButton,
  PaginationControls,
  PaginationMeta,
  PaginationRoot,
} from './CommonPaginationCss';

const MAX_VISIBLE_PAGES = 5;

function CommonPagination({
  ariaLabel = '페이지 이동',
  currentPage,
  onPageChange,
  pageSize,
  totalItems,
  totalPages,
}) {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);
  const startItem = totalItems > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);
  const visiblePageCount = Math.min(MAX_VISIBLE_PAGES, safeTotalPages);
  const maxStartPage = safeTotalPages - visiblePageCount + 1;
  const startPage = Math.min(
    Math.max(safeCurrentPage - Math.floor(visiblePageCount / 2), 1),
    maxStartPage,
  );
  const visiblePages = Array.from(
    { length: visiblePageCount },
    (_, index) => startPage + index,
  );

  const moveToPage = (nextPage) => {
    onPageChange(Math.min(Math.max(nextPage, 1), safeTotalPages));
  };

  return (
    <PaginationRoot aria-label={ariaLabel}>
      <PaginationMeta>{startItem}-{endItem} / {totalItems}</PaginationMeta>
      <PaginationControls>
        <PageButton
          type="button"
          disabled={safeCurrentPage === 1}
          onClick={() => moveToPage(safeCurrentPage - 1)}
        >
          이전
        </PageButton>
        {visiblePages.map((page) => (
          <PageButton
            key={page}
            type="button"
            $active={page === safeCurrentPage}
            aria-current={page === safeCurrentPage ? 'page' : undefined}
            aria-label={`${page}페이지`}
            onClick={() => moveToPage(page)}
          >
            {page}
          </PageButton>
        ))}
        <PageButton
          type="button"
          disabled={safeCurrentPage === safeTotalPages}
          onClick={() => moveToPage(safeCurrentPage + 1)}
        >
          다음
        </PageButton>
      </PaginationControls>
    </PaginationRoot>
  );
}

export default CommonPagination;
