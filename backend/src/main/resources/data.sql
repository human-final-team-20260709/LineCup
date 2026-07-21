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
