package com.human.linecup.repository;

import com.human.linecup.entity.Product;
import com.human.linecup.entity.Product.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByProductCode(String productCode);

    boolean existsByProductCode(String productCode);

    List<Product> findAllByOrderByProductNameAsc();

    List<Product> findByStatusOrderByProductNameAsc(ProductStatus status);

    @Query("""
            select p
            from Product p
            where (:status is null or p.status = :status)
              and (:keyword is null or :keyword = ''
                   or lower(p.productCode) like lower(concat('%', :keyword, '%'))
                   or lower(p.productName) like lower(concat('%', :keyword, '%'))
                   or lower(p.category) like lower(concat('%', :keyword, '%')))
            """)
    Page<Product> search(
            @Param("keyword") String keyword,
            @Param("status") ProductStatus status,
            Pageable pageable
    );
}
