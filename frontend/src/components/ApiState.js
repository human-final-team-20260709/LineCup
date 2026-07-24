import { extractApiError } from "../api/client";
import styled from "styled-components";

const ErrorMessage = styled.p`
  margin: 12px 0;
  padding: 11px 12px;
  border: 1px solid rgba(255, 180, 171, 0.34);
  border-radius: 4px;
  background: rgba(147, 0, 10, 0.16);
  color: var(--color-danger);
  font-size: 13px;
  line-height: 20px;
`;

const EmptyMessage = styled.p`
  margin: 0;
  padding: 28px 16px;
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 22px;
  text-align: center;
`;

export function ApiError({ error, prefix = "" }) {
  if (!error) {
    return null;
  }
  return (
    <ErrorMessage role="alert">
      {prefix}
      {extractApiError(error)}
    </ErrorMessage>
  );
}

export function EmptyState({ children = "조회된 데이터가 없습니다." }) {
  return <EmptyMessage>{children}</EmptyMessage>;
}

export function QueryStatus({ query, empty }) {
  if (query.isPending && !query.data) {
    return <EmptyState>데이터를 불러오는 중입니다.</EmptyState>;
  }
  if (query.isError && !query.data) {
    return <ApiError error={query.error} />;
  }
  if (empty) {
    return <EmptyState />;
  }
  return query.isError ? <ApiError error={query.error} prefix="최근 갱신 실패: " /> : null;
}

export function ApiErrors({ queries = [] }) {
  const errors = queries.filter((query) => query?.isError).map((query) => query.error);
  if (!errors.length) {
    return null;
  }
  return (
    <>
      {errors.map((error, index) => (
        <ApiError key={`${extractApiError(error)}-${index}`} error={error} prefix="갱신 실패: " />
      ))}
    </>
  );
}
