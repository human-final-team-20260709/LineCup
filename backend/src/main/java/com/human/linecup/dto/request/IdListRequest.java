package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record IdListRequest(@NotNull List<@Positive Long> ids) {
    public IdListRequest {
        ids = ids == null ? null : List.copyOf(ids);
    }
}
