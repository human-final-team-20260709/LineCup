package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank
    @Size(max = 30)
    private String productCode;

    @NotBlank
    @Size(max = 100)
    private String productName;

    @NotBlank
    @Size(max = 10)
    private String unit;

    @NotBlank
    @Pattern(regexp = "사용중|검토")
    private String status;
}
