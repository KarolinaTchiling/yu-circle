package com.yucircle.discourceapp.model;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Entity
@Table(name = "comments")
@JsonInclude(JsonInclude.Include.ALWAYS)
@JsonPropertyOrder({"commentId", "content", "username", "post", "parentComment", "timestamp", "replies"})
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private String username;
    private boolean isDeleted = false;
    
    private LocalDateTime timestamp;
    
	@ManyToOne
	@JoinColumn(name = "post_id")  // Name of the foreign key column
	@JsonBackReference
	private Post post;
	
    @ManyToOne
    @JoinColumn(name = "parent_id")
    @JsonIgnoreProperties("replies")
    private Comment parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    @JsonIgnoreProperties("parentComment")
    private List<Comment> replies = new ArrayList<>();
	
    public void softDelete() {
        this.content = "Deleted";
        this.username = "Deleted";
        this.isDeleted = true;
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


	public void setUsername(String newUsername) {
		// TODO Auto-generated method stub
		this.username = newUsername;
	}

	public LocalDateTime getTimestamp() {
		return this.timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		// TODO Auto-generated method stub
		this.timestamp = timestamp;
	}

	public void setPost(Post post) {
		// TODO Auto-generated method stub
		this.post = post;
	}
	
	public Post getPost() {
	// TODO Auto-generated method stub
		return this.post;
	}

	public void setParentComment(Comment newParent) {
		// TODO Auto-generated method stub
		this.parentComment = newParent;
	}

	public Comment getParentComment() {
		// TODO Auto-generated method stub
		return this.parentComment;
	}

	public Object getCommentId() {
		// TODO Auto-generated method stub
		return this.commentId;
	}

}