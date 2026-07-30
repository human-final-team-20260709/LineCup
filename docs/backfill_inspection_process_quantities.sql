-- DBeaver에서 실행하는 기존 생산 LOT 검사 공정 실적 보정 스크립트입니다.
-- 스키마를 변경하지 않으며, 검사 공정 수량이 모두 0이고 LOT 전체 생산량이 있는 행만 대상으로 합니다.

START TRANSACTION;

SELECT
    ppp.process_progress_id,
    pl.lot_no,
    ppp.production_qty AS before_production_qty,
    ppp.good_qty AS before_good_qty,
    ppp.defect_qty AS before_defect_qty,
    pl.production_qty AS after_production_qty,
    pl.good_qty AS after_good_qty,
    pl.defect_qty AS after_defect_qty
FROM production_process_progress ppp
JOIN manufacturing_process mp
  ON mp.process_id = ppp.process_id
JOIN production_lot pl
  ON pl.production_lot_id = ppp.production_lot_id
WHERE mp.process_code = 'INSPECTION'
  AND ppp.production_qty = 0
  AND ppp.good_qty = 0
  AND ppp.defect_qty = 0
  AND pl.production_qty > 0
ORDER BY pl.production_lot_id;

UPDATE production_process_progress ppp
JOIN manufacturing_process mp
  ON mp.process_id = ppp.process_id
JOIN production_lot pl
  ON pl.production_lot_id = ppp.production_lot_id
SET
    ppp.production_qty = pl.production_qty,
    ppp.good_qty = pl.good_qty,
    ppp.defect_qty = pl.defect_qty
WHERE mp.process_code = 'INSPECTION'
  AND ppp.production_qty = 0
  AND ppp.good_qty = 0
  AND ppp.defect_qty = 0
  AND pl.production_qty > 0;

SELECT
    ROW_COUNT() AS updated_inspection_process_count;

-- 위 SELECT 결과를 확인한 뒤 아래 둘 중 하나만 실행하세요.
COMMIT;
-- ROLLBACK;
