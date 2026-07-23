package com.human.linecup.controller;

import com.human.linecup.dto.request.ProductRequest;
import com.human.linecup.dto.response.ProductResponse;
import com.human.linecup.entity.Product.ProductStatus;
import com.human.linecup.service.ProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

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

    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.create(request);
        return ResponseEntity.created(URI.create(
                "/api/products/" + response.productId()
        )).body(response);
    }

    @PutMapping("/{productId}")
    public ProductResponse update(
            @PathVariable @Positive Long productId,
            @Valid @RequestBody ProductRequest request
    ) {
        return productService.update(productId, request);
    }
}
