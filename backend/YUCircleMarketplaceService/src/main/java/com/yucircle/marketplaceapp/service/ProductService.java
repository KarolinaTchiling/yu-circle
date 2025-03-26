package com.yucircle.marketplaceapp.service;

import com.yucircle.marketplaceapp.model.Product;
import com.yucircle.marketplaceapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

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
        return null;  // Or throw an exception
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}