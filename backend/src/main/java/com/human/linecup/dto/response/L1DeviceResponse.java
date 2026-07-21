package com.human.linecup.dto.response;

import com.human.linecup.entity.L1Device;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
@Builder
public class L1DeviceResponse {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm:ss");

    private Long deviceId;
    private Long equipmentId;
    private Long collectorId;
    private String ipAddress;
    private Integer port;
    private String lastReceivedAt;
    private String connectionStatus;

    public static L1DeviceResponse from(L1Device device) {
        return L1DeviceResponse.builder()
                .deviceId(device.getDeviceId())
                .equipmentId(device.getEquipmentId())
                .collectorId(device.getCollectorId())
                .ipAddress(device.getIpAddress())
                .port(device.getPort())
                .lastReceivedAt(device.getLastReceivedAt() == null
                        ? null : device.getLastReceivedAt().format(TIME_FORMAT))
                .connectionStatus(device.getConnectionStatus())
                .build();
    }
}
