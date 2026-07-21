package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OutHistoryRequest {

    @NotNull
    @Positive
    private Long productInventoryId;

    @NotNull
    @Positive
    private Long userId;

    @NotNull
    @Positive
    private Integer qty;

    @NotNull
    private LocalDateTime occurredAt;

    private String remarks;
}
