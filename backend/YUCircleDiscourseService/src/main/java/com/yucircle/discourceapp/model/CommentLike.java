package com.yucircle.discourceapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "comment_likes")
public class CommentLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @ManyToOne
    @JoinColumn(name = "comment_id", nullable = false)
    private Comment comment;

	public void setComment(Comment comment) {
		// TODO Auto-generated method stub
		this.comment = comment;
	}

	public void setUsername(String username) {
		// TODO Auto-generated method stub
		this.username = username;
	}
}