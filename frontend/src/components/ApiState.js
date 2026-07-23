import { extractApiError } from "../api/client";

export function ApiError({ error, prefix = "" }) {
  if (!error) {
    return null;
  }
  return (
    <p role="alert" style={{ color: "#dc2626", margin: "12px 0" }}>
      {prefix}
      {extractApiError(error)}
    </p>
  );
}

export function EmptyState({ children = "조회된 데이터가 없습니다." }) {
  return (
    <p style={{ color: "#64748b", padding: "24px 0", textAlign: "center" }}>
      {children}
    </p>
  );
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
