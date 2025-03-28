package com.yucircle.discourceapp.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.yucircle.discourceapp.model.PostLike;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
	@Transactional
	void deleteByPostIdAndUsername(Long postId, String username);
	
	List<PostLike> findAllByUsername(String username);
	List<PostLike> findAllByPostId(Long postId);
}