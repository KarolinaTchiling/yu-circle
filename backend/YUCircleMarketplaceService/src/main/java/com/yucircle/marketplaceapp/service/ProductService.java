package com.yucircle.marketplaceapp.service;

import com.yucircle.marketplaceapp.model.Product;
import com.yucircle.marketplaceapp.repository.ProductRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    
    @PersistenceContext
    private EntityManager entityManager;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }
    

    public Product updateProduct(Long id, Product productDetails) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            Product updatedProduct = product.get();
            updatedProduct.setProductName(productDetails.getProductName());
            updatedProduct.setUsername(productDetails.getUsername());
            updatedProduct.setDescription(productDetails.getDescription());
            updatedProduct.setPrice(productDetails.getPrice());
            updatedProduct.setDownloadUrl(productDetails.getDownloadUrl());
            return productRepository.save(updatedProduct);
        }
        return null;
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    public Product updateTags(Long productId, String program, String contentType) {
        Optional<Product> existingProduct = productRepository.findById(productId);
        System.out.println(program);

        if (existingProduct.isPresent()) {
            Product product = existingProduct.get();

            // Update program only if it's not null
            if (program != null) {
                product.setProgram(program);
            }

            // Update contentType only if it's not null
            if (contentType != null) {
                product.setContentType(contentType);
            }

            return productRepository.save(product);
        } else {
        	throw new IllegalArgumentException("Product not found");
        }
    }
    

    public List<Product> dynamicSearch(String program, String contentType, String priceType) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Product> query = cb.createQuery(Product.class);
        Root<Product> root = query.from(Product.class);

        List<Predicate> predicates = new ArrayList<>();

        if (program != null && !program.isEmpty()) {
            predicates.add(cb.equal(root.get("program"), program));
        }

        if (contentType != null && !contentType.isEmpty()) {
            predicates.add(cb.equal(root.get("contentType"), contentType));
        }

        if (priceType != null) {
            if (priceType.equalsIgnoreCase("free")) {
                predicates.add(cb.equal(root.get("price"), 0.0));
            } else if (priceType.equalsIgnoreCase("paid")) {
                predicates.add(cb.greaterThan(root.get("price"), 0.0));
            }
        }

        query.where(cb.and(predicates.toArray(new Predicate[0])));
        return entityManager.createQuery(query).getResultList();
    }
}