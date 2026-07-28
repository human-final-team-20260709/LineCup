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
    ('LEGACY_DISABLED', '사용 중지 불량 유형', false)
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

-- 실제 L1 포트(5001~5009)에 대응하는 제1생산라인 설비 9대만 등록한다.
INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '혼합기 1호', 'MIXER-01', process_id, '제1생산라인', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'MIXING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '압연기 1호', 'ROLLER-01', process_id, '제1생산라인', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'ROLLING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '제면기 1호', 'NOODLE-01', process_id, '제1생산라인', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'NOODLE_MAKING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '증숙기 1호', 'STEAMER-01', process_id, '제1생산라인', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'STEAMING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '절단기 1호', 'CUTTER-01', process_id, '제1생산라인', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'CUTTING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '유탕기 1호', 'FRYER-01', process_id, '제1생산라인', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'FRYING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '냉각기 1호', 'COOLER-01', process_id, '제1생산라인', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'COOLING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '포장기 1호', 'PACKER-01', process_id, '제1생산라인', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'PACKING'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

INSERT INTO equipment (equipment_name, equipment_code, process_id, location, status)
SELECT '검사기 1호', 'INSPECTOR-01', process_id, '제1생산라인', 'STOPPED'
FROM manufacturing_process WHERE process_code = 'INSPECTION'
ON DUPLICATE KEY UPDATE process_id = VALUES(process_id), location = VALUES(location);

-- ============================================================================
-- MES 종합 운영 데이터
-- 제품, 자재, 생산, 품질, 재고, 설비, 작업자, L1/L2 흐름을 함께 확인한다.
-- 초기 로그인 비밀번호: Linecup2026!
-- 관리자 계정: admin01
-- 생산 지시자 계정: supervisor01
-- 작업자 계정: operator01 ~ operator10
-- 활성 작업지시는 L2 단일 작업 조회 규칙에 맞춰 한 건만 유지한다.
-- ============================================================================

CREATE TEMPORARY TABLE seed_sequence (
    seq INT PRIMARY KEY
);

INSERT INTO seed_sequence (seq)
SELECT ones.n + tens.n * 10 + hundreds.n * 100 + 1
FROM (
    SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
) ones
CROSS JOIN (
    SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
) tens
CROSS JOIN (
    SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
) hundreds
WHERE ones.n + tens.n * 10 + hundreds.n * 100 < 500;

-- 사용자와 작업자
INSERT INTO app_user (
    user_id, emp_no, name, email, phone, password, role,
    approval_status, is_active, created_at, last_access_at
) VALUES
    (1,  'admin01',      'MES 시스템 관리자', 'admin01@linecup.co.kr',      '010-4100-0001', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI', 'ADMIN',      'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 500 DAY, CURRENT_TIMESTAMP - INTERVAL 3 MINUTE),
    (2,  'supervisor01', '생산관리 김도윤',     'supervisor01@linecup.co.kr', '010-4100-0002', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI', 'SUPERVISOR', 'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 460 DAY, CURRENT_TIMESTAMP - INTERVAL 8 MINUTE),
    (3,  'supervisor02', '품질관리 이서연',     'supervisor02@linecup.co.kr', '010-4100-0003', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI', 'SUPERVISOR', 'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 430 DAY, CURRENT_TIMESTAMP - INTERVAL 14 MINUTE),
    (4,  'supervisor03', '설비관리 박준호',     'supervisor03@linecup.co.kr', '010-4100-0004', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI', 'SUPERVISOR', 'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 410 DAY, CURRENT_TIMESTAMP - INTERVAL 22 MINUTE),
    (5,  'supervisor04', '자재관리 최유진',     'supervisor04@linecup.co.kr', '010-4100-0005', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI', 'SUPERVISOR', 'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 390 DAY, CURRENT_TIMESTAMP - INTERVAL 35 MINUTE),
    (6,  'operator01',   '혼합 작업자 정민수',  'operator01@linecup.co.kr',   '010-4100-0006', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI', 'OPERATOR',   'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 360 DAY, CURRENT_TIMESTAMP - INTERVAL 5 MINUTE),
    (7,  'operator02',   '압연 작업자 한지우',  'operator02@linecup.co.kr',   '010-4100-0007', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI', 'OPERATOR',   'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 350 DAY, CURRENT_TIMESTAMP - INTERVAL 7 MINUTE),
    (8,  'operator03',   '제면 작업자 송현우',  'operator03@linecup.co.kr',   '010-4100-0008', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI', 'OPERATOR',   'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 330 DAY, CURRENT_TIMESTAMP - INTERVAL 9 MINUTE),
    (9,  'operator04',   '증숙 작업자 윤하린',  'operator04@linecup.co.kr',   '010-4100-0009', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI', 'OPERATOR',   'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 320 DAY, CURRENT_TIMESTAMP - INTERVAL 11 MINUTE),
    (10, 'operator05',   '절단 작업자 강시우',  'operator05@linecup.co.kr',   '010-4100-0010', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI', 'OPERATOR',   'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 300 DAY, CURRENT_TIMESTAMP - INTERVAL 13 MINUTE),
    (11, 'operator06',   '유탕 작업자 오예린',  'operator06@linecup.co.kr',   '010-4100-0011', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI', 'OPERATOR',   'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 290 DAY, CURRENT_TIMESTAMP - INTERVAL 15 MINUTE),
    (12, 'operator07',   '냉각 작업자 임재현',  'operator07@linecup.co.kr',   '010-4100-0012', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI', 'OPERATOR',   'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 280 DAY, CURRENT_TIMESTAMP - INTERVAL 17 MINUTE),
    (13, 'operator08',   '포장 작업자 신가은',  'operator08@linecup.co.kr',   '010-4100-0013', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI', 'OPERATOR',   'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 260 DAY, CURRENT_TIMESTAMP - INTERVAL 19 MINUTE),
    (14, 'operator09',   '검사 작업자 문태윤',  'operator09@linecup.co.kr',   '010-4100-0014', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI', 'OPERATOR',   'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 250 DAY, CURRENT_TIMESTAMP - INTERVAL 21 MINUTE),
    (15, 'operator10',   '공정지원 작업자 배수아','operator10@linecup.co.kr',  '010-4100-0015', 'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI', 'OPERATOR',   'APPROVED', true,  CURRENT_TIMESTAMP - INTERVAL 240 DAY, CURRENT_TIMESTAMP - INTERVAL 24 MINUTE);

INSERT INTO app_user (
    user_id, emp_no, name, email, phone, password, role,
    approval_status, is_active, created_at, last_access_at
)
SELECT
    1000 + s.seq,
    CONCAT(CASE WHEN MOD(s.seq, 20) = 0 THEN 'LC-SV-' ELSE 'LC-OP-' END, LPAD(s.seq, 4, '0')),
    CONCAT(CASE WHEN MOD(s.seq, 20) = 0 THEN '생산 지시자 ' ELSE '생산 작업자 ' END, LPAD(s.seq, 3, '0')),
    CONCAT('factory', LPAD(s.seq, 4, '0'), '@linecup.co.kr'),
    CONCAT('010-7', LPAD(MOD(s.seq, 1000), 3, '0'), '-', LPAD(s.seq, 4, '0')),
    'pbkdf2-sha256:210000:AAECAwQFBgcICQoLDA0ODw:fqni07Ltqmx/mz24g62fgIL/DXK5XDHbJneL4UHG/fI',
    CASE WHEN MOD(s.seq, 20) = 0 THEN 'SUPERVISOR' ELSE 'OPERATOR' END,
    CASE
        WHEN s.seq <= 165 THEN 'APPROVED'
        WHEN s.seq <= 172 THEN 'PENDING'
        WHEN s.seq <= 177 THEN 'REJECTED'
        ELSE 'APPROVED'
    END,
    s.seq <= 165,
    TIMESTAMPADD(DAY, -(220 - s.seq), CURRENT_TIMESTAMP),
    CASE WHEN s.seq <= 165 THEN TIMESTAMPADD(MINUTE, -s.seq, CURRENT_TIMESTAMP) ELSE NULL END
FROM seed_sequence s
WHERE s.seq <= 180;

INSERT INTO worker_profile (
    worker_profile_id, user_id, team_name, shift_type, joined_date, primary_process_id
)
SELECT
    u.user_id,
    u.user_id,
    CONCAT('생산 ', 1 + MOD(u.user_id, 3), '조'),
    CASE MOD(u.user_id, 3) WHEN 0 THEN 'DAY' WHEN 1 THEN 'NIGHT' ELSE 'ROTATING' END,
    DATE(TIMESTAMPADD(DAY, -(300 + MOD(u.user_id, 700)), CURRENT_DATE)),
    mp.process_id
FROM app_user u
JOIN manufacturing_process mp ON mp.sequence_no = 1 + MOD(u.user_id, 9)
WHERE u.role = 'OPERATOR'
  AND u.approval_status = 'APPROVED'
  AND u.is_active = true;

INSERT INTO worker_skill (worker_profile_id, skill_name)
SELECT worker_profile_id, '공정 설비 운전'
FROM worker_profile;

INSERT INTO worker_skill (worker_profile_id, skill_name)
SELECT worker_profile_id, '작업표준 및 품질 확인'
FROM worker_profile;

INSERT INTO equipment_assignment (user_id, equipment_id, started_at, ended_at)
SELECT
    wp.user_id,
    e.equipment_id,
    TIMESTAMPADD(DAY, -(30 + MOD(wp.user_id, 120)), CURRENT_TIMESTAMP),
    CASE
        WHEN wp.user_id BETWEEN 6 AND 14 THEN NULL
        ELSE TIMESTAMPADD(DAY, -(1 + MOD(wp.user_id, 20)), CURRENT_TIMESTAMP)
    END
FROM worker_profile wp
JOIN manufacturing_process mp ON mp.sequence_no = 1 + MOD(wp.user_id - 1, 9)
JOIN equipment e
  ON e.process_id = mp.process_id
 AND RIGHT(e.equipment_code, 3) = '-01';

-- 제품과 BOM
INSERT INTO product (
    product_id, product_code, product_name, category, unit, status
) VALUES
    (1,  'FG-CUP-SPICY-065',    '얼큰한맛 컵면 65g',      '컵면',   'EA', 'ACTIVE'),
    (2,  'FG-CUP-MILD-065',     '담백한맛 컵면 65g',      '컵면',   'EA', 'ACTIVE'),
    (3,  'FG-CUP-SEAFOOD-075',  '해물맛 컵면 75g',        '컵면',   'EA', 'ACTIVE'),
    (4,  'FG-CUP-KIMCHI-075',   '김치맛 컵면 75g',        '컵면',   'EA', 'ACTIVE'),
    (5,  'FG-CUP-BEEF-080',     '소고기맛 컵면 80g',      '컵면',   'EA', 'ACTIVE'),
    (6,  'FG-BOWL-SPICY-105',   '매운해물 큰컵면 105g',   '큰컵면', 'EA', 'ACTIVE'),
    (7,  'FG-BOWL-BEEF-105',    '진한소고기 큰컵면 105g', '큰컵면', 'EA', 'ACTIVE'),
    (8,  'FG-CUP-VEGETABLE-070','채소맛 컵면 70g',        '컵면',   'EA', 'ACTIVE'),
    (9,  'FG-CUP-CURRY-070',    '카레맛 컵면 70g',        '컵면',   'EA', 'ACTIVE'),
    (10, 'FG-CUP-JJAJANG-090',  '짜장맛 컵면 90g',        '컵면',   'EA', 'ACTIVE'),
    (11, 'FG-BOWL-KIMCHI-110',  '김치사발면 110g',        '큰컵면', 'EA', 'ACTIVE'),
    (12, 'FG-CUP-CHICKEN-075',  '닭육수 컵면 75g',        '컵면',   'EA', 'ACTIVE'),
    (13, 'FG-CUP-ANCHOVY-070',  '멸치육수 컵면 70g',      '컵면',   'EA', 'REVIEW'),
    (14, 'FG-BOWL-CREAM-100',   '크림맛 큰컵면 100g',     '큰컵면', 'EA', 'REVIEW'),
    (15, 'FG-CUP-CLASSIC-065',  '전통육수 컵면 65g',      '컵면',   'EA', 'INACTIVE');

INSERT INTO product (
    product_id, product_code, product_name, category, unit, status
)
SELECT
    1000 + s.seq,
    CONCAT('FG-', CASE WHEN MOD(s.seq, 4) = 0 THEN 'BOWL-' ELSE 'CUP-' END, LPAD(s.seq, 4, '0')),
    CONCAT(
        CASE MOD(s.seq, 8)
            WHEN 0 THEN '얼큰육수'
            WHEN 1 THEN '담백육수'
            WHEN 2 THEN '해물육수'
            WHEN 3 THEN '김치육수'
            WHEN 4 THEN '소고기육수'
            WHEN 5 THEN '채소육수'
            WHEN 6 THEN '닭육수'
            ELSE '멸치육수'
        END,
        CASE WHEN MOD(s.seq, 4) = 0 THEN ' 큰컵면 ' ELSE ' 컵면 ' END,
        65 + MOD(s.seq, 10) * 5,
        'g ',
        LPAD(s.seq, 3, '0')
    ),
    CASE WHEN MOD(s.seq, 4) = 0 THEN '큰컵면' ELSE '컵면' END,
    'EA',
    CASE WHEN s.seq <= 135 THEN 'ACTIVE' WHEN s.seq <= 145 THEN 'REVIEW' ELSE 'INACTIVE' END
FROM seed_sequence s
WHERE s.seq <= 150;

-- 원자재와 구매 LOT
INSERT INTO raw_material (
    material_id, material_code, material_name, unit, safety_stock_qty, status
) VALUES
    (1,  'RM-FLOUR-001',       '제면용 밀가루',       'kg', 10000.000, 'ACTIVE'),
    (2,  'RM-STARCH-001',      '감자전분',            'kg',  3000.000, 'ACTIVE'),
    (3,  'RM-OIL-001',         '식품용 팜유',         'L',   8000.000, 'ACTIVE'),
    (4,  'RM-SALT-001',        '정제소금',            'kg',  1000.000, 'ACTIVE'),
    (5,  'RM-SOUP-SPICY',      '얼큰 분말스프',       'kg',  2000.000, 'ACTIVE'),
    (6,  'RM-SOUP-MILD',       '담백 분말스프',       'kg',  2000.000, 'ACTIVE'),
    (7,  'RM-SOUP-SEAFOOD',    '해물 분말스프',       'kg',  2000.000, 'ACTIVE'),
    (8,  'RM-SOUP-KIMCHI',     '김치 분말스프',       'kg',  2000.000, 'ACTIVE'),
    (9,  'RM-SOUP-BEEF',       '소고기 분말스프',     'kg',  2000.000, 'ACTIVE'),
    (10, 'RM-SOUP-VEGETABLE',  '채소 분말스프',       'kg',  2000.000, 'ACTIVE'),
    (11, 'RM-CUP-065',         '종이용기 65g 규격',   'EA', 30000.000, 'ACTIVE'),
    (12, 'RM-CUP-075',         '종이용기 75g 규격',   'EA', 30000.000, 'ACTIVE'),
    (13, 'RM-LID-COMMON',      '알루미늄 용기뚜껑',   'EA', 30000.000, 'ACTIVE'),
    (14, 'RM-FILM-001',        '외포장 필름',         'm',  15000.000, 'ACTIVE'),
    (15, 'RM-CARTON-001',      '완제품 포장상자',     'EA',  5000.000, 'ACTIVE'),
    (16, 'RM-DRIED-VEGETABLE', '건조 채소 후레이크',  'kg',  1000.000, 'ACTIVE'),
    (17, 'RM-DRIED-SEAFOOD',   '건조 해물 후레이크',  'kg',  1000.000, 'ACTIVE'),
    (18, 'RM-SEASONING-BASE',  '복합조미 베이스',     'kg',  1500.000, 'ACTIVE'),
    (19, 'RM-LABEL-001',       '제품표시 라벨',       'EA', 20000.000, 'ACTIVE'),
    (20, 'RM-CUP-OLD',         '구형 종이용기',       'EA',     0.000, 'INACTIVE');

INSERT INTO raw_material (
    material_id, material_code, material_name, unit, safety_stock_qty, status
)
SELECT
    1000 + s.seq,
    CONCAT('RM-PKG-', LPAD(s.seq, 4, '0')),
    CONCAT(
        CASE MOD(s.seq, 4)
            WHEN 0 THEN '제품표시 인쇄필름 '
            WHEN 1 THEN '전용 종이용기 '
            WHEN 2 THEN '전용 용기뚜껑 '
            ELSE '출하 포장상자 '
        END,
        LPAD(s.seq, 3, '0')
    ),
    CASE WHEN MOD(s.seq, 4) = 0 THEN 'm' ELSE 'EA' END,
    1000.000 + MOD(s.seq, 10) * 250.000,
    CASE WHEN s.seq <= 145 THEN 'ACTIVE' ELSE 'INACTIVE' END
FROM seed_sequence s
WHERE s.seq <= 150;

INSERT INTO bom (bom_id, bom_code, product_id, version, status, note)
SELECT
    p.product_id,
    CONCAT('BOM-STD-', LPAD(p.product_id, 4, '0')),
    p.product_id,
    '1.0',
    CASE WHEN p.status = 'INACTIVE' THEN 'INACTIVE' WHEN p.status = 'REVIEW' THEN 'REVIEW' ELSE 'ACTIVE' END,
    '표준 배합 및 포장 기준'
FROM product p
WHERE p.product_id BETWEEN 1 AND 15;

INSERT INTO bom (bom_id, bom_code, product_id, version, status, note)
SELECT
    1000 + s.seq,
    CONCAT('BOM-MASS-', LPAD(s.seq, 4, '0')),
    1000 + s.seq,
    '1.0',
    CASE WHEN s.seq <= 135 THEN 'ACTIVE' WHEN s.seq <= 145 THEN 'REVIEW' ELSE 'INACTIVE' END,
    CONCAT('제품별 표준 배합서 ', LPAD(s.seq, 3, '0'))
FROM seed_sequence s
WHERE s.seq <= 150;

INSERT INTO bom_item (bom_id, material_id, process_id, spec, required_qty, loss_rate, note)
SELECT b.bom_id, 1, mp.process_id, '제면용 식품 규격', 0.055, 2.00, '주원료 계량'
FROM bom b
JOIN manufacturing_process mp ON mp.process_code = 'MIXING';

INSERT INTO bom_item (bom_id, material_id, process_id, spec, required_qty, loss_rate, note)
SELECT b.bom_id, 3, mp.process_id, '유탕용 식품 규격', 0.008, 1.50, '유탕 공정 투입'
FROM bom b
JOIN manufacturing_process mp ON mp.process_code = 'FRYING';

INSERT INTO bom_item (bom_id, material_id, process_id, spec, required_qty, loss_rate, note)
SELECT b.bom_id, 5 + MOD(b.product_id - 1, 6), mp.process_id, '제품별 분말 배합', 0.010, 1.00, '분말스프 투입'
FROM bom b
JOIN manufacturing_process mp ON mp.process_code = 'PACKING';

INSERT INTO bom_item (bom_id, material_id, process_id, spec, required_qty, loss_rate, note)
SELECT b.bom_id, 13, mp.process_id, '공용 밀봉 규격', 1.000, 0.20, '용기 밀봉'
FROM bom b
JOIN manufacturing_process mp ON mp.process_code = 'PACKING';

INSERT INTO bom_item (bom_id, material_id, process_id, spec, required_qty, loss_rate, note)
SELECT
    b.bom_id,
    CASE WHEN b.bom_id < 1000 THEN 11 + MOD(b.product_id, 2) ELSE b.product_id END,
    mp.process_id,
    '제품별 포장 규격',
    1.000,
    0.30,
    '완제품 포장'
FROM bom b
JOIN manufacturing_process mp ON mp.process_code = 'PACKING';

INSERT INTO raw_material_lot (
    material_lot_id, material_id, material_lot_no, supplier_name, supplier_lot_no,
    manufacture_date, expiry_date, received_date, received_qty, current_qty
)
SELECT
    s.seq,
    1 + MOD(s.seq - 1, 20),
    CONCAT('RMLOT-COMMON-', LPAD(s.seq, 5, '0')),
    CASE MOD(s.seq, 5)
        WHEN 0 THEN '한빛식품원료'
        WHEN 1 THEN '대한제분공업'
        WHEN 2 THEN '동해포장산업'
        WHEN 3 THEN '중앙조미식품'
        ELSE '미래유지산업'
    END,
    CONCAT('SUP-COM-', LPAD(s.seq, 5, '0')),
    DATE(TIMESTAMPADD(DAY, -(40 + s.seq), CURRENT_DATE)),
    CASE
        WHEN s.seq > 20 AND MOD(s.seq, 5) = 0
            THEN DATE(TIMESTAMPADD(DAY, -30, CURRENT_DATE))
        ELSE DATE(TIMESTAMPADD(DAY, 365 + MOD(s.seq, 200), CURRENT_DATE))
    END,
    DATE(TIMESTAMPADD(DAY, -(20 + MOD(s.seq, 20)), CURRENT_DATE)),
    500000.000 + s.seq * 100.000,
    300000.000 + s.seq * 50.000
FROM seed_sequence s
WHERE s.seq <= 40;

INSERT INTO raw_material_lot (
    material_lot_id, material_id, material_lot_no, supplier_name, supplier_lot_no,
    manufacture_date, expiry_date, received_date, received_qty, current_qty
)
SELECT
    1000 + s.seq,
    1000 + s.seq,
    CONCAT('RMLOT-PKG-A-', LPAD(s.seq, 5, '0')),
    CASE MOD(s.seq, 4)
        WHEN 0 THEN '새한인쇄포장'
        WHEN 1 THEN '라인컵용기'
        WHEN 2 THEN '대한밀봉자재'
        ELSE '동우출하포장'
    END,
    CONCAT('PKG-A-', LPAD(s.seq, 5, '0')),
    DATE(TIMESTAMPADD(DAY, -(30 + MOD(s.seq, 90)), CURRENT_DATE)),
    DATE(TIMESTAMPADD(DAY, 700 + MOD(s.seq, 200), CURRENT_DATE)),
    DATE(TIMESTAMPADD(DAY, -(10 + MOD(s.seq, 60)), CURRENT_DATE)),
    20000.000 + s.seq * 10.000,
    12000.000 + s.seq * 5.000
FROM seed_sequence s
WHERE s.seq <= 150;

INSERT INTO raw_material_lot (
    material_lot_id, material_id, material_lot_no, supplier_name, supplier_lot_no,
    manufacture_date, expiry_date, received_date, received_qty, current_qty
)
SELECT
    2000 + s.seq,
    1000 + s.seq,
    CONCAT('RMLOT-PKG-B-', LPAD(s.seq, 5, '0')),
    CASE MOD(s.seq, 4)
        WHEN 0 THEN '새한인쇄포장'
        WHEN 1 THEN '라인컵용기'
        WHEN 2 THEN '대한밀봉자재'
        ELSE '동우출하포장'
    END,
    CONCAT('PKG-B-', LPAD(s.seq, 5, '0')),
    DATE(TIMESTAMPADD(DAY, -(300 + MOD(s.seq, 120)), CURRENT_DATE)),
    CASE
        WHEN MOD(s.seq, 12) = 0 THEN DATE(TIMESTAMPADD(DAY, -15, CURRENT_DATE))
        ELSE DATE(TIMESTAMPADD(DAY, 240 + MOD(s.seq, 100), CURRENT_DATE))
    END,
    DATE(TIMESTAMPADD(DAY, -(120 + MOD(s.seq, 120)), CURRENT_DATE)),
    8000.000 + s.seq * 5.000,
    CASE WHEN MOD(s.seq, 12) = 0 THEN 0.000 ELSE 2500.000 + s.seq * 2.000 END
FROM seed_sequence s
WHERE s.seq <= 150;

-- 작업지시, 생산 LOT, 공정 진척
INSERT INTO work_order (
    work_order_id, work_order_no, product_id, supervisor_id,
    target_qty, hourly_target_qty, current_qty, good_qty, defect_qty,
    planned_start_date, registered_at, started_at, completed_at, status, remarks
)
SELECT
    s.seq,
    CONCAT('WO-', DATE_FORMAT(CURRENT_DATE, '%Y%m'), '-', LPAD(s.seq, 5, '0')),
    1 + MOD(s.seq - 1, 15),
    2 + MOD(s.seq, 3),
    CASE WHEN s.seq = 1 THEN 1200 ELSE 800 + MOD(s.seq, 10) * 40 END,
    CASE WHEN s.seq = 1 THEN 200 ELSE 200 + MOD(s.seq, 10) * 10 END,
    CASE
        WHEN s.seq = 1 THEN 420
        WHEN s.seq <= 51 THEN 0
        ELSE 800 + MOD(s.seq, 10) * 40 - MOD(s.seq, 4) * 10
    END,
    CASE
        WHEN s.seq = 1 THEN 411
        WHEN s.seq <= 51 THEN 0
        ELSE 800 + MOD(s.seq, 10) * 40 - MOD(s.seq, 4) * 10 - (12 + MOD(s.seq, 18))
    END,
    CASE
        WHEN s.seq = 1 THEN 9
        WHEN s.seq <= 51 THEN 0
        ELSE 12 + MOD(s.seq, 18)
    END,
    CASE
        WHEN s.seq = 1 THEN CURRENT_DATE
        WHEN s.seq <= 51 THEN DATE(TIMESTAMPADD(DAY, s.seq - 1, CURRENT_DATE))
        ELSE DATE(TIMESTAMPADD(DAY, -(201 - s.seq), CURRENT_DATE))
    END,
    CASE
        WHEN s.seq = 1 THEN TIMESTAMPADD(HOUR, -5, CURRENT_TIMESTAMP)
        WHEN s.seq <= 51 THEN TIMESTAMPADD(HOUR, -(52 - s.seq), CURRENT_TIMESTAMP)
        ELSE TIMESTAMPADD(DAY, -(202 - s.seq), CURRENT_TIMESTAMP)
    END,
    CASE
        WHEN s.seq = 1 THEN TIMESTAMPADD(HOUR, -4, CURRENT_TIMESTAMP)
        WHEN s.seq <= 51 THEN NULL
        ELSE TIMESTAMPADD(HOUR, -6, TIMESTAMPADD(DAY, -(201 - s.seq), CURRENT_TIMESTAMP))
    END,
    CASE
        WHEN s.seq <= 51 THEN NULL
        ELSE TIMESTAMPADD(HOUR, -1, TIMESTAMPADD(DAY, -(201 - s.seq), CURRENT_TIMESTAMP))
    END,
    CASE WHEN s.seq = 1 THEN 'IN_PROGRESS' WHEN s.seq <= 51 THEN 'PENDING' ELSE 'DONE' END,
    CONCAT(
        '제',
        1 + MOD(s.seq - 1, 3),
        '생산라인 ',
        CASE WHEN s.seq = 1 THEN '당일 생산 진행' WHEN s.seq <= 51 THEN '생산 계획 확정' ELSE '생산 실적 확정' END
    )
FROM seed_sequence s
WHERE s.seq <= 200;

INSERT INTO production_lot (
    production_lot_id, lot_no, work_order_id,
    production_qty, good_qty, defect_qty, status, started_at, completed_at
)
SELECT
    w.work_order_id,
    REPLACE(w.work_order_no, 'WO-', 'LOT-'),
    w.work_order_id,
    w.current_qty,
    w.good_qty,
    w.defect_qty,
    CASE WHEN w.status = 'PENDING' THEN 'PENDING' WHEN w.status = 'DONE' THEN 'COMPLETED' ELSE 'IN_PROGRESS' END,
    w.started_at,
    w.completed_at
FROM work_order w;

INSERT INTO work_order_equipment (work_order_id, equipment_id)
SELECT
    w.work_order_id,
    e.equipment_id
FROM work_order w
CROSS JOIN manufacturing_process mp
JOIN equipment e
  ON e.process_id = mp.process_id
 AND RIGHT(e.equipment_code, 3) = '-01';

INSERT INTO work_order_worker (work_order_id, user_id)
SELECT
    w.work_order_id,
    6 + MOD(w.work_order_id + worker_slot.slot_no, 10)
FROM work_order w
CROSS JOIN (
    SELECT 0 AS slot_no UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
) worker_slot;

INSERT INTO production_process_progress (
    production_lot_id, process_id, equipment_id, status,
    target_qty, production_qty, good_qty, defect_qty, started_at, completed_at
)
SELECT
    pl.production_lot_id,
    mp.process_id,
    e.equipment_id,
    CASE
        WHEN w.status = 'PENDING' THEN 'PENDING'
        WHEN w.status = 'DONE' THEN 'COMPLETED'
        ELSE 'IN_PROGRESS'
    END,
    w.target_qty,
    CASE
        WHEN w.status = 'DONE' THEN w.current_qty
        ELSE 0
    END,
    CASE
        WHEN w.status = 'DONE' THEN w.good_qty
        ELSE 0
    END,
    CASE
        WHEN w.status = 'DONE' THEN w.defect_qty
        ELSE 0
    END,
    CASE
        WHEN w.status = 'PENDING' THEN NULL
        ELSE w.started_at
    END,
    CASE
        WHEN w.status = 'DONE' THEN w.completed_at
        ELSE NULL
    END
FROM production_lot pl
JOIN work_order w ON w.work_order_id = pl.work_order_id
CROSS JOIN manufacturing_process mp
JOIN equipment e
  ON e.process_id = mp.process_id
 AND RIGHT(e.equipment_code, 3) = '-01';

UPDATE equipment
SET status = CASE
    WHEN equipment_code = 'STEAMER-01' THEN 'RUNNING'
    ELSE 'STOPPED'
END;

-- 작업지시 상태 변경 이력
INSERT INTO work_order_status_history (
    work_order_id, changed_by_id, action, prev_status, new_status, changed_at, note
)
SELECT
    w.work_order_id,
    w.supervisor_id,
    'REGISTERED',
    NULL,
    'PENDING',
    w.registered_at,
    '생산계획 등록'
FROM work_order w;

INSERT INTO work_order_status_history (
    work_order_id, changed_by_id, action, prev_status, new_status, changed_at, note
)
SELECT
    w.work_order_id,
    w.supervisor_id,
    'START',
    'PENDING',
    'IN_PROGRESS',
    w.started_at,
    '작업표준 확인 후 생산 시작'
FROM work_order w
WHERE w.status IN ('IN_PROGRESS', 'DONE');

INSERT INTO work_order_status_history (
    work_order_id, changed_by_id, action, prev_status, new_status, changed_at, note
)
SELECT
    w.work_order_id,
    w.supervisor_id,
    'HOLD',
    'IN_PROGRESS',
    'HOLD',
    TIMESTAMPADD(MINUTE, 90, w.started_at),
    '공정 품질 확인을 위한 일시 보류'
FROM work_order w
WHERE w.status = 'DONE'
  AND MOD(w.work_order_id, 7) = 0;

INSERT INTO work_order_status_history (
    work_order_id, changed_by_id, action, prev_status, new_status, changed_at, note
)
SELECT
    w.work_order_id,
    w.supervisor_id,
    'RESUME',
    'HOLD',
    'IN_PROGRESS',
    TIMESTAMPADD(MINUTE, 120, w.started_at),
    '품질 확인 완료 후 생산 재개'
FROM work_order w
WHERE w.status = 'DONE'
  AND MOD(w.work_order_id, 7) = 0;

INSERT INTO work_order_status_history (
    work_order_id, changed_by_id, action, prev_status, new_status, changed_at, note
)
SELECT
    w.work_order_id,
    w.supervisor_id,
    'COMPLETE',
    'IN_PROGRESS',
    'DONE',
    w.completed_at,
    '생산수량 및 품질실적 확정'
FROM work_order w
WHERE w.status = 'DONE';

-- 시간별 생산량과 생산실적
INSERT INTO hourly_production (
    work_order_id, bucket_start, bucket_end, received_at,
    target_qty, production_qty, good_qty, defect_qty, is_partial, close_reason
)
SELECT
    q.work_order_id,
    q.bucket_start,
    TIMESTAMPADD(HOUR, 1, q.bucket_start),
    TIMESTAMPADD(MINUTE, 2, TIMESTAMPADD(HOUR, 1, q.bucket_start)),
    q.target_qty,
    q.production_qty,
    q.production_qty - q.defect_qty,
    q.defect_qty,
    q.slot_no = q.slot_count AND q.current_qty < q.total_target_qty,
    CASE
        WHEN q.order_status = 'DONE' AND q.slot_no = q.slot_count THEN 'WORK_ORDER_COMPLETED'
        ELSE 'HOURLY'
    END
FROM (
    SELECT
        w.work_order_id,
        w.status AS order_status,
        w.current_qty,
        w.target_qty AS total_target_qty,
        w.hourly_target_qty AS target_qty,
        slot.slot_no,
        CASE WHEN w.status = 'IN_PROGRESS' THEN 3 ELSE 4 END AS slot_count,
        TIMESTAMPADD(HOUR, slot.slot_no - 1, w.started_at) AS bucket_start,
        CASE
            WHEN slot.slot_no < CASE WHEN w.status = 'IN_PROGRESS' THEN 3 ELSE 4 END
                THEN FLOOR(w.current_qty / CASE WHEN w.status = 'IN_PROGRESS' THEN 3 ELSE 4 END)
            ELSE w.current_qty
                 - FLOOR(w.current_qty / CASE WHEN w.status = 'IN_PROGRESS' THEN 3 ELSE 4 END)
                   * (CASE WHEN w.status = 'IN_PROGRESS' THEN 3 ELSE 4 END - 1)
        END AS production_qty,
        CASE
            WHEN slot.slot_no < CASE WHEN w.status = 'IN_PROGRESS' THEN 3 ELSE 4 END
                THEN FLOOR(w.defect_qty / CASE WHEN w.status = 'IN_PROGRESS' THEN 3 ELSE 4 END)
            ELSE w.defect_qty
                 - FLOOR(w.defect_qty / CASE WHEN w.status = 'IN_PROGRESS' THEN 3 ELSE 4 END)
                   * (CASE WHEN w.status = 'IN_PROGRESS' THEN 3 ELSE 4 END - 1)
        END AS defect_qty
    FROM work_order w
    CROSS JOIN (
        SELECT 1 AS slot_no UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    ) slot
    WHERE w.status IN ('IN_PROGRESS', 'DONE')
      AND slot.slot_no <= CASE WHEN w.status = 'IN_PROGRESS' THEN 3 ELSE 4 END
) q;

INSERT INTO production_result (
    production_result_id, result_no, production_lot_id,
    target_qty, production_qty, good_qty, defect_qty, status,
    started_at, completed_at, last_aggregated_at, created_at, updated_at
)
SELECT
    w.work_order_id,
    CONCAT('PR-', LPAD(w.work_order_id, 7, '0')),
    pl.production_lot_id,
    w.target_qty,
    w.current_qty,
    w.good_qty,
    w.defect_qty,
    CASE WHEN w.status = 'DONE' THEN 'COMPLETED' ELSE 'COLLECTING' END,
    w.started_at,
    w.completed_at,
    CASE WHEN w.status = 'DONE' THEN w.completed_at ELSE TIMESTAMPADD(MINUTE, -2, CURRENT_TIMESTAMP) END,
    w.started_at,
    CASE WHEN w.status = 'DONE' THEN w.completed_at ELSE TIMESTAMPADD(MINUTE, -2, CURRENT_TIMESTAMP) END
FROM work_order w
JOIN production_lot pl ON pl.work_order_id = w.work_order_id
WHERE w.status IN ('IN_PROGRESS', 'DONE');

-- 생산 LOT별 실제 자재 사용
INSERT INTO production_lot_material (production_lot_id, material_lot_id, used_qty)
SELECT pl.production_lot_id, 1, ROUND(pl.production_qty * 0.055, 3)
FROM production_lot pl
WHERE pl.status IN ('IN_PROGRESS', 'COMPLETED');

INSERT INTO production_lot_material (production_lot_id, material_lot_id, used_qty)
SELECT pl.production_lot_id, 3, ROUND(pl.production_qty * 0.008, 3)
FROM production_lot pl
WHERE pl.status IN ('IN_PROGRESS', 'COMPLETED');

INSERT INTO production_lot_material (production_lot_id, material_lot_id, used_qty)
SELECT pl.production_lot_id, 5 + MOD(w.product_id - 1, 6), ROUND(pl.production_qty * 0.010, 3)
FROM production_lot pl
JOIN work_order w ON w.work_order_id = pl.work_order_id
WHERE pl.status IN ('IN_PROGRESS', 'COMPLETED');

INSERT INTO production_lot_material (production_lot_id, material_lot_id, used_qty)
SELECT pl.production_lot_id, 11 + MOD(w.product_id, 2), pl.production_qty
FROM production_lot pl
JOIN work_order w ON w.work_order_id = pl.work_order_id
WHERE pl.status IN ('IN_PROGRESS', 'COMPLETED');

INSERT INTO production_lot_material (production_lot_id, material_lot_id, used_qty)
SELECT pl.production_lot_id, 13, pl.production_qty
FROM production_lot pl
WHERE pl.status IN ('IN_PROGRESS', 'COMPLETED');

-- 원자재 재고 이동
INSERT INTO inventory_movement (
    movement_no, item_type, movement_type, raw_material_lot_id,
    product_inventory_id, quantity, handled_by_id, occurred_at, remarks
)
SELECT
    CONCAT('RM-IN-', LPAD(rml.material_lot_id, 7, '0')),
    'RAW_MATERIAL',
    'INBOUND',
    rml.material_lot_id,
    NULL,
    rml.received_qty,
    5,
    TIMESTAMP(rml.received_date, '09:00:00'),
    CONCAT(rml.supplier_name, ' 입고 검수 완료')
FROM raw_material_lot rml;

INSERT INTO inventory_movement (
    movement_no, item_type, movement_type, raw_material_lot_id,
    product_inventory_id, quantity, handled_by_id, occurred_at, remarks
)
SELECT
    CONCAT('RM-OUT-', LPAD(rml.material_lot_id, 7, '0')),
    'RAW_MATERIAL',
    'OUTBOUND',
    rml.material_lot_id,
    NULL,
    rml.received_qty - rml.current_qty,
    5,
    TIMESTAMPADD(HOUR, 6, TIMESTAMP(rml.received_date, '09:00:00')),
    '생산계획에 따른 공정 투입'
FROM raw_material_lot rml
WHERE rml.received_qty > rml.current_qty;

INSERT INTO inventory_movement (
    movement_no, item_type, movement_type, raw_material_lot_id,
    product_inventory_id, quantity, handled_by_id, occurred_at, remarks
)
SELECT
    CONCAT('RM-ADJ-', LPAD(rml.material_lot_id, 7, '0')),
    'RAW_MATERIAL',
    'ADJUSTMENT',
    rml.material_lot_id,
    NULL,
    rml.current_qty,
    5,
    TIMESTAMPADD(DAY, 1, TIMESTAMP(rml.received_date, '09:00:00')),
    '정기 재고 실사 수량 반영'
FROM raw_material_lot rml
WHERE MOD(rml.material_lot_id, 10) = 0
  AND rml.current_qty > 0;

-- 완제품 재고와 이동
INSERT INTO product_inventory (
    inventory_id, production_lot_id, current_qty, safety_stock_qty, expiry_date, created_at
)
SELECT
    pl.production_lot_id,
    pl.production_lot_id,
    CASE MOD(pl.production_lot_id, 4)
        WHEN 0 THEN 0
        WHEN 1 THEN pl.good_qty
        WHEN 2 THEN LEAST(50, pl.good_qty)
        ELSE LEAST(200, pl.good_qty)
    END,
    100,
    CASE
        WHEN MOD(pl.production_lot_id, 4) = 3 THEN DATE(TIMESTAMPADD(DAY, -10, CURRENT_DATE))
        ELSE DATE(TIMESTAMPADD(DAY, 180 + MOD(pl.production_lot_id, 90), CURRENT_DATE))
    END,
    TIMESTAMPADD(MINUTE, 10, pl.completed_at)
FROM production_lot pl
WHERE pl.status = 'COMPLETED';

INSERT INTO inventory_movement (
    movement_no, item_type, movement_type, raw_material_lot_id,
    product_inventory_id, quantity, handled_by_id, occurred_at, remarks
)
SELECT
    CONCAT('FG-IN-', LPAD(pi.inventory_id, 7, '0')),
    'FINISHED_PRODUCT',
    'INBOUND',
    NULL,
    pi.inventory_id,
    pl.good_qty,
    5,
    TIMESTAMPADD(MINUTE, 10, pl.completed_at),
    '생산 완료 LOT 입고'
FROM product_inventory pi
JOIN production_lot pl ON pl.production_lot_id = pi.production_lot_id;

INSERT INTO inventory_movement (
    movement_no, item_type, movement_type, raw_material_lot_id,
    product_inventory_id, quantity, handled_by_id, occurred_at, remarks
)
SELECT
    CONCAT('FG-OUT-', LPAD(pi.inventory_id, 7, '0')),
    'FINISHED_PRODUCT',
    'OUTBOUND',
    NULL,
    pi.inventory_id,
    pl.good_qty - pi.current_qty,
    5,
    TIMESTAMPADD(DAY, 1, pl.completed_at),
    '출하계획에 따른 완제품 출고'
FROM product_inventory pi
JOIN production_lot pl ON pl.production_lot_id = pi.production_lot_id
WHERE pl.good_qty > pi.current_qty;

INSERT INTO inventory_movement (
    movement_no, item_type, movement_type, raw_material_lot_id,
    product_inventory_id, quantity, handled_by_id, occurred_at, remarks
)
SELECT
    CONCAT('FG-ADJ-', LPAD(pi.inventory_id, 7, '0')),
    'FINISHED_PRODUCT',
    'ADJUSTMENT',
    NULL,
    pi.inventory_id,
    pi.current_qty,
    5,
    TIMESTAMPADD(DAY, 2, pl.completed_at),
    '완제품 창고 실사 수량 반영'
FROM product_inventory pi
JOIN production_lot pl ON pl.production_lot_id = pi.production_lot_id
WHERE MOD(pi.inventory_id, 10) = 0
  AND pi.current_qty > 0;

-- 설비 계측값
INSERT INTO equipment_telemetry (
    equipment_id, work_order_id, metric_type, metric_value, unit, measured_at
)
SELECT
    e.equipment_id,
    CASE WHEN MOD(s.seq, 150) = 0 THEN 1 ELSE 52 + MOD(s.seq - 1, 149) END,
    'TEMPERATURE',
    24.0000 + MOD(s.seq, 37) * 0.6500,
    'C',
    TIMESTAMPADD(MINUTE, -s.seq, CURRENT_TIMESTAMP)
FROM seed_sequence s
JOIN manufacturing_process mp ON mp.sequence_no = 1 + MOD(s.seq - 1, 9)
JOIN equipment e
  ON e.process_id = mp.process_id
 AND RIGHT(e.equipment_code, 3) = '-01';

INSERT INTO equipment_telemetry (
    equipment_id, work_order_id, metric_type, metric_value, unit, measured_at
)
SELECT
    e.equipment_id,
    CASE WHEN MOD(s.seq, 150) = 0 THEN 1 ELSE 52 + MOD(s.seq - 1, 149) END,
    'HUMIDITY',
    38.0000 + MOD(s.seq, 28) * 0.7000,
    '%',
    TIMESTAMPADD(MINUTE, -s.seq, CURRENT_TIMESTAMP)
FROM seed_sequence s
JOIN manufacturing_process mp ON mp.sequence_no = 1 + MOD(s.seq - 1, 9)
JOIN equipment e
  ON e.process_id = mp.process_id
 AND RIGHT(e.equipment_code, 3) = '-01';

INSERT INTO equipment_telemetry (
    equipment_id, work_order_id, metric_type, metric_value, unit, measured_at
)
SELECT
    e.equipment_id,
    CASE WHEN MOD(s.seq, 150) = 0 THEN 1 ELSE 52 + MOD(s.seq - 1, 149) END,
    'SPEED',
    90.0000 + MOD(s.seq, 45) * 2.5000,
    'RPM',
    TIMESTAMPADD(MINUTE, -s.seq, CURRENT_TIMESTAMP)
FROM seed_sequence s
JOIN manufacturing_process mp ON mp.sequence_no = 1 + MOD(s.seq - 1, 9)
JOIN equipment e
  ON e.process_id = mp.process_id
 AND RIGHT(e.equipment_code, 3) = '-01';

-- 불량과 처리 이력
INSERT INTO defect (
    defect_no, idempotency_key, production_lot_id, equipment_id,
    defect_type_id, quantity, occurred_at, cause, status
)
SELECT
    CONCAT('DF-', LPAD(w.work_order_id, 6, '0'), '-', d.slot_no),
    CONCAT('DEFECT-', LPAD(w.work_order_id, 6, '0'), '-', d.slot_no),
    pl.production_lot_id,
    e.equipment_id,
    dt.defect_type_id,
    1 + MOD(w.work_order_id + d.slot_no, 3),
    TIMESTAMPADD(MINUTE, 35 + d.slot_no * 20, w.started_at),
    CASE MOD(w.work_order_id + d.slot_no, 5)
        WHEN 0 THEN '포장 밀봉 압력 편차'
        WHEN 1 THEN '제품 중량 허용범위 이탈'
        WHEN 2 THEN '원료 수분 편차'
        WHEN 3 THEN '검사 공정 이물 감지'
        ELSE '공정 조건 일시 편차'
    END,
    CASE MOD(w.work_order_id + d.slot_no, 4)
        WHEN 0 THEN 'UNHANDLED'
        WHEN 1 THEN 'IN_PROGRESS'
        WHEN 2 THEN 'ON_HOLD'
        ELSE 'COMPLETED'
    END
FROM work_order w
JOIN production_lot pl ON pl.work_order_id = w.work_order_id
CROSS JOIN (
    SELECT 1 AS slot_no UNION ALL SELECT 2
) d
JOIN manufacturing_process mp ON mp.process_code = 'INSPECTION'
JOIN equipment e
  ON e.process_id = mp.process_id
 AND RIGHT(e.equipment_code, 3) = '-01'
JOIN defect_type dt
  ON dt.code = CASE MOD(w.work_order_id + d.slot_no, 5)
      WHEN 0 THEN 'SEALING'
      WHEN 1 THEN 'WEIGHT'
      WHEN 2 THEN 'MOISTURE'
      WHEN 3 THEN 'FOREIGN_MATERIAL'
      ELSE 'GENERAL_NG'
  END
WHERE w.status IN ('IN_PROGRESS', 'DONE');

INSERT INTO defect_handling_history (
    defect_id, status, handle_method, content, handled_by_id, handled_at
)
SELECT
    d.defect_id,
    'IN_PROGRESS',
    NULL,
    '현장 원인 확인 및 영향 범위 분석',
    3,
    TIMESTAMPADD(MINUTE, 15, d.occurred_at)
FROM defect d
WHERE d.status <> 'UNHANDLED';

INSERT INTO defect_handling_history (
    defect_id, status, handle_method, content, handled_by_id, handled_at
)
SELECT
    d.defect_id,
    d.status,
    CASE
        WHEN d.status <> 'COMPLETED' THEN NULL
        WHEN dt.code = 'FOREIGN_MATERIAL' THEN 'DISPOSAL'
        WHEN dt.code IN ('SEALING', 'WEIGHT') THEN 'REWORK'
        ELSE 'NORMAL_APPROVAL'
    END,
    CASE
        WHEN d.status = 'ON_HOLD' THEN '추가 품질 판정을 위해 생산품 격리'
        WHEN dt.code = 'FOREIGN_MATERIAL' THEN '영향 제품 격리 후 폐기 처리'
        WHEN dt.code IN ('SEALING', 'WEIGHT') THEN '공정 조건 보정 후 재작업 완료'
        ELSE '품질 기준 재확인 후 정상 승인'
    END,
    3,
    TIMESTAMPADD(MINUTE, 40, d.occurred_at)
FROM defect d
JOIN defect_type dt ON dt.defect_type_id = d.defect_type_id
WHERE d.status IN ('ON_HOLD', 'COMPLETED');

-- 설비 알람
INSERT INTO alarm (
    alarm_no, equipment_id, handler_id, message, description,
    severity, status, occurred_at, resolved_at, handling_content
)
SELECT
    CONCAT('AL-', DATE_FORMAT(CURRENT_DATE, '%Y%m'), '-', LPAD(s.seq, 5, '0')),
    e.equipment_id,
    CASE WHEN MOD(s.seq, 5) = 0 THEN NULL ELSE 4 END,
    CASE MOD(s.seq, 6)
        WHEN 0 THEN CONCAT(e.equipment_name, ' 구동부 과부하 감지')
        WHEN 1 THEN CONCAT(e.equipment_name, ' 공정 온도 상한 접근')
        WHEN 2 THEN CONCAT(e.equipment_name, ' 회전속도 편차 발생')
        WHEN 3 THEN CONCAT(e.equipment_name, ' 안전센서 신호 확인 필요')
        WHEN 4 THEN CONCAT(e.equipment_name, ' 통신 응답 지연')
        ELSE CONCAT(e.equipment_name, ' 예방보전 주기 도래')
    END,
    CONCAT(
        e.location,
        ' ',
        e.equipment_code,
        '에서 기준값 편차가 감지되었습니다. 현장 작업표준에 따라 설비 상태와 생산품 영향을 확인합니다.'
    ),
    CASE WHEN MOD(s.seq, 10) = 0 THEN 'CRITICAL' WHEN MOD(s.seq, 3) = 0 THEN 'WARNING' ELSE 'INFO' END,
    CASE MOD(s.seq, 5)
        WHEN 0 THEN 'PENDING_CONFIRMATION'
        WHEN 1 THEN 'IN_PROGRESS'
        WHEN 2 THEN 'INSPECTION_RESERVED'
        WHEN 3 THEN 'MONITORING'
        ELSE 'RESOLVED'
    END,
    TIMESTAMPADD(HOUR, -s.seq, CURRENT_TIMESTAMP),
    CASE WHEN MOD(s.seq, 5) = 4 THEN TIMESTAMPADD(MINUTE, 45, TIMESTAMPADD(HOUR, -s.seq, CURRENT_TIMESTAMP)) ELSE NULL END,
    CASE MOD(s.seq, 5)
        WHEN 0 THEN NULL
        WHEN 1 THEN '현장 설비 상태와 공정 조건 확인 중'
        WHEN 2 THEN '다음 비가동 시간에 정밀점검 예정'
        WHEN 3 THEN '조건 보정 후 계측값 추이 관찰'
        ELSE '원인 조치와 정상 가동 확인 완료'
    END
FROM seed_sequence s
JOIN manufacturing_process mp ON mp.sequence_no = 1 + MOD(s.seq - 1, 9)
JOIN equipment e
  ON e.process_id = mp.process_id
 AND RIGHT(e.equipment_code, 3) = '-01';

-- L1/L2 연결 상태와 통신 이력
INSERT INTO l2_collector (
    collector_id, collector_code, name, status, connected_l1_count,
    backend_connection_status, last_sent_at
) VALUES
    (1, 'L2-01', '제1생산라인 L2 수집기', 'RUNNING', 9, 'CONNECTED', CURRENT_TIMESTAMP - INTERVAL 3 SECOND);

INSERT INTO l1_device (
    device_id, equipment_id, ip_address, port, connection_status, last_received_at
)
SELECT
    e.equipment_id,
    e.equipment_id,
    CONCAT('10.20.10.', 20 + MOD(e.equipment_id - 1, 9)),
    5001 + MOD(e.equipment_id - 1, 9),
    'CONNECTED',
    TIMESTAMPADD(SECOND, -MOD(e.equipment_id, 12), CURRENT_TIMESTAMP)
FROM equipment e
WHERE RIGHT(e.equipment_code, 3) = '-01';

INSERT INTO communication_log (
    device_id, collector_id, direction, success, fail_reason, occurred_at
)
SELECT
    e.equipment_id,
    NULL,
    'RX',
    MOD(s.seq, 31) <> 0,
    CASE WHEN MOD(s.seq, 31) = 0 THEN 'L1 응답 지연으로 연결 재시도' ELSE NULL END,
    TIMESTAMPADD(SECOND, -s.seq * 7, CURRENT_TIMESTAMP)
FROM seed_sequence s
JOIN manufacturing_process mp ON mp.sequence_no = 1 + MOD(s.seq - 1, 9)
JOIN equipment e
  ON e.process_id = mp.process_id
 AND RIGHT(e.equipment_code, 3) = '-01';

INSERT INTO communication_log (
    device_id, collector_id, direction, success, fail_reason, occurred_at
)
SELECT
    NULL,
    1,
    'TX',
    MOD(s.seq, 37) <> 0,
    CASE WHEN MOD(s.seq, 37) = 0 THEN '백엔드 전송 지연으로 재전송 대기' ELSE NULL END,
    TIMESTAMPADD(SECOND, -s.seq * 11, CURRENT_TIMESTAMP)
FROM seed_sequence s;

DROP TEMPORARY TABLE seed_sequence;
