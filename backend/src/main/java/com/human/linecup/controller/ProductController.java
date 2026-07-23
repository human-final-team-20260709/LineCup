package com.human.linecup.controller;

import com.human.linecup.dto.response.ProductResponse;
import com.human.linecup.entity.Product.ProductStatus;
import com.human.linecup.service.ProductService;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public Page<ProductResponse> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ProductStatus status,
            @PageableDefault(size = 20, sort = {"productName", "productId"}) Pageable pageable
    ) {
        return productService.search(keyword, status, pageable);
    }

    @GetMapping("/{productId}")
    public ProductResponse get(@PathVariable @Positive Long productId) {
        return productService.get(productId);
    }
}
