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
