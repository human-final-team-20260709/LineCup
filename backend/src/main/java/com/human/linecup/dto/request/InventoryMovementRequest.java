package com.human.linecup.dto.request;

import com.human.linecup.entity.InventoryMovement.InventoryItemType;
import com.human.linecup.entity.InventoryMovement.InventoryMovementType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.Instant;

public record InventoryMovementRequest(
        @NotNull InventoryItemType itemType,
        @NotNull InventoryMovementType movementType,
        @Positive Long rawMaterialLotId,
        @Positive Long productInventoryId,
        @NotNull @Positive BigDecimal quantity,
        @NotNull @Positive Long handledById,
        Instant occurredAt,
        String remarks
) {
}
