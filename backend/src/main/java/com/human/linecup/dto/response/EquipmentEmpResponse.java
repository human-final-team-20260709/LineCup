package com.human.linecup.dto.response;

import com.human.linecup.entity.EquipmentEmp;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
@Builder
public class EquipmentEmpResponse {

    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private Long equipmentEmpId;
    private Long userId;
    private Long equipmentId;
    private String startTime;
    private String endTime;
    private boolean active;

    public static EquipmentEmpResponse from(EquipmentEmp emp) {
        return EquipmentEmpResponse.builder()
                .equipmentEmpId(emp.getEquipmentEmpId())
                .userId(emp.getUserId())
                .equipmentId(emp.getEquipmentId())
                .startTime(emp.getStartTime().format(DATETIME_FORMAT))
                .endTime(emp.getEndTime() == null ? null : emp.getEndTime().format(DATETIME_FORMAT))
                .active(emp.isActive())
                .build();
    }
}
