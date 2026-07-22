# Backend Entity/DTO Contract

이 문서는 현재 백엔드 Entity와 DTO의 기준 문서다. 프론트 화면의 표시값은 조회 DTO에서 조합하고, C가 보내는 JSON 형식은 아래 L2 계약을 그대로 유지한다.

## 패키지 규칙

```text
com.human.linecup
├── entity/          # JPA Entity, enum, 도메인 불변식
├── repository/      # 조회 그래프, 멱등 키, 잠금 쿼리
├── service/         # 트랜잭션, 상태 전이, DTO 매핑
└── dto/
    ├── request/     # 요청 record
    └── response/    # 응답 record
```

- DTO 하위에 도메인별 추가 패키지를 만들지 않는다.
- DTO는 모두 불변 `record`이며 Entity를 생성하거나 조회하지 않는다.
- Entity는 공개 setter 없이 정적 팩터리와 의미 있는 변경 메서드만 제공한다.
- 테이블과 컬럼은 소문자 `snake_case`를 사용한다. 사용자 테이블은 예약어 충돌을 피하기 위해 `app_user`를 사용한다.
- 이벤트 시각은 UTC ISO-8601 `Instant`, 업무 날짜는 `LocalDate`를 사용한다.
- 숫자 PK와 업무 식별자를 구분한다. 예: `userId`/`empNo`, `productId`/`productCode`.
- 요청 상태는 enum 코드로 받고 응답에는 코드와 `...Label`을 함께 제공한다.
- 작업지시 상태는 `PENDING / IN_PROGRESS / HOLD / DONE`을 사용하며 화면에는 `PENDING`을 "대기"로 표시한다.
- 생산 LOT는 작업 시작 전에 `PENDING`으로 만들고 작업지시와 같은 트랜잭션에서 시작·보류·재개·완료한다.

## L2 HTTP DTO 계약

| 경로 | 메서드 | DTO | 처리 규칙 |
| --- | --- | --- | --- |
| `/api/l2/work-orders/active?collectorCode=...` | GET | `L2ActiveWorkOrderResponse` | 활성 작업 없음 `204`, 있으면 `200`; `equipmentCodes`는 비어 있을 수 없음 |
| `/api/l2/telemetry/batch` | POST | `TelemetryBatchRequest` | `samples` 1개 이상, metric은 `TEMPERATURE/HUMIDITY/SPEED` |
| `/api/l2/hourly-productions` | POST | `HourlyProductionRequest` | `(workOrderId, bucketStart)` 기준 멱등 갱신 |
| `/api/l2/defects` | POST | `DefectIngestRequest` | `idempotencyKey` 기준 중복 저장 방지 |
| `/api/l2/status/heartbeat` | POST | `L2HeartbeatRequest` | `connectedL1Count`와 연결 장비 수가 일치해야 함 |

`L2ActiveWorkOrderResponse`는 `workOrderId`, `productionLotId`, `status`, `targetQty`, `currentQty`, `hourlyTargetQty`, `equipmentCodes`를 모두 제공한다. 모든 POST는 저장이 완료된 뒤에만 2xx를 반환해야 C의 JSONL 스풀에서 안전하게 제거된다.

## 논리 ERD

```mermaid
erDiagram
    PRODUCT ||--o{ WORK_ORDER : orders
    USER ||--o{ WORK_ORDER : supervises
    WORK_ORDER ||--o{ PRODUCTION_LOT : creates
    WORK_ORDER ||--o{ HOURLY_PRODUCTION : aggregates
    WORK_ORDER ||--o{ EQUIPMENT_TELEMETRY : measures
    PRODUCTION_LOT ||--|| PRODUCTION_RESULT : summarizes
    PRODUCTION_LOT ||--o{ PRODUCTION_PROCESS_PROGRESS : progresses
    MANUFACTURING_PROCESS ||--o{ PRODUCTION_PROCESS_PROGRESS : defines
    EQUIPMENT ||--o{ PRODUCTION_PROCESS_PROGRESS : performs
    PRODUCT ||--o{ BOM : versions
    BOM ||--o{ BOM_ITEM : contains
    RAW_MATERIAL ||--o{ BOM_ITEM : requires
    RAW_MATERIAL ||--o{ RAW_MATERIAL_LOT : lots
    PRODUCTION_LOT ||--o{ PRODUCTION_LOT_MATERIAL : consumes
    RAW_MATERIAL_LOT ||--o{ PRODUCTION_LOT_MATERIAL : consumed_by
    PRODUCTION_LOT ||--|| PRODUCT_INVENTORY : stocks
    RAW_MATERIAL_LOT ||--o{ INVENTORY_MOVEMENT : moves
    PRODUCT_INVENTORY ||--o{ INVENTORY_MOVEMENT : moves
    PRODUCTION_LOT ||--o{ DEFECT : has
    DEFECT_TYPE ||--o{ DEFECT : classifies
    DEFECT ||--o{ DEFECT_HANDLING_HISTORY : handled
    EQUIPMENT ||--o{ ALARM : raises
    EQUIPMENT ||--|| L1_DEVICE : connects
    L2_COLLECTOR ||--o{ COMMUNICATION_LOG : logs
    USER ||--|| WORKER_PROFILE : profile
    WORKER_PROFILE ||--o{ WORKER_SKILL : skills
```

### 핵심 테이블과 제약

- `equipment_telemetry`: 기존 온도·습도·속도 테이블을 통합한다. 설비/metric/시각 및 작업지시/시각 인덱스를 둔다.
- `hourly_production`: `(work_order_id, bucket_start)` 유일 키와 `production_qty = good_qty + defect_qty` 제약을 둔다.
- `defect`: `defect_no`, `idempotency_key`가 각각 유일하며 LOT·설비·불량 유형을 FK로 참조한다.
- `bom`/`bom_item`: BOM 헤더 버전과 원자재 행을 분리한다. `(product_id, version)` 및 `bom_code`가 유일하다.
- `inventory_movement`: 원자재 LOT 또는 완제품 재고 중 정확히 하나만 참조한다.
- `production_process_progress`: `(production_lot_id, process_id)`가 유일하다.
- `raw_material_lot`: 내부 `material_lot_no`와 공급사 LOT 번호를 구분한다.

## 수량 소유권

| 단계 | 책임 |
| --- | --- |
| `HourlyProduction` | L2가 전송한 시간 버킷 원천 |
| `ProductionResult` | 생산 LOT별 시간 집계 요약 |
| `ProductionLot` | LOT 현재 합계 |
| `WorkOrder` | 작업지시 전체 합계 |

각 단계의 저장 필드는 의도적인 집계 스냅샷이다. 모든 갱신은 `production/currentQty = goodQty + defectQty`와 음수 금지 규칙을 적용하고, 비율은 `ProductionQuantityPolicy`의 한 자리 반올림 규칙을 사용한다.

## 초기 기준 데이터

`data.sql`은 C가 보내는 불량 코드와 9개 표준 공정·설비(`MIXER-01`~`INSPECTOR-01`)를 등록한다. 설비 코드는 물리 설비 계약이고 공정의 `sequence_no`는 화면 표시 순서일 뿐 설비 간 선후 의존성을 만들지 않는다. 개발 DB를 실제로 초기화할 때만 `schema-reset` 프로필을 활성화한다. 이 프로필은 `ddl-auto=create`이므로 기존 개발 데이터가 삭제된다.

```bash
SPRING_PROFILES_ACTIVE=schema-reset bash gradlew bootRun
```

## 검증

```bash
bash gradlew clean compileJava
```
