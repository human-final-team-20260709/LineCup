import { apiClient, unwrap } from "./client";

const get = (url, params) => unwrap(apiClient.get(url, { params }));
const post = (url, body) => unwrap(apiClient.post(url, body));
const put = (url, body) => unwrap(apiClient.put(url, body));
const patch = (url, body) => unwrap(apiClient.patch(url, body));
const remove = (url) => unwrap(apiClient.delete(url));

export const authApi = {
  login: (body) => post("/auth/login", body),
  signup: (body) => post("/auth/signup", body),
  findEmployeeNumber: (body) => post("/auth/find-employee-number", body),
  verifyPasswordReset: (body) => post("/auth/password-reset/verify", body),
  resetPassword: (body) => patch("/auth/password-reset", body),
};

export const usersApi = {
  list: (params) => get("/users", params),
  summary: () => get("/users/summary"),
  pending: (params) => get("/users/pending-approvals", params),
  detail: (id) => get(`/users/${id}`),
  role: (id, body) => patch(`/users/${id}/role`, body),
  activation: (id, body) => patch(`/users/${id}/activation`, body),
  approval: (id, body) => patch(`/users/${id}/approval`, body),
  remove: (id) => remove(`/users/${id}`),
};

export const workerApi = {
  list: (params) => get("/worker-profiles", params),
  detail: (id) => get(`/worker-profiles/${id}`),
  byUser: (id) => get(`/worker-profiles/by-user/${id}`),
  create: (body) => post("/worker-profiles", body),
  update: (id, body) => put(`/worker-profiles/${id}`, body),
  addSkill: (id, body) => post(`/worker-profiles/${id}/skills`, body),
  removeSkill: (id, skill) =>
    remove(`/worker-profiles/${id}/skills/${encodeURIComponent(skill)}`),
  remove: (id) => remove(`/worker-profiles/${id}`),
};

export const referenceApi = {
  products: (params) => get("/products", params),
  rawMaterials: (params) => get("/raw-materials", params),
  processes: () => get("/manufacturing-processes"),
  equipments: (params) => get("/equipments", params),
};

export const workOrderApi = {
  list: (params) => get("/work-orders", params),
  detail: (id) => get(`/work-orders/${id}`),
  active: () => get("/work-orders/active"),
  summary: () => get("/work-orders/dashboard-summary"),
  create: (body) => post("/work-orders", body),
  status: (id, body) => patch(`/work-orders/${id}/status`, body),
  targets: (id, body) => patch(`/work-orders/${id}/target-quantities`, body),
  supervisor: (id, body) => patch(`/work-orders/${id}/supervisor`, body),
  workers: (id, body) => put(`/work-orders/${id}/workers`, body),
};

export const productionApi = {
  results: (params) => get("/production-results", params),
  recent: (params) => get("/production-results/recent", params),
  summary: (params) => get("/production-results/summary", params),
  byProduct: (params) => get("/production-results/by-product", params),
  byWorkOrder: (params) => get("/production-results/by-work-order", params),
  hourly: (params) => get("/hourly-productions", params),
};

export const alarmApi = {
  list: (params) => get("/alarms", params),
  current: (params) => get("/alarms/current", params),
  detail: (id) => get(`/alarms/${id}`),
  byNumber: (number) => get(`/alarms/number/${encodeURIComponent(number)}`),
  statistics: (params) => get("/alarms/statistics", params),
  handle: (id, body) => patch(`/alarms/${id}/handling`, body),
};

export const defectApi = {
  list: (params) => get("/quality/defects", params),
  dashboard: () => get("/quality/defects/dashboard"),
  detail: (id) => get(`/quality/defects/${id}`),
  byNumber: (number) => get(`/quality/defects/number/${encodeURIComponent(number)}`),
  statistics: (params) => get("/quality/defects/statistics", params),
  types: () => get("/quality/defect-types"),
  create: (body) => post("/quality/defects", body),
  cause: (id, body) => patch(`/quality/defects/${id}/cause`, body),
  handle: (id, body) => patch(`/quality/defects/${id}/handling`, body),
};

export const communicationApi = {
  l1: () => get("/l1-devices"),
  l2: () => get("/l2-collectors"),
  logs: (params) => get("/communication-logs", params),
};

export const materialApi = {
  boms: (params) => get("/boms", params),
  bom: (id) => get(`/boms/${id}`),
  createBom: (body) => post("/boms", body),
  updateBom: (id, body) => put(`/boms/${id}`, body),
  removeBom: (id) => remove(`/boms/${id}`),
  productionLots: (params) => get("/production-lots", params),
  productionLot: (id) => get(`/production-lots/${id}`),
  addUsage: (id, body) => post(`/production-lots/${id}/materials`, body),
  rawMaterialLots: (params) => get("/raw-material-lots", params),
  rawMaterialLot: (id) => get(`/raw-material-lots/${id}`),
  productInventories: (params) => get("/product-inventories", params),
  inventoryMovements: (params) => get("/inventory-movements", params),
  recentMovements: (params) => get("/inventory-movements/recent", params),
  createMovement: (body) => post("/inventory-movements", body),
};
