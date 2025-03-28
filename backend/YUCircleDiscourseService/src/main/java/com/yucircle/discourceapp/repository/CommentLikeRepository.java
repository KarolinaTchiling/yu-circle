package com.yucircle.discourceapp.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.yucircle.discourceapp.model.CommentLike;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {
	@Transactional
	void deleteByCommentIdAndUsername(Long commentId, String username);
	
	List<CommentLike> findAllByUsername(String username);
	List<CommentLike> findAllByCommentId(Long commentId);
}