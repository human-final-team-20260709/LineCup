INSERT INTO defect_type (code, name, is_active) VALUES
    ('OK', '정상', true),
    ('SEALING', '실링 불량', true),
    ('MOISTURE', '수분 불량', true),
    ('WEIGHT', '중량 불량', true),
    ('FOREIGN_MATERIAL', '이물 불량', true),
    ('GENERAL_NG', '일반 불량', true)
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
    (1, 'WO-20260724-001', 1, 2, 100, 50, 0,   0,   0, CURRENT_DATE,                 CURRENT_TIMESTAMP - INTERVAL 1 HOUR,  NULL,                                  NULL,                                  'PENDING',     '신규 등록/작업 시작 테스트용'),
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
    (2, CURRENT_TIMESTAMP - INTERVAL 1 HOUR, CURRENT_TIMESTAMP,                   CURRENT_TIMESTAMP - INTERVAL 2 MINUTE,  100, 15, 14, 1, true,  'HOURLY'),
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
