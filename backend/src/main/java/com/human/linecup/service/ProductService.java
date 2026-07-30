package com.human.linecup.service;

import com.human.linecup.dto.request.ProductRequest;
import com.human.linecup.dto.response.ProductResponse;
import com.human.linecup.entity.Bom;
import com.human.linecup.entity.Product;
import com.human.linecup.entity.BusinessConflictException;
import com.human.linecup.repository.BomRepository;
import com.human.linecup.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final BomRepository bomRepository;

    @Transactional
    public ProductResponse create(ProductRequest request) {
        validateUniqueCode(request.productCode(), null);
        Product product = Product.create(
                request.productCode(),
                request.productName(),
                request.category(),
                request.unit(),
                request.status()
        );
        return toResponse(productRepository.save(product), null);
    }

    @Transactional
    public ProductResponse update(Long productId, ProductRequest request) {
        Product product = findProduct(productId);
        validateUniqueCode(request.productCode(), productId);
        product.changeInfo(
                request.productCode(),
                request.productName(),
                request.category(),
                request.unit(),
                request.status()
        );
        return toResponse(product, findActiveBom(productId));
    }

    public ProductResponse get(Long productId) {
        Product product = findProduct(productId);
        return toResponse(product, findActiveBom(productId));
    }

    public List<ProductResponse> getAll() {
        return mapProducts(productRepository.findAllByOrderByProductNameAsc());
    }

    public Page<ProductResponse> search(
            String keyword,
            Product.ProductStatus status,
            Pageable pageable
    ) {
        Page<Product> page = productRepository.search(normalizeKeyword(keyword), status, pageable);
        Map<Long, Bom> activeBoms = getActiveBoms(page.getContent());
        return page.map(product -> toResponse(product, activeBoms.get(product.getProductId())));
    }

    private List<ProductResponse> mapProducts(List<Product> products) {
        Map<Long, Bom> activeBoms = getActiveBoms(products);
        return products.stream()
                .map(product -> toResponse(product, activeBoms.get(product.getProductId())))
                .toList();
    }

    private Map<Long, Bom> getActiveBoms(List<Product> products) {
        if (products.isEmpty()) {
            return Map.of();
        }
        List<Long> productIds = products.stream().map(Product::getProductId).toList();
        Map<Long, Bom> result = new LinkedHashMap<>();
        bomRepository.findByProductProductIdInAndStatusOrderByBomIdDesc(
                productIds,
                Bom.BomStatus.ACTIVE
        ).forEach(bom -> result.putIfAbsent(bom.getProduct().getProductId(), bom));
        return result;
    }

    private Bom findActiveBom(Long productId) {
        return bomRepository.findFirstByProductProductIdAndStatusOrderByBomIdDesc(
                productId,
                Bom.BomStatus.ACTIVE
        ).orElse(null);
    }

    private ProductResponse toResponse(Product product, Bom activeBom) {
        return new ProductResponse(
                product.getProductId(),
                product.getProductCode(),
                product.getProductName(),
                product.getCategory(),
                product.getUnit(),
                product.getStatus(),
                product.getStatus().getLabel(),
                activeBom == null ? null : activeBom.getBomCode(),
                activeBom == null ? null : activeBom.getVersion()
        );
    }

    private Product findProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 제품입니다: " + productId));
    }

    private void validateUniqueCode(String productCode, Long currentProductId) {
        productRepository.findByProductCode(productCode)
                .filter(product -> !product.getProductId().equals(currentProductId))
                .ifPresent(product -> {
                    throw new BusinessConflictException("이미 사용 중인 제품 코드입니다: " + productCode);
                });
    }

    private String normalizeKeyword(String keyword) {
        return keyword == null || keyword.isBlank() ? null : keyword.trim();
    }
}
