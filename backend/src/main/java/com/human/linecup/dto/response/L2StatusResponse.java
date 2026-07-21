package com.human.linecup.dto.response;

import com.human.linecup.entity.L2Collector;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
@Builder
public class L2StatusResponse {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm:ss");

    private Long collectorId;
    private String name;
    private String status;
    private int connectedL1Count;
    private int l1Total;
    private String backendConnectionStatus;
    private String lastSentAt;

    public static L2StatusResponse from(L2Collector collector, long l1Total) {
        return L2StatusResponse.builder()
                .collectorId(collector.getCollectorId())
                .name(collector.getName())
                .status(collector.getStatus())
                .connectedL1Count(collector.getConnectedL1Count())
                .l1Total((int) l1Total)
                .backendConnectionStatus(collector.getBackendConnectionStatus())
                .lastSentAt(collector.getLastSentAt() == null
                        ? null : collector.getLastSentAt().format(TIME_FORMAT))
                .build();
    }
}
