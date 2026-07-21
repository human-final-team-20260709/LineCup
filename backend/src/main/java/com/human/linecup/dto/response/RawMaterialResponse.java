package com.human.linecup.dto.response;

import com.human.linecup.entity.RawMaterial;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class RawMaterialResponse {

    private final Long materialId;
    private final String materialName;
    private final String unit;

    public static RawMaterialResponse from(RawMaterial material) {
        return RawMaterialResponse.builder()
                .materialId(material.getMaterialId())
                .materialName(material.getMaterialName())
                .unit(material.getUnit())
                .build();
    }
}
