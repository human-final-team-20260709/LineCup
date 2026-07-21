package com.human.linecup.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.human.linecup.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
