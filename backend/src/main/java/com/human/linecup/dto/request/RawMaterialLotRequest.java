package com.human.linecup.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RawMaterialLotRequest(
        @NotBlank @Size(max = 50) String materialLotNo,
        @NotNull @Positive Long materialId,
        @NotBlank @Size(max = 100) String supplierName,
        @NotBlank @Size(max = 50) String supplierLotNo,
        @NotNull LocalDate manufactureDate,
        @NotNull LocalDate expiryDate,
        @NotNull @PositiveOrZero @Digits(integer = 9, fraction = 3) BigDecimal receivedQty,
        @NotNull LocalDate receivedDate
) {
}
