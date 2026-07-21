package com.human.linecup.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 작업지시 (WORK_ORDER)
 *
 * Status/Action은 WorkOrder를 떠나서는 의미가 없는 타입이라 별도 파일 대신 이 안에 중첩시켰다.
 * 바깥에서는 WorkOrder.Status / WorkOrder.Action 으로 참조한다.
 *
 * [트레이드오프] Action.validate()가 스프링 ResponseStatusException을 바로 던지기 때문에
 * 엔티티(도메인 계층)가 spring-web 패키지를 알게 된다. 계층을 엄격히 나누는 원칙에는 어긋나지만,
 * 이 규모에서는 상태 전이 예외를 위해 별도 클래스+핸들러를 두는 비용이 더 커서 실용적으로 합쳤다.
 * 나중에 계층을 다시 나누고 싶으면 여기서 순수 도메인 예외(unchecked)를 던지고,
 * 서비스 계층에서 잡아 ResponseStatusException으로 변환하는 식으로 되돌리면 된다.
 */
@Entity
@Table(name = "work_order")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "work_order_id")
    private Long workOrderId;

    @Column(name = "work_order_no", nullable = false, unique = true, length = 30)
    private String workOrderNo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    /** 담당 지시자 (지시자 배정 대상) */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User supervisor;

    @Column(name = "target_qty", nullable = false)
    private Integer targetQty;

    @Column(name = "current_qty", nullable = false)
    private Integer currentQty;

    @Column(name = "good_qty", nullable = false)
    private Integer goodQty;

    @Column(name = "defect_qty", nullable = false)
    private Integer defectQty;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status;

    @Column(name = "planned_start_date", nullable = false)
    private LocalDate plannedStartDate;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "registered_at", nullable = false, updatable = false)
    private LocalDateTime registeredAt;

    @Builder
    public WorkOrder(String workOrderNo, Product product, User supervisor, Integer targetQty,
                      LocalDate plannedStartDate, String remarks) {
        this.workOrderNo = workOrderNo;
        this.product = product;
        this.supervisor = supervisor;
        this.targetQty = targetQty;
        this.plannedStartDate = plannedStartDate;
        this.remarks = remarks;
        this.currentQty = 0;
        this.goodQty = 0;
        this.defectQty = 0;
        this.status = Status.PENDING; // 최초 상태는 대기로 등록
    }

    @PrePersist
    protected void onCreate() {
        this.registeredAt = LocalDateTime.now();
    }

    /** 목표 대비 달성률 /  목록의 진행률 표시 */
    public Double getProgressRate() {
        if (targetQty == null || targetQty == 0) {
            return 0.0;
        }
        double rate = (currentQty * 100.0) / targetQty;
        return Math.round(rate * 10) / 10.0;
    }

    /**생산 목표 수량 수정 */
    public void changeTargetQty(Integer targetQty) {
        this.targetQty = targetQty;
    }

    /** 지시자 변경 */
    public void changeSupervisor(User supervisor) {
        this.supervisor = supervisor;
    }

    /**
     *작업 시작 / 보류 / 재개 / 완료 처리.
     * @return 변경 전 상태 (이력 저장에 사용)
     */
    public Status applyAction(Action action) {
        Status prevStatus = this.status;
        Status nextStatus = action.nextStatus(prevStatus);
        this.status = nextStatus;

        LocalDateTime now = LocalDateTime.now();
        if (action == Action.START) {
            this.startTime = now;
        } else if (action == Action.COMPLETE) {
            this.endTime = now;
        }
        return prevStatus;
    }

    /** 작업 상태 /  WORK_ORDER.status */
    public enum Status {
        PENDING,
        IN_PROGRESS,
        HOLD,
        DONE
    }

    /**
     *  작업 시작/보류/재개/완료 처리 액션과 전이 규칙.
     * 대기 --START--> 진행중 --HOLD--> 보류 --RESUME--> 진행중 --COMPLETE--> 완료
     */
    public enum Action {
        START {
            @Override
            public Status nextStatus(Status current) {
                validate(current, Status.PENDING, this);
                return Status.IN_PROGRESS;
            }
        },
        HOLD {
            @Override
            public Status nextStatus(Status current) {
                validate(current, Status.IN_PROGRESS, this);
                return Status.HOLD;
            }
        },
        RESUME {
            @Override
            public Status nextStatus(Status current) {
                validate(current, Status.HOLD, this);
                return Status.IN_PROGRESS;
            }
        },
        COMPLETE {
            @Override
            public Status nextStatus(Status current) {
                validate(current, Status.IN_PROGRESS, this);
                return Status.DONE;
            }
        };

        public abstract Status nextStatus(Status current);

        private static void validate(Status current, Status required, Action action) {
            if (current != required) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        String.format("현재 상태(%s)에서는 '%s' 처리를 할 수 없습니다.", current, action));
            }
        }
    }
}
