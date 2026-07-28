import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { referenceApi, usersApi, workOrderApi } from "../../api/services";
import WorkOrderList from "./WorkOrderList";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock("../../api/services", () => ({
  referenceApi: {
    products: jest.fn(),
  },
  usersApi: {
    list: jest.fn(),
  },
  workOrderApi: {
    create: jest.fn(),
    list: jest.fn(),
    summary: jest.fn(),
  },
}));

const page = (content) => ({
  content,
  last: true,
  number: 0,
  size: 20,
  totalElements: content.length,
  totalPages: 1,
});

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <WorkOrderList />
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  workOrderApi.list.mockResolvedValue(page([
    {
      workOrderId: 1,
      workOrderNo: "WO-001",
      productName: "기존 제품",
      status: "PENDING",
      statusLabel: "대기",
      targetQty: 100,
      currentQty: 0,
      hourlyTargetQty: 10,
      supervisorName: "관리자",
      plannedStartDate: "2026-07-28",
    },
  ]));
  workOrderApi.summary.mockResolvedValue({
    doneCount: 0,
    pendingCount: 1,
    totalCount: 1,
  });
  usersApi.list.mockResolvedValue(page([]));
  referenceApi.products.mockImplementation(({ keyword }) => (
    Promise.resolve(page(keyword
      ? [{
        productId: 22,
        productCode: "GEAR-01",
        productName: "기어 제품",
      }]
      : [{
        productId: 11,
        productCode: "BASE-01",
        productName: "기본 제품",
      }]))
  ));
});

test("제품을 서버에서 검색하고 검색 결과를 선택한다", async () => {
  renderPage();

  fireEvent.click(screen.getByRole("button", { name: "작업지시 등록" }));
  fireEvent.click(screen.getByRole("button", { name: "제품 선택" }));

  expect(await screen.findByRole("option", { name: /기본 제품/ })).toBeInTheDocument();

  fireEvent.change(screen.getByRole("searchbox", { name: "작업지시 제품 검색" }), {
    target: { value: "gear" },
  });

  await waitFor(() => {
    expect(referenceApi.products).toHaveBeenCalledWith({
      keyword: "gear",
      page: 0,
      size: 20,
      status: "ACTIVE",
    });
  });

  fireEvent.click(await screen.findByRole("option", { name: /기어 제품/ }));

  expect(screen.getByRole("button", { name: "GEAR-01 · 기어 제품" })).toBeInTheDocument();
  expect(document.querySelector('input[name="productId"]')).toHaveValue("22");
});
