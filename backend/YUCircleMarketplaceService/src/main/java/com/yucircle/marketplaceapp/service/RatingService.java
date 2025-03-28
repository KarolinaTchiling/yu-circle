package com.yucircle.marketplaceapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yucircle.marketplaceapp.model.Rating;
import com.yucircle.marketplaceapp.repository.RatingRepository;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    public Rating addRating(String username, Long productId, int ratingValue) {
        Rating rating = new Rating(username, productId, ratingValue);
        
        // Checks if person has rated before.
        Optional<Rating> existingRating = ratingRepository.findByUsernameAndProductId(rating.getUsername(), rating.getProductId());
        if (existingRating.isPresent()) {
            throw new IllegalArgumentException("You have already rated this product.");
        }
        
        return ratingRepository.save(rating);
    }
    
    public List<Rating> getRatingsByUsername(String username) {
        return ratingRepository.findByUsername(username);
    }

    public Double getAverageRating(Long productId) {
        return ratingRepository.findAverageRating(productId);
    }
}