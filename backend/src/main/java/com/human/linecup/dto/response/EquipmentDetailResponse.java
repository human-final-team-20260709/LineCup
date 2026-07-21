package com.human.linecup.dto.response;

import java.util.List;

public record EquipmentDetailResponse(
        EquipmentResponse equipment,
        List<TelemetryResponse> latestTelemetry
) {
    public EquipmentDetailResponse {
        latestTelemetry = latestTelemetry == null ? List.of() : List.copyOf(latestTelemetry);
    }
}
