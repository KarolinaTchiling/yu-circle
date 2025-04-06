package com.yucircle.marketplaceapp;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import com.yucircle.marketplaceapp.model.Product;

class ProductTest {

    @Test
    void testSettersAndGetters() {
        Product product = new Product();

        product.setProductName("AI Textbook");
        product.setUsername("mehregan");
        product.setDescription("An advanced guide to AI");
        product.setPrice(19.99);
        product.setDownloadUrl("http://example.com/download");
        product.setProgram("Computer Science");
        product.setContentType("PDF");

        assertEquals("AI Textbook", product.getProductName());
        assertEquals("mehregan", product.getUsername());
        assertEquals("An advanced guide to AI", product.getDescription());
        assertEquals(19.99, product.getPrice());
        assertEquals("http://example.com/download", product.getDownloadUrl());
        assertEquals("Computer Science", product.getProgram());
        assertEquals("PDF", product.getContentType());
    }

    @Test
    void testInitialProductIdIsNull() {
        Product product = new Product();
        assertNull(product.getProductId(), "Product ID should be null before persistence");
    }
}
