package com.yucircle.discourceapp.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@Entity
@Table(name = "posts")
@JsonPropertyOrder({"id", "title", "content", "username", "timestamp", "comments"}) 
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;
    
    @Column(columnDefinition = "TEXT")
    @JsonProperty("content")
    private String content;
    
    @JsonProperty("username")
    private String username;
    
    @JsonProperty("title")
    private String title;
    
    private LocalDateTime timestamp;
    
    private boolean isDeleted = false;
    
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Comment> comments = new ArrayList<>();

    
    public void softDelete() {
        this.content = "Deleted";
        this.username = "Deleted";
        this.isDeleted = true;
    }

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String newTitle) {
		this.title = newTitle;
		
	}

	public String getContent() {
		return this.content;
	}

	public void setContent(String newContent) {
		this.content = newContent;
	}

	public String getUsername() {

		// TODO Auto-generated method stub
		return this.username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}

	public Long getId() {
		// TODO Auto-generated method stub
		return this.postId;
	}
	
	public LocalDateTime getTimestamp() {
		return this.timestamp;
	}

	
	public void addComment(Comment newComment) {
		// TODO Auto-generated method stub
		comments.add(newComment);
	}

	public void setComments(List<Comment> comments) {
		// TODO Auto-generated method stub
		this.comments = comments;
	}

	public List<Comment> getComments() {
		// TODO Auto-generated method stub
		return this.comments;
	}

	public void setId(Long postId) {
		// TODO Auto-generated method stub
		this.postId = postId;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		// TODO Auto-generated method stub
		this.timestamp = timestamp;
	}
}