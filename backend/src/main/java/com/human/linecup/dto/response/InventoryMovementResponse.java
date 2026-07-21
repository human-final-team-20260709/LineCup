package com.human.linecup.dto.response;

import com.human.linecup.entity.InventoryMovement.InventoryItemType;
import com.human.linecup.entity.InventoryMovement.InventoryMovementType;

import java.math.BigDecimal;
import java.time.Instant;

public record InventoryMovementResponse(
        Long movementId,
        String movementNo,
        InventoryItemType itemType,
        String itemTypeLabel,
        InventoryMovementType movementType,
        String movementTypeLabel,
        Long rawMaterialLotId,
        Long productInventoryId,
        String lotNo,
        String itemCode,
        String itemName,
        BigDecimal quantity,
        Long handledById,
        String handledByEmpNo,
        String handledByName,
        Instant occurredAt,
        String remarks
) {
}
