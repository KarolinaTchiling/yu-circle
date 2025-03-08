package com.yucircle.discourceapp.model;

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
@Table(name = "posts")
@JsonPropertyOrder({"id", "title", "content", "username", "comments"}) 
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
    private int likes = 0;
    private boolean isDeleted = false;
    
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
//    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();
    
//    // Custom getter to return only top-level comments
//    @JsonProperty("topLevelComments")
//    public List<Comment> getTopLevelComments() {
//        return comments.stream()
//                .filter(comment -> comment.getParentComment() == null)
//                .collect(Collectors.toList());
//    }

    
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
}