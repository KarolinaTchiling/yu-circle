package com.yucircle.discourceapp.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "postlikes")
public class PostLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postLikeId;
    
    @Column(name = "username")
    private String username;
    
    @Column(name = "post_id")
    private Long postId;
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    // Getters
    //
    
	public String getUsername() {
		return this.username;
	}
	
	public Long getPostId() {
		return this.postId;
	}
	
	public LocalDateTime getTimestamp() {
		return this.timestamp;
	}
	
	//Setters
	//
	public void setUsername(String username) {
		this.username = username;
	}
	
	public void setPostId(Long postId) {
		this.postId = postId;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
}