package com.yucircle.discourceapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "post_likes")
public class PostLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

	public void setPost(Post post) {
		// TODO Auto-generated method stub
		this.post = post;
	}

	public void setUsername(String username) {
		// TODO Auto-generated method stub
		this.username = username;
	}
}