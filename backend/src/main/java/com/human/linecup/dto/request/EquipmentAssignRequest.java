package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EquipmentAssignRequest {

    @NotNull
    private Long userId;
}
