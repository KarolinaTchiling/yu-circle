package com.yucircle.marketplaceapp;

import com.yucircle.marketplaceapp.model.Rating;
import com.yucircle.marketplaceapp.service.NotificationProducerService;
import com.yucircle.marketplaceapp.service.RatingService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import com.yucircle.marketplaceapp.controller.RatingController;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.mockito.Mockito.*;

@WebMvcTest(RatingController.class)
public class RatingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RatingService ratingService;

    @MockBean
    private NotificationProducerService nService;

    private Rating mockRating(String toStringValue) {
        Rating rating = mock(Rating.class);
        when(rating.toString()).thenReturn(toStringValue);
        return rating;
    }

    @Test
    void testGetAllRatings_returns200() throws Exception {
        Rating rating = mockRating("Rating1");
        when(ratingService.getAllRatings()).thenReturn(List.of(rating));

        mockMvc.perform(get("/marketplace/rating/all"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAverageRatingsForAllProducts_returns200() throws Exception {
        when(ratingService.getAverageRatingsForAllProducts())
                .thenReturn(Map.of(1L, 4.5, 2L, 3.0));

        mockMvc.perform(get("/marketplace/rating/average/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.1").value(4.5))
                .andExpect(jsonPath("$.2").value(3.0));
    }

    @Test
    void testAddRating_returns200() throws Exception {
        Rating rating = mockRating("NewRating");
        when(ratingService.addRating(eq("mehregan"), eq(1L), eq(5))).thenReturn(rating);
        doNothing().when(nService).createRatingNotification(rating);

        String json = """
                {
                    "username": "mehregan",
                    "productId": "1",
                    "rating": "5"
                }
                """;

        mockMvc.perform(post("/marketplace/rating/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
    }

    @Test
    void testGetRatingsByUsername_found() throws Exception {
        Rating rating = mockRating("RatingForUser");
        when(ratingService.getRatingsByUsername("mehregan")).thenReturn(List.of(rating));

        mockMvc.perform(get("/marketplace/rating/user/mehregan"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetRatingsByUsername_empty_returns204() throws Exception {
        when(ratingService.getRatingsByUsername("emptyuser")).thenReturn(List.of());

        mockMvc.perform(get("/marketplace/rating/user/emptyuser"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testGetAverageRating_returns200() throws Exception {
        when(ratingService.getAverageRating(1L)).thenReturn(4.0);

        mockMvc.perform(get("/marketplace/rating/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("4.0"));
    }

    @Test
    void testGetAverageRating_null_returns0() throws Exception {
        when(ratingService.getAverageRating(2L)).thenReturn(null);

        mockMvc.perform(get("/marketplace/rating/2"))
                .andExpect(status().isOk())
                .andExpect(content().string("0.0"));
    }
}
