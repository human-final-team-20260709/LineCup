# MES 프론트엔드 API 계약

이 문서는 React 프론트엔드와 Spring Boot 백엔드 사이의 연동 기준이다. C의 L2 연동 계약은 `backend/README.md`를 따르며, 프론트엔드는 `/api/l2/*`를 호출하지 않는다.

## 1. 공통 규칙

- 개발 Base URL: CRA proxy를 거친 `/api` (`http://localhost:8080`)
- 운영 Base URL: `REACT_APP_API_BASE_URL` 환경 변수 또는 `/api`
- 요청·응답 Content-Type: `application/json`
- 저장·요청 시각: UTC ISO-8601 `Instant` (예: `2026-07-23T01:30:00Z`)
- 화면 표시 및 일별 통계 경계: `Asia/Seoul`
- `*Id`: 숫자 PK, `*No`/`*Code`: 화면에 표시하는 업무 번호·코드
- 목록 응답: Spring `Page`의 `content`, `number`, `size`, `totalElements`, `totalPages`
- `204 No Content`: 정상적인 빈 단일 조회이며 오류로 처리하지 않는다.

오류는 RFC 9457 `ProblemDetail`을 사용한다.

```json
{
  "status": 400,
  "title": "요청 값 검증 실패",
  "detail": "요청 값이 올바르지 않습니다.",
  "errors": {
    "empNo": "사원 번호는 필수입니다."
  }
}
```

프론트는 `detail`을 기본 오류 문구로 사용하고, `errors`가 있으면 필드별 오류에 연결한다. 네트워크 오류와 5xx만 한 번 재시도하며 4xx는 재시도하지 않는다.

Page 응답 예시:

```json
{
  "content": [{ "workOrderId": 12, "workOrderNo": "WO-20260723-001" }],
  "number": 0,
  "size": 20,
  "totalElements": 1,
  "totalPages": 1
}
```

## 2. Enum

| 구분 | 코드 | 한글 라벨 |
|---|---|---|
| 작업지시 | `PENDING`, `IN_PROGRESS`, `HOLD`, `DONE` | 대기, 진행 중, 보류, 완료 |
| 작업지시 액션 | `REGISTERED`, `START`, `HOLD`, `RESUME`, `COMPLETE` | 등록, 시작, 보류, 재개, 완료 |
| 알람 심각도 | `INFO`, `WARNING`, `CRITICAL` | 정보, 경고, 심각 |
| 알람 상태 | `PENDING_CONFIRMATION`, `IN_PROGRESS`, `INSPECTION_RESERVED`, `MONITORING`, `RESOLVED` | 확인 대기, 처리 중, 점검 예정, 모니터링, 처리 완료 |
| 불량 상태 | `UNHANDLED`, `IN_PROGRESS`, `ON_HOLD`, `COMPLETED` | 미처리, 처리 중, 보류, 처리 완료 |
| 불량 처리 | `NORMAL_APPROVAL`, `REWORK`, `DISPOSAL` | 정상 승인, 재작업, 폐기 |
| 사용자 역할 | `admin`, `supervisor`, `operator` | 관리자, 지시자, 작업자 |
| 가입 승인 | `PENDING`, `APPROVED`, `REJECTED` | 승인 대기, 승인, 반려 |
| 품목 유형 | `RAW_MATERIAL`, `FINISHED_PRODUCT` | 원자재, 완제품 |
| 재고 이동 | `INBOUND`, `OUTBOUND`, `ADJUSTMENT` | 입고, 출고, 조정 |

## 3. Polling 기준

| 데이터 | GET API | 주기 |
|---|---|---:|
| L1/L2/통신 로그 | `/l1-devices`, `/l2-collectors`, `/communication-logs` | 5초 |
| 작업지시 목록·상세·활성 | `/work-orders`, `/work-orders/{id}`, `/work-orders/active` | 5초 |
| 생산 실적·분석 | `/production-results/*`, `/hourly-productions` | 현재 포함 기간 60초 |
| 현재 알람·상세 | `/alarms/current`, `/alarms/{id}` | 5초, 해결 상세는 중지 |
| 알람 이력·통계 | `/alarms`, `/alarms/statistics` | 30초 / 60초 |
| 불량 목록·상세 | `/quality/defects`, `/quality/defects/{id}` | 5초 |
| 불량 통계 | `/quality/defects/statistics` | 현재 포함 기간 60초 |
| 생산 LOT | `/production-lots` | 30초 |
| 재고·이동 | `/raw-material-lots`, `/product-inventories`, `/inventory-movements` | 30초 |
| 기준정보·설정·계정 | 각 CRUD API | polling 없음 |

브라우저 탭이 비활성일 때 polling하지 않으며, 포커스 복귀 시 다시 조회한다. 필터·페이지·기간은 query key에 포함한다.

## 4. 계정과 사용자

| Method | Path | 용도 |
|---|---|---|
| POST | `/auth/login` | 로그인 `{empNo,password}` → `{user}` |
| POST | `/auth/signup` | 가입 |
| POST | `/auth/find-employee-number` | 사원 번호 찾기 |
| POST | `/auth/password-reset/verify` | 비밀번호 재설정 본인 확인 |
| POST | `/auth/password-reset` | 비밀번호 변경 |
| GET | `/users` | 사용자 검색·Page |
| GET | `/users/summary` | 역할별 요약 |
| GET | `/users/pending-approvals` | 가입 승인 대기 |
| PATCH | `/users/{id}/role` | 역할 변경 |
| PATCH | `/users/{id}/activation` | 활성 상태 변경 |
| PATCH | `/users/{id}/approval` | 가입 승인·반려 |
| DELETE | `/users/{id}` | 사용자 삭제 |
| GET/POST/PATCH/DELETE | `/worker-profiles/**` | 작업자 프로필·기술 관리 |

로그인 응답의 `user`만 `sessionStorage`에 저장한다. 비밀번호는 저장하지 않는다. 프론트 보호 라우트는 화면 접근 제어일 뿐 서버 보안을 의미하지 않는다.

## 5. 작업지시

| Method | Path | 용도 |
|---|---|---|
| GET | `/work-orders` | `status`, `keyword`, `page`, `size` 검색 |
| GET | `/work-orders/{workOrderId}` | 상세 |
| GET | `/work-orders/active` | 진행/보류 중인 단일 활성 작업 |
| GET | `/work-orders/dashboard-summary` | 상태별 요약 |
| POST | `/work-orders` | 등록 |
| PATCH | `/work-orders/{id}/status` | 상태 전이 |
| PATCH | `/work-orders/{id}/target-quantities` | 목표 수정 |
| PATCH | `/work-orders/{id}/supervisor` | 지시자 변경 |
| PUT | `/work-orders/{id}/workers` | 작업자 전체 교체 |

등록 예시:

```json
{
  "productId": 1,
  "targetQty": 10000,
  "hourlyTargetQty": 1200,
  "plannedStartDate": "2026-07-23",
  "supervisorUserId": 2,
  "remarks": "주간 생산",
  "workerUserIds": [],
  "equipmentIds": []
}
```

`equipmentIds=[]`이면 C 연동 설비가 자동 매핑된다. 활성 작업이 없으면 `204`, 둘 이상이면 `409 ProblemDetail`이다.

활성 작업 응답은 작업지시 상세와 동일하다.

```json
{
  "summary": {
    "workOrderId": 12,
    "workOrderNo": "WO-20260723-001",
    "status": "IN_PROGRESS",
    "targetQty": 10000,
    "hourlyTargetQty": 1200,
    "currentQty": 2400
  },
  "workers": [],
  "equipments": [],
  "processes": [],
  "statusHistories": []
}
```

## 6. 생산·통신

- 생산: `/production-results`, `/production-results/recent`, `/production-results/summary`, `/production-results/by-product`, `/production-results/by-work-order`, `/hourly-productions`
- 통신: `/l1-devices`, `/l2-collectors`, `/communication-logs`
- 생산수량은 C가 전송한 1시간·보류·완료 집계값이며 초 단위 실시간 수량이 아니다.
- 화면은 `lastAggregatedAt`을 “최근 집계 기준”으로 표시한다.

## 7. 알람

- 현재: `GET /alarms/current`
- 검색·이력: `GET /alarms`
- 상세: `GET /alarms/{alarmId}`, `GET /alarms/number/{alarmNo}`
- 처리: `PATCH /alarms/{alarmId}/handling`
- 통계: `GET /alarms/statistics?from={Instant}&to={Instant}`

통계 기간은 UTC 반개구간 `[from,to)`, 최대 93일이다. 응답은 `dailyCounts`(KST, 빈 날짜 0), `equipmentCounts`(상위 5), `severityCounts`, `frequentAlarms`(동일 설비·메시지·심각도 상위 5)를 포함한다.

```json
{
  "from": "2026-07-16T15:00:00Z",
  "to": "2026-07-23T03:00:00Z",
  "totalCount": 8,
  "dailyCounts": [{ "date": "2026-07-17", "count": 0 }],
  "equipmentCounts": [{ "equipmentId": 1, "equipmentCode": "MIXER-01", "equipmentName": "혼합기", "count": 3 }],
  "severityCounts": [{ "severity": "WARNING", "severityLabel": "경고", "count": 3, "ratio": 37.5 }],
  "frequentAlarms": [{ "rank": 1, "message": "온도 편차", "equipmentCode": "MIXER-01", "equipmentName": "혼합기", "severity": "WARNING", "severityLabel": "경고", "count": 2 }]
}
```

## 8. 품질

- 목록·상세·등록: `/quality/defects`, `/quality/defects/{id}`
- 원인·처리: `/quality/defects/{id}/cause`, `/quality/defects/{id}/handling`
- 대시보드: `/quality/defects/dashboard`
- 활성 불량 유형: `GET /quality/defect-types`
- 통계: `GET /quality/defects/statistics?from={Instant}&to={Instant}`

불량률은 `불량 수량 ÷ HourlyProduction 생산수량 × 100`이며 두 자리 반올림한다. `typeCounts[].ratio`는 전체 불량 발생 건수 중 해당 유형의 건수 비율이다. 공정별 분모가 없으므로 `processQuantities`는 공정별 불량 수량이다. `rankings[].changeRatePercent=null`은 이전 동일 기간 발생이 없는 신규 유형이다.

```json
{
  "totalProductionQty": 24000,
  "totalDefectCount": 4,
  "totalDefectQuantity": 12,
  "periodDefectRate": 0.05,
  "previousPeriodRateChangePercentagePoint": -0.02,
  "completedDefectCount": 3,
  "handlingRate": 75.0,
  "dailyRates": [{ "date": "2026-07-23", "productionQty": 24000, "defectQty": 12, "defectRate": 0.05 }],
  "productRates": [],
  "processQuantities": [{ "processName": "포장", "defectQty": 8 }],
  "typeCounts": [],
  "rankings": [{ "rank": 1, "defectTypeLabel": "실링 불량", "mainProcessName": "포장", "eventCount": 2, "changeRatePercent": null }]
}
```

`GET /quality/defect-types` 응답 예시:

```json
[{ "code": "SEALING", "name": "실링 불량" }]
```

## 9. 자재·LOT·재고

- 기준정보: `/products`, `/raw-materials`, `/manufacturing-processes`
- BOM: `/boms`
- 생산 LOT: `/production-lots`
- 원자재 LOT: `/raw-material-lots`
- 완제품 재고: `/product-inventories`
- 재고 이동: `/inventory-movements`

재고 이동 요청은 `itemType`, `movementType`, `rawMaterialLotId` 또는 `productInventoryId`, `quantity`, `handledById`, `occurredAt`, `remarks`만 전송한다. 원자재 LOT ID와 완제품 재고 ID 중 정확히 하나만 지정한다.
