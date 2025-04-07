package com.yucircle.marketplaceapp;

import com.yucircle.marketplaceapp.model.Product;
import com.yucircle.marketplaceapp.service.ProductService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import com.yucircle.marketplaceapp.controller.ProductController;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    private Product mockProduct(String toStringValue) {
        Product product = mock(Product.class);
        when(product.toString()).thenReturn(toStringValue);
        return product;
    }

    @Test
    void testGetAllProducts_returns200() throws Exception {
        Product product = mockProduct("Product1");
        when(productService.getAllProducts()).thenReturn(List.of(product));

        mockMvc.perform(get("/marketplace/products"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetProductById_found() throws Exception {
        Product product = mockProduct("FoundProduct");
        when(productService.getProductById(1L)).thenReturn(Optional.of(product));

        mockMvc.perform(get("/marketplace/products/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetProductById_notFound() throws Exception {
        when(productService.getProductById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/marketplace/products/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetProductsByUsername() throws Exception {
        Product product = mockProduct("UserProduct");
        when(productService.getProductsByUsername("mehregan")).thenReturn(List.of(product));

        mockMvc.perform(get("/marketplace/products/user/mehregan"))
                .andExpect(status().isOk());
    }

    @Test
    void testDynamicSearch_returns200() throws Exception {
        Product product = mockProduct("SearchMatch");
        when(productService.dynamicSearch(any(), any(), any()))
                .thenReturn(List.of(product));

        mockMvc.perform(get("/marketplace/search")
                .param("program", "CS")
                .param("contentType", "pdf")
                .param("priceType", "free"))
                .andExpect(status().isOk());
    }

    @Test
    void testAddProduct_returns200() throws Exception {
        Product product = mockProduct("CreatedProduct");
        when(productService.addProduct(any())).thenReturn(product);

        String json = """
                {
                    "title": "New Item",
                    "username": "user123",
                    "description": "Great condition"
                }
                """;

        mockMvc.perform(post("/marketplace/products")
                .contentType("application/json")
                .content(json))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateProduct_success() throws Exception {
        Product product = mockProduct("UpdatedProduct");
        when(productService.updateProduct(eq(1L), any())).thenReturn(product);

        String json = """
                {
                    "title": "Updated Title"
                }
                """;

        mockMvc.perform(put("/marketplace/update/1")
                .contentType("application/json")
                .content(json))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateProduct_notFound() throws Exception {
        when(productService.updateProduct(eq(999L), any())).thenReturn(null);

        mockMvc.perform(put("/marketplace/update/999")
                .contentType("application/json")
                .content("{\"title\":\"Nothing\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateTags_success() throws Exception {
        Product product = mockProduct("TaggedProduct");
        when(productService.updateTags(eq(1L), any(), any())).thenReturn(product);

        mockMvc.perform(put("/marketplace/updatetags/1")
                .param("program", "ENG")
                .param("contentType", "video"))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateTags_fails_returns404() throws Exception {
        when(productService.updateTags(eq(2L), any(), any()))
                .thenThrow(new RuntimeException("fail"));

        mockMvc.perform(put("/marketplace/updatetags/2")
                .param("program", "ENG")
                .param("contentType", "image"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteProduct_returns204() throws Exception {
        doNothing().when(productService).deleteProduct(1L);

        mockMvc.perform(delete("/marketplace/products/1"))
                .andExpect(status().isNoContent());
    }
}
