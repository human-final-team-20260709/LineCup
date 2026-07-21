package com.human.linecup.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RawMaterialLotRequest {

    @NotNull
    @Positive
    private Long materialId;

    @NotBlank
    @Size(max = 100)
    private String supplierName;

    @NotBlank
    @Size(max = 50)
    private String supplierLotNo;

    @NotNull
    private LocalDate manufactureDate;

    @NotNull
    private LocalDate expiryDate;

    @NotNull
    @PositiveOrZero
    @Digits(integer = 9, fraction = 3)
    private BigDecimal receivedQty;

    @NotNull
    @PositiveOrZero
    @Digits(integer = 9, fraction = 3)
    private BigDecimal currentQty;

    @NotNull
    private LocalDate receivedDate;
}
