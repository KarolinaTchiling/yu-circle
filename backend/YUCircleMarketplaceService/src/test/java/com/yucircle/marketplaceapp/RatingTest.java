package com.yucircle.marketplaceapp;

import com.yucircle.marketplaceapp.model.*;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class RatingTest {

    @Test
    void testNoArgsConstructorAndSetters() {
        Rating rating = new Rating();
        rating.setUsername("mehregan");
        rating.setProductId(1L);
        rating.setRating(5);

        assertEquals("mehregan", rating.getUsername());
        assertEquals(1L, rating.getProductId());
        assertEquals(5, rating.getRating());
    }

    @Test
    void testAllArgsConstructor() {
        Rating rating = new Rating("user123", 10L, 4);

        assertEquals("user123", rating.getUsername());
        assertEquals(10L, rating.getProductId());
        assertEquals(4, rating.getRating());
    }
}
