package com.human.linecup.dto.response;

import com.human.linecup.entity.RawMaterialLot;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class RawMaterialLotResponse {

    private final Long materialLotId;
    private final Long materialId;
    private final String supplierName;
    private final String supplierLotNo;
    private final LocalDate manufactureDate;
    private final LocalDate expiryDate;
    private final BigDecimal receivedQty;
    private final BigDecimal currentQty;
    private final LocalDate receivedDate;

    public static RawMaterialLotResponse from(RawMaterialLot materialLot) {
        return RawMaterialLotResponse.builder()
                .materialLotId(materialLot.getMaterialLotId())
                .materialId(materialLot.getMaterial().getMaterialId())
                .supplierName(materialLot.getSupplierName())
                .supplierLotNo(materialLot.getSupplierLotNo())
                .manufactureDate(materialLot.getManufactureDate())
                .expiryDate(materialLot.getExpiryDate())
                .receivedQty(materialLot.getReceivedQty())
                .currentQty(materialLot.getCurrentQty())
                .receivedDate(materialLot.getReceivedDate())
                .build();
    }
}
