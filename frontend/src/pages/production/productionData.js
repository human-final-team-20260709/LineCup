export const PRODUCTION_STATUS = {
  IN_PROGRESS: '집계 중',
  COMPLETED: '집계 완료',
  CANCELED: '취소',
};

export const statusTone = {
  [PRODUCTION_STATUS.COMPLETED]: 'success',
  [PRODUCTION_STATUS.IN_PROGRESS]: 'warning',
  [PRODUCTION_STATUS.CANCELED]: 'neutral',
};

export const PRODUCTION_BASE_DATE = '2026-07-15';

export const productionRecords = [
  {
    occurredAt: '2026-07-15 17:05',
    id: 'PR-20260715-012',
    workOrder: 'WO-20260715-012',
    lot: 'LOT-260715-D02',
    product: '얼큰 컵누들',
    process: '포장',
    targetQty: 1300,
    productionQty: 620,
    goodQty: 612,
    defectQty: 8,
    achievementRate: 47.7,
    status: PRODUCTION_STATUS.IN_PROGRESS,
  },
  {
    occurredAt: '2026-07-15 16:10',
    id: 'PR-20260715-011',
    workOrder: 'WO-20260715-011',
    lot: 'LOT-260715-D01',
    product: '치즈불닭 컵면',
    process: '포장',
    targetQty: 1300,
    productionQty: 1020,
    goodQty: 1004,
    defectQty: 16,
    achievementRate: 78.5,
    status: PRODUCTION_STATUS.IN_PROGRESS,
  },
  {
    occurredAt: '2026-07-15 15:35',
    id: 'PR-20260715-010',
    workOrder: 'WO-20260715-010',
    lot: 'LOT-260715-C04',
    product: '고소 크림누들',
    process: '건조',
    targetQty: 950,
    productionQty: 420,
    goodQty: 410,
    defectQty: 10,
    achievementRate: 44.2,
    status: PRODUCTION_STATUS.CANCELED,
  },
  {
    occurredAt: '2026-07-15 14:50',
    id: 'PR-20260715-009',
    workOrder: 'WO-20260715-009',
    lot: 'LOT-260715-C03',
    product: '고소 크림누들',
    process: '증숙',
    targetQty: 950,
    productionQty: 940,
    goodQty: 925,
    defectQty: 15,
    achievementRate: 98.9,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-15 14:05',
    id: 'PR-20260715-008',
    workOrder: 'WO-20260715-008',
    lot: 'LOT-260715-C02',
    product: '매콤 볶음누들',
    process: '포장',
    targetQty: 1200,
    productionQty: 1195,
    goodQty: 1170,
    defectQty: 25,
    achievementRate: 99.6,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-15 13:10',
    id: 'PR-20260715-007',
    workOrder: 'WO-20260715-007',
    lot: 'LOT-260715-C01',
    product: '치즈불닭 컵면',
    process: '건조',
    targetQty: 1200,
    productionQty: 1180,
    goodQty: 1152,
    defectQty: 28,
    achievementRate: 98.3,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-15 11:50',
    id: 'PR-20260715-006',
    workOrder: 'WO-20260715-006',
    lot: 'LOT-260715-B02',
    product: '해물육수 컵면',
    process: '포장',
    targetQty: 1000,
    productionQty: 1000,
    goodQty: 982,
    defectQty: 18,
    achievementRate: 100,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-15 11:05',
    id: 'PR-20260715-005',
    workOrder: 'WO-20260715-005',
    lot: 'LOT-260715-B01',
    product: '얼큰 컵누들',
    process: '건조',
    targetQty: 1000,
    productionQty: 990,
    goodQty: 974,
    defectQty: 16,
    achievementRate: 99,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-15 10:15',
    id: 'PR-20260715-004',
    workOrder: 'WO-20260715-004',
    lot: 'LOT-260715-A04',
    product: '매콤 볶음누들',
    process: '증숙',
    targetQty: 1100,
    productionQty: 1090,
    goodQty: 1073,
    defectQty: 17,
    achievementRate: 99.1,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-15 09:35',
    id: 'PR-20260715-003',
    workOrder: 'WO-20260715-003',
    lot: 'LOT-260715-A03',
    product: '해물육수 컵면',
    process: '원료 혼합',
    targetQty: 1100,
    productionQty: 1080,
    goodQty: 1060,
    defectQty: 20,
    achievementRate: 98.2,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-15 08:55',
    id: 'PR-20260715-002',
    workOrder: 'WO-20260715-002',
    lot: 'LOT-260715-A02',
    product: '얼큰 컵누들',
    process: '증숙',
    targetQty: 900,
    productionQty: 900,
    goodQty: 886,
    defectQty: 14,
    achievementRate: 100,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-15 08:20',
    id: 'PR-20260715-001',
    workOrder: 'WO-20260715-001',
    lot: 'LOT-260715-A01',
    product: '고소 크림누들',
    process: '원료 혼합',
    targetQty: 900,
    productionQty: 890,
    goodQty: 875,
    defectQty: 15,
    achievementRate: 98.9,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-14 17:10',
    id: 'PR-20260714-002',
    workOrder: 'WO-20260714-002',
    lot: 'LOT-260714-B02',
    product: '치즈불닭 컵면',
    process: '포장',
    targetQty: 1200,
    productionQty: 1200,
    goodQty: 1178,
    defectQty: 22,
    achievementRate: 100,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-14 15:30',
    id: 'PR-20260714-001',
    workOrder: 'WO-20260714-001',
    lot: 'LOT-260714-B01',
    product: '해물육수 컵면',
    process: '포장',
    targetQty: 1000,
    productionQty: 980,
    goodQty: 963,
    defectQty: 17,
    achievementRate: 98,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-13 16:40',
    id: 'PR-20260713-002',
    workOrder: 'WO-20260713-002',
    lot: 'LOT-260713-B02',
    product: '매콤 볶음누들',
    process: '건조',
    targetQty: 1100,
    productionQty: 1095,
    goodQty: 1078,
    defectQty: 17,
    achievementRate: 99.5,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-13 14:15',
    id: 'PR-20260713-001',
    workOrder: 'WO-20260713-001',
    lot: 'LOT-260713-B01',
    product: '고소 크림누들',
    process: '증숙',
    targetQty: 950,
    productionQty: 940,
    goodQty: 922,
    defectQty: 18,
    achievementRate: 98.9,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-12 17:20',
    id: 'PR-20260712-002',
    workOrder: 'WO-20260712-002',
    lot: 'LOT-260712-B02',
    product: '얼큰 컵누들',
    process: '포장',
    targetQty: 1300,
    productionQty: 1290,
    goodQty: 1260,
    defectQty: 30,
    achievementRate: 99.2,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-12 13:45',
    id: 'PR-20260712-001',
    workOrder: 'WO-20260712-001',
    lot: 'LOT-260712-B01',
    product: '해물육수 컵면',
    process: '건조',
    targetQty: 1000,
    productionQty: 995,
    goodQty: 979,
    defectQty: 16,
    achievementRate: 99.5,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-11 16:55',
    id: 'PR-20260711-002',
    workOrder: 'WO-20260711-002',
    lot: 'LOT-260711-B02',
    product: '치즈불닭 컵면',
    process: '포장',
    targetQty: 1200,
    productionQty: 1185,
    goodQty: 1161,
    defectQty: 24,
    achievementRate: 98.8,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-11 11:30',
    id: 'PR-20260711-001',
    workOrder: 'WO-20260711-001',
    lot: 'LOT-260711-B01',
    product: '고소 크림누들',
    process: '원료 혼합',
    targetQty: 900,
    productionQty: 900,
    goodQty: 887,
    defectQty: 13,
    achievementRate: 100,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-10 15:25',
    id: 'PR-20260710-002',
    workOrder: 'WO-20260710-002',
    lot: 'LOT-260710-B02',
    product: '매콤 볶음누들',
    process: '건조',
    targetQty: 1050,
    productionQty: 1040,
    goodQty: 1021,
    defectQty: 19,
    achievementRate: 99,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-10 10:40',
    id: 'PR-20260710-001',
    workOrder: 'WO-20260710-001',
    lot: 'LOT-260710-B01',
    product: '얼큰 컵누들',
    process: '증숙',
    targetQty: 1000,
    productionQty: 985,
    goodQty: 968,
    defectQty: 17,
    achievementRate: 98.5,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-09 14:50',
    id: 'PR-20260709-002',
    workOrder: 'WO-20260709-002',
    lot: 'LOT-260709-B02',
    product: '해물육수 컵면',
    process: '건조',
    targetQty: 900,
    productionQty: 890,
    goodQty: 874,
    defectQty: 16,
    achievementRate: 98.9,
    status: PRODUCTION_STATUS.COMPLETED,
  },
  {
    occurredAt: '2026-07-09 09:20',
    id: 'PR-20260709-001',
    workOrder: 'WO-20260709-001',
    lot: 'LOT-260709-B01',
    product: '치즈불닭 컵면',
    process: '원료 혼합',
    targetQty: 1100,
    productionQty: 1080,
    goodQty: 1056,
    defectQty: 24,
    achievementRate: 98.2,
    status: PRODUCTION_STATUS.COMPLETED,
  },
];

export const formatNumber = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toLocaleString('ko-KR') : '0';
};

export const calculateAchievementRate = (production, target) =>
  target > 0 ? Number(((production / target) * 100).toFixed(1)) : 0;

export const isActiveProductionRecord = (record) => record.status !== PRODUCTION_STATUS.CANCELED;

const sum = (records, field) => records.reduce((total, record) => total + Number(record[field] ?? 0), 0);

export const getRecordsByDate = (date, records = productionRecords) =>
  records.filter((record) => record.occurredAt.startsWith(date));

export const getProductionSummary = (records = productionRecords, date = PRODUCTION_BASE_DATE) => {
  const dayRecords = getRecordsByDate(date, records);
  const activeRecords = dayRecords.filter(isActiveProductionRecord);
  const completedRecords = activeRecords.filter((record) => record.status === PRODUCTION_STATUS.COMPLETED);
  const inProgressRecords = activeRecords.filter((record) => record.status === PRODUCTION_STATUS.IN_PROGRESS);
  const targetQty = sum(activeRecords, 'targetQty');
  const productionQty = sum(activeRecords, 'productionQty');
  const completedProductionQty = sum(completedRecords, 'productionQty');
  const goodQty = sum(activeRecords, 'goodQty');
  const defectQty = sum(activeRecords, 'defectQty');

  return {
    date,
    targetQty,
    productionQty,
    completedProductionQty,
    goodQty,
    defectQty,
    achievementRate: calculateAchievementRate(productionQty, targetQty),
    inProgressOrderCount: new Set(inProgressRecords.map((record) => record.workOrder)).size,
    completedCount: completedRecords.length,
    canceledCount: dayRecords.length - activeRecords.length,
  };
};

export const aggregateProductionBy = (field, records = productionRecords) => {
  const grouped = records.filter(isActiveProductionRecord).reduce((result, record) => {
    const key = record[field];
    if (!result[key]) {
      result[key] = { name: key, target: 0, production: 0, good: 0, defect: 0 };
    }

    result[key].target += record.targetQty;
    result[key].production += record.productionQty;
    result[key].good += record.goodQty;
    result[key].defect += record.defectQty;
    return result;
  }, {});

  return Object.values(grouped).map((item) => ({
    ...item,
    achievementRate: calculateAchievementRate(item.production, item.target),
  }));
};

export const buildHourlyProduction = (records = productionRecords, date = PRODUCTION_BASE_DATE) => {
  const dayRecords = getRecordsByDate(date, records).filter(isActiveProductionRecord);

  return Array.from({ length: 10 }, (_, index) => {
    const hour = String(index + 8).padStart(2, '0');
    const hourRecords = dayRecords.filter((record) => record.occurredAt.slice(11, 13) === hour);
    return {
      time: `${hour}:00`,
      target: sum(hourRecords, 'targetQty'),
      production: sum(hourRecords, 'productionQty'),
      good: sum(hourRecords, 'goodQty'),
      defect: sum(hourRecords, 'defectQty'),
    };
  });
};

export const buildDailyProduction = (records = productionRecords) => {
  const dates = [...new Set(records.map((record) => record.occurredAt.slice(0, 10)))].sort();

  return dates.map((date) => {
    const dayRecords = getRecordsByDate(date, records).filter(isActiveProductionRecord);
    return {
      date,
      label: date.slice(5).replace('-', '.'),
      target: sum(dayRecords, 'targetQty'),
      production: sum(dayRecords, 'productionQty'),
      good: sum(dayRecords, 'goodQty'),
      defect: sum(dayRecords, 'defectQty'),
    };
  });
};

export const todayProductionSummary = getProductionSummary();
export const hourlyProduction = buildHourlyProduction();
export const dailyProduction = buildDailyProduction();

export const processProduction = aggregateProductionBy('process').sort(
  (left, right) => right.production - left.production
);
export const productProduction = aggregateProductionBy('product').sort(
  (left, right) => right.production - left.production
);
export const workOrderAchievement = aggregateProductionBy('workOrder').sort(
  (left, right) => right.achievementRate - left.achievementRate
);
export const recentProductionRecords = productionRecords.filter(isActiveProductionRecord).slice(0, 6);
