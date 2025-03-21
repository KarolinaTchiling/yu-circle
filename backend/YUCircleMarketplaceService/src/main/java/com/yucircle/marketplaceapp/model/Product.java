package com.yucircle.marketplaceapp.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@Entity
@Table(name = "marketplace")
//@JsonPropertyOrder({"id", "title", "content", "username", "comments"})
public class Product {
//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	private Long productId;
//	
//	private String name;
//	private String description;
//	private String url;
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String productName;
    private String username;
    private String description;
    private Double price;
    private String downloadUrl;
	
	// Getters
	//
	public String getProductName() {
		return this.productName;
	}
	
	public String getDescription() {
		return this.description;
	}
	
	public String getDownloadUrl() {
		return this.downloadUrl;
	}
	
	// Setters
	//
	public void setProductName(String name) {
		this.productName = name;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public void setDownloadUrl(String downloadUrl) {
		this.downloadUrl = downloadUrl;
	}

	public String getUsername() {
		// TODO Auto-generated method stub
		return this.username;
	}

	public Double getPrice() {
		// TODO Auto-generated method stub
		return this.price;
	}

	public void setPrice(Double price) {
		// TODO Auto-generated method stub
		this.price = price;
	}

	public void setUsername(String username) {
		// TODO Auto-generated method stub
		this.username = username;
	}
}