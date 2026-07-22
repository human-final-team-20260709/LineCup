package com.human.linecup.repository;

import com.human.linecup.entity.EquipmentTelemetry;
import com.human.linecup.entity.TelemetryMetricType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * 온도, 습도, 속도를 metric type으로 구분하는 통합 설비 텔레메트리 Repository.
 */
public interface EquipmentTelemetryRepository extends JpaRepository<EquipmentTelemetry, Long> {

    @EntityGraph(attributePaths = {"equipment", "equipment.manufacturingProcess", "workOrder"})
    Optional<EquipmentTelemetry> findFirstByEquipmentEquipmentIdAndMetricTypeOrderByMeasuredAtDescTelemetryIdDesc(
            Long equipmentId,
            TelemetryMetricType metricType
    );

    @EntityGraph(attributePaths = {"equipment", "equipment.manufacturingProcess", "workOrder"})
    List<EquipmentTelemetry> findByWorkOrderWorkOrderIdOrderByMeasuredAtAscTelemetryIdAsc(Long workOrderId);
}
