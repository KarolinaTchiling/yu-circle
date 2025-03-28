package com.yucircle.marketplaceapp.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yucircle.marketplaceapp.model.Rating;
import com.yucircle.marketplaceapp.service.RatingService;

@RestController
@RequestMapping("/marketplace/rating")
public class RatingController {

    @Autowired
    private RatingService ratingService;

	@PostMapping("/add")
	public ResponseEntity<Rating> addRating(@RequestBody Map<String, String> request) {
		return ResponseEntity.ok(ratingService.addRating(request.get("username"), Long.valueOf(request.get("productId")), Integer.valueOf(request.get("rating"))));
	}
	
	@GetMapping("/user/{username}")
    public ResponseEntity<List<Rating>> getRatingsByUsername(@PathVariable String username) {
        List<Rating> ratings = ratingService.getRatingsByUsername(username);
        if (ratings.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(ratings);
    }

	@GetMapping("/{id}")
	public ResponseEntity<Double> getAverageRating(@PathVariable Long id) {
	    Double average = ratingService.getAverageRating(id);
	    return ResponseEntity.ok(average != null ? average : 0.0);
	}
}