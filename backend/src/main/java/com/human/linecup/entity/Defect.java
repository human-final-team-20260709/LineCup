package com.human.linecup.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** ERD: DEFECT — README 4.1~4.4 */
@Entity
@Table(name = "defect")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Defect {

    public static final String STATUS_UNHANDLED = "미처리";
    public static final String STATUS_IN_PROGRESS = "처리 중";
    public static final String STATUS_ON_HOLD = "보류";
    public static final String STATUS_DONE = "처리 완료";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "defect_id")
    private Long defectId;

    // 표시용 불량 번호 (예: DF-260713-024)
    @Column(name = "defect_no", nullable = false, unique = true, length = 30)
    private String defectNo;

    // FK -> PRODUCTION_LOT (별도 모듈 관리 — 현재는 ID 컬럼만 보유)
    @Column(name = "production_lot_id", nullable = false)
    private Long productionLotId;

    // FK -> EQUIPMENT (별도 모듈 관리 — 현재는 ID 컬럼만 보유)
    @Column(name = "equipment_id", nullable = false)
    private Long equipmentId;

    // FK -> USER, nullable (별도 모듈 관리 — 현재는 ID 컬럼만 보유)
    @Column(name = "handler_id")
    private Long handlerId;

    @Column(name = "defect_type", nullable = false, length = 50)
    private String defectType;

    @Column(nullable = false)
    private int quantity;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String cause;

    // 정상 승인 / 재작업 / 폐기
    @Column(name = "handle_method", length = 20)
    private String handleMethod;

    // 미처리 / 처리 중 / 보류 / 처리 완료
    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "occurred_at", nullable = false)
    private LocalDateTime occurredAt;

    // ERD에는 없는 보조 테이블: 프론트 DefectDetailPage 타임라인 표시용 (선택 사항)
    @OneToMany(mappedBy = "defect", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("occurredAt ASC")
    private List<DefectHistory> history = new ArrayList<>();

    @Builder
    public Defect(String defectNo, Long productionLotId, Long equipmentId, Long handlerId,
                  String defectType, int quantity, String cause, String handleMethod,
                  String status, LocalDateTime occurredAt) {
        if (requiresHandler(status) && handlerId == null) {
            throw new IllegalStateException(
                    "상태가 '" + status + "'로 등록되려면 담당자(handlerId)가 필요합니다.");
        }
        this.defectNo = defectNo;
        this.productionLotId = productionLotId;
        this.equipmentId = equipmentId;
        this.handlerId = handlerId;
        this.defectType = defectType;
        this.quantity = quantity;
        this.cause = cause;
        this.handleMethod = handleMethod;
        this.status = status;
        this.occurredAt = occurredAt;
    }

    public void addHistory(DefectHistory entry) {
        this.history.add(entry);
        entry.assignDefect(this);
    }

    public void updateTreatment(String handleMethod, Long handlerId, String status) {
        if (requiresHandler(status) && handlerId == null) {
            throw new IllegalStateException(
                    "상태가 '" + status + "'로 전이되려면 담당자(handlerId)가 필요합니다.");
        }
        this.handleMethod = handleMethod;
        this.handlerId = handlerId;
        this.status = status;
    }

    private boolean requiresHandler(String status) {
        return STATUS_IN_PROGRESS.equals(status) || STATUS_DONE.equals(status);
    }

    /** 상태에 따른 UI 색상 톤 */
    public String getTone() {
        return switch (status) {
            case STATUS_UNHANDLED -> "alarm";
            case STATUS_IN_PROGRESS -> "warning";
            case STATUS_DONE -> "success";
            default -> "neutral";
        };
    }
}
