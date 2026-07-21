package com.human.linecup.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.human.linecup.entity.WorkOrder;

public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {

    boolean existsByWorkOrderNo(String workOrderNo);

    /** 작업지시 목록 — 상태 필터 + 작업지시번호/제품명 키워드 검색 */
    @Query("""
            SELECT w FROM WorkOrder w
            JOIN FETCH w.product
            JOIN FETCH w.supervisor
            WHERE (:status IS NULL OR w.status = :status)
              AND (:keyword IS NULL OR :keyword = ''
                   OR w.workOrderNo LIKE CONCAT('%', :keyword, '%')
                   OR w.product.productName LIKE CONCAT('%', :keyword, '%'))
            """)
    Page<WorkOrder> search(@Param("status") WorkOrder.Status status,
                            @Param("keyword") String keyword,
                            Pageable pageable);

    /** 작업지시 상세 — product/supervisor를 함께 조회해서 지연로딩 예외를 피한다 */
    @Query("""
            SELECT w FROM WorkOrder w
            JOIN FETCH w.product
            JOIN FETCH w.supervisor
            WHERE w.workOrderId = :workOrderId
            """)
    Optional<WorkOrder> findDetailById(@Param("workOrderId") Long workOrderId);

    long countByStatus(WorkOrder.Status status);

    /** 대시보드 카드 "목표 대비 평균 진행률" 계산용 */
    @Query("SELECT COALESCE(AVG(w.currentQty * 100.0 / w.targetQty), 0) FROM WorkOrder w WHERE w.targetQty > 0")
    Double averageProgressRate();

    /** 작업지시 번호(WO-yyyyMMdd-###) 채번을 위해 같은 날짜 prefix의 마지막 번호를 조회 */
    @Query("SELECT MAX(w.workOrderNo) FROM WorkOrder w WHERE w.workOrderNo LIKE CONCAT(:prefix, '%')")
    Optional<String> findMaxWorkOrderNoByPrefix(@Param("prefix") String prefix);
}
