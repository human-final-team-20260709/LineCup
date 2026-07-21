package com.human.linecup.dto.response;

import com.human.linecup.entity.EquipmentHumidity;
import com.human.linecup.entity.EquipmentSpeed;
import com.human.linecup.entity.EquipmentTemperature;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

/** 온도/습도/속도 이력 조회를 하나의 응답 형태로 공유 (WorkOrder 상세 - 공정 조건 그래프용) */
@Getter
@Builder
public class EquipmentSensorHistoryResponse {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm:ss");

    private Long equipmentId;
    private Long workOrderId;
    private BigDecimal value;
    private String unit;
    private String measuredAt;

    public static EquipmentSensorHistoryResponse from(EquipmentTemperature t) {
        return EquipmentSensorHistoryResponse.builder()
                .equipmentId(t.getEquipmentId())
                .workOrderId(t.getWorkOrderId())
                .value(t.getTemperature())
                .unit("°C")
                .measuredAt(t.getMeasuredAt().format(TIME_FORMAT))
                .build();
    }

    public static EquipmentSensorHistoryResponse from(EquipmentHumidity h) {
        return EquipmentSensorHistoryResponse.builder()
                .equipmentId(h.getEquipmentId())
                .workOrderId(h.getWorkOrderId())
                .value(h.getHumidity())
                .unit("%")
                .measuredAt(h.getMeasuredAt().format(TIME_FORMAT))
                .build();
    }

    public static EquipmentSensorHistoryResponse from(EquipmentSpeed s) {
        return EquipmentSensorHistoryResponse.builder()
                .equipmentId(s.getEquipmentId())
                .workOrderId(s.getWorkOrderId())
                .value(s.getSpeed())
                .unit(s.getUnit())
                .measuredAt(s.getMeasuredAt().format(TIME_FORMAT))
                .build();
    }
}
