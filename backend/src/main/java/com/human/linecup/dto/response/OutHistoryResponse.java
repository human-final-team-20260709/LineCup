package com.human.linecup.dto.response;

import com.human.linecup.entity.OutHistory;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class OutHistoryResponse {

    private final Long historyId;
    private final Long productInventoryId;
    private final Long userId;
    private final Integer qty;
    private final LocalDateTime occurredAt;
    private final String remarks;

    public static OutHistoryResponse from(OutHistory outHistory) {
        return OutHistoryResponse.builder()
                .historyId(outHistory.getHistoryId())
                .productInventoryId(outHistory.getProductInventory().getInventoryId())
                .userId(outHistory.getUserId())
                .qty(outHistory.getQty())
                .occurredAt(outHistory.getOccurredAt())
                .remarks(outHistory.getRemarks())
                .build();
    }
}
