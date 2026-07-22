export const WORK_ORDER_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  HOLD: 'HOLD',
  DONE: 'DONE',
};

export const WORK_ORDER_STATUS_META = {
  [WORK_ORDER_STATUS.PENDING]: { label: '대기', color: '#bccbb9' },
  [WORK_ORDER_STATUS.IN_PROGRESS]: { label: '진행중', color: '#4be277' },
  [WORK_ORDER_STATUS.HOLD]: { label: '보류', color: '#ffb95f' },
  [WORK_ORDER_STATUS.DONE]: { label: '완료', color: '#bccbb9' },
};

export const PROCESS_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  HOLD: 'HOLD',
  COMPLETED: 'COMPLETED',
};

export const PROCESS_STATUS_META = {
  [PROCESS_STATUS.PENDING]: { label: '대기', color: '#bccbb9' },
  [PROCESS_STATUS.IN_PROGRESS]: { label: '진행중', color: '#4be277' },
  [PROCESS_STATUS.HOLD]: { label: '보류', color: '#ffb95f' },
  [PROCESS_STATUS.COMPLETED]: { label: '완료', color: '#bccbb9' },
};

export const EQUIPMENT_STATUS_META = {
  RUNNING: { label: '가동중', color: '#4be277' },
  STOPPED: { label: '정지', color: '#bccbb9' },
  ERROR: { label: '이상', color: '#ffb4ab' },
};

export const HISTORY_EVENT_META = {
  REGISTERED: { label: '등록', color: '#bccbb9' },
  IN_PROGRESS: { label: '작업 시작', color: '#4be277' },
  RESUMED: { label: '작업 재개', color: '#4be277' },
  HOLD: { label: '보류 처리', color: '#ffb95f' },
  DONE: { label: '작업 완료', color: '#bccbb9' },
};

export const DUMMY_PRODUCTS = [
  { id: 'PRD-001', name: '얼큰 컵누들' },
  { id: 'PRD-002', name: '고소 크림누들' },
  { id: 'PRD-003', name: '매콤 볶음누들' },
  { id: 'PRD-004', name: '해물육수 컵면' },
  { id: 'PRD-005', name: '치즈불닭 컵면' },
];

export const DUMMY_SUPERVISORS = [
  { id: 'SV-001', name: '이도윤', dept: '생산관리팀', position: '지시자' },
  { id: 'SV-002', name: '한수빈', dept: '생산관리팀', position: '지시자' },
];

export const DUMMY_EQUIPMENTS = [
  { id: 'MIXER-01', name: '혼합기 1호', process: '혼합', status: 'RUNNING' },
  { id: 'ROLLER-01', name: '압연기 1호', process: '압연', status: 'RUNNING' },
  { id: 'NOODLE-01', name: '제면기 1호', process: '제면', status: 'RUNNING' },
  { id: 'STEAMER-01', name: '증숙기 1호', process: '증숙', status: 'RUNNING' },
  { id: 'CUTTER-01', name: '절단기 1호', process: '절단', status: 'RUNNING' },
  { id: 'FRYER-01', name: '유탕기 1호', process: '유탕', status: 'RUNNING' },
  { id: 'COOLER-01', name: '냉각기 1호', process: '냉각', status: 'RUNNING' },
  { id: 'PACKER-01', name: '포장기 1호', process: '포장', status: 'RUNNING' },
  { id: 'INSPECTOR-01', name: '검사기 1호', process: '검사', status: 'RUNNING' },
];

export const PROCESS_TEMPLATE = ['혼합', '압연', '제면', '증숙', '절단', '유탕', '냉각', '포장', '검사'];

const findEquipment = (processName) => DUMMY_EQUIPMENTS.find((equipment) => equipment.process === processName);

const buildProcesses = (statusPattern, qtyPattern) =>
  PROCESS_TEMPLATE.map((name, index) => {
    const equipment = findEquipment(name);
    return {
      id: `P${index + 1}`,
      name,
      status: statusPattern[index] ?? PROCESS_STATUS.PENDING,
      goodQty: qtyPattern[index]?.good ?? 0,
      defectQty: qtyPattern[index]?.defect ?? 0,
      equipmentName: equipment?.name ?? '-',
      equipmentStatus: equipment?.status ?? 'STOPPED',
    };
  });

const buildWaitingProcesses = () =>
  PROCESS_TEMPLATE.map((name, index) => ({
    id: `P${index + 1}`,
    name,
    status: PROCESS_STATUS.PENDING,
    goodQty: 0,
    defectQty: 0,
    equipmentName: findEquipment(name)?.name ?? '-',
    equipmentStatus: findEquipment(name)?.status ?? 'STOPPED',
  }));

const buildEquipmentList = (processNames) =>
  processNames.map((name) => findEquipment(name)).filter(Boolean).map((equipment) => ({ ...equipment }));

export const INITIAL_WORK_ORDERS = [
  {
    id: 'WO-001',
    code: 'WO-20260709-001',
    productName: '얼큰 컵누들',
    status: WORK_ORDER_STATUS.IN_PROGRESS,
    targetQty: 5000,
    currentQty: 3120,
    goodQty: 3040,
    defectQty: 80,
    startDate: '2026-07-09',
    regDate: '2026-07-05',
    supervisor: '이도윤',
    supervisorId: 'SV-001',
    startedAt: '2026-07-09 08:02',
    completedAt: null,
    remark: '주간조 정규 생산',
    processes: buildProcesses(
      Array(PROCESS_TEMPLATE.length).fill(PROCESS_STATUS.IN_PROGRESS),
      [{ good: 3120, defect: 40 }, { good: 3040, defect: 60 }, { good: 0, defect: 0 }, { good: 0, defect: 0 }]
    ),
    equipmentList: buildEquipmentList(PROCESS_TEMPLATE),
    statusHistory: [
      { id: 'H2', status: 'IN_PROGRESS', changedAt: '2026-07-09 08:02', changedBy: '김민준', note: '작업 시작' },
      { id: 'H1', status: 'REGISTERED', changedAt: '2026-07-05 14:20', changedBy: '정하늘', note: '작업지시 등록' },
    ],
  },
  {
    id: 'WO-002',
    code: 'WO-20260709-002',
    productName: '고소 크림누들',
    status: WORK_ORDER_STATUS.DONE,
    targetQty: 3000,
    currentQty: 900,
    goodQty: 860,
    defectQty: 40,
    startDate: '2026-07-09',
    regDate: '2026-07-06',
    supervisor: '한수빈',
    supervisorId: 'SV-002',
    startedAt: '2026-07-09 09:10',
    completedAt: '2026-07-09 12:05',
    remark: '설비 점검을 위해 목표 수량 전 조기 완료',
    processes: buildProcesses(
      Array(PROCESS_TEMPLATE.length).fill(PROCESS_STATUS.COMPLETED),
      [{ good: 900, defect: 20 }, { good: 880, defect: 10 }, { good: 860, defect: 10 }, { good: 0, defect: 0 }]
    ),
    equipmentList: buildEquipmentList(PROCESS_TEMPLATE),
    statusHistory: [
      { id: 'H4', status: 'DONE', changedAt: '2026-07-09 12:05', changedBy: '박도윤', note: '조기 완료' },
      { id: 'H3', status: 'HOLD', changedAt: '2026-07-09 11:45', changedBy: '박도윤', note: '건조기 2호 이상 알람으로 보류' },
      { id: 'H2', status: 'IN_PROGRESS', changedAt: '2026-07-09 09:10', changedBy: '박도윤', note: '작업 시작' },
      { id: 'H1', status: 'REGISTERED', changedAt: '2026-07-06 10:05', changedBy: '정하늘', note: '작업지시 등록' },
    ],
  },
  {
    id: 'WO-003',
    code: 'WO-20260708-005',
    productName: '매콤 볶음누들',
    status: WORK_ORDER_STATUS.DONE,
    targetQty: 4000,
    currentQty: 4000,
    goodQty: 3950,
    defectQty: 50,
    startDate: '2026-07-08',
    regDate: '2026-07-04',
    supervisor: '이도윤',
    supervisorId: 'SV-001',
    startedAt: '2026-07-08 08:00',
    completedAt: '2026-07-08 17:32',
    remark: '',
    processes: buildProcesses(
      Array(PROCESS_TEMPLATE.length).fill(PROCESS_STATUS.COMPLETED),
      [{ good: 4000, defect: 10 }, { good: 3990, defect: 15 }, { good: 3970, defect: 15 }, { good: 3950, defect: 10 }]
    ),
    equipmentList: buildEquipmentList(PROCESS_TEMPLATE),
    statusHistory: [
      { id: 'H3', status: 'DONE', changedAt: '2026-07-08 17:32', changedBy: '이서연', note: '전 공정 완료' },
      { id: 'H2', status: 'IN_PROGRESS', changedAt: '2026-07-08 08:00', changedBy: '이서연', note: '작업 시작' },
      { id: 'H1', status: 'REGISTERED', changedAt: '2026-07-04 09:15', changedBy: '정하늘', note: '작업지시 등록' },
    ],
  },
  {
    id: 'WO-004',
    code: 'WO-20260709-003',
    productName: '해물육수 컵면',
    status: WORK_ORDER_STATUS.DONE,
    targetQty: 2000,
    currentQty: 120,
    goodQty: 110,
    defectQty: 10,
    startDate: '2026-07-09',
    regDate: '2026-07-09',
    supervisor: '한수빈',
    supervisorId: 'SV-002',
    startedAt: '2026-07-09 13:20',
    completedAt: '2026-07-09 14:10',
    remark: '거래처 요청 건, 우선 진행',
    processes: buildProcesses(
      Array(PROCESS_TEMPLATE.length).fill(PROCESS_STATUS.COMPLETED),
      [{ good: 110, defect: 10 }, { good: 0, defect: 0 }, { good: 0, defect: 0 }, { good: 0, defect: 0 }]
    ),
    equipmentList: buildEquipmentList(PROCESS_TEMPLATE),
    statusHistory: [
      { id: 'H3', status: 'DONE', changedAt: '2026-07-09 14:10', changedBy: '최지우', note: '우선 생산 완료' },
      { id: 'H2', status: 'IN_PROGRESS', changedAt: '2026-07-09 13:20', changedBy: '최지우', note: '작업 시작' },
      { id: 'H1', status: 'REGISTERED', changedAt: '2026-07-09 13:00', changedBy: '정하늘', note: '작업지시 등록' },
    ],
  },
  {
    id: 'WO-005',
    code: 'WO-20260709-004',
    productName: '치즈불닭 컵면',
    status: WORK_ORDER_STATUS.DONE,
    targetQty: 6000,
    currentQty: 1180,
    goodQty: 1150,
    defectQty: 30,
    startDate: '2026-07-09',
    regDate: '2026-07-07',
    supervisor: '이도윤',
    supervisorId: 'SV-001',
    startedAt: '2026-07-09 08:30',
    completedAt: '2026-07-09 10:15',
    remark: '',
    processes: buildProcesses(
      Array(PROCESS_TEMPLATE.length).fill(PROCESS_STATUS.COMPLETED),
      [{ good: 1150, defect: 30 }, { good: 0, defect: 0 }, { good: 0, defect: 0 }, { good: 0, defect: 0 }]
    ),
    equipmentList: buildEquipmentList(PROCESS_TEMPLATE),
    statusHistory: [
      { id: 'H3', status: 'DONE', changedAt: '2026-07-09 10:15', changedBy: '한소율', note: '조기 완료' },
      { id: 'H2', status: 'IN_PROGRESS', changedAt: '2026-07-09 08:30', changedBy: '한소율', note: '작업 시작' },
      { id: 'H1', status: 'REGISTERED', changedAt: '2026-07-07 16:40', changedBy: '정하늘', note: '작업지시 등록' },
    ],
  },
  {
    id: 'WO-006',
    code: 'WO-20260710-001',
    productName: '얼큰 컵누들',
    status: WORK_ORDER_STATUS.PENDING,
    targetQty: 2500,
    currentQty: 0,
    goodQty: 0,
    defectQty: 0,
    startDate: '2026-07-10',
    regDate: '2026-07-08',
    supervisor: '한수빈',
    supervisorId: 'SV-002',
    startedAt: null,
    completedAt: null,
    remark: '원자재(스프) 입고 대기',
    processes: buildWaitingProcesses(),
    equipmentList: buildEquipmentList(PROCESS_TEMPLATE),
    statusHistory: [
      { id: 'H1', status: 'REGISTERED', changedAt: '2026-07-08 10:00', changedBy: '정하늘', note: '작업지시 등록' },
    ],
  },
];

const pad = (value) => String(value).padStart(2, '0');

const dateParts = (date) => ({
  date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
  dateKey: `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`,
  dateTime: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`,
});

export const nowString = () => dateParts(new Date()).dateTime;

const nextWorkOrderId = (workOrders) => {
  const maxId = workOrders.reduce((max, workOrder) => {
    const match = /^WO-(\d+)$/.exec(workOrder.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `WO-${String(maxId + 1).padStart(3, '0')}`;
};

const nextWorkOrderCode = (workOrders, dateKey) => {
  const prefix = `WO-${dateKey}-`;
  const maxSequence = workOrders.reduce((max, workOrder) => {
    if (!workOrder.code.startsWith(prefix)) return max;
    const sequence = Number(workOrder.code.slice(prefix.length));
    return Number.isNaN(sequence) ? max : Math.max(max, sequence);
  }, 0);
  return `${prefix}${String(maxSequence + 1).padStart(3, '0')}`;
};

export const createWaitingWorkOrder = (values, workOrders) => {
  const product = DUMMY_PRODUCTS.find((item) => item.id === values.productId);
  const now = new Date();
  const { date, dateKey, dateTime } = dateParts(now);

  return {
    id: nextWorkOrderId(workOrders),
    code: nextWorkOrderCode(workOrders, dateKey),
    productName: product?.name ?? '미지정 제품',
    status: WORK_ORDER_STATUS.PENDING,
    targetQty: Number(values.targetQty),
    currentQty: 0,
    goodQty: 0,
    defectQty: 0,
    startDate: values.startDate,
    regDate: date,
    supervisor: values.supervisorName,
    supervisorId: values.supervisorId,
    startedAt: null,
    completedAt: null,
    remark: values.remark ?? '',
    processes: buildWaitingProcesses(),
    equipmentList: buildEquipmentList(PROCESS_TEMPLATE),
    statusHistory: [
      { id: 'H1', status: 'REGISTERED', changedAt: dateTime, changedBy: values.supervisorName, note: '작업지시 등록' },
    ],
  };
};
