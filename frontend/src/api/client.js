import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const extractApiError = (error, fallback = "요청을 처리하지 못했습니다.") => {
  const problem = error?.response?.data;
  if (problem?.errors && typeof problem.errors === "object") {
    const fieldMessage = Object.values(problem.errors).find(Boolean);
    if (fieldMessage) {
      return fieldMessage;
    }
  }
  return problem?.detail || problem?.message || error?.message || fallback;
};

export const shouldRetry = (failureCount, error) => {
  if (failureCount >= 1) {
    return false;
  }
  const status = error?.response?.status;
  return status == null || status >= 500;
};

export const unwrap = (request) => request.then((response) => response.data ?? null);
