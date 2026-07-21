package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductionLotRequest {

    @NotBlank
    @Size(max = 50)
    private String lotNo;

    @NotNull
    @Positive
    private Long workOrderId;

    @NotNull
    @PositiveOrZero
    private Integer productionQty;

    @NotNull
    @PositiveOrZero
    private Integer goodQty;

    @NotNull
    @PositiveOrZero
    private Integer defectQty;

    @NotBlank
    @Pattern(regexp = "IN_PROGRESS|COMPLETED|HOLD")
    private String status;

    @NotNull
    private LocalDateTime startedAt;

    private LocalDateTime completedAt;
}
