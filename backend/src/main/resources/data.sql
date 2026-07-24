-- Instant(datetime(6)) 컬럼은 UTC로 저장한다.
-- JDBC connectionTimeZone만으로 MySQL 세션의 SYSTEM 타임존은 바뀌지 않으므로
-- 초기 데이터 스크립트가 실행되는 연결을 명시적으로 UTC로 맞춘다.
SET SESSION time_zone = '+00:00';

INSERT INTO defect_type (code, name, is_active) VALUES
    ('OK', '정상', true),
    ('SEALING', '실링 불량', true),
    ('MOISTURE', '수분 불량', true),
    ('WEIGHT', '중량 불량', true),
    ('FOREIGN_MATERIAL', '이물 불량', true),
    ('GENERAL_NG', '일반 불량', true),
    ('LEGACY_DISABLED', '사용 중지 테스트 유형', false)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    is_active = VALUES(is_active);

INSERT INTO manufacturing_process (process_code, process_name, sequence_no, is_active) VALUES
    ('MIXING', '혼합', 1, true),
    ('ROLLING', '압연', 2, true),
    ('NOODLE_MAKING', '제면', 3, true),
    ('STEAMING', '증숙', 4, true),
    ('CUTTING', '절단', 5, true),
    ('FRYING', '유탕', 6, true),
    ('COOLING', '냉각', 7, true),
    ('PACKING', '포장', 8, true),
    ('INSPECTION', '검사', 9, true)
ON DUPLICATE KEY UPDATE
    process_name = VALUES(process_name),
    sequence_no = VALUES(sequence_no),
    is_active = VALUES(is_active);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '혼합기 1호', 'MIXER-01', process_id, '생산 구역', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'MIXING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '압연기 1호', 'ROLLER-01', process_id, '생산 구역', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'ROLLING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '제면기 1호', 'NOODLE-01', process_id, '생산 구역', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'NOODLE_MAKING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '증숙기 1호', 'STEAMER-01', process_id, '생산 구역', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'STEAMING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '절단기 1호', 'CUTTER-01', process_id, '생산 구역', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'CUTTING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '유탕기 1호', 'FRYER-01', process_id, '생산 구역', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'FRYING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '냉각기 1호', 'COOLER-01', process_id, '생산 구역', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'COOLING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '포장기 1호', 'PACKER-01', process_id, '생산 구역', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'PACKING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '검사기 1호', 'INSPECTOR-01', process_id, '생산 구역', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'INSPECTION'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

-- ============================================================================
-- 통합 테스트용 초기 데이터
-- spring.jpa.hibernate.ddl-auto=create 환경에서 테이블 생성 후 자동 실행됩니다.
-- 운영 환경에서는 사용하지 마세요.
--
-- 공통 테스트 비밀번호: Test1234!
-- 승인 계정: admin01 / supervisor01 / supervisor02 / operator01~04
-- 승인 대기/거절/비활성 검증 계정: pending01 / rejected01 / inactive01
--
-- L1/L2 최초 등록과 heartbeat 흐름을 검증할 수 있도록
-- l1_device, l2_collector, communication_log에는 데이터를 넣지 않습니다.
-- 활성 작업지시는 WO-20260723-001 한 건만 두어 L2 조회 충돌을 방지합니다.
-- 다른 대기 작업지시의 시작 테스트 전에는 위 활성 작업지시를 먼저 완료해야 합니다.
-- 미래 날짜는 예약 대기 작업지시의 계획일과 정상 재고의 유통기한에만 사용합니다.
-- ============================================================================

INSERT INTO app_user (
    user_id, emp_no, name, email, phone, password, role,
    approval_status, is_active, created_at, last_access_at
) VALUES
    (1,  'admin01',      '시스템 관리자', 'admin01@linecup.test',      '010-1000-0001', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:RM07ZqOdg/y8TqKuolpXHQHVTZOCPDVpWrgqs+fmhjU', 'ADMIN',      'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 120 DAY, CURRENT_TIMESTAMP - INTERVAL 5 MINUTE),
    (2,  'supervisor01', '생산 관리자 김철수', 'supervisor01@linecup.test', '010-1000-0002', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:RM07ZqOdg/y8TqKuolpXHQHVTZOCPDVpWrgqs+fmhjU', 'SUPERVISOR', 'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 100 DAY, CURRENT_TIMESTAMP - INTERVAL 10 MINUTE),
    (3,  'supervisor02', '품질 관리자 이영희', 'supervisor02@linecup.test', '010-1000-0003', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:RM07ZqOdg/y8TqKuolpXHQHVTZOCPDVpWrgqs+fmhjU', 'SUPERVISOR', 'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 90 DAY,  CURRENT_TIMESTAMP - INTERVAL 1 HOUR),
    (4,  'operator01',   '작업자 박민수', 'operator01@linecup.test',   '010-1000-0004', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:RM07ZqOdg/y8TqKuolpXHQHVTZOCPDVpWrgqs+fmhjU', 'OPERATOR',   'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 80 DAY,  CURRENT_TIMESTAMP - INTERVAL 20 MINUTE),
    (5,  'operator02',   '작업자 최지은', 'operator02@linecup.test',   '010-1000-0005', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:RM07ZqOdg/y8TqKuolpXHQHVTZOCPDVpWrgqs+fmhjU', 'OPERATOR',   'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 75 DAY,  CURRENT_TIMESTAMP - INTERVAL 30 MINUTE),
    (6,  'operator03',   '작업자 정현우', 'operator03@linecup.test',   '010-1000-0006', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:RM07ZqOdg/y8TqKuolpXHQHVTZOCPDVpWrgqs+fmhjU', 'OPERATOR',   'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 70 DAY,  CURRENT_TIMESTAMP - INTERVAL 2 HOUR),
    (7,  'operator04',   '작업자 한소라', 'operator04@linecup.test',   '010-1000-0007', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:RM07ZqOdg/y8TqKuolpXHQHVTZOCPDVpWrgqs+fmhjU', 'OPERATOR',   'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 65 DAY,  CURRENT_TIMESTAMP - INTERVAL 3 HOUR),
    (8,  'pending01',    '승인 대기 사용자', 'pending01@linecup.test',    '010-1000-0008', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:RM07ZqOdg/y8TqKuolpXHQHVTZOCPDVpWrgqs+fmhjU', 'SUPERVISOR', 'PENDING',  false, CURRENT_TIMESTAMP - INTERVAL 2 DAY,   NULL),
    (9,  'rejected01',   '승인 거절 사용자', 'rejected01@linecup.test',   '010-1000-0009', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:RM07ZqOdg/y8TqKuolpXHQHVTZOCPDVpWrgqs+fmhjU', 'OPERATOR',   'REJECTED', false, CURRENT_TIMESTAMP - INTERVAL 5 DAY,   NULL),
    (10, 'inactive01',   '비활성 사용자', 'inactive01@linecup.test',   '010-1000-0010', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:RM07ZqOdg/y8TqKuolpXHQHVTZOCPDVpWrgqs+fmhjU', 'OPERATOR',   'APPROVED', false, CURRENT_TIMESTAMP - INTERVAL 30 DAY,  CURRENT_TIMESTAMP - INTERVAL 20 DAY);

INSERT INTO product (
    product_id, product_code, product_name, category, unit, status
) VALUES
    (1, 'FG-CUP-SPICY-065',   '매운맛 컵라면 65g',   '컵라면', 'EA', 'ACTIVE'),
    (2, 'FG-CUP-MILD-065',    '순한맛 컵라면 65g',   '컵라면', 'EA', 'ACTIVE'),
    (3, 'FG-CUP-SEAFOOD-075', '해물맛 컵라면 75g',   '컵라면', 'EA', 'ACTIVE'),
    (4, 'FG-BAG-SPICY-120',   '매운맛 봉지라면 120g', '봉지라면', 'EA', 'REVIEW'),
    (5, 'FG-CUP-OLD-065',     '단종 컵라면 65g',     '컵라면', 'EA', 'INACTIVE');

INSERT INTO raw_material (
    material_id, material_code, material_name, unit, safety_stock_qty, status
) VALUES
    (1, 'RM-FLOUR-001',     '밀가루',          'kg', 100.000, 'ACTIVE'),
    (2, 'RM-SOUP-001',      '매운맛 분말스프',   'kg', 20.000,  'ACTIVE'),
    (3, 'RM-SOUP-MILD-001', '순한맛 분말스프',   'kg', 20.000,  'ACTIVE'),
    (4, 'RM-OIL-001',       '팜유',            'L',  200.000, 'ACTIVE'),
    (5, 'RM-CUP-001',       '종이 용기',        'EA', 500.000, 'ACTIVE'),
    (6, 'RM-LID-001',       '용기 뚜껑',        'EA', 500.000, 'ACTIVE'),
    (7, 'RM-FILM-001',      '포장 필름',        'm',  1000.000,'ACTIVE'),
    (8, 'RM-SEAFOOD-001',   '해물맛 분말스프',   'kg', 20.000,  'ACTIVE'),
    (9, 'RM-OLD-001',       '단종 원자재',       'kg', 10.000,  'INACTIVE');

INSERT INTO bom (
    bom_id, bom_code, product_id, version, status, note
) VALUES
    (1, 'BOM-CUP-SPICY-065',    1, '1.0', 'ACTIVE', '매운맛 컵라면 표준 BOM'),
    (2, 'BOM-CUP-MILD-065',     2, '1.0', 'ACTIVE', '순한맛 컵라면 표준 BOM'),
    (3, 'BOM-CUP-SEAFOOD-075',  3, '1.0', 'ACTIVE', '해물맛 컵라면 표준 BOM'),
    (4, 'BOM-CUP-SPICY-065-V2', 1, '2.0', 'REVIEW', '팜유 배합을 포함한 검토 버전');

INSERT INTO bom_item (
    bom_item_id, bom_id, material_id, process_id, spec,
    required_qty, loss_rate, note
) VALUES
    (1, 1, 1, (SELECT process_id FROM manufacturing_process WHERE process_code = 'MIXING'),  '식품용', 0.055, 2.000, '면 원료'),
    (2, 1, 2, (SELECT process_id FROM manufacturing_process WHERE process_code = 'PACKING'), '매운맛', 0.010, 1.000, '분말스프'),
    (3, 1, 5, (SELECT process_id FROM manufacturing_process WHERE process_code = 'PACKING'), '65g용',  1.000, 0.000, '컵 용기'),
    (4, 1, 6, (SELECT process_id FROM manufacturing_process WHERE process_code = 'PACKING'), '65g용',  1.000, 0.000, '용기 뚜껑'),
    (5, 2, 1, (SELECT process_id FROM manufacturing_process WHERE process_code = 'MIXING'),  '식품용', 0.055, 2.000, '면 원료'),
    (6, 2, 3, (SELECT process_id FROM manufacturing_process WHERE process_code = 'PACKING'), '순한맛', 0.010, 1.000, '분말스프'),
    (7, 2, 5, (SELECT process_id FROM manufacturing_process WHERE process_code = 'PACKING'), '65g용',  1.000, 0.000, '컵 용기'),
    (8, 2, 6, (SELECT process_id FROM manufacturing_process WHERE process_code = 'PACKING'), '65g용',  1.000, 0.000, '용기 뚜껑'),
    (9, 3, 1, (SELECT process_id FROM manufacturing_process WHERE process_code = 'MIXING'),  '식품용', 0.065, 2.000, '면 원료'),
    (10,3, 8, (SELECT process_id FROM manufacturing_process WHERE process_code = 'PACKING'), '해물맛', 0.010, 1.000, '분말스프'),
    (11,3, 5, (SELECT process_id FROM manufacturing_process WHERE process_code = 'PACKING'), '75g용',  1.000, 0.000, '컵 용기'),
    (12,3, 6, (SELECT process_id FROM manufacturing_process WHERE process_code = 'PACKING'), '75g용',  1.000, 0.000, '용기 뚜껑'),
    (13,4, 1, (SELECT process_id FROM manufacturing_process WHERE process_code = 'MIXING'),  '식품용', 0.053, 1.500, '배합 개선안'),
    (14,4, 2, (SELECT process_id FROM manufacturing_process WHERE process_code = 'PACKING'), '매운맛', 0.011, 1.000, '스프 증량안'),
    (15,4, 4, (SELECT process_id FROM manufacturing_process WHERE process_code = 'FRYING'),  '식품용', 0.008, 1.000, '유탕용 팜유'),
    (16,4, 5, (SELECT process_id FROM manufacturing_process WHERE process_code = 'PACKING'), '65g용',  1.000, 0.000, '컵 용기'),
    (17,4, 6, (SELECT process_id FROM manufacturing_process WHERE process_code = 'PACKING'), '65g용',  1.000, 0.000, '용기 뚜껑');

INSERT INTO raw_material_lot (
    material_lot_id, material_id, material_lot_no, supplier_name, supplier_lot_no,
    manufacture_date, expiry_date, received_date, received_qty, current_qty
) VALUES
    (1, 1, 'RMLOT-20260723-001', '대한제분',   'SUP-20260720-001', '2026-07-20', '2027-07-20', '2026-07-23', 500.000, 494.500),
    (2, 1, 'RMLOT-20260710-002', '대한제분',   'SUP-20260708-002', '2026-07-08', '2027-07-08', '2026-07-10', 300.000, 300.000),
    (3, 2, 'RMLOT-20260723-002', '한국스프',   'SPICY-20260718',   '2026-07-18', '2027-01-18', '2026-07-23', 100.000, 99.000),
    (4, 3, 'RMLOT-20260723-003', '한국스프',   'MILD-20260718',    '2026-07-18', '2027-01-18', '2026-07-23', 100.000, 100.000),
    (5, 4, 'RMLOT-20260722-001', '서울유지',   'OIL-20260715',     '2026-07-15', '2027-07-15', '2026-07-22', 1000.000,1000.000),
    (6, 5, 'RMLOT-20260723-004', '대한용기',   'CUP-20260720',     '2026-07-20', '2029-07-20', '2026-07-23', 2000.000,1965.000),
    (7, 6, 'RMLOT-20260723-005', '대한용기',   'LID-20260720',     '2026-07-20', '2029-07-20', '2026-07-23', 2000.000,1965.000),
    (8, 7, 'RMLOT-20260722-002', '라인패키지', 'FILM-20260719',    '2026-07-19', '2029-07-19', '2026-07-22', 5000.000,5000.000),
    (9, 8, 'RMLOT-20260723-006', '바다식품',   'SEA-20260718',     '2026-07-18', '2027-01-18', '2026-07-23', 80.000,  80.000),
    (10,9, 'RMLOT-20260110-001', '구형공급사', 'OLD-20260105',     '2026-01-05', '2026-12-31', '2026-01-10', 50.000,  50.000);

INSERT INTO work_order (
    work_order_id, work_order_no, product_id, supervisor_id,
    target_qty, hourly_target_qty, current_qty, good_qty, defect_qty,
    planned_start_date, registered_at, started_at, completed_at, status, remarks
) VALUES
    (1, 'WO-20260724-001', 1, 2, 100, 50, 0,   0,   0, CURRENT_DATE - INTERVAL 1 DAY, CURRENT_TIMESTAMP - INTERVAL 1 HOUR,  NULL,                                  NULL,                                  'PENDING',     '신규 등록/작업 시작 테스트용'),
    (2, 'WO-20260723-001', 1, 2, 100, 50, 35,  33,  2, CURRENT_DATE - INTERVAL 1 DAY, CURRENT_TIMESTAMP - INTERVAL 1 DAY,   CURRENT_TIMESTAMP - INTERVAL 2 HOUR,   NULL,                                  'IN_PROGRESS', 'L1/L2 활성 작업지시 조회용'),
    (3, 'WO-20260722-001', 2, 2, 80,  40, 80,  77,  3, CURRENT_DATE - INTERVAL 2 DAY, CURRENT_TIMESTAMP - INTERVAL 3 DAY,   CURRENT_TIMESTAMP - INTERVAL 2 DAY,    CURRENT_TIMESTAMP - INTERVAL 46 HOUR, 'DONE',        '완료/완제품 재고 생성 완료'),
    (4, 'WO-20260721-001', 3, 3, 120, 60, 115, 110, 5, CURRENT_DATE - INTERVAL 3 DAY, CURRENT_TIMESTAMP - INTERVAL 4 DAY,   CURRENT_TIMESTAMP - INTERVAL 3 DAY,    CURRENT_TIMESTAMP - INTERVAL 68 HOUR, 'DONE',        '완제품 입고 가능 LOT 테스트용'),
    (5, 'WO-20260720-001', 1, 2, 50,  25, 50,  49,  1, CURRENT_DATE - INTERVAL 4 DAY, CURRENT_TIMESTAMP - INTERVAL 5 DAY,   CURRENT_TIMESTAMP - INTERVAL 4 DAY,    CURRENT_TIMESTAMP - INTERVAL 92 HOUR, 'DONE',        '이미 완제품 입고된 LOT'),
    (6, 'WO-20260719-001', 2, 3, 10,  10, 0,   0,   0, CURRENT_DATE - INTERVAL 5 DAY, CURRENT_TIMESTAMP - INTERVAL 6 DAY,   CURRENT_TIMESTAMP - INTERVAL 5 DAY,    CURRENT_TIMESTAMP - INTERVAL 116 HOUR,'DONE',        'goodQty 0 선택 제외 테스트용'),
    (7, 'WO-20260718-001', 2, 2, 60,  30, 0,   0,   0, CURRENT_DATE + INTERVAL 1 DAY, CURRENT_TIMESTAMP - INTERVAL 30 MINUTE,NULL,                                  NULL,                                  'PENDING',     '추가 대기 작업지시');

INSERT INTO production_lot (
    production_lot_id, lot_no, work_order_id, production_qty, good_qty, defect_qty,
    started_at, completed_at, status
) VALUES
    (1, 'LOT-20260724-001', 1, 0,   0,   0, NULL,                                  NULL,                                  'PENDING'),
    (2, 'LOT-20260723-001', 2, 35,  33,  2, CURRENT_TIMESTAMP - INTERVAL 2 HOUR,    NULL,                                  'IN_PROGRESS'),
    (3, 'LOT-20260722-001', 3, 80,  77,  3, CURRENT_TIMESTAMP - INTERVAL 2 DAY,     CURRENT_TIMESTAMP - INTERVAL 46 HOUR, 'COMPLETED'),
    (4, 'LOT-20260721-001', 4, 115, 110, 5, CURRENT_TIMESTAMP - INTERVAL 3 DAY,     CURRENT_TIMESTAMP - INTERVAL 68 HOUR, 'COMPLETED'),
    (5, 'LOT-20260720-001', 5, 50,  49,  1, CURRENT_TIMESTAMP - INTERVAL 4 DAY,     CURRENT_TIMESTAMP - INTERVAL 92 HOUR, 'COMPLETED'),
    (6, 'LOT-20260719-001', 6, 0,   0,   0, CURRENT_TIMESTAMP - INTERVAL 5 DAY,     CURRENT_TIMESTAMP - INTERVAL 116 HOUR,'COMPLETED'),
    (7, 'LOT-20260718-001', 7, 0,   0,   0, NULL,                                  NULL,                                  'PENDING');

INSERT INTO work_order_equipment (work_order_id, equipment_id)
SELECT wo.work_order_id, e.equipment_id
FROM work_order wo
CROSS JOIN equipment e;

INSERT INTO work_order_worker (work_order_id, user_id) VALUES
    (1,4), (1,5),
    (2,4), (2,5), (2,6),
    (3,4), (3,7),
    (4,5), (4,6),
    (5,4), (5,5),
    (6,6),
    (7,6), (7,7);

INSERT INTO production_process_progress (
    production_lot_id, process_id, equipment_id, target_qty,
    production_qty, good_qty, defect_qty, started_at, completed_at, status
)
SELECT
    pl.production_lot_id,
    mp.process_id,
    e.equipment_id,
    wo.target_qty,
    CASE WHEN pl.status = 'PENDING' THEN 0 ELSE pl.production_qty END,
    CASE WHEN pl.status = 'PENDING' THEN 0 ELSE pl.good_qty END,
    CASE WHEN pl.status = 'PENDING' THEN 0 ELSE pl.defect_qty END,
    pl.started_at,
    pl.completed_at,
    pl.status
FROM production_lot pl
JOIN work_order wo ON wo.work_order_id = pl.work_order_id
CROSS JOIN manufacturing_process mp
LEFT JOIN equipment e ON e.process_id = mp.process_id;

INSERT INTO work_order_status_history (
    work_order_id, changed_by_id, action, prev_status, new_status, changed_at, note
) VALUES
    (1,2,'REGISTERED',NULL,'PENDING',     CURRENT_TIMESTAMP - INTERVAL 1 HOUR,   '작업지시 등록'),
    (2,2,'REGISTERED',NULL,'PENDING',     CURRENT_TIMESTAMP - INTERVAL 1 DAY,    '작업지시 등록'),
    (2,2,'START',     'PENDING','IN_PROGRESS',CURRENT_TIMESTAMP - INTERVAL 2 HOUR,'작업 시작'),
    (3,2,'REGISTERED',NULL,'PENDING',     CURRENT_TIMESTAMP - INTERVAL 3 DAY,    '작업지시 등록'),
    (3,2,'START',     'PENDING','IN_PROGRESS',CURRENT_TIMESTAMP - INTERVAL 2 DAY,'작업 시작'),
    (3,2,'COMPLETE',  'IN_PROGRESS','DONE',CURRENT_TIMESTAMP - INTERVAL 46 HOUR, '작업 완료'),
    (4,3,'REGISTERED',NULL,'PENDING',     CURRENT_TIMESTAMP - INTERVAL 4 DAY,    '작업지시 등록'),
    (4,3,'START',     'PENDING','IN_PROGRESS',CURRENT_TIMESTAMP - INTERVAL 3 DAY,'작업 시작'),
    (4,3,'HOLD',      'IN_PROGRESS','HOLD',CURRENT_TIMESTAMP - INTERVAL 71 HOUR, '품질 점검으로 보류'),
    (4,3,'RESUME',    'HOLD','IN_PROGRESS',CURRENT_TIMESTAMP - INTERVAL 70 HOUR, '품질 점검 완료'),
    (4,3,'COMPLETE',  'IN_PROGRESS','DONE',CURRENT_TIMESTAMP - INTERVAL 68 HOUR, '작업 완료'),
    (5,2,'REGISTERED',NULL,'PENDING',     CURRENT_TIMESTAMP - INTERVAL 5 DAY,    '작업지시 등록'),
    (5,2,'START',     'PENDING','IN_PROGRESS',CURRENT_TIMESTAMP - INTERVAL 4 DAY,'작업 시작'),
    (5,2,'COMPLETE',  'IN_PROGRESS','DONE',CURRENT_TIMESTAMP - INTERVAL 92 HOUR, '작업 완료'),
    (6,3,'REGISTERED',NULL,'PENDING',     CURRENT_TIMESTAMP - INTERVAL 6 DAY,    '작업지시 등록'),
    (6,3,'START',     'PENDING','IN_PROGRESS',CURRENT_TIMESTAMP - INTERVAL 5 DAY,'작업 시작'),
    (6,3,'COMPLETE',  'IN_PROGRESS','DONE',CURRENT_TIMESTAMP - INTERVAL 116 HOUR,'생산 없이 작업 종료'),
    (7,2,'REGISTERED',NULL,'PENDING',     CURRENT_TIMESTAMP - INTERVAL 30 MINUTE,'작업지시 등록');

INSERT INTO hourly_production (
    work_order_id, bucket_start, bucket_end, received_at,
    target_qty, production_qty, good_qty, defect_qty, is_partial, close_reason
) VALUES
    (2, CURRENT_TIMESTAMP - INTERVAL 2 HOUR, CURRENT_TIMESTAMP - INTERVAL 1 HOUR, CURRENT_TIMESTAMP - INTERVAL 59 MINUTE, 100, 20, 19, 1, false, 'HOURLY'),
    (2, CURRENT_TIMESTAMP - INTERVAL 1 HOUR, CURRENT_TIMESTAMP - INTERVAL 1 MINUTE,CURRENT_TIMESTAMP - INTERVAL 2 MINUTE,  100, 15, 14, 1, true,  'HOURLY'),
    (3, CURRENT_TIMESTAMP - INTERVAL 48 HOUR,CURRENT_TIMESTAMP - INTERVAL 47 HOUR,CURRENT_TIMESTAMP - INTERVAL 47 HOUR,   80,  40, 39, 1, false, 'HOURLY'),
    (3, CURRENT_TIMESTAMP - INTERVAL 47 HOUR,CURRENT_TIMESTAMP - INTERVAL 46 HOUR,CURRENT_TIMESTAMP - INTERVAL 46 HOUR,   80,  40, 38, 2, true,  'WORK_ORDER_COMPLETED'),
    (4, CURRENT_TIMESTAMP - INTERVAL 70 HOUR,CURRENT_TIMESTAMP - INTERVAL 69 HOUR,CURRENT_TIMESTAMP - INTERVAL 69 HOUR,   120, 60, 58, 2, false, 'HOURLY'),
    (4, CURRENT_TIMESTAMP - INTERVAL 69 HOUR,CURRENT_TIMESTAMP - INTERVAL 68 HOUR,CURRENT_TIMESTAMP - INTERVAL 68 HOUR,   120, 55, 52, 3, true,  'WORK_ORDER_COMPLETED'),
    (5, CURRENT_TIMESTAMP - INTERVAL 94 HOUR,CURRENT_TIMESTAMP - INTERVAL 93 HOUR,CURRENT_TIMESTAMP - INTERVAL 93 HOUR,   50,  25, 25, 0, false, 'HOURLY'),
    (5, CURRENT_TIMESTAMP - INTERVAL 93 HOUR,CURRENT_TIMESTAMP - INTERVAL 92 HOUR,CURRENT_TIMESTAMP - INTERVAL 92 HOUR,   50,  25, 24, 1, true,  'WORK_ORDER_COMPLETED');

INSERT INTO production_result (
    result_no, production_lot_id, target_qty, production_qty, good_qty, defect_qty,
    status, started_at, created_at, updated_at, last_aggregated_at, completed_at
) VALUES
    ('RESULT-20260723-001', 2, 100, 35,  33,  2, 'COLLECTING', CURRENT_TIMESTAMP - INTERVAL 2 HOUR, CURRENT_TIMESTAMP - INTERVAL 2 HOUR, CURRENT_TIMESTAMP - INTERVAL 2 MINUTE, CURRENT_TIMESTAMP - INTERVAL 2 MINUTE, NULL),
    ('RESULT-20260722-001', 3, 80,  80,  77,  3, 'COMPLETED',  CURRENT_TIMESTAMP - INTERVAL 2 DAY,  CURRENT_TIMESTAMP - INTERVAL 2 DAY,  CURRENT_TIMESTAMP - INTERVAL 46 HOUR, CURRENT_TIMESTAMP - INTERVAL 46 HOUR, CURRENT_TIMESTAMP - INTERVAL 46 HOUR),
    ('RESULT-20260721-001', 4, 120, 115, 110, 5, 'COMPLETED',  CURRENT_TIMESTAMP - INTERVAL 3 DAY,  CURRENT_TIMESTAMP - INTERVAL 3 DAY,  CURRENT_TIMESTAMP - INTERVAL 68 HOUR, CURRENT_TIMESTAMP - INTERVAL 68 HOUR, CURRENT_TIMESTAMP - INTERVAL 68 HOUR),
    ('RESULT-20260720-001', 5, 50,  50,  49,  1, 'COMPLETED',  CURRENT_TIMESTAMP - INTERVAL 4 DAY,  CURRENT_TIMESTAMP - INTERVAL 4 DAY,  CURRENT_TIMESTAMP - INTERVAL 92 HOUR, CURRENT_TIMESTAMP - INTERVAL 92 HOUR, CURRENT_TIMESTAMP - INTERVAL 92 HOUR);

INSERT INTO production_lot_material (
    production_lot_id, material_lot_id, used_qty
) VALUES
    (2, 1, 5.500),
    (2, 3, 1.000),
    (2, 6, 35.000),
    (2, 7, 35.000);

INSERT INTO product_inventory (
    inventory_id, production_lot_id, current_qty, safety_stock_qty, expiry_date, created_at
) VALUES
    (1, 3, 70, 20, CURRENT_DATE + INTERVAL 180 DAY, CURRENT_TIMESTAMP - INTERVAL 45 HOUR),
    (2, 5, 49, 15, CURRENT_DATE + INTERVAL 175 DAY, CURRENT_TIMESTAMP - INTERVAL 91 HOUR);

INSERT INTO inventory_movement (
    movement_no, item_type, movement_type, raw_material_lot_id, product_inventory_id,
    quantity, occurred_at, handled_by_id, remarks
) VALUES
    ('MV-RM-IN-001', 'RAW_MATERIAL',    'INBOUND',  1, NULL, 500.000, CURRENT_TIMESTAMP - INTERVAL 1 DAY,   1, '밀가루 최초 입고'),
    ('MV-RM-IN-002', 'RAW_MATERIAL',    'INBOUND',  2, NULL, 300.000, CURRENT_TIMESTAMP - INTERVAL 14 DAY,  1, '밀가루 추가 입고'),
    ('MV-RM-IN-003', 'RAW_MATERIAL',    'INBOUND',  3, NULL, 100.000, CURRENT_TIMESTAMP - INTERVAL 1 DAY,   1, '매운맛 스프 입고'),
    ('MV-RM-IN-004', 'RAW_MATERIAL',    'INBOUND',  4, NULL, 100.000, CURRENT_TIMESTAMP - INTERVAL 1 DAY,   1, '순한맛 스프 입고'),
    ('MV-RM-IN-005', 'RAW_MATERIAL',    'INBOUND',  5, NULL, 1000.000,CURRENT_TIMESTAMP - INTERVAL 2 DAY,   1, '팜유 입고'),
    ('MV-RM-IN-006', 'RAW_MATERIAL',    'INBOUND',  6, NULL, 2000.000,CURRENT_TIMESTAMP - INTERVAL 1 DAY,   1, '종이 용기 입고'),
    ('MV-RM-IN-007', 'RAW_MATERIAL',    'INBOUND',  7, NULL, 2000.000,CURRENT_TIMESTAMP - INTERVAL 1 DAY,   1, '용기 뚜껑 입고'),
    ('MV-RM-IN-008', 'RAW_MATERIAL',    'INBOUND',  8, NULL, 5000.000,CURRENT_TIMESTAMP - INTERVAL 2 DAY,   1, '포장 필름 입고'),
    ('MV-RM-IN-009', 'RAW_MATERIAL',    'INBOUND',  9, NULL, 80.000, CURRENT_TIMESTAMP - INTERVAL 1 DAY,   1, '해물맛 스프 입고'),
    ('MV-RM-IN-010', 'RAW_MATERIAL',    'INBOUND', 10, NULL, 50.000, CURRENT_TIMESTAMP - INTERVAL 190 DAY, 1, '단종 원자재 과거 입고'),
    ('MV-RM-OUT-001','RAW_MATERIAL',    'OUTBOUND', 1, NULL, 5.500,  CURRENT_TIMESTAMP - INTERVAL 90 MINUTE,2, 'LOT-20260723-001 실제 사용'),
    ('MV-RM-OUT-002','RAW_MATERIAL',    'OUTBOUND', 3, NULL, 1.000,  CURRENT_TIMESTAMP - INTERVAL 88 MINUTE,2, 'LOT-20260723-001 실제 사용'),
    ('MV-RM-OUT-003','RAW_MATERIAL',    'OUTBOUND', 6, NULL, 35.000, CURRENT_TIMESTAMP - INTERVAL 85 MINUTE,2, 'LOT-20260723-001 실제 사용'),
    ('MV-RM-OUT-004','RAW_MATERIAL',    'OUTBOUND', 7, NULL, 35.000, CURRENT_TIMESTAMP - INTERVAL 84 MINUTE,2, 'LOT-20260723-001 실제 사용'),
    ('MV-FG-IN-001', 'FINISHED_PRODUCT','INBOUND',  NULL, 1, 77.000, CURRENT_TIMESTAMP - INTERVAL 45 HOUR, 2, 'LOT-20260722-001 완제품 입고'),
    ('MV-FG-OUT-001','FINISHED_PRODUCT','OUTBOUND', NULL, 1, 7.000,  CURRENT_TIMESTAMP - INTERVAL 20 HOUR, 1, '완제품 샘플 출고'),
    ('MV-FG-IN-002', 'FINISHED_PRODUCT','INBOUND',  NULL, 2, 49.000, CURRENT_TIMESTAMP - INTERVAL 91 HOUR, 2, 'LOT-20260720-001 완제품 입고');

INSERT INTO worker_profile (
    worker_profile_id, user_id, primary_process_id, team_name, joined_date, shift_type
) VALUES
    (1, 4, (SELECT process_id FROM manufacturing_process WHERE process_code = 'MIXING'),         '생산 1팀', '2024-03-04', 'DAY'),
    (2, 5, (SELECT process_id FROM manufacturing_process WHERE process_code = 'PACKING'),        '생산 1팀', '2024-05-13', 'DAY'),
    (3, 6, (SELECT process_id FROM manufacturing_process WHERE process_code = 'INSPECTION'),     '품질 1팀', '2025-01-06', 'ROTATING'),
    (4, 7, (SELECT process_id FROM manufacturing_process WHERE process_code = 'NOODLE_MAKING'),  '생산 2팀', '2025-06-02', 'NIGHT');

INSERT INTO worker_skill (worker_profile_id, skill_name) VALUES
    (1, '혼합기 운전'), (1, '원료 계량'),
    (2, '포장기 운전'), (2, '자주검사'),
    (3, '품질 검사'),   (3, '불량 판정'),
    (4, '제면기 운전'), (4, '설비 점검');

INSERT INTO equipment_assignment (
    user_id, equipment_id, started_at, ended_at
) VALUES
    (4, (SELECT equipment_id FROM equipment WHERE equipment_code = 'MIXER-01'),     CURRENT_TIMESTAMP - INTERVAL 2 HOUR, NULL),
    (5, (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),    CURRENT_TIMESTAMP - INTERVAL 2 HOUR, NULL),
    (6, (SELECT equipment_id FROM equipment WHERE equipment_code = 'INSPECTOR-01'), CURRENT_TIMESTAMP - INTERVAL 2 HOUR, NULL),
    (7, (SELECT equipment_id FROM equipment WHERE equipment_code = 'NOODLE-01'),    CURRENT_TIMESTAMP - INTERVAL 3 DAY,  CURRENT_TIMESTAMP - INTERVAL 68 HOUR);

INSERT INTO equipment_telemetry (
    equipment_id, work_order_id, metric_type, metric_value, unit, measured_at
)
SELECT
    e.equipment_id,
    2,
    metrics.metric_type,
    CASE metrics.metric_type
        WHEN 'TEMPERATURE' THEN 55.0000 + e.equipment_id
        WHEN 'HUMIDITY' THEN 38.0000 + e.equipment_id
        ELSE 90.0000 + e.equipment_id
    END,
    CASE metrics.metric_type
        WHEN 'TEMPERATURE' THEN '°C'
        WHEN 'HUMIDITY' THEN '%'
        ELSE 'EA/min'
    END,
    CURRENT_TIMESTAMP - INTERVAL metrics.minutes_ago MINUTE
FROM equipment e
CROSS JOIN (
    SELECT 'TEMPERATURE' AS metric_type, 3 AS minutes_ago
    UNION ALL SELECT 'HUMIDITY', 2
    UNION ALL SELECT 'SPEED', 1
) metrics;

UPDATE equipment
SET status = 'RUNNING'
WHERE equipment_code IN (
    'MIXER-01', 'ROLLER-01', 'NOODLE-01', 'STEAMER-01', 'CUTTER-01',
    'FRYER-01', 'COOLER-01', 'PACKER-01', 'INSPECTOR-01'
);

INSERT INTO defect (
    defect_no, idempotency_key, production_lot_id, equipment_id,
    defect_type_id, quantity, occurred_at, cause, status
) VALUES
    ('DF-20260723-001', 'seed-defect-20260723-001', 2, (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),    (SELECT defect_type_id FROM defect_type WHERE code = 'SEALING'),          1, CURRENT_TIMESTAMP - INTERVAL 70 MINUTE, '실링 온도 편차',       'UNHANDLED'),
    ('DF-20260723-002', 'seed-defect-20260723-002', 2, (SELECT equipment_id FROM equipment WHERE equipment_code = 'FRYER-01'),    (SELECT defect_type_id FROM defect_type WHERE code = 'MOISTURE'),         1, CURRENT_TIMESTAMP - INTERVAL 55 MINUTE, '유탕 시간 편차',       'IN_PROGRESS'),
    ('DF-20260722-001', 'seed-defect-20260722-001', 3, (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),    (SELECT defect_type_id FROM defect_type WHERE code = 'SEALING'),          1, CURRENT_TIMESTAMP - INTERVAL 47 HOUR,   '포장 필름 정렬 불량',   'COMPLETED'),
    ('DF-20260722-002', 'seed-defect-20260722-002', 3, (SELECT equipment_id FROM equipment WHERE equipment_code = 'INSPECTOR-01'), (SELECT defect_type_id FROM defect_type WHERE code = 'WEIGHT'),           2, CURRENT_TIMESTAMP - INTERVAL 46 HOUR,   '내용량 기준 미달',      'COMPLETED'),
    ('DF-20260721-001', 'seed-defect-20260721-001', 4, (SELECT equipment_id FROM equipment WHERE equipment_code = 'MIXER-01'),     (SELECT defect_type_id FROM defect_type WHERE code = 'FOREIGN_MATERIAL'), 2, CURRENT_TIMESTAMP - INTERVAL 70 HOUR,   '원료 육안 검사 보류',   'ON_HOLD'),
    ('DF-20260721-002', 'seed-defect-20260721-002', 4, (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),    (SELECT defect_type_id FROM defect_type WHERE code = 'SEALING'),          3, CURRENT_TIMESTAMP - INTERVAL 69 HOUR,   '뚜껑 실링 압력 부족',   'COMPLETED'),
    ('DF-20260720-001', 'seed-defect-20260720-001', 5, (SELECT equipment_id FROM equipment WHERE equipment_code = 'INSPECTOR-01'), (SELECT defect_type_id FROM defect_type WHERE code = 'WEIGHT'),           1, CURRENT_TIMESTAMP - INTERVAL 93 HOUR,   '중량 검사 기준 미달',  'COMPLETED');

INSERT INTO defect_handling_history (
    defect_id, handled_by_id, status, handle_method, content, handled_at
) VALUES
    ((SELECT defect_id FROM defect WHERE defect_no = 'DF-20260723-002'), 3, 'IN_PROGRESS', NULL,              '유탕기 설정값과 원료 수분을 점검 중', CURRENT_TIMESTAMP - INTERVAL 45 MINUTE),
    ((SELECT defect_id FROM defect WHERE defect_no = 'DF-20260722-001'), 3, 'COMPLETED',   'REWORK',          '필름 위치 조정 후 재포장 완료',       CURRENT_TIMESTAMP - INTERVAL 46 HOUR),
    ((SELECT defect_id FROM defect WHERE defect_no = 'DF-20260722-002'), 3, 'COMPLETED',   'DISPOSAL',        '중량 미달품 폐기 완료',              CURRENT_TIMESTAMP - INTERVAL 45 HOUR),
    ((SELECT defect_id FROM defect WHERE defect_no = 'DF-20260721-001'), 3, 'ON_HOLD',     NULL,              '원료 시료 분석 결과 대기',           CURRENT_TIMESTAMP - INTERVAL 69 HOUR),
    ((SELECT defect_id FROM defect WHERE defect_no = 'DF-20260721-002'), 3, 'COMPLETED',   'REWORK',          '실링 압력 조정 후 재작업 완료',       CURRENT_TIMESTAMP - INTERVAL 68 HOUR),
    ((SELECT defect_id FROM defect WHERE defect_no = 'DF-20260720-001'), 3, 'COMPLETED',   'NORMAL_APPROVAL', '재측정 결과 허용 범위 확인',          CURRENT_TIMESTAMP - INTERVAL 92 HOUR);

INSERT INTO alarm (
    alarm_no, equipment_id, handler_id, message, severity, status,
    occurred_at, resolved_at, description, handling_content
) VALUES
    ('ALM-20260724-001', (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),    NULL, '포장기 실링 온도 상한 경고',       'WARNING',  'PENDING_CONFIRMATION', CURRENT_TIMESTAMP - INTERVAL 15 MINUTE, NULL,                                  '설정 상한보다 온도가 높습니다.',         NULL),
    ('ALM-20260724-002', (SELECT equipment_id FROM equipment WHERE equipment_code = 'FRYER-01'),    3,    '유탕기 수분 편차 점검 중',          'CRITICAL', 'IN_PROGRESS',         CURRENT_TIMESTAMP - INTERVAL 50 MINUTE, NULL,                                  '품질 기준을 벗어난 수분값이 감지되었습니다.','시료 채취 및 설정값 확인 중'),
    ('ALM-20260724-003', (SELECT equipment_id FROM equipment WHERE equipment_code = 'MIXER-01'),    2,    '혼합기 진동 증가 모니터링',          'INFO',     'MONITORING',          CURRENT_TIMESTAMP - INTERVAL 2 HOUR,   NULL,                                  '진동값이 평소보다 높습니다.',             '베어링 상태 모니터링'),
    ('ALM-20260724-004', (SELECT equipment_id FROM equipment WHERE equipment_code = 'INSPECTOR-01'),3,    '검사기 정기 점검 예약',              'INFO',     'INSPECTION_RESERVED', CURRENT_TIMESTAMP - INTERVAL 4 HOUR,   NULL,                                  '교정 주기 도래 예정입니다.',              '다음 비가동 시간에 교정 예정'),
    ('ALM-20260723-001', (SELECT equipment_id FROM equipment WHERE equipment_code = 'ROLLER-01'),   2,    '압연기 두께 편차 해소',              'WARNING',  'RESOLVED',            CURRENT_TIMESTAMP - INTERVAL 20 HOUR,  CURRENT_TIMESTAMP - INTERVAL 19 HOUR, '롤 간격 편차가 감지되었습니다.',          '롤 간격 재설정 완료'),
    ('ALM-20260723-002', (SELECT equipment_id FROM equipment WHERE equipment_code = 'NOODLE-01'),   2,    '제면기 절삭 상태 정상화',            'WARNING',  'RESOLVED',            CURRENT_TIMESTAMP - INTERVAL 22 HOUR,  CURRENT_TIMESTAMP - INTERVAL 21 HOUR, '면 폭 편차가 감지되었습니다.',            '칼날 청소 후 정상 확인'),
    ('ALM-20260722-001', (SELECT equipment_id FROM equipment WHERE equipment_code = 'STEAMER-01'),  2,    '증숙기 압력 경고 처리 완료',          'CRITICAL', 'RESOLVED',            CURRENT_TIMESTAMP - INTERVAL 48 HOUR,  CURRENT_TIMESTAMP - INTERVAL 47 HOUR, '증기 압력이 기준을 초과했습니다.',         '압력 밸브 점검 완료'),
    ('ALM-20260722-002', (SELECT equipment_id FROM equipment WHERE equipment_code = 'CUTTER-01'),   2,    '절단기 센서 오염 처리 완료',          'INFO',     'RESOLVED',            CURRENT_TIMESTAMP - INTERVAL 49 HOUR,  CURRENT_TIMESTAMP - INTERVAL 48 HOUR, '제품 감지 센서 신호가 불안정했습니다.',     '센서 표면 청소 완료'),
    ('ALM-20260721-001', (SELECT equipment_id FROM equipment WHERE equipment_code = 'COOLER-01'),   3,    '냉각기 온도 회복 완료',              'WARNING',  'RESOLVED',            CURRENT_TIMESTAMP - INTERVAL 72 HOUR,  CURRENT_TIMESTAMP - INTERVAL 71 HOUR, '냉각 출구 온도가 높았습니다.',             '냉각팬 점검 후 정상화'),
    ('ALM-20260720-001', (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),   3,    '포장 필름 공급 지연 처리 완료',       'INFO',     'RESOLVED',            CURRENT_TIMESTAMP - INTERVAL 96 HOUR,  CURRENT_TIMESTAMP - INTERVAL 95 HOUR, '필름 공급 속도가 일시적으로 저하되었습니다.','필름 장력 조정 완료');

-- ============================================================================
-- 알람 이력·품질관리 화면 체크리스트용 데이터
-- TC-AL-* : 알람 화면 테스트 데이터
-- TC-Q-*  : 품질관리 화면 테스트 데이터
--
-- 화면 테스트 경계:
--   * 현재 알람 33건 이상, 알람 이력 20건 이상
--   * 단일 설비/심각도 알람 101건으로 size=100 제한 확인
--   * 불량 목록 20건 이상, 상태 4종과 처리방법 3종 확인
--   * 생산 LOT 108건으로 등록 화면 size=100 제한 확인
--   * 최근 7일/30일 및 이전 비교기간 통계 확인
-- ============================================================================

CREATE TEMPORARY TABLE screen_test_sequence (
    seq INT NOT NULL PRIMARY KEY
);

INSERT INTO screen_test_sequence (seq)
SELECT
    hundreds.n * 100 + tens.n * 10 + ones.n + 1
FROM (
    SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
) ones
CROSS JOIN (
    SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
) tens
CROSS JOIN (
    SELECT 0 AS n UNION ALL SELECT 1
) hundreds
WHERE hundreds.n * 100 + tens.n * 10 + ones.n < 101;

SET @screen_test_now_utc = UTC_TIMESTAMP(6);
SET @screen_test_kst_today_utc =
    DATE(@screen_test_now_utc + INTERVAL 9 HOUR) - INTERVAL 9 HOUR;
SET @screen_test_30d_from_utc =
    TIMESTAMPADD(DAY, -29, @screen_test_kst_today_utc);

-- ----------------------------------------------------------------------------
-- 품질관리: 생산 LOT 선택 목록 100건 경계
-- 기존 7건에 완료 작업지시/LOT 101건을 더해 총 108건을 만든다.
-- TC-Q-LOT-101은 오래된 LOT이므로 size=100 조회에서 누락되는지 확인할 수 있다.
-- 추가 작업지시는 모두 DONE이므로 활성 작업지시는 기존 1건만 유지된다.
-- ----------------------------------------------------------------------------

INSERT INTO work_order (
    work_order_no, product_id, supervisor_id,
    target_qty, hourly_target_qty, current_qty, good_qty, defect_qty,
    planned_start_date, registered_at, started_at, completed_at, status, remarks
)
SELECT
    CONCAT('TC-Q-WO-', LPAD(s.seq, 3, '0')),
    CASE WHEN s.seq = 101 THEN 4 ELSE 1 END,
    3,
    1,
    1,
    1,
    1,
    0,
    DATE(TIMESTAMPADD(DAY, 0 - 40 - s.seq, @screen_test_now_utc)),
    TIMESTAMPADD(DAY, 0 - 42 - s.seq, @screen_test_now_utc),
    TIMESTAMPADD(DAY, 0 - 41 - s.seq, @screen_test_now_utc),
    TIMESTAMPADD(DAY, 0 - 40 - s.seq, @screen_test_now_utc),
    'DONE',
    CONCAT('품질 LOT 100건 경계 테스트 ', LPAD(s.seq, 3, '0'))
FROM screen_test_sequence s;

INSERT INTO production_lot (
    lot_no, work_order_id, production_qty, good_qty, defect_qty,
    started_at, completed_at, status
)
SELECT
    CONCAT('TC-Q-LOT-', LPAD(s.seq, 3, '0')),
    wo.work_order_id,
    1,
    1,
    0,
    wo.started_at,
    wo.completed_at,
    'COMPLETED'
FROM screen_test_sequence s
JOIN work_order wo
  ON wo.work_order_no = CONCAT('TC-Q-WO-', LPAD(s.seq, 3, '0'));

-- ----------------------------------------------------------------------------
-- 품질관리: 통계 7일/30일 및 이전 기간 비교용 생산수량
-- ----------------------------------------------------------------------------

INSERT INTO hourly_production (
    work_order_id, bucket_start, bucket_end, received_at,
    target_qty, production_qty, good_qty, defect_qty, is_partial, close_reason
) VALUES
    (
        3,
        TIMESTAMPADD(DAY, -10, @screen_test_now_utc),
        TIMESTAMPADD(HOUR, 1, TIMESTAMPADD(DAY, -10, @screen_test_now_utc)),
        TIMESTAMPADD(HOUR, 1, TIMESTAMPADD(DAY, -10, @screen_test_now_utc)),
        100, 100, 98, 2, false, 'HOURLY'
    ),
    (
        4,
        @screen_test_30d_from_utc,
        TIMESTAMPADD(HOUR, 1, @screen_test_30d_from_utc),
        TIMESTAMPADD(HOUR, 1, @screen_test_30d_from_utc),
        120, 120, 117, 3, false, 'HOURLY'
    ),
    (
        5,
        TIMESTAMPADD(DAY, -31, @screen_test_now_utc),
        TIMESTAMPADD(HOUR, 1, TIMESTAMPADD(DAY, -31, @screen_test_now_utc)),
        TIMESTAMPADD(HOUR, 1, TIMESTAMPADD(DAY, -31, @screen_test_now_utc)),
        80, 80, 76, 4, false, 'HOURLY'
    ),
    (
        3,
        TIMESTAMPADD(DAY, -35, @screen_test_now_utc),
        TIMESTAMPADD(HOUR, 1, TIMESTAMPADD(DAY, -35, @screen_test_now_utc)),
        TIMESTAMPADD(HOUR, 1, TIMESTAMPADD(DAY, -35, @screen_test_now_utc)),
        100, 100, 99, 1, false, 'HOURLY'
    );

-- ----------------------------------------------------------------------------
-- 품질관리: 상세·상태·처리방법·동일시각·기간 경계 테스트
-- ----------------------------------------------------------------------------

INSERT INTO defect (
    defect_no, idempotency_key, production_lot_id, equipment_id,
    defect_type_id, quantity, occurred_at, cause, status
) VALUES
    (
        'TC-Q-DETAIL-UNHANDLED', 'screen-tc-q-detail-unhandled', 2,
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),
        (SELECT defect_type_id FROM defect_type WHERE code = 'SEALING'),
        1, CURRENT_TIMESTAMP - INTERVAL 20 MINUTE, '상세 원인 수정 전', 'UNHANDLED'
    ),
    (
        'TC-Q-DETAIL-INPROGRESS', 'screen-tc-q-detail-inprogress', 2,
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'FRYER-01'),
        (SELECT defect_type_id FROM defect_type WHERE code = 'MOISTURE'),
        2, CURRENT_TIMESTAMP - INTERVAL 21 MINUTE, '처리 중 상세 테스트', 'IN_PROGRESS'
    ),
    (
        'TC-Q-DETAIL-ONHOLD', 'screen-tc-q-detail-onhold', 3,
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'MIXER-01'),
        (SELECT defect_type_id FROM defect_type WHERE code = 'FOREIGN_MATERIAL'),
        3, CURRENT_TIMESTAMP - INTERVAL 22 MINUTE, '보류 상세 테스트', 'ON_HOLD'
    ),
    (
        'TC-Q-COMP-NORMAL', 'screen-tc-q-comp-normal', 3,
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'INSPECTOR-01'),
        (SELECT defect_type_id FROM defect_type WHERE code = 'WEIGHT'),
        1, CURRENT_TIMESTAMP - INTERVAL 23 MINUTE, '정상 승인 완료 테스트', 'COMPLETED'
    ),
    (
        'TC-Q-COMP-REWORK', 'screen-tc-q-comp-rework', 4,
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),
        (SELECT defect_type_id FROM defect_type WHERE code = 'SEALING'),
        2, CURRENT_TIMESTAMP - INTERVAL 24 MINUTE, '재작업 완료 테스트', 'COMPLETED'
    ),
    (
        'TC-Q-COMP-DISPOSAL', 'screen-tc-q-comp-disposal', 4,
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'FRYER-01'),
        (SELECT defect_type_id FROM defect_type WHERE code = 'MOISTURE'),
        3, CURRENT_TIMESTAMP - INTERVAL 25 MINUTE, '폐기 완료 테스트', 'COMPLETED'
    ),
    (
        'TC-Q-DETAIL-HISTORY', 'screen-tc-q-detail-history', 5,
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'INSPECTOR-01'),
        (SELECT defect_type_id FROM defect_type WHERE code = 'WEIGHT'),
        2, CURRENT_TIMESTAMP - INTERVAL 26 MINUTE, '처리이력 정렬 테스트', 'ON_HOLD'
    ),
    (
        'TC-Q-INACTIVE-TYPE', 'screen-tc-q-inactive-type', 5,
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),
        (SELECT defect_type_id FROM defect_type WHERE code = 'LEGACY_DISABLED'),
        1, CURRENT_TIMESTAMP - INTERVAL 27 MINUTE, '비활성 유형 과거 이력', 'UNHANDLED'
    ),
    (
        'TC-Q-ZERO-PROD', 'screen-tc-q-zero-production',
        (SELECT production_lot_id FROM production_lot WHERE lot_no = 'TC-Q-LOT-101'),
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'ROLLER-01'),
        (SELECT defect_type_id FROM defect_type WHERE code = 'SEALING'),
        2, CURRENT_TIMESTAMP - INTERVAL 28 MINUTE, '시간 생산수량 0 제품 테스트', 'UNHANDLED'
    ),
    (
        'TC-Q-SAME-001', 'screen-tc-q-same-001', 2,
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),
        (SELECT defect_type_id FROM defect_type WHERE code = 'SEALING'),
        1, CURRENT_TIMESTAMP - INTERVAL 8 HOUR, '동일 발생시각 첫 번째', 'UNHANDLED'
    ),
    (
        'TC-Q-SAME-002', 'screen-tc-q-same-002', 2,
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),
        (SELECT defect_type_id FROM defect_type WHERE code = 'SEALING'),
        1, CURRENT_TIMESTAMP - INTERVAL 8 HOUR, '동일 발생시각 두 번째', 'UNHANDLED'
    ),
    (
        'TC-Q-STAT-10D', 'screen-tc-q-stat-10d', 3,
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'STEAMER-01'),
        (SELECT defect_type_id FROM defect_type WHERE code = 'SEALING'),
        2, TIMESTAMPADD(DAY, -10, CURRENT_TIMESTAMP), '최근 30일 통계 포함', 'COMPLETED'
    ),
    (
        'TC-Q-STAT-29D', 'screen-tc-q-stat-29d', 4,
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'CUTTER-01'),
        (SELECT defect_type_id FROM defect_type WHERE code = 'MOISTURE'),
        3, @screen_test_30d_from_utc, '최근 30일 경계 포함', 'UNHANDLED'
    ),
    (
        'TC-Q-STAT-31D', 'screen-tc-q-stat-31d', 5,
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'COOLER-01'),
        (SELECT defect_type_id FROM defect_type WHERE code = 'WEIGHT'),
        4, TIMESTAMPADD(DAY, -31, CURRENT_TIMESTAMP), '최근 30일 통계 제외', 'COMPLETED'
    ),
    (
        'TC-Q-STAT-PREV', 'screen-tc-q-stat-previous', 3,
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),
        (SELECT defect_type_id FROM defect_type WHERE code = 'SEALING'),
        1, TIMESTAMPADD(DAY, -35, CURRENT_TIMESTAMP), '이전 비교기간 통계', 'COMPLETED'
    );

-- 품질관리 목록 페이지네이션과 서버 검색용 24건
INSERT INTO defect (
    defect_no, idempotency_key, production_lot_id, equipment_id,
    defect_type_id, quantity, occurred_at, cause, status
)
SELECT
    CONCAT('TC-Q-PAGE-', LPAD(s.seq, 3, '0')),
    CONCAT('screen-tc-q-page-', LPAD(s.seq, 3, '0')),
    pl.production_lot_id,
    e.equipment_id,
    dt.defect_type_id,
    MOD(s.seq, 5) + 1,
    TIMESTAMPADD(MINUTE, 0 - 60 - s.seq, CURRENT_TIMESTAMP),
    CASE
        WHEN s.seq = 24 THEN 'PAGE2_SEARCH_TOKEN 특수문자 %_ 검색'
        ELSE CONCAT('품질 페이징 테스트 원인 ', LPAD(s.seq, 3, '0'))
    END,
    CASE MOD(s.seq, 4)
        WHEN 1 THEN 'UNHANDLED'
        WHEN 2 THEN 'IN_PROGRESS'
        WHEN 3 THEN 'ON_HOLD'
        ELSE 'COMPLETED'
    END
FROM screen_test_sequence s
JOIN production_lot pl
  ON pl.production_lot_id = 2 + MOD(s.seq - 1, 4)
JOIN equipment e
  ON e.equipment_code = CASE MOD(s.seq, 5)
      WHEN 0 THEN 'PACKER-01'
      WHEN 1 THEN 'FRYER-01'
      WHEN 2 THEN 'INSPECTOR-01'
      WHEN 3 THEN 'MIXER-01'
      ELSE 'COOLER-01'
  END
JOIN defect_type dt
  ON dt.code = CASE MOD(s.seq, 4)
      WHEN 0 THEN 'SEALING'
      WHEN 1 THEN 'MOISTURE'
      WHEN 2 THEN 'WEIGHT'
      ELSE 'FOREIGN_MATERIAL'
  END
WHERE s.seq <= 24;

-- 상세 화면의 상태와 처리방법 3종 및 다건 처리이력
INSERT INTO defect_handling_history (
    defect_id, handled_by_id, status, handle_method, content, handled_at
) VALUES
    (
        (SELECT defect_id FROM defect WHERE defect_no = 'TC-Q-DETAIL-INPROGRESS'),
        3, 'IN_PROGRESS', NULL, '원인 분석 및 설비 점검 중',
        CURRENT_TIMESTAMP - INTERVAL 16 MINUTE
    ),
    (
        (SELECT defect_id FROM defect WHERE defect_no = 'TC-Q-DETAIL-ONHOLD'),
        3, 'ON_HOLD', NULL, '검사 결과 대기',
        CURRENT_TIMESTAMP - INTERVAL 15 MINUTE
    ),
    (
        (SELECT defect_id FROM defect WHERE defect_no = 'TC-Q-COMP-NORMAL'),
        3, 'COMPLETED', 'NORMAL_APPROVAL', '재검사 결과 정상 승인',
        CURRENT_TIMESTAMP - INTERVAL 14 MINUTE
    ),
    (
        (SELECT defect_id FROM defect WHERE defect_no = 'TC-Q-COMP-REWORK'),
        3, 'COMPLETED', 'REWORK', '재작업 완료',
        CURRENT_TIMESTAMP - INTERVAL 13 MINUTE
    ),
    (
        (SELECT defect_id FROM defect WHERE defect_no = 'TC-Q-COMP-DISPOSAL'),
        3, 'COMPLETED', 'DISPOSAL', '폐기 처리 완료',
        CURRENT_TIMESTAMP - INTERVAL 12 MINUTE
    ),
    (
        (SELECT defect_id FROM defect WHERE defect_no = 'TC-Q-DETAIL-HISTORY'),
        3, 'IN_PROGRESS', NULL, '1차 원인 분석',
        CURRENT_TIMESTAMP - INTERVAL 20 MINUTE
    ),
    (
        (SELECT defect_id FROM defect WHERE defect_no = 'TC-Q-DETAIL-HISTORY'),
        3, 'ON_HOLD', NULL, '2차 검사 결과 대기',
        CURRENT_TIMESTAMP - INTERVAL 10 MINUTE
    ),
    (
        (SELECT defect_id FROM defect WHERE defect_no = 'TC-Q-STAT-10D'),
        3, 'COMPLETED', 'REWORK', '10일 전 재작업 완료',
        TIMESTAMPADD(MINUTE, 5, TIMESTAMPADD(DAY, -10, CURRENT_TIMESTAMP))
    ),
    (
        (SELECT defect_id FROM defect WHERE defect_no = 'TC-Q-STAT-31D'),
        3, 'COMPLETED', 'DISPOSAL', '31일 전 폐기 완료',
        TIMESTAMPADD(MINUTE, 5, TIMESTAMPADD(DAY, -31, CURRENT_TIMESTAMP))
    ),
    (
        (SELECT defect_id FROM defect WHERE defect_no = 'TC-Q-STAT-PREV'),
        3, 'COMPLETED', 'NORMAL_APPROVAL', '이전 기간 정상 승인',
        TIMESTAMPADD(MINUTE, 5, TIMESTAMPADD(DAY, -35, CURRENT_TIMESTAMP))
    );

INSERT INTO defect_handling_history (
    defect_id, handled_by_id, status, handle_method, content, handled_at
)
SELECT
    d.defect_id,
    3,
    d.status,
    CASE
        WHEN d.status = 'COMPLETED' THEN
            CASE MOD(CAST(RIGHT(d.defect_no, 3) AS UNSIGNED), 3)
                WHEN 0 THEN 'NORMAL_APPROVAL'
                WHEN 1 THEN 'REWORK'
                ELSE 'DISPOSAL'
            END
        ELSE NULL
    END,
    CONCAT('품질 페이징 처리이력 ', RIGHT(d.defect_no, 3)),
    TIMESTAMPADD(MINUTE, 5, d.occurred_at)
FROM defect d
WHERE d.defect_no LIKE 'TC-Q-PAGE-%'
  AND d.status <> 'UNHANDLED';

-- ----------------------------------------------------------------------------
-- 알람: 상태 저장·처리 완료 검증용
-- 아래 4건은 모두 확인 대기에서 시작하므로 화면에서 상태를 변경한다.
-- ----------------------------------------------------------------------------

INSERT INTO alarm (
    alarm_no, equipment_id, handler_id, message, severity, status,
    occurred_at, resolved_at, description, handling_content
) VALUES
    (
        'TC-A16-IN-PROGRESS',
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),
        NULL, '[A-16] 조치 중 상태 변경 테스트', 'WARNING', 'PENDING_CONFIRMATION',
        CURRENT_TIMESTAMP - INTERVAL 2 MINUTE, NULL,
        '조치 중으로 변경하고 A16 조치 중 저장 테스트를 입력합니다.', NULL
    ),
    (
        'TC-A16-INSPECTION',
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),
        NULL, '[A-16] 점검 예약 상태 변경 테스트', 'INFO', 'PENDING_CONFIRMATION',
        CURRENT_TIMESTAMP - INTERVAL 3 MINUTE, NULL,
        '점검 예약으로 변경하고 A16 점검 예약 저장 테스트를 입력합니다.', NULL
    ),
    (
        'TC-A16-MONITORING',
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),
        NULL, '[A-16] 모니터링 상태 변경 테스트', 'CRITICAL', 'PENDING_CONFIRMATION',
        CURRENT_TIMESTAMP - INTERVAL 4 MINUTE, NULL,
        '모니터링으로 변경하고 A16 모니터링 저장 테스트를 입력합니다.', NULL
    ),
    (
        'TC-A17-RESOLVE',
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'PACKER-01'),
        NULL, '[A-17] 처리 완료 필수값 테스트', 'CRITICAL', 'PENDING_CONFIRMATION',
        CURRENT_TIMESTAMP - INTERVAL 5 MINUTE, NULL,
        '조치 내용 없이 완료 오류를 확인한 뒤 정상 완료합니다.', NULL
    ),
    (
        'TC-AL-SEARCH-SPECIAL',
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'CUTTER-01'),
        3, '[검색키워드] ALARM_ALPHA 특수문자 %_', 'WARNING', 'RESOLVED',
        CURRENT_TIMESTAMP - INTERVAL 7 HOUR,
        TIMESTAMPADD(MINUTE, 1, TIMESTAMPADD(HOUR, -7, CURRENT_TIMESTAMP)),
        '설명검색토큰 ALARM_DESCRIPTION_TOKEN', '검색 테스트 처리 완료'
    ),
    (
        'TC-AL-SAME-001',
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'ROLLER-01'),
        3, '[정렬] 동일 발생시각 첫 번째', 'WARNING', 'RESOLVED',
        CURRENT_TIMESTAMP - INTERVAL 6 HOUR,
        TIMESTAMPADD(MINUTE, 1, TIMESTAMPADD(HOUR, -6, CURRENT_TIMESTAMP)),
        '동일 발생시각 정렬 테스트', '정렬 테스트 완료'
    ),
    (
        'TC-AL-SAME-002',
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'ROLLER-01'),
        3, '[정렬] 동일 발생시각 두 번째', 'WARNING', 'RESOLVED',
        CURRENT_TIMESTAMP - INTERVAL 6 HOUR,
        TIMESTAMPADD(MINUTE, 1, TIMESTAMPADD(HOUR, -6, CURRENT_TIMESTAMP)),
        '동일 발생시각에서 최신 ID 우선 확인', '정렬 테스트 완료'
    ),
    (
        'TC-AL-BOUNDARY-IN',
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'COOLER-01'),
        3, '[기간] 최근 30일 포함 데이터', 'INFO', 'RESOLVED',
        @screen_test_30d_from_utc,
        TIMESTAMPADD(MINUTE, 1, @screen_test_30d_from_utc),
        '최근 30일 조회에 포함되어야 합니다.', '기간 경계 확인 완료'
    ),
    (
        'TC-AL-BOUNDARY-OUT',
        (SELECT equipment_id FROM equipment WHERE equipment_code = 'COOLER-01'),
        3, '[기간] 최근 30일 제외 데이터', 'INFO', 'RESOLVED',
        TIMESTAMPADD(SECOND, -1, @screen_test_30d_from_utc),
        @screen_test_30d_from_utc,
        '최근 30일 조회에서 제외되어야 합니다.', '기간 경계 확인 완료'
    );

-- 현재 알람 20건 페이지와 페이지 밖 검색 대상
INSERT INTO alarm (
    alarm_no, equipment_id, handler_id, message, severity, status,
    occurred_at, resolved_at, description, handling_content
)
SELECT
    CONCAT('TC-AL-CURRENT-', LPAD(s.seq, 3, '0')),
    e.equipment_id,
    NULL,
    CASE
        WHEN s.seq = 25 THEN '[페이지2검색] CURRENT_PAGE2_TARGET'
        ELSE CONCAT('[현재알람] 페이징 테스트 ', LPAD(s.seq, 3, '0'))
    END,
    CASE MOD(s.seq, 3)
        WHEN 0 THEN 'INFO'
        WHEN 1 THEN 'CRITICAL'
        ELSE 'WARNING'
    END,
    'PENDING_CONFIRMATION',
    TIMESTAMPADD(MINUTE, 0 - 10 - s.seq, CURRENT_TIMESTAMP),
    NULL,
    CASE
        WHEN s.seq = 25 THEN '첫 페이지에 없는 현재 알람 검색 대상'
        ELSE CONCAT('현재 알람 페이지네이션 데이터 ', LPAD(s.seq, 3, '0'))
    END,
    NULL
FROM screen_test_sequence s
JOIN equipment e
  ON e.equipment_code = CASE MOD(s.seq, 5)
      WHEN 0 THEN 'PACKER-01'
      WHEN 1 THEN 'FRYER-01'
      WHEN 2 THEN 'INSPECTOR-01'
      WHEN 3 THEN 'MIXER-01'
      ELSE 'COOLER-01'
  END
WHERE s.seq <= 25;

-- 설비별/심각도별 size=100 제한과 빈발 알람 상위 5개용 101건
INSERT INTO alarm (
    alarm_no, equipment_id, handler_id, message, severity, status,
    occurred_at, resolved_at, description, handling_content
)
SELECT
    CONCAT('TC-AL-BULK-', LPAD(s.seq, 3, '0')),
    e.equipment_id,
    3,
    CASE
        WHEN s.seq <= 30 THEN '[통계] 포장 온도 반복 경고'
        WHEN s.seq <= 55 THEN '[통계] 포장 필름 반복 경고'
        WHEN s.seq <= 75 THEN '[통계] 포장 압력 반복 경고'
        WHEN s.seq <= 90 THEN '[통계] 포장 속도 반복 경고'
        ELSE '[통계] 포장 센서 반복 경고'
    END,
    'INFO',
    'RESOLVED',
    TIMESTAMPADD(MINUTE, 0 - 14400 - s.seq, CURRENT_TIMESTAMP),
    TIMESTAMPADD(MINUTE, 1, TIMESTAMPADD(MINUTE, 0 - 14400 - s.seq, CURRENT_TIMESTAMP)),
    CONCAT('ALARM_BULK_TOKEN 대량 조회 데이터 ', LPAD(s.seq, 3, '0')),
    '대량 알람 자동 처리 완료'
FROM screen_test_sequence s
JOIN equipment e ON e.equipment_code = 'PACKER-01';

-- ============================================================================
-- 공통 목록 페이지네이션용 대량 데이터
-- 기본 페이지 크기 20건을 기준으로 각 주요 목록이 최소 2페이지 이상 조회된다.
-- 제조일·입고일·가입일·발생 시각 등 이력성 날짜/시간은 모두 현재보다 과거다.
-- 유통기한은 정상/부족/품절 재고 시나리오에 필요한 경우에만 미래로 설정한다.
-- L1/L2/통신 로그는 위의 최초 등록·heartbeat 통합 테스트를 위해 계속 비워 둔다.
-- ============================================================================

-- 사용자 25건 추가: 기존 10건과 합쳐 총 35건
INSERT INTO app_user (
    emp_no, name, email, phone, password, role,
    approval_status, is_active, created_at, last_access_at
)
SELECT
    CONCAT('pageuser', LPAD(s.seq, 3, '0')),
    CONCAT('페이지 작업자 ', LPAD(s.seq, 3, '0')),
    CONCAT('pageuser', LPAD(s.seq, 3, '0'), '@linecup.test'),
    CONCAT('010-7000-', LPAD(s.seq, 4, '0')),
    'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:RM07ZqOdg/y8TqKuolpXHQHVTZOCPDVpWrgqs+fmhjU',
    'OPERATOR',
    'APPROVED',
    true,
    TIMESTAMPADD(DAY, 0 - 200 - s.seq, @screen_test_now_utc),
    TIMESTAMPADD(MINUTE, 0 - 30 - s.seq, @screen_test_now_utc)
FROM screen_test_sequence s
WHERE s.seq <= 25;

-- 작업자 프로필 25건 추가: 기존 4건과 합쳐 총 29건
INSERT INTO worker_profile (
    user_id, primary_process_id, team_name, joined_date, shift_type
)
SELECT
    u.user_id,
    mp.process_id,
    CONCAT('페이지 생산 ', MOD(s.seq - 1, 3) + 1, '팀'),
    DATE(TIMESTAMPADD(DAY, 0 - 365 - s.seq, @screen_test_now_utc)),
    CASE MOD(s.seq, 3)
        WHEN 0 THEN 'DAY'
        WHEN 1 THEN 'NIGHT'
        ELSE 'ROTATING'
    END
FROM screen_test_sequence s
JOIN app_user u
  ON u.emp_no = CONCAT('pageuser', LPAD(s.seq, 3, '0'))
JOIN manufacturing_process mp
  ON mp.sequence_no = MOD(s.seq - 1, 9) + 1
WHERE s.seq <= 25;

INSERT INTO worker_skill (worker_profile_id, skill_name)
SELECT
    wp.worker_profile_id,
    CONCAT(mp.process_name, ' 공정 운전')
FROM worker_profile wp
JOIN app_user u ON u.user_id = wp.user_id
JOIN manufacturing_process mp ON mp.process_id = wp.primary_process_id
WHERE u.emp_no LIKE 'pageuser%';

-- 제품 25건 추가: 기존 5건과 합쳐 총 30건
INSERT INTO product (
    product_code, product_name, category, unit, status
)
SELECT
    CONCAT('TC-FG-', LPAD(s.seq, 3, '0')),
    CONCAT('페이지 테스트 제품 ', LPAD(s.seq, 3, '0')),
    CASE MOD(s.seq, 3)
        WHEN 0 THEN '컵라면'
        WHEN 1 THEN '봉지라면'
        ELSE '간편식'
    END,
    'EA',
    CASE MOD(s.seq, 5)
        WHEN 0 THEN 'INACTIVE'
        WHEN 1 THEN 'REVIEW'
        ELSE 'ACTIVE'
    END
FROM screen_test_sequence s
WHERE s.seq <= 25;

-- 원자재 25건 추가: 기존 9건과 합쳐 총 34건
INSERT INTO raw_material (
    material_code, material_name, unit, safety_stock_qty, status
)
SELECT
    CONCAT('TC-RM-', LPAD(s.seq, 3, '0')),
    CONCAT('페이지 테스트 원자재 ', LPAD(s.seq, 3, '0')),
    CASE MOD(s.seq, 3)
        WHEN 0 THEN 'kg'
        WHEN 1 THEN 'EA'
        ELSE 'L'
    END,
    20.000 + MOD(s.seq, 5) * 10.000,
    CASE WHEN MOD(s.seq, 7) = 0 THEN 'INACTIVE' ELSE 'ACTIVE' END
FROM screen_test_sequence s
WHERE s.seq <= 25;

-- BOM 25건 추가: 기존 4건과 합쳐 총 29건
INSERT INTO bom (
    bom_code, product_id, version, status, note
)
SELECT
    CONCAT('TC-BOM-', LPAD(s.seq, 3, '0')),
    p.product_id,
    '1.0',
    CASE MOD(s.seq, 3)
        WHEN 0 THEN 'INACTIVE'
        WHEN 1 THEN 'ACTIVE'
        ELSE 'REVIEW'
    END,
    CONCAT('BOM 페이지네이션 테스트 ', LPAD(s.seq, 3, '0'))
FROM screen_test_sequence s
JOIN product p
  ON p.product_code = CONCAT('TC-FG-', LPAD(s.seq, 3, '0'))
WHERE s.seq <= 25;

INSERT INTO bom_item (
    bom_id, material_id, process_id, spec,
    required_qty, loss_rate, note
)
SELECT
    b.bom_id,
    rm.material_id,
    mp.process_id,
    '통합 테스트 규격',
    1.000 + MOD(s.seq, 5) * 0.100,
    MOD(s.seq, 4) * 0.500,
    CONCAT('BOM 구성 원자재 ', LPAD(s.seq, 3, '0'))
FROM screen_test_sequence s
JOIN bom b
  ON b.bom_code = CONCAT('TC-BOM-', LPAD(s.seq, 3, '0'))
JOIN raw_material rm
  ON rm.material_code = CONCAT('TC-RM-', LPAD(s.seq, 3, '0'))
JOIN manufacturing_process mp
  ON mp.sequence_no = MOD(s.seq - 1, 9) + 1
WHERE s.seq <= 25;

-- 원자재 LOT 25건 추가: 기존 10건과 합쳐 총 35건
-- EXPIRED/OUT_OF_STOCK/LOW/NORMAL 상태가 반복되도록 수량과 유통기한을 구성한다.
INSERT INTO raw_material_lot (
    material_id, material_lot_no, supplier_name, supplier_lot_no,
    manufacture_date, expiry_date, received_date, received_qty, current_qty
)
SELECT
    rm.material_id,
    CONCAT('TC-RMLOT-', LPAD(s.seq, 3, '0')),
    CONCAT('페이지 공급사 ', MOD(s.seq - 1, 5) + 1),
    CONCAT('TC-SUPLOT-', LPAD(s.seq, 3, '0')),
    DATE(TIMESTAMPADD(DAY, 0 - 70 - s.seq, @screen_test_now_utc)),
    CASE
        WHEN MOD(s.seq, 4) = 0
            THEN DATE(TIMESTAMPADD(DAY, 0 - 5 - s.seq, @screen_test_now_utc))
        ELSE DATE(TIMESTAMPADD(DAY, 180 + s.seq, @screen_test_now_utc))
    END,
    DATE(TIMESTAMPADD(DAY, 0 - 60 - s.seq, @screen_test_now_utc)),
    100.000,
    CASE MOD(s.seq, 4)
        WHEN 0 THEN 40.000
        WHEN 1 THEN 0.000
        WHEN 2 THEN 10.000
        ELSE 100.000
    END
FROM screen_test_sequence s
JOIN raw_material rm
  ON rm.material_code = CONCAT('TC-RM-', LPAD(s.seq, 3, '0'))
WHERE s.seq <= 25;

-- 완제품 재고 25건 추가: 기존 2건과 합쳐 총 27건
-- 완료된 대량 테스트 LOT을 사용하며 재고 상태 4종을 모두 포함한다.
INSERT INTO product_inventory (
    production_lot_id, current_qty, safety_stock_qty, expiry_date, created_at
)
SELECT
    pl.production_lot_id,
    CASE MOD(s.seq, 4)
        WHEN 1 THEN 0
        ELSE 1
    END,
    CASE MOD(s.seq, 4)
        WHEN 2 THEN 2
        ELSE 1
    END,
    CASE
        WHEN MOD(s.seq, 4) = 0
            THEN DATE(TIMESTAMPADD(DAY, 0 - s.seq, @screen_test_now_utc))
        ELSE DATE(TIMESTAMPADD(DAY, 120 + s.seq, @screen_test_now_utc))
    END,
    TIMESTAMPADD(MINUTE, 1, pl.completed_at)
FROM screen_test_sequence s
JOIN production_lot pl
  ON pl.lot_no = CONCAT('TC-Q-LOT-', LPAD(s.seq, 3, '0'))
WHERE s.seq <= 25;

-- 재고 이동 75건 추가: 기존 17건과 합쳐 총 92건
-- 원자재 입고 25건
INSERT INTO inventory_movement (
    movement_no, item_type, movement_type, raw_material_lot_id, product_inventory_id,
    quantity, occurred_at, handled_by_id, remarks
)
SELECT
    CONCAT('TC-MV-RM-IN-', LPAD(s.seq, 3, '0')),
    'RAW_MATERIAL',
    'INBOUND',
    rml.material_lot_id,
    NULL,
    100.000,
    TIMESTAMPADD(DAY, 0 - 60 - s.seq, @screen_test_now_utc),
    1,
    CONCAT('원자재 페이지 입고 ', LPAD(s.seq, 3, '0'))
FROM screen_test_sequence s
JOIN raw_material_lot rml
  ON rml.material_lot_no = CONCAT('TC-RMLOT-', LPAD(s.seq, 3, '0'))
WHERE s.seq <= 25;

-- 원자재 출고/조정 25건
INSERT INTO inventory_movement (
    movement_no, item_type, movement_type, raw_material_lot_id, product_inventory_id,
    quantity, occurred_at, handled_by_id, remarks
)
SELECT
    CONCAT('TC-MV-RM-CHANGE-', LPAD(s.seq, 3, '0')),
    'RAW_MATERIAL',
    CASE WHEN MOD(s.seq, 2) = 0 THEN 'OUTBOUND' ELSE 'ADJUSTMENT' END,
    rml.material_lot_id,
    NULL,
    1.000,
    TIMESTAMPADD(DAY, 0 - 30 - s.seq, @screen_test_now_utc),
    2,
    CONCAT('원자재 페이지 출고/조정 ', LPAD(s.seq, 3, '0'))
FROM screen_test_sequence s
JOIN raw_material_lot rml
  ON rml.material_lot_no = CONCAT('TC-RMLOT-', LPAD(s.seq, 3, '0'))
WHERE s.seq <= 25;

-- 완제품 입고 25건
INSERT INTO inventory_movement (
    movement_no, item_type, movement_type, raw_material_lot_id, product_inventory_id,
    quantity, occurred_at, handled_by_id, remarks
)
SELECT
    CONCAT('TC-MV-FG-IN-', LPAD(s.seq, 3, '0')),
    'FINISHED_PRODUCT',
    'INBOUND',
    NULL,
    pi.inventory_id,
    1.000,
    TIMESTAMPADD(MINUTE, 2, pi.created_at),
    2,
    CONCAT('완제품 페이지 입고 ', LPAD(s.seq, 3, '0'))
FROM screen_test_sequence s
JOIN production_lot pl
  ON pl.lot_no = CONCAT('TC-Q-LOT-', LPAD(s.seq, 3, '0'))
JOIN product_inventory pi
  ON pi.production_lot_id = pl.production_lot_id
WHERE s.seq <= 25;

DROP TEMPORARY TABLE screen_test_sequence;
