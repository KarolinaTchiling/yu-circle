package com.yucircle.marketplaceapp.controller;

import com.yucircle.marketplaceapp.model.Product;
import com.yucircle.marketplaceapp.repository.ProductRepository;
import com.yucircle.marketplaceapp.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/marketplace")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Get all products.
    //
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Get a single product by id.
    //
    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // Search by tags.
    //
    @GetMapping("/search")
    public List<Product> dynamicSearch(
        @RequestParam(required = false) List<String> program,
        @RequestParam(required = false) List<String> contentType,
        @RequestParam(required = false) String priceType // "free", "paid", or null
    ) {
        return productService.dynamicSearch(program, contentType, priceType);
    }

    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }
    

    @PutMapping("/update/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product updatedProduct = productService.updateProduct(id, productDetails);
        return updatedProduct != null ? ResponseEntity.ok(updatedProduct) : ResponseEntity.notFound().build();
    }
    
    @PutMapping("/updatetags/{id}")
    public ResponseEntity<Product> updateTags(
            @PathVariable Long id,
            @RequestParam(required = false) String program,
            @RequestParam(required = false) String contentType) {

        try {
        	System.out.println(program);
            Product updatedProduct = productService.updateTags(id, program, contentType);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    

    
}