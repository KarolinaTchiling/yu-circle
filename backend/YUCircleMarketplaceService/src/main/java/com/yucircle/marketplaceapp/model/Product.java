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
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String productName;
    private String username;
    private String description;
    private double price;
    private String downloadUrl;
    
    // Fields for searching
    private String program;
    private String contentType;
    

	
	// Getters
	//
	public Long getProductId() {
		return this.productId;
	}
	
	public String getProductName() {
		return this.productName;
	}
	
	public String getUsername() {
		// TODO Auto-generated method stub
		return this.username;
	}
	
	public String getDescription() {
		return this.description;
	}

	public Double getPrice() {
		// TODO Auto-generated method stub
		return this.price;
	}
	
	public String getDownloadUrl() {
		return this.downloadUrl;
	}
	
	public String getProgram() {
		return this.program;
	}
	
	public String getContentType() {
		return this.contentType;
	}
	
	
	// Setters
	//
	public void setProductName(String name) {
		this.productName = name;
	}
	
	public void setUsername(String username) {
		// TODO Auto-generated method stub
		this.username = username;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public void setPrice(Double price) {
		// TODO Auto-generated method stub
		this.price = price;
	}
	
	public void setDownloadUrl(String downloadUrl) {
		this.downloadUrl = downloadUrl;
	}
	
	public void setProgram(String program) {
		this.program = program;
	}
	
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}
}