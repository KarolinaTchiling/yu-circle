package com.yucircle.discourceapp.model;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.util.ArrayList;

@Entity
@Table(name = "comments")
@JsonInclude(JsonInclude.Include.ALWAYS)
@JsonPropertyOrder({"commentId", "content", "username", "post", "parentComment", "replies"})
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private String username;
    private int likes = 0;
    private boolean isDeleted = false;
    
//    private Long postId;  // Store the postId directly
//    private Long parentId;  // Store the parentId directly
//    private Long parentComment;

	@ManyToOne
	@JoinColumn(name = "post_id")  // Name of the foreign key column
	@JsonBackReference
//	@JsonIgnore
	private Post post;
	
    @ManyToOne
    @JoinColumn(name = "parent_id")
    @JsonIgnoreProperties("replies")
    private Comment parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    @JsonIgnoreProperties("parentComment")
    private List<Comment> replies = new ArrayList<>();
	
//    @ManyToOne
//    @JoinColumn(name = "parent_id") // Nullable because top-level comments have no parent
//    @JsonBackReference("comment-parent")
//    private Comment parent;
//
//    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
//    @JsonManagedReference("comment-children")
//    private List<Comment> replies = new ArrayList<>();
    
    
    

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

//	public Post getPost() {
//		// TODO Auto-generated method stub
//		return this.post;
//	}

//	public void setPost(Post newPost) {
//		// TODO Auto-generated method stub
//		this.post = newPost;
//	}

	public void setUsername(String newUsername) {
		// TODO Auto-generated method stub
		this.username = newUsername;
	}

	public void setLikes(int i) {
		// TODO Auto-generated method stub
		this.likes = i;
	}

//	public void setParentComment(Long parentComment) {
//		// TODO Auto-generated method stub
//		this.parentId = parentComment;
//	}
//
//	public void setPostId(Long postId) {
//		// TODO Auto-generated method stub
//		this.postId = postId;
//	}
//
//	public Long getParentId() {
//		// TODO Auto-generated method stub
//		return this.parentId;
//	}

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

//	public void setReplies(List<Comment> list) {
//		// TODO Auto-generated method stub
//		this.replies = list;
//	}
//	
//	public void addReply(Comment comment) {
//		this.replies.add(comment);
//	}

}



//@ManyToOne(fetch = FetchType.LAZY)
//@JoinColumn(name = "post_id")
//private Post post;

//@ManyToOne(fetch = FetchType.LAZY)
//@JoinColumn(name = "parent_id")
//private Comment parentComment;

//@OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//private List<Comment> replies;


//@Id
//@GeneratedValue(strategy = GenerationType.IDENTITY)
//private Long id;
//
//@Column(columnDefinition = "TEXT")
//private String content;
//
//private String username;
//private int likes = 0;
//private boolean isDeleted = false;
//
////@ManyToOne
////@JoinColumn(name = "post_id", nullable = false)
//@Column(name = "post_id")
//private Long postId;
////@ManyToOne
////@JoinColumn(name = "post_id")  // Name of the foreign key column
////private Post post;
////
//
//
//
//
//
////identifies a manytoone relationship
////@ManyToOne
////@JoinColumn(name = "parent_id")
////@Column(name = "parent_id", nullable = false)
//private Long parent;
//
//////identifies a onetomany relationship
////@OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
////private List<Comment> replies = new ArrayList<>();