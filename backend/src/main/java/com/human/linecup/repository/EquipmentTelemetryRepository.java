package com.human.linecup.repository;

import com.human.linecup.entity.EquipmentTelemetry;
import com.human.linecup.entity.TelemetryMetricType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * 온도, 습도, 속도를 metric type으로 구분하는 통합 설비 텔레메트리 Repository.
 */
public interface EquipmentTelemetryRepository extends JpaRepository<EquipmentTelemetry, Long> {

    @Modifying
    @Query(value = """
            insert into equipment_telemetry
                (equipment_id, work_order_id, metric_type, metric_value, unit, measured_at)
            values
                (:equipmentId, :workOrderId, :metricType, :metricValue, :unit, :measuredAt)
            on duplicate key update
                metric_value = values(metric_value),
                unit = values(unit)
            """, nativeQuery = true)
    int upsertSample(
            @Param("equipmentId") Long equipmentId,
            @Param("workOrderId") Long workOrderId,
            @Param("metricType") String metricType,
            @Param("metricValue") BigDecimal metricValue,
            @Param("unit") String unit,
            @Param("measuredAt") Instant measuredAt
    );

    @EntityGraph(attributePaths = {"equipment", "equipment.manufacturingProcess", "workOrder"})
    Optional<EquipmentTelemetry> findFirstByEquipmentEquipmentIdAndMetricTypeOrderByMeasuredAtDescTelemetryIdDesc(
            Long equipmentId,
            TelemetryMetricType metricType
    );

    @EntityGraph(attributePaths = {"equipment", "equipment.manufacturingProcess", "workOrder"})
    List<EquipmentTelemetry> findByWorkOrderWorkOrderIdOrderByMeasuredAtAscTelemetryIdAsc(Long workOrderId);
}
