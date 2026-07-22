package com.human.linecup.repository;

import com.human.linecup.entity.EquipmentHumidity;
import com.human.linecup.entity.EquipmentSpeed;
import com.human.linecup.entity.EquipmentTemperature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

/**
 * 설비 공정 조건(온도 / 습도 / 속도) 조회 전용 창구.
 *
 * ERD 상 EQUIPMENT_TEMPERATURE, EQUIPMENT_HUMIDITY, EQUIPMENT_SPEED는
 * 여전히 서로 다른 3개 테이블이다. 테이블/엔티티를 억지로 합치면 정밀도(scale),
 * 단위(unit) 컬럼 유무가 서로 달라 데이터 손실이 생길 수 있어 스키마는 그대로 두고,
 * 바깥에서 호출하는 코드만 이 클래스 하나로 접근하도록 파사드로 감쌌다.
 */
@Repository
public class EquipmentTelemetryRepository {

    private final TemperatureJpaRepository temperatureRepository;
    private final HumidityJpaRepository humidityRepository;
    private final SpeedJpaRepository speedRepository;

    public EquipmentTelemetryRepository(TemperatureJpaRepository temperatureRepository,
                                         HumidityJpaRepository humidityRepository,
                                         SpeedJpaRepository speedRepository) {
        this.temperatureRepository = temperatureRepository;
        this.humidityRepository = humidityRepository;
        this.speedRepository = speedRepository;
    }

    /** 설비 상세 화면 - 온도/습도/속도 최신값을 한 번에 조회 */
    public LatestTelemetry findLatestByEquipmentId(Long equipmentId) {
        BigDecimal latestTemperature = temperatureRepository
                .findTopByEquipmentIdOrderByMeasuredAtDesc(equipmentId)
                .map(EquipmentTemperature::getTemperature)
                .orElse(null);

        BigDecimal latestHumidity = humidityRepository
                .findTopByEquipmentIdOrderByMeasuredAtDesc(equipmentId)
                .map(EquipmentHumidity::getHumidity)
                .orElse(null);

        Optional<EquipmentSpeed> latestSpeed = speedRepository
                .findTopByEquipmentIdOrderByMeasuredAtDesc(equipmentId);

        return new LatestTelemetry(
                equipmentId,
                latestTemperature,
                latestHumidity,
                latestSpeed.map(EquipmentSpeed::getSpeed).orElse(null),
                latestSpeed.map(EquipmentSpeed::getUnit).orElse(null)
        );
    }

    /** 작업지시 상세 - 공정 조건 그래프용 시계열 (온도/습도/속도 통합, 측정 시각 오름차순) */
    public List<TelemetryPoint> findHistoryByWorkOrderId(Long workOrderId) {
        List<TelemetryPoint> points = new ArrayList<>();

        for (EquipmentTemperature t : temperatureRepository.findAllByWorkOrderIdOrderByMeasuredAtAsc(workOrderId)) {
            points.add(new TelemetryPoint(TelemetryType.TEMPERATURE, t.getTemperature(), "°C", t.getMeasuredAt()));
        }
        for (EquipmentHumidity h : humidityRepository.findAllByWorkOrderIdOrderByMeasuredAtAsc(workOrderId)) {
            points.add(new TelemetryPoint(TelemetryType.HUMIDITY, h.getHumidity(), "%", h.getMeasuredAt()));
        }
        for (EquipmentSpeed s : speedRepository.findAllByWorkOrderIdOrderByMeasuredAtAsc(workOrderId)) {
            points.add(new TelemetryPoint(TelemetryType.SPEED, s.getSpeed(), s.getUnit(), s.getMeasuredAt()));
        }

        points.sort(Comparator.comparing(TelemetryPoint::measuredAt));
        return points;
    }

    public enum TelemetryType { TEMPERATURE, HUMIDITY, SPEED }

    public record TelemetryPoint(TelemetryType type, BigDecimal value, String unit, LocalDateTime measuredAt) {
    }

    public record LatestTelemetry(Long equipmentId, BigDecimal temperature, BigDecimal humidity,
                                   BigDecimal speed, String speedUnit) {
    }

    // 파사드 내부에서만 쓰는 실제 JPA Repository (package-private, 외부에서 직접 주입하지 않음)
    interface TemperatureJpaRepository extends JpaRepository<EquipmentTemperature, Long> {
        Optional<EquipmentTemperature> findTopByEquipmentIdOrderByMeasuredAtDesc(Long equipmentId);

        List<EquipmentTemperature> findAllByWorkOrderIdOrderByMeasuredAtAsc(Long workOrderId);
    }

    interface HumidityJpaRepository extends JpaRepository<EquipmentHumidity, Long> {
        Optional<EquipmentHumidity> findTopByEquipmentIdOrderByMeasuredAtDesc(Long equipmentId);

        List<EquipmentHumidity> findAllByWorkOrderIdOrderByMeasuredAtAsc(Long workOrderId);
    }

    interface SpeedJpaRepository extends JpaRepository<EquipmentSpeed, Long> {
        Optional<EquipmentSpeed> findTopByEquipmentIdOrderByMeasuredAtDesc(Long equipmentId);

        List<EquipmentSpeed> findAllByWorkOrderIdOrderByMeasuredAtAsc(Long workOrderId);
    }
}
