# MES 화면 구성

## 1. 대시보드 화면

### 1.1 메인 대시보드

* 오늘 생산 현황 요약

  * 생산 목표 수량
  * 현재 생산 수량
  * 달성률
  * 정상 수량
  * 불량 수량

* 작업지시 현황 요약

  * 진행 중 작업지시
  * 보류 중 작업지시
  * 완료된 작업지시

* 공정 진행 현황

  * 공정별 진행률
  * 현재 진행 중인 공정
  * 공정별 정상 / 불량 수량

* 설비 상태 요약

  * 가동 중 설비
  * 정지 설비
  * 이상 발생 설비
  * 설비별 현재 상태

* 알람 요약

  * 현재 알람
  * 경고 알람
  * 심각 알람
  * 최근 발생 알람

* 재고 요약

  * 원자재 재고
  * 완제품 재고
  * 안전 재고 미달 품목
  * 재고 부족 알림

* 통신 상태 요약

  * L1 장비 연결 상태
  * L2 수집기 상태
  * 최근 통신 로그

---

## 2. 사용자 계정 화면

### 2.1 로그인

* 사원 번호 입력
* 비밀번호 입력
* 로그인 버튼
* 사원 번호 찾기 이동
* 비밀번호 찾기 이동
* 회원가입 이동

### 2.2 회원가입

* 사원 번호 입력
* 비밀번호 입력
* 비밀번호 확인
* 이름 입력
* 이메일 입력
* 연락처 입력
* 권한 선택

  * 관리자
  * 작업자
  * 지시자
* 회원가입 버튼

### 2.3 사원 번호 찾기

* 이름 입력
* 이메일 입력
* 사원 번호 찾기 버튼
* 사원 번호 조회 결과 표시

### 2.4 비밀번호 찾기

* 사원 번호 입력
* 이메일 입력
* 인증 요청
* 임시 비밀번호 발급 또는 비밀번호 재설정

### 2.5 로그아웃

* 로그아웃 처리
* 로그인 화면으로 이동

---

## 3. 작업 지시

### 3.1 작업지시 목록

* 작업지시 번호
* 제품명
* 작업 상태
  * 대기
  * 진행중
  * 보류
  * 완료
* 생산 목표 수량
* 현재 생산 수량
* 시작 예정일
* 등록일
* 담당 지시자

### 3.2 작업지시 상세

* 작업지시 기본 정보
* 제품 정보
* 생산 목표 수량
* 현재 생산 수량
* 작업 상태
* 작업 시작 시간
* 작업 완료 시간
* 배정 지시자
* 매핑된 설비 목록

### 3.3 작업지시 등록

* 제품 선택
* 생산 목표 수량 입력
* 작업 시작 예정일 입력
* 지시자 배정
* 최초 상태는 대기로 등록
* 비고 입력
* 등록 버튼

### 3.4 작업 시작 / 보류 / 완료

* 대기 → 작업 시작 → 진행중
* 진행중 → 작업 보류 → 보류
* 보류 → 작업 재개 → 진행중
* 진행중 → 작업 완료 → 완료
* 작업 상태 변경 이력 확인

### 3.5 작업 순서 확인

* 작업지시별 공정 순서 확인
* 현재 진행 중인 공정 확인
* 다음 공정 확인

### 3.6 공정 진행 현황

* 공정별 진행 상태
* 공정별 생산 수량
* 공정별 불량 수량
* 공정별 설비 상태

### 3.7 지시자 배정

* 작업지시별 지시자 배정
* 지시자 변경
* 지시자별 담당 작업 확인

### 3.8 생산 목표 수량

* 작업지시별 목표 수량 확인
* 목표 수량 수정
* 목표 대비 달성률 확인

### 3.9 현재 생산 수량

* 실시간 생산 수량 확인
* 정상 수량 확인
* 불량 수량 확인
* 목표 대비 진행률 확인

### 3.10 작업지시별 설비 매핑

* 작업지시에 사용될 설비 선택
* 설비별 담당 공정 확인
* 설비 매핑 수정

---

## 4. 품질 관리

### 4.1 불량 현황

* 오늘 불량 수량
* 오늘 불량률
* 미처리 불량 건수
* 공정별 불량 수량
* 최근 발생 불량

### 4.2 불량 목록

* 발생 일시
* 제품명
* 작업지시 번호
* 생산 LOT 번호
* 발생 공정
* 불량 유형
* 불량 수량
* 처리 상태

### 4.3 불량 등록 및 처리

* 작업지시 선택
* 생산 LOT 선택
* 발생 공정 선택
* 불량 유형 선택
* 불량 수량 입력
* 불량 원인
* 처리 방법
  * 정상 승인
  * 재작업
  * 폐기
* 처리 담당자
* 처리 상태

### 4.4 불량 통계

* 일별 불량률
* 제품별 불량률
* 공정별 불량률
* 불량 유형별 발생 건수
* 자주 발생하는 불량 순위

---

## 5. 자재 / LOT

## 5.1 BOM 관리

### 5.1.1 제품별 BOM 조회

* 제품별 원자재 구성 조회
* 제품별 기준 소요량 조회
* 제품별 생산 단위 확인

### 5.1.2 컵라면 원재료 목록

* 면
* 스프
* 용기
* 뚜껑
* 포장재

### 5.1.3 기준 소요량

* 제품 1개 생산 기준 원자재 소요량
* 원자재별 단위
* 원자재별 사용 수량

### 5.1.4 작업지시별 예상 소요량

* 생산 목표 수량 기준 예상 원자재 소요량
* 현재 재고와 비교
* 부족 자재 확인

---

## 5.2 LOT 관리

### 5.2.1 생산 LOT 목록

* 생산 LOT 번호
* 작업지시 번호
* 제품명
* 생산 수량
* 생산 시작일
* 생산 완료일
* LOT 상태

### 5.2.2 LOT 상세 조회

* LOT 기본 정보
* 연결된 작업지시 정보
* 사용된 원자재 LOT
* 생산된 완제품 정보
* 공정 진행 이력

### 5.2.3 원자재 LOT

* 원자재 LOT 번호
* 원자재명
* 입고일
* 유통기한
* 입고 수량
* 현재 수량
* 사용 이력

---

## 5.3 재고 관리

### 5.3.1 원자재 재고

* 원자재명
* 현재 재고 수량
* 안전 재고 수량
* 단위
* 입고일
* LOT 번호

### 5.3.2 완제품 재고

* 제품명
* 생산 LOT 번호
* 현재 재고 수량
* 입고일
* 출고일
* 재고 상태

### 5.3.3 안전 재고

* 품목별 안전 재고 기준
* 현재 재고와 안전 재고 비교
* 안전 재고 미달 여부

### 5.3.4 입고 / 출고 이력

* 입고 이력
* 출고 이력
* 입출고 일시
* 입출고 수량
* 담당자
* 비고

### 5.3.5 작업지시 투입 예정 수량

* 작업지시별 필요 자재 수량
* 투입 예정 수량
* 실제 투입 수량
* 부족 수량

### 5.3.6 재고 부족 알림

* 부족 품목명
* 현재 재고
* 안전 재고
* 부족 수량
* 발생 일시
* 처리 상태

---

## 6. 알람 이력

### 6.1 현재 알람

* 현재 발생 중인 알람 목록
* 설비명
* 알람 내용
* 심각도
* 발생 시간
* 처리 상태

### 6.2 알람 이력 목록

* 전체 알람 발생 이력
* 발생 일시
* 설비명
* 알람 유형
* 심각도
* 처리 여부

### 6.3 설비별 알람 조회

* 설비별 알람 발생 내역
* 설비별 알람 빈도
* 설비별 최근 알람

### 6.4 심각도별 알람 조회

#### 6.4.1 정보

* 단순 상태 알림
* 참고용 알람
* 생산에는 영향이 적은 알람

#### 6.4.2 경고

* 점검이 필요한 알람
* 생산 품질에 영향을 줄 수 있는 알람
* 설비 이상 징후

#### 6.4.3 심각

* 즉시 조치가 필요한 알람
* 설비 정지 가능 알람
* 생산 중단 또는 불량 발생 가능 알람

### 6.5 알람 상세 정보

* 알람 번호
* 설비명
* 발생 위치
* 알람 내용
* 심각도
* 발생 시간
* 해제 시간
* 처리자
* 처리 내용

### 6.6 알람 통계

* 일별 알람 발생 수
* 설비별 알람 발생 수
* 심각도별 알람 비율
* 자주 발생하는 알람 순위

---

## 7. 통신 상태

### 7.1 L1 장비 연결 상태

* 장비별 연결 상태
* 장비 IP
* 장비 포트
* 마지막 수신 시간
* 연결 / 끊김 상태

### 7.2 L2 수집기 상태

* L2 수집기 실행 상태
* L1 장비 연결 개수
* 백엔드 서버 연결 상태
* 마지막 데이터 전송 시간

### 7.3 통신 로그

* 송신 로그
* 수신 로그
* 통신 성공 여부
* 통신 실패 원인
* 발생 시간
* 관련 장비

---

## 8. 설정

### 8.1 사용자 권한 설정

* 사용자 목록
* 사용자 역할

  * 관리자
  * 작업자
  * 지시자
* 권한 변경
* 계정 활성화 / 비활성화
* 회원가입 승인 / 거부

---

## 9. C 프로그램 구조

`c` 디렉터리는 공통 모듈, L1 장비 시뮬레이터, L2 데이터 수집기로 구분한다.

```text
c/
├── Makefile
├── common/
│   ├── config.h
│   ├── types.h
│   ├── types.c
│   ├── platform.h
│   ├── platform.c
│   ├── protocol.h
│   ├── protocol.c
│   ├── net.h
│   └── net.c
├── l1/
│   ├── main.c
│   ├── machine_common.h
│   ├── machine_common.c
│   ├── machine_mixer.c
│   ├── machine_roller.c
│   ├── machine_noodle.c
│   ├── machine_steamer.c
│   ├── machine_cutter.c
│   ├── machine_fryer.c
│   ├── machine_cooler.c
│   ├── machine_packer.c
│   └── machine_inspector.c
├── l2/
│   ├── main.c
│   ├── collector.h/c
│   ├── api_client.h/c
│   ├── command_poller.h/c
│   ├── device_manager.h/c
│   ├── hourly_aggregator.h/c
│   └── spool.h/c
└── tests/
    ├── test_protocol.c
    ├── test_aggregator.c
    ├── test_spool.c
    ├── mock_backend.py
    └── integration_smoke.py
```

### 9.1 공통 모듈 (`c/common`)

| 파일 | 역할 |
| --- | --- |
| `protocol.h/c` | L1 ↔ L2 통신 규칙 정의 |
| `net.h/c` | TCP 서버/클라이언트 소켓 함수 |
| `types.h` | 공통 구조체 정의 |
| `config.h` | 포트, 백엔드 URL, 장비 개수 설정 |
| `platform.h/c` | Linux/Windows 시간·수면·파일 처리 차이 추상화 |

### 9.2 L1 장비 시뮬레이터 (`c/l1`)

| 파일 | 역할 |
| --- | --- |
| `main.c` | 9개 장비 스레드 실행 |
| `machine_common.h/c` | 장비 공통 함수 |
| `machine_mixer.c` | 배합기 데이터 생성 |
| `machine_roller.c` | 압연기 데이터 생성 |
| `machine_noodle.c` | 제면기 데이터 생성 |
| `machine_steamer.c` | 증숙기 데이터 생성 |
| `machine_cutter.c` | 성형/절단기 데이터 생성 |
| `machine_fryer.c` | 유탕기 데이터 생성 |
| `machine_cooler.c` | 냉각기 데이터 생성 |
| `machine_packer.c` | 포장기 데이터 생성 |
| `machine_inspector.c` | 검사기 데이터 생성 |

### 9.3 L2 데이터 수집기 (`c/l2`)

| 파일 | 역할 |
| --- | --- |
| `main.c` | L2 프로그램 시작 |
| `collector.h/c` | L1 데이터 수신, 센서 버퍼, 검사 결과 처리 |
| `api_client.h/c` | Spring Boot REST API 요청 |
| `command_poller.h/c` | 백엔드 작업지시 주기적 조회 및 L1 명령 전송 |
| `device_manager.h/c` | 9개 L1 장비 연결 상태·자동 재연결 관리 |
| `hourly_aggregator.h/c` | 시간별 정상·불량 생산량 집계 |
| `spool.h/c` | 미전송 집계·불량 이벤트 로컬 보존 및 복구 |

### 9.4 L1 ↔ L2 통신 규격

L1 장비는 각각 `MES_BASE_PORT + 장비 순번`에서 TCP 서버로 동작하고 L2가 클라이언트로 연결한다. 기본 포트는 배합기 `5001`부터 검사기 `5009`까지이다.

```text
[STX 0x02][TYPE 1byte][VALUE int32 little-endian][ETX 0x03]
```

| TYPE | 방향 | VALUE |
| --- | --- | --- |
| `0x10` | L1 → L2 | 온도 ×100 |
| `0x11` | L1 → L2 | 습도 ×100 |
| `0x12` | L1 → L2 | 속도 ×1000 |
| `0x20` | 검사기 → L2 | 0=정상, 1=실링, 2=수분, 3=중량, 4=이물 |
| `0x30` | L2 → L1 | START, 남은 목표 수량 |
| `0x31` | L2 → L1 | HOLD |
| `0x32` | L2 → L1 | RESUME, 남은 목표 수량 |
| `0x33` | L2 → L1 | STOP |

### 9.5 빌드 및 실행

Linux는 `gcc`, `make`, `pkg-config`, `libcurl`, `cJSON`, `pthread`가 필요하다. Windows는 MSYS2/MinGW64의 동일 패키지와 `winpthreads`, `WinSock2`를 사용한다.

```bash
cd c
make

# 터미널 1
./mes_l1

# 터미널 2
./mes_l2
```

| 환경변수 | 기본값 | 설명 |
| --- | --- | --- |
| `MES_BASE_URL` | `http://localhost:8080` | Spring Boot 백엔드 URL |
| `MES_COLLECTOR_CODE` | `L2-01` | L2 수집기 코드 |
| `MES_L1_HOST` | `127.0.0.1` | L1 시뮬레이터 호스트 |
| `MES_BASE_PORT` | `5001` | 첫 L1 장비 포트 |
| `MES_COMMAND_POLL_MS` | `5000` | 작업지시 조회 주기 |
| `MES_TELEMETRY_BATCH_MS` | `10000` | 센서·상태 REST 전송 주기 |
| `MES_AGGREGATION_SECONDS` | `3600` | 생산 집계 구간 |
| `MES_SENSOR_INTERVAL_MS` | `1000` | L1 센서 생성 주기 |
| `MES_INSPECTION_INTERVAL_MS` | `5000` | 검사기 결과 생성 주기 |
| `MES_DEFECT_RATE_PERCENT` | `5` | 검사기 불량 발생률 |
| `MES_SPOOL_PATH` | `runtime/pending.jsonl` | 미전송 보존 파일 |
| `MES_RANDOM_SEED` | 현재 시간 | 난수 재현용 seed |

### 9.6 테스트

```bash
cd c
make test
make integration-test
make sanitize
```

`integration-test`는 가짜 Spring Boot API를 실행하여 9개 TCP 연결, 센서 배치, 불량 보고, 시간별 생산 집계, 수집기 상태 전송을 확인한다.

---

## 10. 데이터베이스 ERD

현재 구현 기준 Entity 관계, 컬럼 정책, L2 DTO 계약은 [`backend/README.md`](backend/README.md)를 단일 기준으로 사용한다. 센서 통합, BOM 헤더/항목 분리, 불량 멱등 키, 공정 진행 및 통합 재고 이동 모델이 반영되어 있다.

아래 내용은 팀 통합 이전 화면 요구를 정리한 구 ERD로, 현재 JPA 스키마의 구현 기준이 아니다.

<details>
<summary>통합 이전 ERD 참고 자료</summary>

### 10.1 사용자

#### USER

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| user_id | BIGINT | PK | 사용자 고유 ID |
| emp_no | VARCHAR(50) | UNIQUE | 사원번호 |
| password | VARCHAR(255) |  | 비밀번호 |
| name | VARCHAR(50) |  | 이름 |
| email | VARCHAR(100) | UNIQUE | 이메일 (아이디/비밀번호 찾기 인증용) |
| phone | VARCHAR(20) |  | 연락처 |
| role | VARCHAR(20) | ENUM | admin(관리자) / operator(작업자) / supervisor(지시자) |
| approval_status | VARCHAR(20) | ENUM | 대기 / 승인 / 거부 — 회원가입 승인 처리 상태 |
| is_active | BOOLEAN |  | 계정 활성화 여부 (비활성화 시 로그인 차단) |
| created_at | DATETIME |  | 계정 생성 일시 |

### 10.2 제품 / BOM / 공정 마스터

#### PRODUCT - 완제품

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| product_id | BIGINT | PK | 제품 고유 ID |
| product_code | VARCHAR(30) | UNIQUE | 제품 코드 (예: FG-CUP-110-RD) |
| product_name | VARCHAR(100) |  | 제품명 |
| unit | VARCHAR(10) |  | 생산 단위 (EA, g 등) |
| status | VARCHAR(20) |  | 사용중 / 검토 — BOM 적용 상태 |

#### RAW_MATERIAL - 원자재

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| material_id | BIGINT | PK | 원자재 고유 ID |
| material_name | VARCHAR(500) | UNIQUE | 원자재명 |
| unit | VARCHAR(20) |  | 수량 단위 (g, kg, EA 등) |

#### RAW_MATERIAL_LOT - 원자재 LOT

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| material_lot_id | BIGINT | PK | 원자재 LOT 고유 ID |
| material_id | BIGINT | FK → RAW_MATERIAL | 원자재 마스터 |
| supplier_name | VARCHAR(100) |  | 공급업체명 |
| supplier_lot_no | VARCHAR(50) |  | 공급업체 LOT 번호 (LOT 구분 기준) |
| manufacture_date | DATE |  | 제조일 |
| expiry_date | DATE |  | 유통기한 |
| received_qty | DECIMAL(12,3) |  | 입고 수량 |
| current_qty | DECIMAL(12,3) |  | 현재 잔량 (사용/출고로 차감) |
| received_date | DATE |  | 입고일 |

* 공급업체별 LOT 번호 중복을 방지하기 위해 `(supplier_name, supplier_lot_no)` 조합에 UNIQUE 제약을 적용한다.

#### BOM

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| bom_id | BIGINT | PK | BOM 행 고유 ID |
| product_id | BIGINT | FK → PRODUCT | 대상 제품 |
| material_id | BIGINT | FK → RAW_MATERIAL | 소요 원자재 |
| spec | VARCHAR(50) |  | 원자재 규격 (예: "원형 92mm", "매운맛") |
| required_qty | DECIMAL(10,3) |  | 제품 1개당 기준 소요량 |
| loss_rate | DECIMAL(5,2) |  | 공정 로스율(%) — 실제 소요량 = required_qty × (1+loss_rate) |

* 하나의 제품에 같은 원자재가 중복 등록되지 않도록 `(product_id, material_id)` 조합에 UNIQUE 제약을 적용한다.

### 10.3 설비

#### EQUIPMENT

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| equipment_id | BIGINT | PK | 설비 고유 ID |
| equipment_name | VARCHAR(50) | UNIQUE | 설비명 (예: 혼합기 1호) |
| status | VARCHAR(20) | ENUM | RUNNING(가동중) / STOPPED(정지) / ERROR(이상) |
| equipment_code | VARCHAR(255) | UNIQUE | 식별코드 |

#### EQUIPMENT_EMP

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| equipment_emp_id | BIGINT | PK | 설비 작업자 배정 ID |
| user_id | BIGINT | FK → USER | 배정된 사원 |
| equipment_id | BIGINT | FK → EQUIPMENT | 배정된 설비 |
| start_time | DATETIME |  | 시작시간 |
| end_time | DATETIME | nullable | 종료시간 (현재 배정 중이면 null) |

* 배정 이력을 보존하기 위해 `user_id`에는 단일 UNIQUE 제약을 두지 않는다.

#### EQUIPMENT_TEMPERATURE - 설비 온도

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| equipment_temperature_id | BIGINT | PK | 온도 측정 고유 ID |
| equipment_id | BIGINT | FK → EQUIPMENT | 측정 설비 |
| work_order_id | BIGINT | FK → WORK_ORDER | 측정 중인 작업지시 |
| temperature | DECIMAL(6,2) |  | 온도 값(°C) |
| measured_at | DATETIME |  | 측정 시각 |

#### EQUIPMENT_HUMIDITY - 설비 습도

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| equipment_humidity_id | BIGINT | PK | 습도 측정 고유 ID |
| equipment_id | BIGINT | FK → EQUIPMENT | 측정 설비 |
| work_order_id | BIGINT | FK → WORK_ORDER | 측정 중인 작업지시 |
| humidity | DECIMAL(5,2) |  | 상대습도 값(%) |
| measured_at | DATETIME |  | 측정 시각 |

#### EQUIPMENT_SPEED - 설비 속도

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| equipment_speed_id | BIGINT | PK | 속도 측정 고유 ID |
| equipment_id | BIGINT | FK → EQUIPMENT | 측정 설비 |
| work_order_id | BIGINT | FK → WORK_ORDER | 측정 중인 작업지시 |
| speed | DECIMAL(10,3) |  | 속도 값 |
| unit | VARCHAR(20) |  | 속도 단위 (RPM, m/min 등) |
| measured_at | DATETIME |  | 측정 시각 |

### 10.4 작업지시

#### WORK_ORDER — README 3.1, 3.2, 3.3, 3.8, 3.9

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| work_order_id | BIGINT | PK | 작업지시 고유 ID |
| work_order_no | VARCHAR(30) | UNIQUE | 작업지시 번호 (예: WO-20260709-001) |
| product_id | BIGINT | FK → PRODUCT | 생산 대상 제품 |
| user_id | BIGINT | FK → USER | 지시자(사용자) |
| target_qty | INT |  | 생산 목표 수량 (3.8) |
| current_qty | INT |  | 현재까지 생산된 수량 (3.9) |
| good_qty | INT |  | 정상 수량 (3.9) |
| defect_qty | INT |  | 불량 수량 (3.9) |
| status | VARCHAR(20) |  | PENDING(대기) / IN_PROGRESS(진행중) / HOLD(보류) / DONE(완료) |
| planned_start_date | DATE |  | 작업 시작 예정일 |
| start_time | DATETIME |  | 실제 작업 시작 시각 |
| end_time | DATETIME |  | 작업 완료 시각 |
| remarks | TEXT |  | 비고 |
| registered_at | DATETIME |  | 등록일시 |

#### HOURLY_PRODUCTION — 시간별 생산 집계

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| hourly_production_id | BIGINT | PK | 시간별 생산 집계 고유 ID |
| work_order_id | BIGINT | FK → WORK_ORDER | 집계 대상 작업지시 |
| bucket_start | DATETIME |  | 집계 시작 시각 |
| bucket_end | DATETIME |  | 집계 종료 시각 |
| target_qty | INT |  | 해당 집계 구간의 목표 수량 |
| production_qty | INT |  | 해당 집계 구간의 생산 수량 |
| good_qty | INT |  | 해당 집계 구간의 정상 수량 |
| defect_qty | INT |  | 해당 집계 구간의 불량 수량 |
| is_partial | BOOLEAN |  | 1시간 미만 집계 여부 |
| close_reason | VARCHAR(30) |  | HOURLY / WORK_ORDER_COMPLETED / HOLD / SHUTDOWN |
| received_at | DATETIME |  | 백엔드가 집계 데이터를 수신한 시각 |

* 재전송 시 중복 저장을 방지하기 위해 `(work_order_id, bucket_start)` 조합에 UNIQUE 제약을 적용한다.
* L2는 1시간이 경과하거나 작업지시가 완료·보류되면 집계값을 로컬 스풀에 안전하게 이동하고 다음 집계를 시작한다. 백엔드 저장 성공 응답을 받은 후에만 스풀에서 완전히 제거한다.
* `WORK_ORDER.current_qty`, `good_qty`, `defect_qty`는 해당 작업지시의 `HOURLY_PRODUCTION` 집계 합계와 일치하도록 백엔드에서 갱신한다.

#### PRODUCTION_RESULT — 생산 실적 요약

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| production_result_id | BIGINT | PK | 생산 실적 고유 ID |
| result_no | VARCHAR(30) | UNIQUE | 표시용 생산 실적 번호 (예: PR-20260715-012) |
| work_order_id | BIGINT | FK → WORK_ORDER | 실적 대상 작업지시 |
| production_lot_id | BIGINT | FK → PRODUCTION_LOT | 실적 대상 생산 LOT |
| target_qty | INT |  | 실적 집계 시작 시점의 목표 수량 |
| production_qty | INT |  | 누적 생산 수량 |
| good_qty | INT |  | 누적 정상 수량 |
| defect_qty | INT |  | 누적 불량 수량 |
| status | VARCHAR(20) |  | COLLECTING(집계 중) / COMPLETED(집계 완료) / CANCELED(취소) |
| started_at | DATETIME |  | 실적 집계 시작 시각 |
| completed_at | DATETIME | nullable | 실적 집계 완료 시각 |
| last_aggregated_at | DATETIME | nullable | 마지막 시간별 생산 집계 반영 시각 |
| created_at | DATETIME |  | 실적 생성 시각 |
| updated_at | DATETIME |  | 실적 수정 시각 |

* 작업지시와 생산 LOT별 실적이 중복 생성되지 않도록 `(work_order_id, production_lot_id)` 조합에 UNIQUE 제약을 적용한다.
* `target_qty`는 작업지시 목표 수량이 이후 변경되더라도 당시 실적 기준을 보존하기 위한 스냅샷 값이다.
* `PRODUCTION_RESULT`는 L1·L2가 직접 저장하는 테이블이 아니라, 백엔드가 `HOURLY_PRODUCTION` 저장 후 해당 작업지시의 시간별 집계 합계를 다시 계산하여 갱신하는 조회용 요약 테이블이다.
* 수량 값은 0 이상이어야 하며, 확정된 생산 실적은 `production_qty = good_qty + defect_qty`를 만족해야 한다.
* 한 작업지시에서는 동시에 하나의 생산 LOT만 `COLLECTING` 상태로 관리한다.

#### WORK_ORDER_WORKER — README 3.7 (작업자 배정)

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| id | BIGINT | PK | 배정 행 고유 ID |
| work_order_id | BIGINT | FK → WORK_ORDER | 대상 작업지시 |
| user_id | BIGINT | FK → USER | 배정된 작업자 |

* 작업자 중복 배정을 방지하기 위해 `(work_order_id, user_id)` 조합에 UNIQUE 제약을 적용한다.

#### WORK_ORDER_EQUIPMENT — README 3.10 (설비 매핑)

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| id | BIGINT | PK | 매핑 행 고유 ID |
| work_order_id | BIGINT | FK → WORK_ORDER | 대상 작업지시 |
| equipment_id | BIGINT | FK → EQUIPMENT | 매핑된 설비 |

* 설비 중복 매핑을 방지하기 위해 `(work_order_id, equipment_id)` 조합에 UNIQUE 제약을 적용한다.

#### WORK_ORDER_STATUS_HISTORY — README 3.4 (상태 변경 이력)

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| history_id | BIGINT | PK | 이력 고유 ID |
| work_order_id | BIGINT | FK → WORK_ORDER | 작업지시 고유 ID |
| user_id | BIGINT | FK → USER | 처리자 |
| prev_status | VARCHAR(20) |  | 변경 전 상태 |
| new_status | VARCHAR(20) |  | 변경 후 상태 |
| changed_at | DATETIME |  | 변경 시각 |

### 10.5 LOT / 재고

#### PRODUCTION_LOT - 생산 LOT

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| production_lot_id | BIGINT | PK | 생산 LOT 고유 ID |
| lot_no | VARCHAR(50) | UNIQUE | 생산 LOT 번호 |
| work_order_id | BIGINT | FK → WORK_ORDER | 생산 LOT이 속한 작업지시 |
| production_qty | INT |  | LOT 총 생산 수량 |
| good_qty | INT |  | LOT 정상 수량 |
| defect_qty | INT |  | LOT 불량 수량 |
| status | VARCHAR(20) |  | IN_PROGRESS(생산중) / COMPLETED(완료) / HOLD(보류) |
| started_at | DATETIME |  | LOT 생산 시작 시각 |
| completed_at | DATETIME | nullable | LOT 생산 완료 시각 |

#### PRODUCTION_LOT_MATERIAL — 생산 LOT ↔ 원자재 LOT 매핑 (N:M)

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| id | BIGINT | PK | 매핑 행 고유 ID |
| production_lot_id | BIGINT | FK → PRODUCTION_LOT | 생산 LOT |
| material_lot_id | BIGINT | FK → RAW_MATERIAL_LOT | 사용된 원자재 LOT |
| used_qty | DECIMAL(12,3) |  | 실제 투입 수량 |

* 같은 생산 LOT에 같은 원자재 LOT가 중복 매핑되지 않도록 `(production_lot_id, material_lot_id)` 조합에 UNIQUE 제약을 적용한다.

#### PRODUCT_INVENTORY — 완제품 재고

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| inventory_id | BIGINT | PK | 재고 행 고유 ID |
| production_lot_id | BIGINT | FK → PRODUCTION_LOT, UNIQUE | 재고로 등록된 생산 LOT |
| current_qty | INT |  | 현재 재고 수량 |
| status | VARCHAR(20) |  | AVAILABLE(재고 있음) / DEPLETED(소진) / HOLD(보류) |
| created_at | DATETIME |  | 재고 등록 시각 |

#### OUT_HISTORY — 출고 이력 (완제품)

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| history_id | BIGINT | PK | 이력 고유 ID |
| product_inventory_id | BIGINT | FK → PRODUCT_INVENTORY | 완제품 재고 ID |
| user_id | BIGINT | FK → USER | 담당자 |
| qty | INT |  | 출고 수량 |
| occurred_at | DATETIME |  | 출고 일시 |
| remarks | TEXT |  | 비고 |

### 10.6 품질관리

#### DEFECT — README 4.1~4.4

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| defect_id | BIGINT | PK | 불량 고유 ID |
| defect_no | VARCHAR(30) | UNIQUE | 표시용 불량 번호 (예: DF-260713-024) |
| production_lot_id | BIGINT | FK → PRODUCTION_LOT | 불량이 발생한 생산 LOT |
| equipment_id | BIGINT | FK → EQUIPMENT | 불량이 발생한 설비·공정 |
| handler_id | BIGINT | FK → USER, nullable | 처리 담당자 |
| defect_type | VARCHAR(50) |  | 불량 유형 (예: 실링 불량, 수분 함량 초과) |
| quantity | INT |  | 불량 수량 |
| cause | TEXT | nullable | 불량 원인 |
| handle_method | VARCHAR(20) | nullable | 정상 승인 / 재작업 / 폐기 |
| status | VARCHAR(20) |  | 미처리 / 처리 중 / 보류 / 처리 완료 |
| occurred_at | DATETIME |  | 발생 일시 |

### 10.7 알람

#### ALARM

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| alarm_id | BIGINT | PK | 알람 고유 ID |
| equipment_id | BIGINT | FK → EQUIPMENT | 발생 설비 |
| handler_id | BIGINT | FK → USER, nullable | 사람이 처리한 경우의 담당자 |
| content | VARCHAR(255) |  | 알람 내용 |
| severity | VARCHAR(10) |  | 정보 / 경고 / 심각 |
| handling_content | TEXT | nullable | 처리 내용 |
| status | VARCHAR(20) |  | 확인대기 / 조치중 / 점검예약 / 모니터링 / 처리완료 |
| occurred_at | DATETIME |  | 발생 시각 |
| resolved_at | DATETIME | nullable | 해제 시각 |

### 10.8 통신 상태

#### L1_DEVICE — L1 장비 연결 상태

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| device_id | BIGINT | PK | 장비 연결 고유 ID |
| equipment_id | BIGINT | FK → EQUIPMENT, UNIQUE | 대상 설비 |
| ip_address | VARCHAR(50) |  | 장비 IP |
| port | INT |  | 장비 포트 (예: 502, Modbus) |
| connection_status | VARCHAR(20) |  | 연결 / 끊김 |
| last_received_at | DATETIME |  | 마지막 수신 시각 |

#### L2_COLLECTOR — L2 수집기 상태

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| collector_id | BIGINT | PK | 수집기 고유 ID |
| name | VARCHAR(50) | UNIQUE | 수집기 이름 |
| status | VARCHAR(20) |  | 실행 상태 |
| connected_l1_count | INT |  | 현재 연결된 L1 장비 수 |
| backend_connection_status | VARCHAR(20) |  | 백엔드(Spring Boot) 서버 연결 상태 |
| last_sent_at | DATETIME |  | 마지막 데이터 전송 시각 |

#### COMMUNICATION_LOG — 통신 로그

| 컬럼명 | 타입 | 키 | 설명 |
| --- | --- | --- | --- |
| log_id | BIGINT | PK | 로그 고유 ID |
| device_id | BIGINT | FK → L1_DEVICE (nullable) | 관련 L1 장비 (L1↔L2 통신 로그인 경우) |
| collector_id | BIGINT | FK → L2_COLLECTOR (nullable) | 관련 L2 수집기 (L2↔백엔드 통신 로그인 경우) |
| direction | VARCHAR(10) |  | 송신 / 수신 |
| success | BOOLEAN |  | 통신 성공 여부 |
| fail_reason | VARCHAR(255) |  | 실패 원인 (실패 시에만) |
| occurred_at | DATETIME |  | 통신 발생 시각 |

### 10.9 주요 관계 및 무결성 규칙

* `PRODUCT` 1개에 여러 `WORK_ORDER`가 연결될 수 있다. (`PRODUCT` 1:N `WORK_ORDER`)
* `RAW_MATERIAL` 1개에 여러 `RAW_MATERIAL_LOT`가 연결될 수 있다. (`RAW_MATERIAL` 1:N `RAW_MATERIAL_LOT`)
* `PRODUCT`와 `RAW_MATERIAL`의 N:M 관계는 `BOM`으로 관리한다.
* `WORK_ORDER` 1개에 여러 `PRODUCTION_LOT`와 `HOURLY_PRODUCTION` 집계가 연결될 수 있다.
* `PRODUCTION_LOT`와 `RAW_MATERIAL_LOT`의 N:M 관계는 `PRODUCTION_LOT_MATERIAL`로 관리한다.
* `PRODUCTION_LOT` 1개는 최대 1개의 `PRODUCT_INVENTORY`로 등록한다.
* `DEFECT`는 `PRODUCTION_LOT`와 `EQUIPMENT`를 참조하여 작업지시, 제품, LOT, 발생 공정을 추적한다.
* 모든 PK와 해당 FK의 ID 타입은 `BIGINT`로 통일한다.
* 수량 값은 0 이상이어야 하며, 원자재 LOT의 `current_qty`는 `received_qty`보다 클 수 없다.
* 집계 구간은 `bucket_end > bucket_start`를 보장하고, 확정된 생산 집계와 LOT은 `production_qty = good_qty + defect_qty`를 만족해야 한다.

</details>
