package com.yucircle.discourceapp.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "commentlikes")
public class CommentLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentLikeId;
    
    @Column(name = "username")
    private String username;
    
    @Column(name = "comment_id")
    private Long commentId;
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    // Getters
    //
    
	public String getUsername() {
		return this.username;
	}
	
	public Long getCommentId() {
		return this.commentId;
	}
	
	public LocalDateTime getTimestamp() {
		return this.timestamp;
	}
	
	//Setters
	//
	public void setUsername(String username) {
		this.username = username;
	}
	
	public void setCommentId(Long postId) {
		this.commentId = postId;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
}