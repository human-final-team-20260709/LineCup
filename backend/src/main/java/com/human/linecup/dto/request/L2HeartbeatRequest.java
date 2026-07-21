package com.human.linecup.dto.request;

import com.human.linecup.entity.ConnectionStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

public record L2HeartbeatRequest(
        @NotBlank @Size(max = 50) String collectorCode,
        @NotNull Instant sentAt,
        @NotEmpty List<@Valid L1HeartbeatDeviceRequest> devices,
        @PositiveOrZero int connectedL1Count
) {
    public L2HeartbeatRequest {
        devices = devices == null ? List.of() : List.copyOf(devices);
    }

    @AssertTrue(message = "connectedL1Count는 CONNECTED 장비 수와 일치해야 합니다.")
    public boolean isConnectedCountConsistent() {
        return devices == null || devices.stream()
                .filter(device -> device.connectionStatus() == ConnectionStatus.CONNECTED)
                .count()
                == connectedL1Count;
    }

    public record L1HeartbeatDeviceRequest(
            @NotBlank @Size(max = 50) String equipmentCode,
            @NotNull @Positive Integer port,
            @NotNull ConnectionStatus connectionStatus,
            Instant lastReceivedAt
    ) {
    }
}
