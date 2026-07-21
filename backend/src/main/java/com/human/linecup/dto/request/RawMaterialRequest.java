package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RawMaterialRequest {

    @NotBlank
    @Size(max = 500)
    private String materialName;

    @NotBlank
    @Size(max = 20)
    private String unit;
}
