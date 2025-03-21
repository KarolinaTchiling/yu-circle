package com.yucircle.marketplaceapp.repository;

import java.util.Optional;

//import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import com.yucircle.marketplaceapp.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}