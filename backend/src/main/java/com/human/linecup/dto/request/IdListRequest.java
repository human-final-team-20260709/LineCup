package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record IdListRequest(@NotEmpty List<@Positive Long> ids) {
    public IdListRequest {
        ids = ids == null ? List.of() : List.copyOf(ids);
    }
}
