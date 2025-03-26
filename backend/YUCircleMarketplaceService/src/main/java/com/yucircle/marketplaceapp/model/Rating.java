package com.yucircle.marketplaceapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "marketplace_rating")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private Long productId;

    private int rating;

    public Rating() {}

    public Rating(String username, Long productId, int rating) {
        this.username = username;
        this.productId = productId;
        this.rating = rating;
    }

    // Getters
    //
    public String getUsername() {
    	return this.username;
    }
    
    public Long getProductId() {
    	return this.productId;
    }
    
    public int getRating() {
    	return this.rating;
    }
    
    // Setters
    //
    public void setUsername(String username) {
    	this.username = username;
    }
    
	public void setProductId(Long productId) {
		// TODO Auto-generated method stub
		this.productId = productId;
	}

	public void setRating(int rating) {
		// TODO Auto-generated method stub
		this.rating = rating;
	}
}