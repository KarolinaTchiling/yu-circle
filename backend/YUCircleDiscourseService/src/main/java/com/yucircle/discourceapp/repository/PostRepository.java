package com.yucircle.discourceapp.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import com.yucircle.discourceapp.model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
	Optional<Post> findByPostId(Long postId);
	List<Post> findByUsername(String username);
}