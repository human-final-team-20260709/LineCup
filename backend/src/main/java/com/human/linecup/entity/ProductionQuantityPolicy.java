package com.human.linecup.entity;

/** 생산 수량 검증과 비율 계산을 한 곳에서 관리한다. */
public final class ProductionQuantityPolicy {

    private ProductionQuantityPolicy() {
    }

    public static void validate(int productionQty, int goodQty, int defectQty) {
        if (productionQty < 0 || goodQty < 0 || defectQty < 0) {
            throw new IllegalArgumentException("생산 수량은 0 이상이어야 합니다.");
        }
        if (productionQty != goodQty + defectQty) {
            throw new IllegalArgumentException("생산 수량은 정상 수량과 불량 수량의 합이어야 합니다.");
        }
    }

    public static int requireNonNegative(int value, String fieldName) {
        if (value < 0) {
            throw new IllegalArgumentException(fieldName + "은(는) 0 이상이어야 합니다.");
        }
        return value;
    }

    public static int requirePositive(int value, String fieldName) {
        if (value <= 0) {
            throw new IllegalArgumentException(fieldName + "은(는) 0보다 커야 합니다.");
        }
        return value;
    }

    public static double percentage(long value, long total) {
        if (total <= 0) {
            return 0.0;
        }
        return Math.round((value * 1000.0) / total) / 10.0;
    }
}
